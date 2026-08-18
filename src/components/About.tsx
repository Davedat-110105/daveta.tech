import Image from "next/image";
import { Reveal } from "@/components/Reveal";

const facts = [
  ["NOW", "Lead developer, Astra Labs"],
  ["STUDY", "Seneca Polytechnic, Toronto"],
  ["BASED", "Toronto, Canada"],
  ["ALSO", "Music and cooking"],
];

export function About() {
  return (
    <section id="about" className="pt-[140px]">
      <Reveal className="mx-auto max-w-[1240px] px-8">
        <h2 className="m-0 max-w-[900px] font-display text-[clamp(28px,3.6vw,46px)] font-semibold leading-[1.14] tracking-[-0.03em] text-pretty">
          I work on the unglamorous half of the stack: ingest endpoints that
          fail closed, retrieval that cites its sources, deploys that come back
          up after a power cut.
        </h2>
      </Reveal>

      {/* Full-bleed plate. The one daylight image on a dark page, so it carries
          the section on its own rather than sitting beside a text column. */}
      <Reveal className="mt-16" delay={60}>
        <figure className="relative m-0 h-[46vw] max-h-[620px] min-h-[280px] w-full overflow-hidden">
          <Image
            src="/assets/campus-session.jpeg"
            alt="A packed session at Seneca Polytechnic, students watching a talk against floor-to-ceiling windows overlooking the Toronto lakefront."
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 [background:linear-gradient(to_bottom,rgba(11,11,12,0.55),transparent_28%,transparent_62%,rgba(11,11,12,0.85))]" />
        </figure>
      </Reveal>

      <div className="mx-auto max-w-[1240px] px-8">
        <Reveal className="mt-14 grid gap-14 md:grid-cols-[1.1fr_0.9fr]" delay={60}>
          <p className="m-0 max-w-[62ch] text-[17px] leading-[1.7] text-mute-2 text-pretty">
            At Astra Labs, Seneca Polytechnic&apos;s student rocketry club
            building the Pioneer vehicle for Launch Canada 2026, I own the
            software: public site, staff dashboard, telemetry ingest path, and
            the container stack it runs on. Alongside it I ship client sites,
            host several of them on my own hardware, and use hackathons as an
            excuse to put a stack into production faster than is reasonable.
          </p>

          <dl className="m-0 grid content-start grid-cols-2 gap-x-8 gap-y-7">
            {facts.map(([k, v]) => (
              <div key={k} className="grid gap-2 border-t border-line pt-4">
                <dt className="font-mono text-[11px] tracking-[0.14em] text-accent">
                  {k}
                </dt>
                <dd className="m-0 text-[15.5px] leading-[1.45] text-fg-dim">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
