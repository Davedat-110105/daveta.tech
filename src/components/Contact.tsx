import { links } from "@/data/content";
import { Reveal } from "@/components/Reveal";

export function Contact() {
  return (
    <section id="contact" className="relative mt-[150px] overflow-hidden bg-panel-deep">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(58%_62%_at_50%_0%,rgba(255,122,69,0.09),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1240px] px-8 pb-12 pt-[130px]">
        <Reveal className="grid justify-items-center gap-9 text-center">
          <h2 className="m-0 max-w-[16ch] font-display text-[clamp(38px,6.4vw,92px)] font-semibold leading-[0.98] tracking-[-0.035em] text-balance">
            Open to internships, freelance, and{" "}
            <span className="text-accent">hard</span> infrastructure problems.
          </h2>

          <a
            href={`mailto:${links.email}`}
            className="group inline-block py-3 font-mono text-[clamp(13px,1.5vw,17px)] tracking-[0.06em] text-fg"
          >
            <span className="border-b border-accent/50 pb-2 transition-colors group-hover:border-accent group-hover:text-accent">
              {links.email}
            </span>
          </a>
        </Reveal>

        <Reveal
          className="mt-[110px] flex flex-wrap items-baseline justify-between gap-x-11 gap-y-5 border-t border-line pt-8 font-mono text-[11px] tracking-[0.09em] text-mute-3"
          delay={60}
        >
          <span>TA TAN DAT</span>
          <div className="flex flex-wrap gap-x-9 gap-y-4">
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-mute transition-colors hover:text-accent"
            >
              LINKEDIN
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-mute transition-colors hover:text-accent"
            >
              GITHUB
            </a>
            <a
              href="#top"
              className="py-2 text-mute transition-colors hover:text-accent"
            >
              TOP ↑
            </a>
          </div>
          <span>TORONTO · © 2026</span>
        </Reveal>
      </div>
    </section>
  );
}
