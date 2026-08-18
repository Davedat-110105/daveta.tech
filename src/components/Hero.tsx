import { HeroField } from "@/components/HeroField";
import { PointerDrift } from "@/components/PointerDrift";
import { links } from "@/data/content";

export function Hero() {
  return (
    <header
      id="top"
      className="relative mx-auto grid min-h-[100dvh] max-w-[1240px] content-center px-8 pb-24 pt-24"
    >
      {/* Full-bleed atmosphere, generated entirely on the GPU; only the type
          sits inside the 1240px column. `w-screen` breaks the layer out of that
          column, otherwise the background stops at the column edge and reads
          as a clipping bug on anything wider than ~1400px. */}
      <HeroField className="pointer-events-none absolute left-1/2 top-0 block h-full w-screen max-w-none -translate-x-1/2" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-screen -translate-x-1/2 [background:radial-gradient(130%_90%_at_50%_0%,rgba(11,11,12,0.05)_25%,#0b0b0c_88%)]" />

      <div className="hero-exit relative">
        <PointerDrift className="grid max-w-[1000px] gap-7">
          {/* "I'm Dave." leads in at a smaller scale so the claim itself stays a
            two-line headline rather than a four-line paragraph. */}
          <h1 className="m-0 font-display font-semibold leading-[1.02] tracking-[-0.025em]">
            <span className="block overflow-hidden pb-1">
              <span className="inline-block text-[clamp(20px,2.4vw,34px)] font-medium tracking-[-0.01em] text-mute [animation:lineUp_0.9s_0.08s_cubic-bezier(0.2,0.8,0.2,1)_both]">
                I&apos;m Dave.
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="inline-block text-[clamp(40px,6vw,86px)] [animation:lineUp_0.9s_0.2s_cubic-bezier(0.2,0.8,0.2,1)_both]">
                I build and{" "}
                <em className="trace-word not-italic text-accent">run</em>
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="inline-block text-[clamp(40px,6vw,86px)] [animation:lineUp_0.9s_0.32s_cubic-bezier(0.2,0.8,0.2,1)_both]">
                production systems.
              </span>
            </span>
          </h1>

          <p className="m-0 max-w-[560px] text-[18px] leading-[1.6] text-mute text-pretty [animation:riseIn_0.95s_0.16s_ease_both]">
            Full-stack developer who ships and then keeps things running: web
            products, client sites, APIs, and the infrastructure underneath
            them.
          </p>

          <div className="flex flex-wrap items-baseline gap-x-9 gap-y-3.5 font-mono text-[13px] tracking-[0.04em] [animation:riseIn_1.05s_0.24s_ease_both]">
            {/* The padding is the hit area; the underline stays on the text. */}
            <a href="#work" className="group inline-block py-3 text-fg">
              <span className="border-b border-accent/60 pb-[3px] transition-colors group-hover:border-accent group-hover:text-accent">
                Selected work ↓
              </span>
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-3 text-mute-3 transition-colors hover:text-fg"
            >
              GitHub ↗
            </a>
            <a
              href={`mailto:${links.email}`}
              className="inline-block py-3 text-mute-3 transition-colors hover:text-fg"
            >
              Email ↗
            </a>
          </div>
        </PointerDrift>
      </div>
    </header>
  );
}
