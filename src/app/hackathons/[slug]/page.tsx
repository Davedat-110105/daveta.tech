import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  ArrowUpRight,
} from "@/components/templates/portfolio/primitives";
import { newsreader, sourceSans } from "@/components/templates/portfolio/fonts";
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

export default async function HackathonPage({ params }: Props) {
  const hackathon = getHackathon((await params).slug);
  if (!hackathon) notFound();

  const index = HACKATHONS.indexOf(hackathon);
  const next = HACKATHONS[(index + 1) % HACKATHONS.length];
  const [cover, ...gallery] = hackathon.photos;

  return (
    <main
      data-slot="portfolio"
      id="main-content"
      tabIndex={-1}
      className={cn(
        sourceSans.variable,
        newsreader.variable,
        "min-h-svh bg-[hsl(var(--bg))] text-[hsl(var(--text))] antialiased",
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: PORTFOLIO_STYLES }} />

      <div className="mx-auto max-w-[1120px] px-6 pb-20 pt-6 md:px-10 md:pt-10">
        <Link
          href="/#record"
          className="group inline-flex min-h-11 items-center gap-2 text-sm text-[hsl(var(--muted))] hover:text-[hsl(var(--text))]"
        >
          <ArrowRight className="size-3.5 rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:rotate-0" />
          Back to the record
        </Link>

        {/* Image and story pairing informed by Editorial Image Hero on 21st.dev. */}
        <header className={cn("mt-6 grid gap-7 border-b border-[hsl(var(--stroke))] pb-8 md:mt-9 md:items-center md:gap-12 md:pb-10", cover && "md:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]")}>
          <div className="max-w-[60ch]">
            <h1 className="text-balance font-display text-5xl leading-none sm:text-6xl">
              {hackathon.project}
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-[hsl(var(--text))]/85">
              {hackathon.summary}
            </p>
            <p className="mt-5 text-sm text-[hsl(var(--muted))]">
              {hackathon.event} · {hackathon.date} · {hackathon.rank} place
            </p>
          </div>
          {cover ? (
            <figure>
              <Image
                src={cover.src}
                alt=""
                width={cover.width}
                height={cover.height}
                priority
                sizes="(min-width: 768px) 440px, 90vw"
                className="h-auto max-h-[25rem] w-full rounded-lg bg-[hsl(var(--surface))] object-contain"
              />
              <figcaption className="mt-2 text-sm text-[hsl(var(--muted))]">{cover.alt}</figcaption>
            </figure>
          ) : null}
        </header>

        {hackathon.stats ? (
          <dl className="grid grid-cols-2 gap-x-4 border-b border-[hsl(var(--stroke))] py-4 sm:grid-cols-4">
            {hackathon.stats.map((stat) => (
              <div
                key={stat.label}
                className="py-2"
              >
                <dt className="text-sm text-[hsl(var(--muted))]">{stat.label}</dt>
                <dd className="mt-1 font-medium tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12">
          <div className="space-y-10 md:col-span-8">
            {hackathon.sections.map((section) => (
              <section key={section.label}>
                <h2 className="text-xl font-medium leading-tight">
                  {section.label}
                </h2>
                <p className="mt-2 text-pretty font-medium">{section.heading}</p>
                <div className="mt-3 max-w-[65ch] space-y-3">
                  {section.body.map((para) => (
                    <p
                      key={para}
                      className="text-pretty text-base leading-relaxed text-[hsl(var(--body))]"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside aria-label="Project details" className="space-y-6 border-t border-[hsl(var(--stroke))] pt-6 md:col-span-4 md:self-start md:border-s md:border-t-0 md:ps-6 md:pt-0">
            {hackathon.role ? (
              <div>
                <h2 className="font-medium">My role</h2>
                <p className="mt-2 text-sm text-[hsl(var(--body))]">{hackathon.role}</p>
              </div>
            ) : null}
            {hackathon.team ? (
              <div>
                <h2 className="font-medium">Team</h2>
                <ul className="mt-2 space-y-1.5 text-sm text-[hsl(var(--body))]">
                  {hackathon.team.map((member) => (
                    <li key={member}>{member}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {hackathon.stack ? (
              <div>
                <h2 className="font-medium">Stack</h2>
                <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--body))]">{hackathon.stack.join(", ")}</p>
              </div>
            ) : null}
            {hackathon.links ? (
              <div>
                <h2 className="font-medium">Links</h2>
                <ul className="mt-2 space-y-2">
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
                  className={photo.fit === "contain" ? "object-contain p-3" : "object-cover"}
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
            <span className="block text-sm text-[hsl(var(--muted))]">
              Next
            </span>
            <span className="mt-2 inline-flex items-center gap-2 text-2xl font-medium tracking-tight sm:text-3xl">
              {next.project}
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
