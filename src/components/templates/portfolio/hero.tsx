"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import gsap from "gsap";

import { HACKATHONS } from "@/data/hackathons";
import { cn } from "@/lib/utils";

import { RingLink } from "./primitives";

const NAV_LINKS = [
  { label: "Work", id: "work" },
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

// Firsts lead, then the rest; each group keeps the record's newest-first order.
const PODIUM = [...HACKATHONS].sort(
  (a, b) => Number(a.rank !== "1st") - Number(b.rank !== "1st"),
);

function Logo({ active }: { active: boolean }) {
  return (
    <a
      href="#home"
      aria-label="Home"
      aria-current={active ? "location" : undefined}
      className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-white/10"
    >
      <Image
        src="/assets/hero/dt-monogram.png"
        alt=""
        width={36}
        height={36}
        className="size-9 rounded-full ring-1 ring-[hsl(var(--signal))]/50"
      />
    </a>
  );
}

export function Navbar() {
  const [active, setActive] = React.useState("home");
  const navRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const sections = ["home", ...NAV_LINKS.map((link) => link.id)]
      .map((id) => document.getElementById(id));
    const updateActive = () => {
      const readingLine = (navRef.current?.getBoundingClientRect().bottom ?? 0) + 32;
      const current = sections.findLast((section) => section && section.getBoundingClientRect().top <= readingLine);
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? "contact" : current?.id ?? "home");
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      data-portfolio-nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center [padding-inline:max(.5rem,env(safe-area-inset-left),env(safe-area-inset-right))] [padding-top:max(.75rem,env(safe-area-inset-top))]"
    >
      <div className="pointer-events-auto relative inline-flex max-w-full flex-wrap items-center justify-center rounded-full border border-white/10 bg-[hsl(var(--surface))] p-1 shadow-md shadow-black/20">
        <Logo active={active === "home"} />
        {NAV_LINKS.map(({ label, id }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full px-1.5 text-sm text-[hsl(var(--text))]/80 hover:bg-white/10 hover:text-white aria-[current=location]:bg-white/10 aria-[current=location]:text-white sm:px-3"
          >
            {label}
          </a>
        ))}
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
      tabIndex={-1}
      className="relative w-full overflow-hidden bg-[hsl(var(--bg))] md:min-h-dvh"
    >
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
          className="name-reveal pointer-events-none relative z-10 -mt-[0.55em] select-none whitespace-nowrap text-center font-display text-[23vw] italic leading-[0.8] tracking-[-0.03em] text-[hsl(var(--text))] opacity-0 md:absolute md:inset-x-0 md:bottom-[0.02em] md:mt-0 md:text-[18vw]"
        >
          Dave Ta
        </p>

        <div className="relative z-20 mt-8 flex flex-col gap-10 md:absolute md:inset-x-10 md:top-1/2 md:mt-0 md:-translate-y-[62%] md:flex-row md:items-start md:justify-between lg:inset-x-16">
          <div className="max-w-[19rem]">
            <h1 className="blur-in text-lg font-medium leading-snug opacity-0 sm:text-xl">
              <span className="sr-only">Dave Ta. </span>Hi, I&apos;m Dave. I build
              software and host most of it myself.
            </h1>
            <p className="blur-in mt-3 text-pretty text-sm leading-6 text-[hsl(var(--text))]/70 opacity-0">
              Lately that means an IELTS practice site, a public MCP server,
              and telemetry for a rocket. My other sites run on a few machines
              at home in Toronto.
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
