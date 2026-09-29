"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";

import { links } from "@/data/content";
import { HACKATHONS } from "@/data/hackathons";
import { cn } from "@/lib/utils";

import {
  ArrowRight,
  ArrowUpRight,
  PlateImage,
  SectionHeader,
} from "./primitives";

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
  imageClassName?: string;
  description: string[];
};

const ROLES: Role[] = [
  {
    org: "GDG on Campus",
    tagline: "Google Developer Group at Seneca Polytechnic",
    period: "Since 2026",
    position: "Tech Lead",
    location: "Toronto, ON",
    domain: "Community & events",
    image: "/assets/gdg/info-session-bean-bash.jpg",
    description: [
      "Tech lead for the GDG chapter on campus. I help plan and run the workshops and talks, and I handle the coordination that comes with them.",
      "Our first info session ran on September 23, 2026: 64 registrations, a panel and Q&A with Olivier Bourgeois from Google, workshops and demos, and the Bean Bash mini-game, which I hosted.",
    ],
  },
  {
    org: "AWS @ Seneca",
    tagline: "Student cloud club",
    period: "Since 2026",
    position: "Member",
    location: "Toronto, ON",
    domain: "Cloud",
    description: [
      "Joined the campus AWS club in September 2026. First job was helping the team find marketing and events people. I want to bring the deployment work I already do into club sessions.",
    ],
  },
  {
    org: "Student Support",
    tagline: "Live events and campus AV",
    period: "Since 2024",
    position: "Audio Visual Technician",
    location: "Toronto, ON",
    domain: "Live systems",
    image: "/assets/av-club/401885f4-93a3-424f-a6b7-449d37e69fe5.jpg",
    description: [
      "Live sound, streaming, and event setups for campus events, including the equipment safety side. Rooms have to work the first time.",
      "Nothing here is theoretical. When something fails, a room full of people watches it fail.",
    ],
  },
  {
    org: "Brand Glow Up",
    tagline: "Websites and automation for small teams",
    period: "2024",
    position: "Technical Support Intern",
    location: "Remote",
    domain: "Web & automation",
    website: "brandglowup.com",
    image: "/assets/brand-glow-up-logo.png",
    imageClassName: "object-contain p-12 invert sm:p-20",
    description: [
      "Website and automation support, technical audits, and remote troubleshooting against client sites I did not write and had to read first.",
      "Most of the job was reproducing the problem properly before touching anything.",
    ],
  },
];

/*
 * The competition record is the loudest fact on the page, so it is set that
 * way: placement as a display-italic numeral at poster size, and the event
 * photograph riding the cursor across the row. On touch screens, where there
 * is no hover, the photograph sits inline as a small plate instead.
 */
type Win = {
  slug: string;
  date: string;
  name: string;
  rank: string;
  image?: string;
};

// Each row opens the event's own page, /hackathons/<slug>. The row photo is
// the first photo on that page.
const RECORD: Win[] = HACKATHONS.map((hackathon) => ({
  slug: hackathon.slug,
  date: hackathon.date,
  name: hackathon.name,
  rank: hackathon.rank,
  image: hackathon.photos[0]?.src,
}));

/*
 * Credentials, most recent first. Each links to the vendor's official page
 * for that certification, not to a personal record, so no credential ids are
 * published. The one program without a public page falls back to LinkedIn.
 */
const CREDENTIALS = [
  {
    issuer: "NVIDIA",
    name: "NVIDIA-Certified Associate: Generative AI LLMs",
    url: "https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/",
  },
  {
    issuer: "Oracle",
    name: "OCI 2025 Certified Generative AI Professional",
    url: "https://education.oracle.com/oracle-cloud-infrastructure-2025-generative-ai-professional/pexam_1Z0-1127-25",
  },
  {
    issuer: "Oracle",
    name: "OCI 2025 Certified AI Foundations Associate",
    url: "https://education.oracle.com/oracle-cloud-infrastructure-2025-ai-foundations-associate/pexam_1Z0-1122-25",
  },
  {
    issuer: "NVIDIA",
    name: "NVIDIA-Certified Associate: AI Infrastructure and Operations",
    url: "https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-operations-associate/",
  },
  {
    issuer: "CompTIA",
    name: "CompTIA A+",
    url: "https://www.comptia.org/en-us/certifications/a/",
  },
  {
    issuer: "CompTIA Tech Career Academy",
    name: "Systems Support Specialist",
    url: links.certifications,
  },
  {
    issuer: "AWS",
    name: "AWS Certified AI Practitioner",
    url: "https://aws.amazon.com/certification/certified-ai-practitioner/",
  },
  {
    issuer: "CompTIA",
    name: "CompTIA Linux+",
    url: "https://www.comptia.org/en-us/certifications/linux/",
  },
  {
    issuer: "Microsoft",
    name: "AZ-900: Microsoft Azure Fundamentals",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
  },
  {
    issuer: "AWS",
    name: "AWS Certified Cloud Practitioner",
    url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
  },
  {
    issuer: "HarvardX · edX",
    name: "CS50's Introduction to Databases with SQL",
    url: "https://cs50.harvard.edu/sql/",
  },
  {
    issuer: "HarvardX · edX",
    name: "CS50's Introduction to Computer Science",
    url: "https://cs50.harvard.edu/x/",
  },
];

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-[hsl(var(--stroke))]" />
      <span className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted))]">
        {children}
      </span>
    </div>
  );
}

/** Cursor-following photograph for the hovered row. Desktop pointer only. */
function HoverCard({
  win,
  x,
  y,
  rotate,
}: {
  win: Win | null;
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
  rotate: ReturnType<typeof useSpring>;
}) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y, rotate }}
      className="pointer-events-none absolute left-0 top-0 z-30 hidden md:block"
    >
      <AnimatePresence>
        {win ? (
          <motion.div
            key={win.name}
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-0 top-0 aspect-[4/3] w-[280px] -translate-x-1/2 -translate-y-[58%] overflow-hidden rounded-xl bg-[hsl(var(--surface))] shadow-2xl shadow-black/60 ring-1 ring-white/10 lg:w-[320px]"
          >
            {win.image ? (
              <Image
                src={win.image}
                alt=""
                fill
                sizes="320px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-1">
                <span className="font-display text-7xl italic leading-none text-[hsl(var(--text))]">
                  {win.rank}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted))]">
                  No photo from this one
                </span>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function Record() {
  const listRef = React.useRef<HTMLOListElement>(null);
  const [active, setActive] = React.useState<number | null>(null);
  const lastX = React.useRef<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tilt = useMotionValue(0);
  const spring = { stiffness: 320, damping: 30, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const rotate = useSpring(tilt, { stiffness: 160, damping: 18 });

  const onMove = (event: React.MouseEvent) => {
    const list = listRef.current;
    if (!list) return;
    const rect = list.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
    // Lean into the direction of travel, then settle.
    const dx = lastX.current === null ? 0 : event.clientX - lastX.current;
    tilt.set(Math.max(-10, Math.min(10, dx * 0.5)));
    lastX.current = event.clientX;
  };

  const onLeave = () => {
    setActive(null);
    tilt.set(0);
    lastX.current = null;
  };

  return (
    <ol
      ref={listRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mt-10 border-t border-[hsl(var(--stroke))]"
    >
      {RECORD.map((win, index) => {
        const isActive = active === index;
        return (
          <motion.li
            key={`${win.date}-${win.name}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onMouseEnter={() => setActive(index)}
            className={cn(
              "border-b border-[hsl(var(--stroke))] transition-opacity duration-300",
              active !== null && !isActive && "opacity-40",
            )}
          >
            <Link
              href={`/hackathons/${win.slug}`}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(var(--text))] sm:gap-x-6 md:grid-cols-[7rem_1fr_auto] md:py-7"
            >
              {/* Inline plate for touch screens; the hover card covers desktop. */}
              <span className="relative block size-14 overflow-hidden rounded-lg bg-[hsl(var(--surface))] md:hidden">
                {win.image ? (
                  <Image
                    src={win.image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center font-display text-xl italic text-[hsl(var(--muted))]">
                    {win.rank}
                  </span>
                )}
              </span>
              <span className="hidden font-data text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted))] tabular-nums md:block">
                {win.date}
              </span>

              <span className="min-w-0">
                <span className="block font-data text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted))] md:hidden">
                  {win.date}
                </span>
                <span className="flex items-center gap-2 text-pretty text-lg font-medium leading-tight tracking-tight text-[hsl(var(--text))] sm:text-2xl md:text-3xl">
                  {win.name}
                  <ArrowRight className="size-4 shrink-0 text-[hsl(var(--muted))] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[hsl(var(--text))] md:size-5" />
                </span>
              </span>

              <span className="flex items-baseline gap-2 text-[hsl(var(--text))]">
                <span
                  className={cn(
                    "font-display text-5xl italic leading-none transition-colors duration-300 sm:text-6xl md:text-7xl lg:text-8xl",
                    win.rank === "1st"
                      ? "text-[hsl(var(--signal))]"
                      : "text-[hsl(var(--text))]/60",
                  )}
                >
                  {win.rank}
                </span>
                <span className="hidden font-data text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted))] sm:block">
                  place
                </span>
              </span>
            </Link>
          </motion.li>
        );
      })}

      <HoverCard
        win={active === null ? null : RECORD[active]}
        x={sx}
        y={sy}
        rotate={rotate}
      />
    </ol>
  );
}

function Credentials() {
  // Two copies: the strip translates by half its width and loops seamlessly.
  // It pauses under the pointer so a credential can be clicked through to
  // the vendor page; the second copy is decoration for assistive tech.
  const copy = (hidden: boolean) =>
    CREDENTIALS.map((credential) => (
      <a
        key={`${hidden}-${credential.name}`}
        href={credential.url}
        target="_blank"
        rel="noreferrer"
        aria-hidden={hidden || undefined}
        tabIndex={hidden ? -1 : undefined}
        title={`${credential.issuer}: official certification page`}
        className="group flex shrink-0 items-baseline gap-3 pe-14 transition-opacity duration-300 hover:opacity-100 [.animate-marquee:hover_&:not(:hover)]:opacity-50"
      >
        <span className="font-display text-2xl italic text-[hsl(var(--text))] sm:text-3xl">
          {credential.issuer}
        </span>
        <span className="text-base text-[hsl(var(--muted))] transition-colors duration-300 group-hover:text-[hsl(var(--text))] sm:text-lg">
          {credential.name}
        </span>
        <ArrowUpRight className="size-3.5 self-center text-[hsl(var(--muted))] opacity-0 transition-all duration-300 group-hover:opacity-100 rtl:-scale-x-100" />
        <span
          aria-hidden="true"
          className="accent-gradient ms-8 size-1.5 shrink-0 -translate-y-1 rounded-full"
        />
      </a>
    ));

  return (
    <div className="mt-16">
      <div className="flex items-end justify-between gap-4">
        <Kicker>Certifications</Kicker>
        <a
          href={links.certifications}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-1.5 text-sm text-[hsl(var(--muted))] transition-colors duration-300 hover:text-[hsl(var(--text))]"
        >
          <span className="border-b border-[hsl(var(--stroke))] pb-px transition-colors duration-300 group-hover:border-[hsl(var(--text))]">
            All of them on LinkedIn
          </span>
          <ArrowUpRight className="size-3 rtl:-scale-x-100" />
        </a>
      </div>
      <div className="relative -mx-6 mt-6 overflow-hidden border-y border-[hsl(var(--stroke))] py-5 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] md:-mx-10 lg:-mx-16">
        <div className="animate-marquee flex w-max whitespace-nowrap ps-6 md:ps-10 lg:ps-16">
          {copy(false)}
          {copy(true)}
        </div>
      </div>
    </div>
  );
}

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
          className={cn(
            "absolute inset-0 size-full opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-15",
            role.imageClassName && "group-hover:opacity-30",
          )}
          imageClassName={role.imageClassName}
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
          subtext="I study AI and Computer Engineering Technology at Seneca Polytechnic. The rest of the week goes to keeping other people's systems up."
          className="mb-10 md:mb-14"
        />

        <div className="rounded-3xl">
          {ROLES.map((role, i) => (
            <RoleRow key={role.org} role={role} isFirst={i === 0} />
          ))}
        </div>

        <Credentials />
      </div>
    </section>
  );
}

/**
 * The competition record as its own section, straight after Selected Work and
 * in the nav. It used to sit under Experience, about 5,000px down the page.
 */
export function CompetitionRecord() {
  return (
    <section id="record" className="bg-[hsl(var(--bg))] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <Kicker>Competition record</Kicker>
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-xl text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Four podiums,{" "}
            <span className="font-display italic font-normal">
              three of them first.
            </span>
          </h2>
          <p className="max-w-xs text-sm text-[hsl(var(--muted))] sm:text-base">
            Hackathons and engineering competitions, most recent first. Open one
            for the full story.
          </p>
        </div>
        <Record />
      </div>
    </section>
  );
}
