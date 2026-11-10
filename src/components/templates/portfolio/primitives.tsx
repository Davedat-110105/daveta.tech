"use client";

import Image from "next/image";
import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const SECTION_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-3.5", className)}
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-3.5 rtl:rotate-180", className)}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Pill / button with the accent-gradient ring that fades in on hover. The
 * ring sits 2px behind an opaque inner surface, so only a hairline gradient
 * border shows through.
 */
export function RingLink({
  href,
  children,
  ariaLabel,
  target,
  rel,
  outerClassName,
  innerClassName,
}: {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
  target?: string;
  rel?: string;
  outerClassName?: string;
  innerClassName?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={target}
      rel={rel ?? (target === "_blank" ? "noreferrer" : undefined)}
      className={cn("group relative inline-flex shrink-0", outerClassName)}
    >
      <span
        aria-hidden="true"
        className="accent-gradient pointer-events-none absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        className={cn(
          "relative inline-flex items-center justify-center gap-1.5 rounded-full transition-colors duration-300",
          innerClassName,
        )}
      >
        {children}
      </span>
    </a>
  );
}

/** Desktop-only "View all" pill used by the section headers. */
export function ViewAllButton({
  label,
  href,
  className,
}: {
  label: string;
  href: string;
  className?: string;
}) {
  return (
    <RingLink
      href={href}
      outerClassName={cn("hidden md:inline-flex", className)}
      innerClassName="bg-[hsl(var(--surface))] px-4 py-2 text-xs text-[hsl(var(--text))] backdrop-blur-md"
    >
      {label}
      <ArrowRight className="size-3" />
    </RingLink>
  );
}

/**
 * Heading + subtext header shared by the Work, Journal and Experience
 * sections. The whole heading is set in the display serif, the same as every
 * other section title. Reveals on scroll with Framer Motion.
 */
export function SectionHeader({
  heading: Heading = "h2",
  lead,
  accent,
  trailing = "",
  subtext,
  viewAll,
  className,
}: {
  heading?: "h2" | "h3";
  lead: string;
  accent: string;
  trailing?: string;
  subtext: string;
  viewAll?: { label: string; href: string };
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: SECTION_EASE }}
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <Heading
            className={cn(
              "text-balance font-display leading-none",
              Heading === "h2" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl",
            )}
          >
            {lead} {accent}
            {trailing}
          </Heading>
          <p className="mt-4 max-w-md text-base text-[hsl(var(--body))] sm:text-lg">
            {subtext}
          </p>
        </div>
        {viewAll ? (
          <ViewAllButton label={viewAll.label} href={viewAll.href} />
        ) : null}
      </div>
    </motion.div>
  );
}

/**
 * Image that degrades to a labelled drafting plate when the asset is missing,
 * so an unfilled slot reads as reserved rather than broken. Same failure mode
 * the previous site used for its image slots.
 */
export function PlateImage({
  src,
  alt,
  label,
  sizes = "100vw",
  className,
  imageClassName,
  plateClassName,
}: {
  src: string;
  alt: string;
  label: string;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  plateClassName?: string;
}) {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <span
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn(
          "flex items-center justify-center border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] text-center",
          className,
          plateClassName,
        )}
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, hsl(var(--stroke))/0.6 0 1px, transparent 1px 11px)",
        }}
      >
        <span className="px-3 text-xs text-[hsl(var(--muted))]">
          {label}
        </span>
      </span>
    );
  }

  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onError={() => setFailed(true)}
        className={cn("object-cover", imageClassName)}
      />
    </span>
  );
}
