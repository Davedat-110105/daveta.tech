"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%$&@";

/**
 * Terminal-style character scramble that resolves left to right.
 *
 * The real string is what renders on the server and what assistive technology
 * reads — the scramble is a decorative overlay that never changes the string
 * length, so nothing reflows while it runs. Skipped entirely under
 * `prefers-reduced-motion`.
 */
export function DecoderText({
  text,
  className,
  /** Milliseconds each character waits before it settles, on average. */
  speed = 34,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const still =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || typeof IntersectionObserver === "undefined") return;

    const chars = Array.from(text);
    const total = chars.length * speed + 260;
    let raf = 0;
    let start = 0;

    const step = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      // How many characters have locked in by now.
      const settled = (elapsed / total) * chars.length * 1.35;

      setDisplay(
        chars
          .map((ch, i) => {
            if (ch === " " || i < settled) return ch;
            // Characters just about to settle flicker faster than distant ones.
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );

      if (elapsed < total) raf = requestAnimationFrame(step);
      else setDisplay(text);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text, speed]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
