"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { ArrowUpRight, PlateImage, SectionHeader } from "./primitives";

/*
 * Adapted from "Impact Experience" by uilayout.contact on 21st.dev
 * (https://21st.dev/@uilayout.contact/components/impact-experience).
 * Retheming: the original ships light (zinc-50 / neutral-900); here it runs on
 * the portfolio's scoped `--bg`/`--surface`/`--muted` channels, the hardcoded
 * per-index unsplash images become a data field, and the hover-reveal image
 * degrades to an invisible plate when its asset is missing.
 */

type Role = {
  org: string;
  tagline: string;
  period: string;
  position: string;
  location: string;
  domain: string;
  website?: string;
  image?: string;
  description: string[];
};

const ROLES: Role[] = [
  {
    org: "Student Support",
    tagline: "Live events and campus AV",
    period: "2024 — Present",
    position: "Audio Visual Technician",
    location: "Toronto, ON",
    domain: "Live systems",
    image: "/assets/av-club/401885f4-93a3-424f-a6b7-449d37e69fe5.jpg",
    description: [
      "Live sound, streaming, and event systems for campus programming, including equipment safety and setup for rooms that have to work the first time.",
      "Nothing here is theoretical: a failure is visible to a room full of people while it is happening.",
    ],
  },
  {
    org: "Brand Glow Up",
    tagline: "Websites and automation for small teams",
    period: "2024",
    position: "Technical Support Intern",
    location: "Remote",
    domain: "Web & automation",
    description: [
      "Website and automation support, technical audits, and remote troubleshooting against client sites I did not write and had to read first.",
      "Most of the job was reproducing a problem accurately before touching anything.",
    ],
  },
];

const CREDENTIALS = [
  "NVIDIA Generative AI LLM Associate",
  "Oracle Cloud Infrastructure AI Foundations",
  "CS50 SQL",
  "CompTIA Linux+",
];

const RECORD = [
  { year: "2026", name: "CentennialHacks", result: "3rd place" },
  { year: "2025", name: "Seneca Software Engineering Competition", result: "1st place" },
  { year: "2025", name: "Seneca Hackathon", result: "1st place" },
  { year: "2025", name: "Rotman Commerce FinTech, UFD", result: "1st place" },
];

function RoleRow({ role, isFirst }: { role: Role; isFirst: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "group relative z-10 grid w-full grid-cols-1 gap-8 overflow-hidden border-x border-b border-[hsl(var(--stroke))] bg-[hsl(var(--surface))]/30 px-6 py-12 transition-colors duration-300 md:grid-cols-12 md:px-8 md:py-16",
        isFirst && "rounded-t-3xl border-t",
      )}
    >
      {role.image ? (
        <PlateImage
          src={role.image}
          alt=""
          label={role.org}
          sizes="(min-width: 1200px) 1072px, 100vw"
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-15"
          plateClassName="opacity-0"
        />
      ) : null}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--bg))] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative z-10 space-y-3 md:col-span-3">
        <h3 className="text-3xl font-medium leading-tight tracking-tight text-[hsl(var(--text))] md:text-4xl">
          {role.org}
        </h3>
        <p className="font-display text-base italic text-[hsl(var(--muted))] transition-colors duration-300 group-hover:text-[hsl(var(--text))]">
          {role.tagline}
        </p>
        <p className="text-sm tabular-nums text-[hsl(var(--muted))]">
          {role.period}
        </p>
      </div>

      <dl className="relative z-10 grid grid-cols-2 gap-y-4 self-start md:col-span-4">
        <dt className="text-sm text-[hsl(var(--muted))]">Position</dt>
        <dd className="text-sm font-medium text-[hsl(var(--text))]">
          {role.position}
        </dd>

        <dt className="text-sm text-[hsl(var(--muted))]">Location</dt>
        <dd className="text-sm font-medium text-[hsl(var(--text))]">
          {role.location}
        </dd>

        <dt className="text-sm text-[hsl(var(--muted))]">Domain</dt>
        <dd className="text-sm font-medium text-[hsl(var(--text))]">
          {role.domain}
        </dd>

        {role.website ? (
          <>
            <dt className="text-sm text-[hsl(var(--muted))]">Site</dt>
            <dd>
              <a
                href={`https://${role.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-1 border-b border-[hsl(var(--stroke))] text-sm font-medium text-[hsl(var(--text))] transition-colors hover:border-[hsl(var(--text))]"
              >
                {role.website}
                <ArrowUpRight className="size-3 rtl:-scale-x-100" />
              </a>
            </dd>
          </>
        ) : null}
      </dl>

      <div className="relative z-10 space-y-5 md:col-span-5">
        {role.description.map((para) => (
          <p
            key={para}
            className="text-pretty text-sm leading-relaxed text-[hsl(var(--muted))] transition-colors duration-300 group-hover:text-[hsl(var(--text))]/85 sm:text-base"
          >
            {para}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

export function Experience() {
  return (
    <section id="about" className="bg-[hsl(var(--bg))] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Experience"
          lead="Where the work"
          accent="happens"
          subtext="Studying AI and Computer Engineering Technology at Seneca Polytechnic. The rest of the week is spent keeping other people's systems up."
          className="mb-10 md:mb-14"
        />

        <div className="rounded-3xl">
          {ROLES.map((role, i) => (
            <RoleRow key={role.org} role={role} isFirst={i === 0} />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-[hsl(var(--stroke))] pt-10 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted))]">
              Certifications
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {CREDENTIALS.map((credential) => (
                <li
                  key={credential}
                  className="flex items-baseline gap-3 text-sm text-[hsl(var(--text))]/90"
                >
                  <span
                    aria-hidden="true"
                    className="accent-gradient size-1.5 shrink-0 translate-y-[-2px] rounded-full"
                  />
                  {credential}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted))]">
              Competition record
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {RECORD.map((entry) => (
                <li
                  key={`${entry.year}-${entry.name}`}
                  className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--stroke))] pb-3 text-sm last:border-b-0"
                >
                  <span className="min-w-0 flex-1 truncate text-[hsl(var(--text))]/90">
                    <span className="me-3 tabular-nums text-[hsl(var(--muted))]">
                      {entry.year}
                    </span>
                    {entry.name}
                  </span>
                  <span className="shrink-0 font-display italic text-[hsl(var(--text))]">
                    {entry.result}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
