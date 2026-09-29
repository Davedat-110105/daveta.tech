"use client";

import Image from "next/image";
import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";

/**
 * Photographs from the days around the work, drifting past a heading that
 * holds still. The template did this with a 300vh GSAP pin that left a long
 * empty scroll once the photos ran out and covered the heading on phones.
 * Here the heading is CSS-sticky behind two columns that set the section's
 * height themselves, so the section ends when the last photo leaves. Phones
 * get the same tilted cards in a plain grid under the heading.
 */
const ITEMS = [
  {
    image: "/assets/seneca-hackathon/seneca-hackathon-threshold-team.jpeg",
    label: "Seneca Energy Hackathon, Threshold",
    width: 1600,
    height: 1200,
    rotate: -4,
  },
  {
    image: "/assets/uoft-hackathon/UofT-fintech-summit-presentation.jpg",
    label: "Rotman FinTech Summit",
    width: 2000,
    height: 1500,
    rotate: 3,
  },
  {
    image: "/assets/centennial-hackathon/field-award-certificates.jpg",
    label: "CentennialHacks, certificates",
    width: 1517,
    height: 1014,
    rotate: -2,
  },
  {
    image: "/assets/atmosphere-community.jpeg",
    label: "Community night",
    width: 2000,
    height: 1334,
    rotate: 4,
  },
  {
    image: "/assets/av-club/59475abd-d23f-47d5-a917-93747495b867.jpg",
    label: "AV Club",
    width: 3840,
    height: 5120,
    rotate: -3,
  },
  {
    image: "/assets/uoft-hackathon/UofT-fintech-summit-team.jpg",
    label: "Summit, after the pitch",
    width: 2000,
    height: 1528,
    rotate: 2,
  },
];

type Item = (typeof ITEMS)[number];

function Card({
  item,
  onOpen,
}: {
  item: Item;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  return (
    <figure
      style={{ "--tilt": `${item.rotate}deg` } as React.CSSProperties}
      className="group w-full max-w-[320px] rotate-[var(--tilt)] transition-transform duration-500 ease-out focus-within:rotate-0 hover:-translate-y-1.5 hover:rotate-0"
    >
      <button
        type="button"
        onClick={(e) => onOpen(e.currentTarget)}
        aria-label={`Open photo: ${item.label}`}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] shadow-[0_18px_40px_-18px_rgb(0_0_0/0.8)] transition-colors duration-300 group-hover:border-white/25"
      >
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(min-width: 768px) 320px, 45vw"
          className="object-cover"
        />
      </button>
      {/* Handwritten, in the same script as the opening "hello". */}
      <figcaption className="font-script mt-2.5 text-center text-lg leading-tight text-[hsl(var(--muted))] transition-colors duration-300 group-hover:text-[hsl(var(--text))] md:text-xl">
        {item.label}
      </figcaption>
    </figure>
  );
}

export function Explorations() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const col1Ref = React.useRef<HTMLDivElement>(null);
  const col2Ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState<Item | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  // Two columns drifting at slightly different speeds over the sticky
  // heading. Desktop widths only, and never under reduced motion.
  React.useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!desktop || reduce) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const drift = (target: HTMLElement | null, from: number, to: number) =>
        gsap.fromTo(
          target,
          { yPercent: from },
          {
            yPercent: to,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      drift(col1Ref.current, 4, -2);
      drift(col2Ref.current, 12, -6);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const open = (item: Item, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActive(item);
  };

  const close = React.useCallback(() => {
    setActive(null);
    // Hand focus back to the photo that opened the preview.
    triggerRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!active) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  return (
    <section
      ref={sectionRef}
      id="explorations"
      className="relative bg-[hsl(var(--bg))] py-16 md:py-0"
    >
      <div className="pointer-events-none z-0 flex items-center justify-center px-6 md:sticky md:top-0 md:h-svh">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[hsl(var(--stroke))]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted))]">
              Off the clock
            </span>
            <span className="h-px w-8 bg-[hsl(var(--stroke))]" />
          </div>
          <h2 className="mt-5 text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
            Behind the{" "}
            <span className="font-display italic font-normal">builds</span>
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm text-[hsl(var(--muted))]">
            Photos from hackathon stages and campus AV shifts.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-10 grid max-w-[1400px] grid-cols-2 gap-x-5 px-6 md:-mt-[100svh] md:gap-x-40 md:pb-[8svh]">
        <div
          ref={col1Ref}
          className="flex flex-col items-center gap-10 md:gap-[26svh] md:pt-[40svh]"
        >
          {ITEMS.slice(0, 3).map((item) => (
            <Card key={item.image} item={item} onOpen={(t) => open(item, t)} />
          ))}
        </div>
        <div
          ref={col2Ref}
          className="flex flex-col items-center gap-10 pt-16 md:gap-[26svh] md:pt-[68svh]"
        >
          {ITEMS.slice(3, 6).map((item) => (
            <Card key={item.image} item={item} onOpen={(t) => open(item, t)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.label}
            onClick={close}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/90 p-6"
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Close photo"
              onClick={close}
              className="absolute end-6 top-6 flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
                className="size-4"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <Image
              src={active.image}
              alt={active.label}
              width={active.width}
              height={active.height}
              sizes="90vw"
              onClick={(e) => e.stopPropagation()}
              className="h-auto max-h-[80vh] w-auto max-w-[90vw] rounded-2xl object-contain"
            />
            <p className="font-script text-xl text-white/80">{active.label}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
