"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/data/content";
import { Counter } from "@/components/Counter";
import { Reveal } from "@/components/Reveal";
import { SlotImage } from "@/components/SlotImage";

export function Work() {
  const [open, setOpen] = useState<number | null>(null);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<number | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    const idx = returnTo.current;
    returnTo.current = null;
    if (idx != null) rowRefs.current[idx]?.focus();
  }, []);

  const select = (i: number) => {
    returnTo.current = i;
    setOpen(i);
  };

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const p = open == null ? null : projects[open];
  const nextIdx = open == null ? 0 : (open + 1) % projects.length;
  const nextLabel = `NEXT: ${projects[nextIdx].name.toUpperCase()} →`;

  return (
    <>
      <section id="work" className="mx-auto max-w-[1240px] px-8 pb-6 pt-[120px]">
        <Reveal className="max-w-[760px]">
          <h2 className="m-0 font-display text-[clamp(34px,4.6vw,58px)] font-semibold leading-[1.04] tracking-[-0.03em]">
            Selected work
          </h2>
          <p className="mt-4 font-mono text-[12px] tracking-[0.1em] text-faint">
            <Counter value={projects.length} /> PROJECTS · 2025-2026
          </p>
        </Reveal>

        {/* The first project is set as a featured spread so the section opens
            with an image and a scale change instead of another list row. */}
        <Reveal className="mt-16" delay={80}>
          <button
            type="button"
            ref={(el) => {
              rowRefs.current[0] = el;
            }}
            onClick={() => select(0)}
            aria-haspopup="dialog"
            className="group block w-full border-t border-line pt-10 text-left"
          >
            <div className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="grid gap-5">
                <div className="flex items-baseline gap-4 font-mono text-[12px] tracking-[0.1em]">
                  <span className="text-accent">01</span>
                  <span className="text-mute-3">{projects[0].role}</span>
                  <span className="ml-auto text-mute-3">{projects[0].year}</span>
                </div>
                <h3 className="m-0 font-display text-[clamp(38px,4.8vw,64px)] font-semibold leading-[0.98] tracking-[-0.03em]">
                  {projects[0].name}
                </h3>
                <p className="m-0 font-display text-[clamp(19px,2vw,26px)] font-medium leading-[1.2] tracking-[-0.015em] text-mute">
                  {projects[0].descriptor}
                </p>
                <p className="m-0 max-w-[520px] text-[16.5px] leading-[1.6] text-mute-2 text-pretty">
                  {projects[0].summary}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {projects[0].tags.map((t) => (
                    <span
                      key={t}
                      className="whitespace-nowrap border border-line-strong px-2.5 py-1 font-mono text-[11px] tracking-[0.05em] text-mute-3"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mt-3 inline-flex items-center gap-3 font-mono text-[12px] tracking-[0.1em] text-accent">
                  READ THE CASE STUDY
                  <span className="inline-block transition-transform duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-x-1.5">
                    →
                  </span>
                </span>
              </div>

              <div className="relative aspect-[5/4] overflow-hidden border border-line bg-panel transition-[border-color,transform] duration-[500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-1 group-hover:border-accent/50">
                <SlotImage
                  src={projects[0].cover}
                  label={`COVER · ${projects[0].name}`}
                  alt={`${projects[0].name} ${projects[0].descriptor}, homepage`}
                  sizes="(min-width: 1024px) 480px, 100vw"
                />
              </div>
            </div>
          </button>
        </Reveal>

        {/* Everything after the featured entry reads as an index: the name at
            display scale, the descriptor under it, no per-row tag clutter. */}
        <div className="mt-20">
          {projects.slice(1).map((proj, idx) => {
            const i = idx + 1;
            return (
              <Reveal key={proj.title} delay={idx * 60}>
                <button
                  type="button"
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  onClick={() => select(i)}
                  aria-haspopup="dialog"
                  className="group grid w-full grid-cols-[36px_1fr] items-baseline gap-x-6 gap-y-2 border-t border-line-soft py-7 text-left transition-[padding-left,background] duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:bg-white/[0.025] hover:pl-4 sm:grid-cols-[36px_1fr_auto]"
                >
                  <span className="font-mono text-[12px] leading-[1.6] text-faint transition-colors duration-[350ms] group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="grid gap-1.5">
                    <span className="font-display text-[clamp(24px,2.7vw,34px)] font-semibold leading-[1.08] tracking-[-0.025em] text-fg">
                      {proj.name}
                    </span>
                    <span className="text-[15.5px] leading-[1.5] text-mute-2">
                      {proj.descriptor}
                    </span>
                  </span>
                  <span className="col-start-2 flex items-center gap-3 whitespace-nowrap font-mono text-[11px] tracking-[0.1em] text-mute-3 sm:col-start-3">
                    {proj.year}
                    <span className="inline-block text-accent transition-transform duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-x-1.5">
                      →
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {p ? (
        <div
          ref={backdropRef}
          onClick={close}
          className="fixed inset-0 z-[70] overflow-y-auto bg-[rgba(4,6,10,0.72)] backdrop-blur-lg [animation:fadeIn_0.3s_ease_both]"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={p.title}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto min-h-full max-w-[940px] border-x border-line-soft bg-panel [animation:panelIn_0.45s_cubic-bezier(0.2,0.8,0.2,1)_both]"
          >
            <div className="sticky top-0 z-[2] flex items-center justify-between gap-5 border-b border-line-soft bg-[linear-gradient(#131315f5,#131315d0)] px-6 py-[18px] font-mono text-[12px] tracking-[0.08em] backdrop-blur-[10px] sm:px-10">
              <span className="text-mute-4">
                CASE STUDY · {String(open! + 1).padStart(2, "0")}
              </span>
              <button
                type="button"
                ref={closeRef}
                onClick={close}
                className="flex-none whitespace-nowrap border border-line-strong px-3.5 py-1.5 text-mute transition-colors hover:border-accent/60 hover:text-fg"
              >
                CLOSE ESC
              </button>
            </div>

            {p.cover ? (
              <div className="relative h-60 overflow-hidden border-b border-line-soft">
                <SlotImage
                  src={p.cover}
                  label={`COVER · ${p.title}`}
                  alt={`${p.name} homepage`}
                  sizes="(min-width: 940px) 940px, 100vw"
                />
              </div>
            ) : null}

            <div className="grid gap-11 px-6 pb-[90px] pt-[52px] sm:px-10">
              <div className="grid gap-5">
                <h2 className="m-0 font-display text-[clamp(34px,5.2vw,60px)] font-normal leading-[1.02]">
                  {p.title}
                </h2>
                <p className="m-0 max-w-[680px] text-[19px] leading-[1.6] text-mute text-pretty">
                  {p.summary}
                </p>
                <dl className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-5 border-y border-line-soft py-[22px] font-mono text-[12px]">
                  {[
                    ["ROLE", p.role],
                    ["TIMELINE", p.year],
                    ["STATUS", p.status],
                  ].map(([k, v]) => (
                    <div key={k} className="grid gap-[7px]">
                      <dt className="tracking-[0.1em] text-faint">{k}</dt>
                      <dd className="m-0 text-fg-dim">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {p.sections.map((s) => (
                <div
                  key={s.label}
                  className="grid items-start gap-x-7 gap-y-3 sm:grid-cols-[124px_1fr]"
                >
                  <span className="font-mono text-[11px] tracking-[0.12em] text-accent sm:pt-2">
                    {s.label}
                  </span>
                  <div className="grid gap-4">
                    <h3 className="m-0 text-[22px] font-normal leading-[1.35] tracking-[-0.015em] text-pretty">
                      {s.heading}
                    </h3>
                    {s.body.map((para) => (
                      <p
                        key={para}
                        className="m-0 text-[16.5px] leading-[1.68] text-mute-2 text-pretty"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              <div className="grid items-start gap-x-7 gap-y-3 border-t border-line-soft pt-3.5 sm:grid-cols-[124px_1fr]">
                <span className="font-mono text-[11px] tracking-[0.12em] text-accent sm:pt-2">
                  STACK
                </span>
                <div className="flex flex-wrap gap-2">
                  {p.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-[3px] border border-white/10 bg-white/[0.04] px-[11px] py-1.5 font-mono text-[12px] text-fg-dim"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid items-start gap-x-7 gap-y-3 sm:grid-cols-[124px_1fr]">
                <span className="font-mono text-[11px] tracking-[0.12em] text-accent sm:pt-2">
                  LINKS
                </span>
                <div className="flex flex-wrap gap-x-7 gap-y-2.5 font-mono text-[13px]">
                  {p.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-fg"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-5 border-t border-line-soft pt-7 font-mono text-[12px]">
                <button
                  type="button"
                  onClick={close}
                  className="text-mute transition-colors hover:text-fg"
                >
                  ← ALL WORK
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(nextIdx);
                    returnTo.current = nextIdx;
                    // The case study scrolls inside the backdrop, not the page.
                    backdropRef.current?.scrollTo(0, 0);
                  }}
                  className="text-accent transition-opacity hover:opacity-70"
                >
                  {nextLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
