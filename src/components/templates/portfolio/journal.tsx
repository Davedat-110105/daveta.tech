"use client";

import { motion } from "motion/react";

import { ArrowUpRight, PlateImage, SectionHeader } from "./primitives";

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

export function Journal() {
  return (
    <section id="deploys" className="bg-[hsl(var(--bg))] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Deployments"
          lead="Live"
          accent="deployments"
          subtext="Client sites and self-hosted services I built, shipped, and still keep running."
          viewAll={{ label: "View all", href: "https://github.com/Davedat-110105" }}
          className="mb-10 md:mb-14"
        />

        <div
          tabIndex={0}
          role="region"
          aria-label="Live deployment cards"
          className="flex snap-x snap-mandatory overflow-x-auto px-3 pb-12 pt-4 md:overflow-visible md:px-10 md:pb-16"
        >
          {ENTRIES.map((entry, i) => (
            <motion.div
              key={entry.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className={`relative w-[78vw] max-w-[300px] shrink-0 snap-center hover:z-30 focus-within:z-30 md:w-[29%] md:max-w-none ${i === 0 ? "" : "ms-4 md:-ms-8"}`}
            >
              <a
                href={entry.href}
                target="_blank"
                rel="noreferrer"
                className={`group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] shadow-2xl transition-transform duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(var(--text))] md:hover:-translate-y-2 md:hover:rotate-0 ${DEPLOYMENT_SLOTS[i] ?? DEPLOYMENT_SLOTS[1]}`}
              >
                <PlateImage
                  src={entry.image}
                  alt=""
                  label={entry.kind}
                  sizes="(min-width: 768px) 290px, 78vw"
                  className="absolute inset-0 size-full"
                  imageClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute end-4 top-4 z-20 flex size-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm">
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
                </span>
                <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/85 to-transparent px-5 pb-5 pt-24 text-white">
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-white/60">
                    {entry.kind}
                  </span>
                  <span className="mt-2 block text-lg font-medium leading-tight [overflow-wrap:anywhere]">
                    {entry.title}
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-white/65">
                    {entry.note}
                  </span>
                </span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
