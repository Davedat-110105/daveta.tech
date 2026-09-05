"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { ArrowUpRight, PlateImage, SectionHeader } from "./primitives";

/**
 * The four flagship builds. Swap a card by editing one entry: `image` points
 * at `public/assets/…` and falls back to a labelled plate while the file is
 * missing, so a slot waiting on a screenshot reads as reserved.
 */
const PROJECTS = [
  {
    title: "Astra Labs",
    descriptor: "Pioneer telemetry platform",
    image: "/assets/shot-astralab.jpg",
    href: "https://www.astralab.space",
    span: "md:col-span-7",
  },
  {
    title: "Hana IELTS",
    descriptor: "IELTS learning platform",
    image: "/assets/shot-hana.jpg",
    href: "https://hana-ielts.vercel.app",
    span: "md:col-span-5",
  },
  {
    title: "Greenlight",
    descriptor: "CentennialHacks 2026, 3rd place",
    image: "/assets/shot-greenlight.jpg",
    href: "https://github.com/naik26m3/centennialhacks2026",
    span: "md:col-span-6",
  },
  {
    title: "SuperWeb",
    descriptor: "OpenAI WebMCP Challenge",
    image: "/assets/shot-superweb.webp",
    href: "https://webmcp-superweb.vercel.app",
    span: "md:col-span-6",
  },
];

const HALFTONE = {
  backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
  backgroundSize: "4px 4px",
};

export function SelectedWorks() {
  return (
    <section id="work" className="bg-[hsl(var(--bg))] py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Selected Work"
          lead="Featured"
          accent="projects"
          subtext="Systems I can explain from the inside, from the problem to the deploy that runs it."
          viewAll={{
            label: "View all work",
            href: "https://github.com/Davedat-110105",
          }}
          className="mb-10 md:mb-14"
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
          className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6"
        >
          {PROJECTS.map((project) => (
            <motion.a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                "group relative block h-[320px] overflow-hidden rounded-3xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] transition-colors duration-300 hover:border-white/25 md:h-[440px]",
                project.span,
              )}
            >
              <PlateImage
                src={project.image}
                alt={`${project.title}, ${project.descriptor}`}
                label={`${project.title} — screenshot pending`}
                sizes={
                  project.span === "md:col-span-12"
                    ? "(min-width: 1200px) 1072px, 100vw"
                    : "(min-width: 1200px) 620px, (min-width: 768px) 58vw, 100vw"
                }
                className="absolute inset-0 size-full object-cover"
                plateClassName="rounded-3xl border-0"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-20 mix-blend-multiply"
                style={HALFTONE}
              />

              {/*
               * The title sits on the card, always. The template hid it behind
               * a hover overlay — an animated gradient pill over a blurred
               * scrim — which left four unlabelled images at rest and did the
               * reveal with the flashiest possible gesture. A scrim and a
               * caption say the same thing without the performance.
               */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                <span className="min-w-0">
                  <span className="block text-lg font-medium leading-tight text-white md:text-xl">
                    {project.title}
                  </span>
                  <span className="mt-1 block truncate text-xs text-white/65 md:text-sm">
                    {project.descriptor}
                  </span>
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors duration-300 group-hover:border-white/60 group-hover:text-white">
                  <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
                </span>
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
