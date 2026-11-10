"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { motion } from "motion/react";

import { links } from "@/data/content";
import { HACKATHONS } from "@/data/hackathons";
import { cn } from "@/lib/utils";

import { Journal } from "./journal";
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

type ClubEvent = {
  label: string;
  title: string;
  date: string;
  dateTime: string;
  description: string;
  media?: { src: string; width: number; height: number; alt: string; caption: string };
  resources: { label: string; href: string }[];
};

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
  events?: ClubEvent[];
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
    ],
    events: [
      {
        label: "Resume Roast",
        title: "Resume Roast & Career Workshop with Rezzy",
        date: "Nov 3, 2026",
        dateTime: "2026-11-03",
        description: "I co-hosted this workshop with Rezzy. Rezzy co-founder Aryan Khurana shared resume advice, and the session used live reviews to show how students could make their experience clearer on the page.",
        media: {
          src: "/assets/gdg/resume-roast-poster.jpg",
          width: 800,
          height: 800,
          alt: "Rezzy and GDG on Campus at Seneca logos above a microphone",
          caption: "Official event artwork from GDG on Campus.",
        },
        resources: [
          { label: "GDG event post", href: "https://gdg.community.dev/events/details/google-gdg-on-campus-seneca-polytechnic-toronto-canada-presents-resume-roast-amp-career-workshop-with-rezzy/" },
          { label: "Rezzy", href: "https://rezzy.dev/" },
        ],
      },
      {
        label: "Info session",
        title: "Welcome to GDG @ Seneca",
        date: "Sep 23, 2026",
        dateTime: "2026-09-23",
        description: "Our fall info session drew 64 RSVPs and included a panel and Q&A with Olivier Bourgeois from Google. I hosted Bean Bash, the live mini-game.",
        media: {
          src: "/assets/gdg/info-session-bean-bash.jpg",
          width: 1086,
          height: 1448,
          alt: "Dave Ta holding a microphone in front of a Bean Bash quiz at Seneca",
          caption: "Hosting Bean Bash at the fall info session.",
        },
        resources: [
          { label: "GDG event post", href: "https://gdg.community.dev/events/details/google-gdg-on-campus-seneca-polytechnic-toronto-canada-presents-welcome-to-gdg-seneca-info-session/" },
          { label: "Open Bean Bash", href: "https://gdg-bean-bash.tatandat110105.workers.dev/" },
        ],
      },
    ],
  },
  {
    org: "AWS @ Seneca",
    tagline: "AWS Student Builder Group at Seneca Polytechnic",
    period: "Since 2026",
    position: "Tech Lead",
    location: "Toronto, ON",
    domain: "Cloud",
    image: "/assets/aws/aws-logo.svg",
    imageClassName: "object-contain p-14 sm:p-24",
    description: [
      "I build workshop projects and help plan sessions where students can deploy an app and see how the cloud services fit together.",
    ],
    events: [
      {
        label: "AWS 101",
        title: "AWS 101 Workshop",
        date: "Oct 28, 2026",
        dateTime: "2026-10-28",
        description: "I helped plan the workshop and built the starter app. The session covered EC2, S3, IAM and RDS, with a guided deployment and a team challenge.",
        media: {
          src: "/assets/aws/aws-101-poster.jpg",
          width: 600,
          height: 337,
          alt: "AWS 101 Workshop poster for October 28 at Seneca Newnham Campus",
          caption: "Official workshop poster from AWS Student Builder Groups at Seneca.",
        },
        resources: [
          { label: "Meetup listing", href: "https://www.meetup.com/aws-sbg-at-seneca-polytechnic-newnham-campus/events/316658151/" },
          { label: "Seneca announcement", href: "https://students.senecapolytechnic.ca/spaces/281/school-of-computer-programming-analysis/articles/news/18484/aws101-workshop-on-october-28th-in-seneca-helix-conference-room-from-3pm-5pm" },
          { label: "Workshop starter app", href: "https://github.com/aws-seneca/aws-101-workshop" },
        ],
      },
      {
        label: "Club kickoff",
        title: "AWS Student Builder Group kickoff",
        date: "Sep 16, 2026",
        dateTime: "2026-09-16",
        description: "Our online launch introduced the club, core AWS services and certification paths. The session agenda included a live static-site deployment to S3.",
        resources: [
          { label: "Kickoff post on LinkedIn", href: "https://www.linkedin.com/posts/aws-student-builder-seneca-poly_aws-cloudcomputing-senecapolytechnic-activity-7503199298671763457-PqVv" },
        ],
      },
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
    issuer: "HarvardX on edX",
    name: "CS50's Introduction to Databases with SQL",
    url: "https://cs50.harvard.edu/sql/",
  },
  {
    issuer: "HarvardX on edX",
    name: "CS50's Introduction to Computer Science",
    url: "https://cs50.harvard.edu/x/",
  },
];

/**
 * The record, lit like a stage. Pointing at or tabbing to a placement keeps
 * that row in the light, dims the others, and crossfades the frame beside the
 * title to a photo from that event. Phones get each photo inline instead.
 */
function CompetitionRecord() {
  const firstLit = Math.max(
    0,
    HACKATHONS.findIndex((h) => h.rank === "1st" && h.photos.length > 0),
  );
  const [active, setActive] = React.useState(firstLit);
  const [engaged, setEngaged] = React.useState(false);
  const current = HACKATHONS[active];

  const frame = (
    <figure className="hidden lg:block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))]">
        {HACKATHONS.map((hackathon, i) => {
          const photo = hackathon.photos[0];
          if (hackathon.mark) {
            return (
              <span
                key={hackathon.slug}
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              >
                <Image
                  src={hackathon.mark.src}
                  alt=""
                  width={208}
                  height={208}
                  className="size-52 rounded-full"
                />
              </span>
            );
          }
          return photo ? (
            <Image
              key={hackathon.slug}
              src={photo.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 360px, 0px"
              className={cn(
                "object-cover transition-opacity duration-500 ease-out",
                i === active ? "opacity-100" : "opacity-0",
              )}
            />
          ) : (
            <span
              key={hackathon.slug}
              aria-hidden="true"
              className={cn(
                "absolute inset-0 flex items-center justify-center font-display text-8xl text-[hsl(var(--signal))] transition-opacity duration-500",
                i === active ? "opacity-100" : "opacity-0",
              )}
            >
              {hackathon.rank}
            </span>
          );
        })}
      </div>
      <figcaption className="mt-3 text-sm text-[hsl(var(--muted))]">
        {current.mark?.alt ?? current.photos[0]?.alt ?? `${current.project}, ${current.rank} place at ${current.event}`}
      </figcaption>
    </figure>
  );

  return (
    <section id="record" tabIndex={-1} className="border-t border-[hsl(var(--stroke))] py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-6 md:px-10 lg:grid-cols-12 lg:gap-10 lg:px-16">
        <header className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <h3 className="text-balance font-display text-3xl leading-none sm:text-4xl">Competition record</h3>
          <p className="mt-4 max-w-sm text-base text-[hsl(var(--body))] sm:text-lg">
            Four podiums, three of them first. Open one for the full story.
          </p>
          <div className="mt-8">{frame}</div>
        </header>

        <ul
          onPointerLeave={() => setEngaged(false)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEngaged(false);
          }}
          className="min-w-0 border-t border-[hsl(var(--stroke))] lg:col-span-8 lg:border-t-0"
        >
          {HACKATHONS.map((hackathon, i) => {
            const { slug, project, name, date, rank } = hackathon;
            const lit = !engaged || i === active;
            const photo = hackathon.photos[0];
            return (
              <li key={slug} className="border-b border-[hsl(var(--stroke))]">
                <Link
                  href={`/hackathons/${slug}`}
                  onPointerEnter={() => {
                    setActive(i);
                    setEngaged(true);
                  }}
                  onFocus={() => {
                    setActive(i);
                    setEngaged(true);
                  }}
                  className={cn(
                    "group grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-5 py-7 transition-opacity duration-300 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:gap-x-8 lg:py-9 lg:[li:first-child_&]:pt-0",
                    lit ? "opacity-100" : "lg:opacity-35",
                  )}
                >
                  <span
                    className={cn(
                      "col-span-2 font-display text-7xl leading-[0.8] tracking-[-0.03em] sm:col-span-1 sm:text-8xl",
                      rank === "1st" ? "text-[hsl(var(--signal))]" : "text-[hsl(var(--muted))]",
                    )}
                  >
                    {rank}
                  </span>
                  <span className="mt-4 min-w-0 sm:mt-0">
                    <span className="block text-pretty text-2xl font-semibold leading-tight text-[hsl(var(--text))] group-hover:underline group-hover:decoration-[hsl(var(--muted))] group-hover:underline-offset-4 sm:text-3xl">
                      {project}
                    </span>
                    <span className="mt-1.5 block text-base text-[hsl(var(--body))]">{name}</span>
                    <span className="mt-1 block text-sm text-[hsl(var(--muted))]">{date}</span>
                  </span>
                  {hackathon.mark ? (
                    <span className="mt-4 flex size-20 shrink-0 items-center justify-center rounded-lg border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] sm:mt-0 lg:hidden">
                      <Image src={hackathon.mark.src} alt="" width={56} height={56} className="size-14 rounded-full" />
                    </span>
                  ) : photo ? (
                    <span className="relative mt-4 block size-20 shrink-0 overflow-hidden rounded-lg border border-[hsl(var(--stroke))] sm:mt-0 lg:hidden">
                      <Image src={photo.src} alt="" fill sizes="80px" className="object-cover" />
                    </span>
                  ) : (
                    <span className="lg:hidden" />
                  )}
                  <ArrowRight className="hidden size-5 shrink-0 self-center text-[hsl(var(--muted))] transition-transform duration-200 group-hover:translate-x-1 lg:block" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Group by issuer, keeping each issuer where its newest credential sits. */
const CREDENTIAL_GROUPS = CREDENTIALS.reduce<Array<{ issuer: string; items: typeof CREDENTIALS }>>(
  (groups, credential) => {
    const group = groups.find((g) => g.issuer === credential.issuer);
    if (group) group.items.push(credential);
    else groups.push({ issuer: credential.issuer, items: [credential] });
    return groups;
  },
  [],
);

/**
 * One block of the experience chapter: a hairline, generous room, the title
 * on the left and the content on the right, so each block reads as its own
 * section rather than a list run into the last one.
 */
function Block({
  id,
  title,
  lead,
  aside,
  children,
}: {
  id?: string;
  title: string;
  lead?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} tabIndex={id ? -1 : undefined} className="border-t border-[hsl(var(--stroke))] py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-6 md:px-10 lg:grid-cols-12 lg:gap-10 lg:px-16">
        <header className="lg:col-span-4">
          <h3 className="text-balance font-display text-3xl leading-none sm:text-4xl">{title}</h3>
          {lead ? <p className="mt-4 max-w-sm text-base text-[hsl(var(--body))] sm:text-lg">{lead}</p> : null}
          {aside ? <div className="mt-4">{aside}</div> : null}
        </header>
        <div className="min-w-0 lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

function Credentials() {
  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {CREDENTIAL_GROUPS.map((group) => (
        <section key={group.issuer} aria-label={group.issuer} className="border-t border-[hsl(var(--stroke))] pt-4 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0">
          <p className="text-sm text-[hsl(var(--muted))]">{group.issuer}</p>
          <ul className="mt-2 space-y-1">
            {group.items.map((credential) => (
              <li key={credential.name}>
                <a
                  href={credential.url}
                  target="_blank"
                  rel="noreferrer"
                  title={`${credential.issuer}: official certification page`}
                  className="inline-block py-1 text-base leading-snug text-[hsl(var(--text))] hover:underline hover:decoration-[hsl(var(--muted))] hover:underline-offset-4"
                >
                  {credential.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const LINKEDIN_CERTS = (
  <a
    href={links.certifications}
    target="_blank"
    rel="noreferrer"
    className="group inline-flex min-h-11 items-center gap-1.5 text-sm text-[hsl(var(--muted))] transition-colors duration-300 hover:text-[hsl(var(--text))]"
  >
    <span className="border-b border-[hsl(var(--stroke))] pb-px transition-colors duration-300 group-hover:border-[hsl(var(--text))]">
      See them on LinkedIn
    </span>
    <ArrowUpRight className="size-3 rtl:-scale-x-100" />
  </a>
);

function ClubEvents({ org, events }: { org: string; events: ClubEvent[] }) {
  const id = React.useId();
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [active, setActive] = React.useState(0);

  function handleTabKey(event: React.KeyboardEvent<HTMLDivElement>) {
    const last = events.length - 1;
    let next: number;

    switch (event.key) {
      case "ArrowUp":
        next = active === 0 ? last : active - 1;
        break;
      case "ArrowDown":
        next = active === last ? 0 : active + 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActive(next);
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  }

  return (
    <>
      <button
        type="button"
        aria-label={`View events from ${org}`}
        aria-haspopup="dialog"
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          setActive(0);
          dialogRef.current?.showModal();
        }}
        className="absolute inset-0 z-20 cursor-pointer rounded-[inherit] text-[hsl(var(--muted))] hover:text-[hsl(var(--signal))] focus-visible:text-[hsl(var(--signal))]"
        style={{ outlineOffset: -4 }}
      >
        <ArrowRight className="absolute end-6 bottom-5 size-4 md:end-8" />
      </button>
      <dialog
        ref={dialogRef}
        data-club-events
        aria-labelledby={`${id}-title`}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="fixed inset-y-0 end-[calc(100%_-_100dvw)] start-auto m-0 h-dvh max-h-none w-dvw max-w-none overflow-y-auto overscroll-contain bg-[hsl(var(--bg))] text-[hsl(var(--text))] backdrop:bg-black/70 sm:w-[min(42rem,90vw)]"
      >
        <div className="min-h-full px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8">
          <header className="flex items-start justify-between gap-4 border-b border-[hsl(var(--stroke))] pb-5">
            <h2 id={`${id}-title`} className="self-center text-balance font-display text-3xl leading-none sm:text-4xl">{org} events</h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="min-h-11 shrink-0 cursor-pointer rounded-full border border-white/15 px-4 text-sm hover:bg-white/10"
            >
              Close
            </button>
          </header>
          <div className="grid gap-6 pt-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
            <div
              role="tablist"
              aria-label={`${org} events`}
              aria-orientation="vertical"
              onKeyDown={handleTabKey}
              className="flex flex-col gap-1 border-b border-[hsl(var(--stroke))] pb-4 sm:border-b-0 sm:border-e sm:pb-0 sm:pe-4"
            >
              {events.map((event, i) => (
                <button
                  key={event.dateTime}
                  id={`${id}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-controls={`${id}-event-${i}`}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="min-h-11 cursor-pointer rounded-lg px-3 text-start text-sm font-medium text-[hsl(var(--muted))] hover:bg-white/5 hover:text-white aria-selected:bg-white/10 aria-selected:text-white"
                >
                  {event.label}
                </button>
              ))}
            </div>
            {events.map((event, i) => (
              <div
                key={event.dateTime}
                id={`${id}-event-${i}`}
                role="tabpanel"
                aria-labelledby={`${id}-tab-${i}`}
                hidden={active !== i}
                tabIndex={0}
                className="space-y-3"
              >
                <time dateTime={event.dateTime} className="text-sm tabular-nums text-[hsl(var(--muted))]">
                  {event.date}
                </time>
                <h3 className="text-balance text-2xl font-medium leading-tight">{event.title}</h3>
                <p className="text-pretty text-base leading-relaxed text-[hsl(var(--body))]">{event.description}</p>
                {event.media ? (
                  <figure className="pt-2">
                    <Image
                      src={event.media.src}
                      alt={event.media.alt}
                      width={event.media.width}
                      height={event.media.height}
                      sizes="(min-width: 640px) 420px, 90vw"
                      className="h-auto max-h-80 w-full rounded-xl bg-[hsl(var(--surface))] object-contain"
                    />
                    <figcaption className="mt-2 text-sm text-[hsl(var(--muted))]">{event.media.caption}</figcaption>
                  </figure>
                ) : null}
                <ul className="border-t border-[hsl(var(--stroke))] pt-1">
                  {event.resources.map((resource) => (
                    <li key={resource.href}>
                      <a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm underline decoration-[hsl(var(--muted))] underline-offset-4 hover:decoration-current">
                        {resource.label}
                        <ArrowUpRight className="size-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </>
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
        <p className="text-base text-[hsl(var(--body))]">
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
            className="text-pretty text-base leading-relaxed text-[hsl(var(--body))]"
          >
            {para}
          </p>
        ))}
      </div>
      {role.events ? <ClubEvents org={role.org} events={role.events} /> : null}
    </motion.div>
  );
}

export function Experience() {
  return (
    <section id="experience" tabIndex={-1} className="bg-[hsl(var(--bg))] pt-16 md:pt-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          lead="Where the work"
          accent="happens"
          subtext="Campus workshops, live event production, and technical support."
        />
        <div className="mb-8 mt-4 flex flex-wrap gap-x-5 md:mb-12">
          <a href="#record" className="inline-flex min-h-11 items-center text-sm underline decoration-[hsl(var(--muted))] underline-offset-4 hover:decoration-current">Competition record</a>
          <a href="#deploys" className="inline-flex min-h-11 items-center text-sm underline decoration-[hsl(var(--muted))] underline-offset-4 hover:decoration-current">Live deployments</a>
        </div>

        <div className="rounded-3xl pb-16 md:pb-24">
          {ROLES.map((role, i) => (
            <RoleRow key={role.org} role={role} isFirst={i === 0} />
          ))}
        </div>
      </div>
      <Block title="Certifications" aside={LINKEDIN_CERTS}>
        <Credentials />
      </Block>
      <CompetitionRecord />
      <Journal />
    </section>
  );
}
