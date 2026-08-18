"use client";

import { useEffect, useState } from "react";
import { links, nav } from "@/data/content";

export function Nav() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setLifted(window.scrollY > 80);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-3 font-mono text-[11px] tracking-[0.09em] transition-[background-color,border-color,padding,backdrop-filter] duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:px-8 ${
        lifted
          ? "border-b border-line-soft bg-[rgba(11,11,12,0.78)] py-3 backdrop-blur-md"
          : "border-b border-transparent py-6"
      }`}
    >
      <a
        href="#top"
        className="whitespace-nowrap px-1 py-3.5 text-fg transition-colors hover:text-accent"
      >
        TA TAN DAT
      </a>
      <div className="flex items-center gap-1 sm:gap-5">
        {nav.map((item) => (
          <a key={item.href} href={item.href} className="nav-link px-1.5 py-3 sm:px-2">
            <span className="swap text-mute">
              <span className="swap-col">
                <span>{item.label}</span>
                <span className="text-accent">{item.label}</span>
              </span>
            </span>
          </a>
        ))}
        {/* Contact should never be more than one click away, from anywhere. */}
        <a
          href={`mailto:${links.email}`}
          className={`ml-1 hidden whitespace-nowrap border border-line-strong px-3.5 py-3 text-mute transition-[color,border-color,opacity] duration-300 hover:border-accent/60 hover:text-accent sm:inline-block ${
            lifted ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!lifted}
          tabIndex={lifted ? 0 : -1}
        >
          EMAIL ↗
        </a>
      </div>
    </nav>
  );
}
