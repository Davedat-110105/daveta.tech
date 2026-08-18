"use client";

import { useRef } from "react";
import { deploys } from "@/data/content";
import { DecoderText } from "@/components/DecoderText";
import { Reveal } from "@/components/Reveal";
import { SlotImage } from "@/components/SlotImage";

export function DeployRail() {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollBy = (left: number) =>
    railRef.current?.scrollBy({ left, behavior: "smooth" });

  return (
    <section id="clients" className="mx-auto max-w-[1240px] px-8 pb-5 pt-[130px]">
      <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <div className="max-w-[620px]">
          <h2 className="m-0 font-display text-[clamp(34px,4.6vw,58px)] font-semibold leading-[1.04] tracking-[-0.03em]">
            <DecoderText text="Live on the internet" />
          </h2>
          <p className="mt-4 max-w-[46ch] text-[16.5px] leading-[1.6] text-mute-2 text-pretty">
            Some of it runs on Vercel, some on hardware I own.
          </p>
        </div>
        <div className="deploy-fan-arrows flex gap-2.5">
          <button
            type="button"
            onClick={() => scrollBy(-330)}
            aria-label="Scroll deploys left"
            className="grid h-11 w-11 place-items-center border border-line-strong text-[16px] text-mute transition-colors hover:border-accent hover:text-accent"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollBy(330)}
            aria-label="Scroll deploys right"
            className="grid h-11 w-11 place-items-center border border-line-strong text-[16px] text-mute transition-colors hover:border-accent hover:text-accent"
          >
            →
          </button>
        </div>
      </Reveal>

      {/* The rail scrolls, so it has to be reachable and scrollable by keyboard
          (WCAG 2.1.1) — not just by the two arrow buttons.

          The reveal wraps the whole rail rather than each card: cards past the
          right edge are outside the viewport horizontally, so a per-card
          observer would leave them permanently hidden. */}
      <Reveal>
        <div
          ref={railRef}
          tabIndex={0}
          role="region"
          aria-label="Live deployments"
          className="rail deploy-fan flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-0.5 pb-2.5 pt-6"
        >
          {deploys.map((d, i) => (
            <div
              key={d.host}
              // `--off` is the card's signed distance from the middle of the
              // hand; the fan derives its rotation and arc dip from it.
              style={
                {
                  "--i": String(i),
                  "--off": String(i - (deploys.length - 1) / 2),
                } as React.CSSProperties
              }
              className="deploy-card grid w-80 flex-none snap-start content-start border border-line bg-panel text-fg hover:border-accent/50 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)]"
            >
              <div className="relative h-[170px] overflow-hidden border-b border-line-soft">
                <SlotImage
                  src={d.img}
                  label={`SCREENSHOT · ${d.host}`}
                  alt={`${d.host} homepage`}
                  sizes="320px"
                />
              </div>
              <div className="grid gap-2.5 px-[22px] pb-[22px] pt-5">
                <span className="font-mono text-[11px] tracking-[0.08em] text-accent">
                  {d.kind}
                </span>
                {/* Hostnames are one long unbroken token; without this the
                    longest one spills past the card edge. */}
                <span className="text-[18px] [overflow-wrap:anywhere]">
                  {d.host}
                </span>
                <span className="text-[14px] leading-[1.55] text-mute-2">
                  {d.note}
                </span>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-block py-3 font-mono text-[11px] tracking-[0.08em] text-accent-soft transition-colors hover:text-fg"
                >
                  VISIT ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
