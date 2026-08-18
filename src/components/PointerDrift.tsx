"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Drifts its children a few pixels against the pointer, so the hero type sits
 * at a different depth from the field behind it.
 *
 * Writes straight to `style.transform` inside a rAF tick — no React state, so
 * moving the mouse never renders. Inert without a real pointer (a touch drag
 * fires `pointermove` too, which would make the headline jitter while
 * scrolling) and inert under `prefers-reduced-motion`.
 */
export function PointerDrift({
  children,
  className,
  /** Maximum travel in pixels, x and y. */
  strength = [14, 9],
}: {
  children: ReactNode;
  className?: string;
  strength?: [number, number];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window.matchMedia !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const [sx, sy] = strength;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let raf = 0;

    const tick = () => {
      raf = 0;
      cur.x += (tgt.x - cur.x) * 0.05;
      cur.y += (tgt.y - cur.y) * 0.05;
      el.style.transform = `translate3d(${(-cur.x * sx).toFixed(2)}px, ${(
        -cur.y * sy
      ).toFixed(2)}px, 0)`;
      if (
        Math.abs(tgt.x - cur.x) > 0.0004 ||
        Math.abs(tgt.y - cur.y) > 0.0004
      ) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      tgt.x = e.clientX / window.innerWidth - 0.5;
      tgt.y = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
