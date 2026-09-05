"use client";

import { motion } from "motion/react";

/**
 * A register, not a stat row. The three-big-numbers-with-caps-labels pattern
 * restated figures the Deployments and Experience sections already list, and
 * counted them up on scroll for decoration. This carries facts that appear
 * nowhere else on the page, set in the mono face, with no animated numbers.
 */
const ROWS: Array<[string, string]> = [
  ["Based", "Toronto, Ontario — EST"],
  ["Studying", "AI & Computer Engineering Technology, Seneca Polytechnic"],
  ["Writing", "TypeScript · Python · SQL · Bash"],
  ["Building on", "Next.js · Postgres · Prisma · Docker · S3"],
  ["Running on", "Proxmox on hardware I own · Vercel · Neon"],
  ["Open to", "Software, platform, and infrastructure work"],
];

export function Details() {
  return (
    <section id="details" className="bg-[hsl(var(--bg))] py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[hsl(var(--stroke))]" />
          <span className="font-data text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted))]">
            Details
          </span>
        </div>

        <dl className="mt-8 border-t border-[hsl(var(--stroke))]">
          {ROWS.map(([key, value]) => (
            <div
              key={key}
              className="grid grid-cols-1 gap-1 border-b border-[hsl(var(--stroke))] py-4 sm:grid-cols-[10rem_1fr] sm:gap-6 sm:py-5"
            >
              <dt className="font-data text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted))] sm:pt-0.5">
                {key}
              </dt>
              <dd className="font-data text-sm text-[hsl(var(--text))]/90 sm:text-[15px]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
