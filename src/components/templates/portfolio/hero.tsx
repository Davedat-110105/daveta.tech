"use client";

import Image from "next/image";
import * as React from "react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

import { ArrowUpRight, onAnchorClick, RingLink } from "./primitives";

const NAV_LINKS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "Work", href: "#work", id: "work" },
  { label: "Deploys", href: "#deploys", id: "deploys" },
  { label: "About", href: "#about", id: "about" },
  { label: "Details", href: "#details", id: "details" },
];

function Logo() {
  return (
    <a
      href="#home"
      aria-label="Home"
      onClick={(e) => onAnchorClick(e, "#home")}
      className="group relative flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
    >
      <span className="accent-gradient absolute inset-0 rounded-full" />
      <span
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage: "linear-gradient(270deg, #89AACC 0%, #4E85BF 100%)",
        }}
      />
      <span className="absolute inset-[1.5px] rounded-full bg-[hsl(var(--bg))]" />
      <span className="relative font-display text-[13px] italic leading-none">
        DT
      </span>
    </a>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState("home");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    for (const link of NAV_LINKS) {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <div
        className={cn(
          "inline-flex items-center rounded-full border border-white/10 bg-[hsl(var(--surface))] px-2 py-2 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-md shadow-black/10",
        )}
      >
        <Logo />
        <span className="mx-1 hidden h-5 w-px bg-[hsl(var(--stroke))] sm:block" />
        <div className="flex items-center gap-0.5">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => onAnchorClick(e, link.href)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm",
                  isActive
                    ? "bg-[hsl(var(--stroke))]/50 text-[hsl(var(--text))]"
                    : "text-[hsl(var(--muted))] hover:bg-[hsl(var(--stroke))]/50 hover:text-[hsl(var(--text))]",
                )}
              >
                {link.label}
              </a>
            );
          })}
        </div>
        <span className="mx-1 hidden h-5 w-px bg-[hsl(var(--stroke))] sm:block" />
        <RingLink
          href="#contact"
          innerClassName="bg-[hsl(var(--surface))] px-3 py-1.5 text-xs text-[hsl(var(--text))] backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
        >
          Say hi
          <ArrowUpRight className="size-3 rtl:-scale-x-100" />
        </RingLink>
      </div>
    </nav>
  );
}

export function Hero({ start = true }: { start?: boolean }) {
  const rootRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!start) return;
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        gsap.set([".name-reveal", ".blur-in"], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 },
      ).fromTo(
        ".blur-in",
        { opacity: 0, y: 20, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.1,
        },
        0.3,
      );
    }, rootRef);
    return () => ctx.revert();
  }, [start]);

  return (
    <section
      ref={rootRef}
      id="home"
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden"
    >
      <Navbar />

      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-field.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover saturate-75"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[hsl(var(--bg))] via-[hsl(var(--bg))]/35 to-transparent" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 mx-auto grid w-full max-w-[1600px] grid-cols-12 divide-x divide-white/10 border-x border-white/10"
      >
        <span className="col-span-1" />
        <span className="col-span-3" />
        <span className="col-span-4" />
        <span className="col-span-3" />
        <span className="col-span-1" />
      </div>

      <div className="relative z-20 flex max-w-5xl flex-col items-center px-6 text-center text-white">
        <p className="blur-in mb-5 text-xs uppercase tracking-[0.22em] text-white/65 opacity-0 sm:text-sm">
          Dave Ta · Software engineer · Toronto
        </p>
        <h1 className="name-reveal max-w-4xl font-display text-5xl leading-[0.92] tracking-[-0.035em] opacity-0 sm:text-6xl md:text-7xl lg:text-8xl">
          I build software that stays running.
        </h1>
        <p className="blur-in mb-10 mt-7 max-w-2xl text-sm leading-6 text-white/70 opacity-0 sm:text-base sm:leading-7">
          Rocket telemetry, learning platforms, public MCP services, and the
          infrastructure behind them.
        </p>
        <div className="blur-in opacity-0">
          <a
            href="#work"
            onClick={(e) => onAnchorClick(e, "#work")}
            className="group inline-flex items-stretch gap-px rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="flex items-center rounded-full bg-white px-6 text-sm font-medium text-black transition-colors duration-300 group-hover:bg-[#16212b] group-hover:text-white">
              See my work
            </span>
            <span className="relative flex size-12 items-center justify-center overflow-hidden rounded-full bg-white text-black transition-colors duration-300 group-hover:bg-[#16212b] group-hover:text-white">
              <ArrowUpRight className="absolute size-4 transition-transform duration-500 ease-out group-hover:translate-x-8 group-hover:-translate-y-8 rtl:-scale-x-100" />
              <ArrowUpRight className="absolute size-4 -translate-x-8 translate-y-8 transition-transform duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 rtl:-scale-x-100" />
            </span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted))]">
          Scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-[hsl(var(--stroke))]">
          <span className="accent-gradient animate-scroll-down absolute inset-x-0 top-0 block h-1/2 w-full" />
        </span>
      </div>
    </section>
  );
}
