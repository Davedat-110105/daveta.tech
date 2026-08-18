"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Reveals children once, the first time they scroll into view.
 *
 * The element ships hidden in the markup and CSS handles the transition, so
 * there is no layout work on the main thread beyond a single class flip. Under
 * `prefers-reduced-motion` the global transition override collapses the
 * duration and the element simply appears. With JavaScript disabled the
 * `<noscript>` rule in the layout forces everything visible.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 18,
  className,
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger offset in milliseconds. */
  delay?: number;
  /** Distance in pixels the element travels up into place. */
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Older browsers, or anything without IO, get the content immediately.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      // Fire a little before the element reaches the fold so the motion has
      // finished by the time it is properly in frame.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    io.observe(el);

    // Safety net. A hidden tab delivers no IntersectionObserver callbacks at
    // all, and a page restored from bfcache can come back without one either —
    // in both cases the element would sit at opacity 0 forever. When the tab
    // becomes visible, check position directly and reveal anything on screen.
    const recheck = () => {
      if (document.visibilityState !== "visible") return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setShown(true);
    };
    document.addEventListener("visibilitychange", recheck);
    window.addEventListener("pageshow", recheck);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", recheck);
      window.removeEventListener("pageshow", recheck);
    };
  }, [once]);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-shown={shown ? "true" : "false"}
      className={className}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
