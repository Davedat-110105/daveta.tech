import { community, creds, links, wins } from "@/data/content";
import { Reveal } from "@/components/Reveal";

export function Record() {
  return (
    <section id="record" className="mx-auto max-w-[1240px] px-8 pt-[130px]">
      <Reveal className="max-w-[760px]">
        <h2 className="m-0 font-display text-[clamp(34px,4.6vw,58px)] font-semibold leading-[1.04] tracking-[-0.03em]">
          Built under a clock
        </h2>
        <p className="mt-4 max-w-[520px] text-[16.5px] leading-[1.6] text-mute-2 text-pretty">
          Four competitions, four stacks that had to be standing by the demo.
        </p>
      </Reveal>

      {/* The result is the content, so it is set at display scale and the
          supporting detail hangs off it. A hairline grid rather than a row
          list, so this section does not repeat the shape of the work index. */}
      <Reveal className="mt-14" delay={60}>
        <ol className="m-0 grid list-none grid-cols-1 gap-px border-t border-line p-0 md:grid-cols-2">
          {wins.map((win) => (
            <li
              key={win.name + win.project}
              className="grid content-start gap-3 border-b border-line-soft py-9 md:odd:border-r md:odd:border-r-line-soft md:odd:pr-10 md:even:pl-10"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[clamp(30px,3.4vw,44px)] font-semibold leading-none tracking-[-0.03em] text-accent">
                  {win.result.replace(" PLACE", "")}
                </span>
                <span className="font-mono text-[11px] tracking-[0.12em] text-faint">
                  PLACE · {win.year}
                </span>
              </div>
              <div className="grid gap-1">
                <span className="font-display text-[19px] font-medium leading-[1.25] tracking-[-0.015em] text-fg">
                  {win.name}
                </span>
                <span className="text-[15px] leading-[1.5] text-mute">
                  {win.project}
                </span>
              </div>
              <p className="m-0 max-w-[46ch] text-[14.5px] leading-[1.55] text-mute-3 text-pretty">
                {win.note}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Community and credentials are supporting evidence, so they sit in a
          quieter band with no rules between individual entries. */}
      <Reveal className="mt-24 grid gap-16 md:grid-cols-[1.15fr_0.85fr]" delay={60}>
        <div className="grid gap-7">
          <h3 className="m-0 font-display text-[26px] font-semibold tracking-[-0.02em] text-fg">
            Community
          </h3>
          {community.map((c) => (
            <div key={c.name} className="grid gap-1.5">
              <span className="flex flex-wrap items-baseline gap-x-3 font-display text-[18px] font-medium tracking-[-0.01em] text-fg">
                {c.name}
                <span className="font-mono text-[11px] font-normal tracking-[0.1em] text-accent">
                  {c.org}
                </span>
              </span>
              <p className="m-0 max-w-[52ch] text-[15px] leading-[1.55] text-mute-2 text-pretty">
                {c.note}
              </p>
            </div>
          ))}
        </div>

        <div className="grid content-start gap-5 border-t border-line pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <h3 className="m-0 font-display text-[26px] font-semibold tracking-[-0.02em] text-fg">
            Certified
          </h3>
          <ul className="m-0 grid list-none gap-4 p-0">
            {creds.map((cr) => (
              <li key={cr.name} className="grid gap-1">
                <span className="text-[15.5px] leading-[1.4] text-fg-dim">
                  {cr.name}
                </span>
                <span className="font-mono text-[11px] tracking-[0.12em] text-mute-3">
                  {cr.org}
                </span>
              </li>
            ))}
          </ul>
          <a
            href={links.certifications}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-2 font-mono text-[12px] tracking-[0.06em] text-accent transition-opacity hover:opacity-70"
          >
            ALL 12 ON LINKEDIN ↗
          </a>
        </div>
      </Reveal>
    </section>
  );
}
