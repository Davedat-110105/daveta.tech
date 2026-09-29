import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  ArrowUpRight,
} from "@/components/templates/portfolio/primitives";
import { inter, instrumentSerif } from "@/components/templates/portfolio/fonts";
import { PORTFOLIO_STYLES } from "@/components/templates/portfolio/styles";
import { getHackathon, HACKATHONS } from "@/data/hackathons";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return HACKATHONS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hackathon = getHackathon((await params).slug);
  if (!hackathon) return {};
  const title = `${hackathon.project}, ${hackathon.rank} place at ${hackathon.event}`;
  return {
    title,
    description: hackathon.summary,
    alternates: { canonical: `/hackathons/${hackathon.slug}` },
    openGraph: { title, description: hackathon.summary },
  };
}

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

export default async function HackathonPage({ params }: Props) {
  const hackathon = getHackathon((await params).slug);
  if (!hackathon) notFound();

  const index = HACKATHONS.indexOf(hackathon);
  const next = HACKATHONS[(index + 1) % HACKATHONS.length];
  const [cover, ...gallery] = hackathon.photos;

  return (
    <div
      data-slot="portfolio"
      id="main-content"
      tabIndex={-1}
      className={cn(
        inter.variable,
        instrumentSerif.variable,
        "min-h-svh bg-[hsl(var(--bg))] text-[hsl(var(--text))] antialiased",
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: PORTFOLIO_STYLES }} />

      <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-8 md:px-10 md:pt-12 lg:px-16">
        <Link
          href="/#record"
          className="group inline-flex items-center gap-2 text-sm text-[hsl(var(--muted))] transition-colors duration-300 hover:text-[hsl(var(--text))]"
        >
          <ArrowRight className="size-3.5 rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:rotate-0" />
          Back to the record
        </Link>

        <header className="mt-14 md:mt-20">
          <Kicker>
            {hackathon.date} · {hackathon.host}
          </Kicker>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                {hackathon.project}
              </h1>
              <p className="mt-3 font-display text-xl italic text-[hsl(var(--muted))] sm:text-2xl">
                {hackathon.event}
              </p>
            </div>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-7xl italic leading-none sm:text-8xl lg:text-9xl">
                {hackathon.rank}
              </span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--muted))]">
                place
              </span>
            </p>
          </div>
          <p className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-[hsl(var(--text))]/80 sm:text-lg">
            {hackathon.summary}
          </p>
        </header>

        {cover ? (
          <div className="relative mt-12 aspect-[16/10] overflow-hidden rounded-3xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] md:mt-16">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              priority
              sizes="(min-width: 1200px) 1072px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        {hackathon.stats ? (
          <dl className="mt-12 grid grid-cols-2 border-t border-[hsl(var(--stroke))] md:mt-16 md:grid-cols-4">
            {hackathon.stats.map((stat) => (
              <div
                key={stat.label}
                className="border-b border-[hsl(var(--stroke))] py-6 pe-4"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-5xl italic leading-none tabular-nums">
                    {stat.value}
                  </span>
                  <span className="mt-3 block text-sm text-[hsl(var(--muted))]">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
          <div className="space-y-16 md:col-span-8">
            {hackathon.sections.map((section) => (
              <section key={section.label}>
                <Kicker>{section.label}</Kicker>
                <h2 className="mt-5 text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-4">
                  {section.body.map((para) => (
                    <p
                      key={para}
                      className="text-pretty text-sm leading-relaxed text-[hsl(var(--muted))] sm:text-base"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-10 md:col-span-4 md:border-s md:border-[hsl(var(--stroke))] md:ps-8">
            {hackathon.role ? (
              <div>
                <Kicker>My role</Kicker>
                <p className="mt-4 text-sm font-medium">{hackathon.role}</p>
              </div>
            ) : null}
            {hackathon.team ? (
              <div>
                <Kicker>Team</Kicker>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {hackathon.team.map((member) => (
                    <li key={member}>{member}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {hackathon.stack ? (
              <div>
                <Kicker>Stack</Kicker>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {hackathon.stack.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-[hsl(var(--stroke))] px-3 py-1 text-xs text-[hsl(var(--muted))]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {hackathon.links ? (
              <div>
                <Kicker>Links</Kicker>
                <ul className="mt-4 space-y-2">
                  {hackathon.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 border-b border-[hsl(var(--stroke))] text-sm font-medium transition-colors hover:border-[hsl(var(--text))]"
                      >
                        {link.label}
                        <ArrowUpRight className="size-3 rtl:-scale-x-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>

        {gallery.length ? (
          <div className="mt-20 grid gap-5 sm:grid-cols-2 md:mt-28">
            {gallery.map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 536px, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}

        <nav
          aria-label="More competitions"
          className="mt-24 flex flex-col gap-6 border-t border-[hsl(var(--stroke))] pt-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <Link
            href="/#record"
            className="text-sm text-[hsl(var(--muted))] transition-colors duration-300 hover:text-[hsl(var(--text))]"
          >
            All competitions
          </Link>
          <Link href={`/hackathons/${next.slug}`} className="group text-end">
            <span className="block text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted))]">
              Next
            </span>
            <span className="mt-2 inline-flex items-center gap-2 text-2xl font-medium tracking-tight sm:text-3xl">
              {next.project}
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
