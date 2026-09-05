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

        <div className="flex flex-col gap-4">
          {ENTRIES.map((entry, i) => (
            <motion.a
              key={entry.title}
              href={entry.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group flex items-center gap-4 rounded-[40px] border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))]/30 p-4 transition-colors duration-300 hover:bg-[hsl(var(--surface))] sm:gap-6 sm:rounded-full"
            >
              <PlateImage
                src={entry.image}
                alt=""
                label={entry.kind}
                sizes="(min-width: 640px) 80px, 64px"
                className="size-16 shrink-0 rounded-full object-cover sm:size-20"
                plateClassName="rounded-full"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-medium sm:text-lg">
                  {entry.title}
                </h3>
                <p className="mt-1 text-xs text-[hsl(var(--muted))] sm:text-sm">
                  {entry.kind} · {entry.note}
                </p>
              </div>
              <span className="me-2 flex size-9 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--stroke))] text-[hsl(var(--muted))] transition-colors duration-300 group-hover:text-[hsl(var(--text))]">
                <ArrowUpRight className="size-4 rtl:-scale-x-100" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
