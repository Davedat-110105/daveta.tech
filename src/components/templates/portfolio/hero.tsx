"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import gsap from "gsap";

import { HACKATHONS } from "@/data/hackathons";
import { cn } from "@/lib/utils";

import { ArrowUpRight, onAnchorClick, RingLink } from "./primitives";

// The full pill is wider than a 375px viewport. Below `sm` the "Home" link
// gives way (the logo already goes home) and the type tightens; every section
// link stays. The competition record gets its own item: it is the strongest
// proof on the page and should be one click from anywhere.
const NAV_LINKS = [
  { label: "Home", href: "#home", id: "home", compact: false },
  { label: "Work", href: "#work", id: "work", compact: true },
  { label: "Record", href: "#record", id: "record", compact: true },
  { label: "Deploys", href: "#deploys", id: "deploys", compact: true },
  { label: "About", href: "#about", id: "about", compact: true },
];

// Firsts lead, then the rest; each group keeps the record's newest-first order.
const PODIUM = [...HACKATHONS].sort(
  (a, b) => Number(a.rank !== "1st") - Number(b.rank !== "1st"),
);

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
      // the name rises over it. Nothing else in the hero moves on load.
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
      className="relative w-full overflow-hidden bg-[hsl(var(--bg))] md:min-h-dvh"
    >
      <Navbar />

      {/* A studio sweep, not a picture: a faint lift behind the subject on
          the flat field, the way a backdrop falls off under one light. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_60%_at_50%_58%,hsl(0_0%_11%),transparent_70%)]"
      />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col px-6 pt-24 md:block md:h-dvh md:min-h-[640px] md:px-10 md:pt-0 lg:px-16">
        {/* Cut-out portrait, standing on the bottom edge. */}
        <div className="hero-bg relative mx-auto h-[56svh] w-full max-w-[420px] md:absolute md:inset-x-0 md:bottom-0 md:h-[88%] md:max-w-none">
          <Image
            src="/assets/hero/dave-portrait-cutout.png"
            alt="Portrait of Dave Ta"
            fill
            priority
            sizes="(min-width: 768px) 60vh, 90vw"
            className="object-contain object-bottom"
          />
        </div>

        {/* The name runs across the portrait at poster scale, in front of it,
            and bleeds off the bottom edge. */}
        <p
          aria-hidden="true"
          className="name-reveal pointer-events-none relative z-10 -mt-[0.55em] select-none whitespace-nowrap text-center font-display text-[26vw] italic leading-[0.8] tracking-[-0.03em] text-[hsl(var(--text))] opacity-0 md:absolute md:inset-x-0 md:bottom-[0.02em] md:mt-0 md:text-[20vw]"
        >
          Dave Ta
        </p>

        <div className="relative z-20 mt-8 flex flex-col gap-10 md:absolute md:inset-x-10 md:top-1/2 md:mt-0 md:-translate-y-[62%] md:flex-row md:items-start md:justify-between lg:inset-x-16">
          <div className="max-w-[19rem]">
            <h1 className="blur-in text-lg font-medium leading-snug opacity-0 sm:text-xl">
              <span className="sr-only">Dave Ta. </span>I build software. I keep
              it running too.
            </h1>
            <p className="blur-in mt-3 text-pretty text-sm leading-6 text-[hsl(var(--text))]/70 opacity-0">
              Right now I&apos;m working on rocket telemetry, an IELTS site, and
              a public MCP server. I run several other sites from a rack in
              Toronto.
            </p>
            <div className="blur-in mt-6 flex flex-wrap items-center gap-3 opacity-0">
              {/* Same hover grammar as the nav's "Say hi": the accent ring
                  rises behind each pill. */}
              <RingLink
                href="#work"
                innerClassName="bg-[hsl(var(--text))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--bg))] group-hover:bg-[hsl(var(--surface))] group-hover:text-[hsl(var(--text))]"
              >
                See my work
              </RingLink>
              <RingLink
                href="#contact"
                innerClassName="bg-[hsl(var(--surface))] px-5 py-2.5 text-sm text-[hsl(var(--text))]"
              >
                Reach out
              </RingLink>
            </div>
          </div>

          {/* The record, stated up front: the strongest proof on the page
              should not wait 5,000px. Each placement opens its write-up. */}
          <ul
            aria-label="Competition placements"
            className="blur-in w-full max-w-[17rem] border-t border-[hsl(var(--stroke))] opacity-0"
          >
            {PODIUM.map((hackathon) => (
              <li
                key={hackathon.slug}
                className="border-b border-[hsl(var(--stroke))]"
              >
                <Link
                  href={`/hackathons/${hackathon.slug}`}
                  className="group flex items-baseline gap-4 py-2.5"
                >
                  <span
                    className={cn(
                      "w-10 shrink-0 font-display text-2xl italic leading-none",
                      hackathon.rank === "1st"
                        ? "text-[hsl(var(--signal))]"
                        : "text-[hsl(var(--text))]/60",
                    )}
                  >
                    {hackathon.rank}
                  </span>
                  <span className="text-xs leading-snug text-[hsl(var(--muted))] transition-colors duration-300 group-hover:text-[hsl(var(--text))]">
                    {hackathon.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
