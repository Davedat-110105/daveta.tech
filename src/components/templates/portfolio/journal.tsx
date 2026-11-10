"use client";

import * as React from "react";
import { motion } from "motion/react";

import { ArrowUpRight, PlateImage, SectionHeader } from "./primitives";
import { SnapCarousel } from "./snap-carousel";

/** Sites currently serving traffic, client work and self-hosted alike. */
const ENTRIES = [
  {
    title: "wendyliu.work",
    image: "/assets/shot-wendyliu.jpg",
    kind: "Client",
    note: "Portfolio, designed and deployed",
    href: "https://wendyliu.work",
  },
  {
    title: "iliasabokro.com",
    image: "/assets/shot-iliasabokro.jpg",
    kind: "Client",
    note: "Civil and mechanical drawing sets",
    href: "https://iliasabokro.com",
  },
  {
    title: "huydoan.work",
    image: "/assets/shot-huydoan.jpg",
    kind: "Self-hosted",
    note: "Research portfolio on my own hardware",
    href: "https://huydoan.work",
  },
  {
    title: "jeremiahwong.homeserverlocal.com",
    image: "/assets/shot-jeremiahwong.jpg",
    kind: "Self-hosted",
    note: "Portfolio, alongside the rest of the rack",
    href: "https://jeremiahwong.homeserverlocal.com",
  },
];

const DEPLOYMENT_SLOTS = [
  "md:translate-y-10 md:-rotate-6",
  "md:translate-y-2 md:-rotate-2",
  "md:translate-y-2 md:rotate-2",
  "md:translate-y-10 md:rotate-6",
] as const;

type Entry = (typeof ENTRIES)[number];

/**
 * One deployment card. `tilt` carries the fan pose for wide screens. A swipe
 * that started on the card must not open the site, so a click after more
 * than a few pixels of movement is ignored.
 */
function DeployCard({ entry, tilt = "", sizes }: { entry: Entry; tilt?: string; sizes: string }) {
  const start = React.useRef<number | null>(null);
  return (
    <a
      href={entry.href}
      target="_blank"
      rel="noreferrer"
      draggable={false}
      onPointerDown={(event) => {
        start.current = event.clientX;
      }}
      onClick={(event) => {
        if (start.current !== null && Math.abs(event.clientX - start.current) > 8) event.preventDefault();
      }}
      className={`group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] shadow-2xl transition-transform duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(var(--text))] md:hover:-translate-y-2 md:hover:rotate-0 ${tilt}`}
    >
      <PlateImage
        src={entry.image}
        alt=""
        label={entry.kind}
        sizes={sizes}
        className="absolute inset-0 size-full"
        imageClassName="pointer-events-none transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <span className="absolute end-4 top-4 z-20 flex size-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm">
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
      </span>
      <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-4 pt-16 text-white">
        <span className="block text-base font-semibold leading-tight [overflow-wrap:anywhere]">{entry.title}</span>
        <span className="mt-1 block text-sm leading-5 text-white/80">
          {entry.kind}, {entry.note.charAt(0).toLowerCase() + entry.note.slice(1)}
        </span>
      </span>
    </a>
  );
}

export function Journal() {
  return (
    <section id="deploys" tabIndex={-1} className="border-t border-[hsl(var(--stroke))] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          heading="h3"
          lead="Sites I keep"
          accent="online"
          subtext="Four sites I built or host and still look after. Two of them run on hardware I own."
          className="mb-8 md:mb-10"
        />

        {/* Phones: a swipeable carousel. */}
        <div className="md:hidden">
          <SnapCarousel label="Live deployments" peek={40} gap={12}>
            {ENTRIES.map((entry) => (
              <DeployCard key={entry.title} entry={entry} sizes="80vw" />
            ))}
          </SnapCarousel>
        </div>

        {/* Wider screens: the fanned hand of cards. */}
        <div role="region" aria-label="Live deployment cards" className="hidden px-10 pb-16 pt-4 md:flex">
          {ENTRIES.map((entry, i) => (
            <motion.div
              key={entry.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className={`relative w-[29%] shrink-0 hover:z-30 focus-within:z-30 ${i === 0 ? "" : "-ms-8"}`}
            >
              <DeployCard entry={entry} tilt={DEPLOYMENT_SLOTS[i] ?? DEPLOYMENT_SLOTS[1]} sizes="290px" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
