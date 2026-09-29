"use client";

import Image from "next/image";
import * as React from "react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

import { ArrowUpRight, onAnchorClick, RingLink } from "./primitives";

// The full pill is wider than a 375px viewport. Below `sm` the "Home" link
// gives way (the logo already goes home) and the type tightens; every section
// link stays.
const NAV_LINKS = [
  { label: "Home", href: "#home", id: "home", compact: false },
  { label: "Work", href: "#work", id: "work", compact: true },
  { label: "Deploys", href: "#deploys", id: "deploys", compact: true },
  { label: "About", href: "#about", id: "about", compact: true },
  { label: "Details", href: "#details", id: "details", compact: true },
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
                  "rounded-full px-2.5 py-1.5 text-[11px] transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm",
                  !link.compact && "hidden sm:block",
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
          innerClassName="bg-[hsl(var(--surface))] px-2.5 py-1.5 text-[11px] text-[hsl(var(--text))] backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
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
        gsap.set(".hero-bg", { scale: 1 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      // One authored entrance: the photograph settles from a slight zoom while
      // the type rises through it. Nothing else in the hero moves on load.
      tl.fromTo(
        ".hero-bg",
        { scale: 1.06 },
        { scale: 1, duration: 2.2, ease: "power2.out" },
        0,
      );
      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 },
        0,
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
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden py-28"
    >
      <Navbar />

      <div className="absolute inset-0 z-0">
        {/* Gaia Armellin, Unsplash. Alternates and credits are listed in
            ./ATTRIBUTION.md; swap the path to try one. The beam is framed to
            the upper right so the headline sits over dark rock. */}
        <div className="hero-bg absolute inset-0">
          <Image
            src="/assets/hero/lighthouse.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[66%_40%] md:object-[50%_35%]"
          />
        </div>
        <div className="absolute inset-0 bg-[hsl(var(--bg))]/45" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[hsl(var(--bg))]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[hsl(var(--bg))] via-[hsl(var(--bg))]/40 to-transparent" />
      </div>

      <div className="relative z-20 flex max-w-5xl flex-col items-center px-6 text-center text-[hsl(var(--text))]">
        {/* The previous site's hero copy, kept word for word: the name is
            the headline, the claim sits under it in the text face. */}
        <h1 className="name-reveal font-display text-7xl italic leading-[0.9] tracking-[-0.03em] opacity-0 sm:text-8xl md:text-[7.5rem] lg:text-[9rem]">
          Dave Ta
        </h1>
        <p className="blur-in mt-8 text-balance text-lg font-medium text-[hsl(var(--text))]/90 opacity-0 sm:text-xl md:text-2xl">
          I build software. I keep it running too.
        </p>
        <p className="blur-in mt-4 max-w-xl text-pretty text-sm leading-6 text-[hsl(var(--text))]/70 opacity-0 sm:text-base sm:leading-7">
          Right now I&apos;m working on rocket telemetry, an IELTS site, and a
          public MCP server. I run several other sites from a rack in Toronto.
        </p>
        <div className="blur-in mt-10 flex flex-wrap items-center justify-center gap-3 opacity-0">
          {/* Same hover grammar as the nav's "Say hi": the accent ring rises
              behind each pill. */}
          <RingLink
            href="#work"
            innerClassName="bg-[hsl(var(--text))] px-6 py-3 text-sm font-medium text-[hsl(var(--bg))] group-hover:bg-[hsl(var(--surface))] group-hover:text-[hsl(var(--text))]"
          >
            See Works
          </RingLink>
          <RingLink
            href="#contact"
            innerClassName="bg-[hsl(var(--surface))]/80 px-6 py-3 text-sm text-[hsl(var(--text))] backdrop-blur-md"
          >
            Reach out
          </RingLink>
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
