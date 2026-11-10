"use client";

import * as React from "react";
import { MotionConfig } from "motion/react";

import { cn } from "@/lib/utils";

import { Contact } from "./contact";
import { Details } from "./details";
import { Experience } from "./experience";
import { Explorations } from "./explorations";
import { dancingScript, newsreader, sourceSans } from "./fonts";
import { Hero, Navbar } from "./hero";
import { LoadingScreen } from "./loading-screen";
import { PersonalNotes } from "./personal-notes";
import { SelectedWorks } from "./selected-works";
import { PORTFOLIO_STYLES } from "./styles";

export default function Portfolio() {
  const [isLoading, setIsLoading] = React.useState(true);

  // Greet once per session. Coming back from a competition page should land
  // on the record, not replay the greeting. Layout effect so a client-side
  // navigation never paints the overlay.
  React.useLayoutEffect(() => {
    const dismiss = () => setIsLoading(false);
    if (window.location.hash || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dismiss();
      return;
    }
    try {
      if (sessionStorage.getItem("pf-greeted")) {
        dismiss();
        return;
      }
      sessionStorage.setItem("pf-greeted", "1");
    } catch {
      // Storage blocked: greet every time, as before.
    }

    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("pointerdown", dismiss, { once: true });
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
  }, []);

  return (
    <div
      data-slot="portfolio"
      className={cn(
        sourceSans.variable,
        newsreader.variable,
        dancingScript.variable,
        "min-h-svh bg-[hsl(var(--bg))] text-[hsl(var(--text))] antialiased",
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: PORTFOLIO_STYLES }} />

      <MotionConfig reducedMotion="user">
        {isLoading ? (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        ) : null}

        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Hero start={!isLoading} />
          <SelectedWorks />
          <section id="about" tabIndex={-1} aria-labelledby="about-heading" className="py-16 md:py-24">
            <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
              {/* The introduction is the section: set at display size, so it
                  reads as a voice rather than a caption under a heading. */}
              <div className="grid gap-6 md:grid-cols-12 md:gap-8">
                <h2 id="about-heading" className="text-lg font-semibold text-[hsl(var(--muted))] md:col-span-3 md:pt-3">
                  About me
                </h2>
                <div className="md:col-span-9">
                  <p className="max-w-[24ch] text-balance font-display text-4xl leading-[1.08] tracking-[-0.01em] sm:text-5xl lg:text-6xl">
                    I&apos;m Dave Ta. I study AI and Computer Engineering
                    Technology at Seneca, in Toronto.
                  </p>
                  <div className="mt-8 grid max-w-3xl gap-6 text-base leading-relaxed text-[hsl(var(--body))] sm:grid-cols-2 md:text-lg">
                    <p>I like taking a project from the first prototype to something people can use.</p>
                    <p>Off the clock, I play piano and cook.</p>
                  </div>
                  <a href="#experience" className="mt-6 inline-flex min-h-11 items-center text-[hsl(var(--text))] underline decoration-[hsl(var(--muted))] underline-offset-4 hover:decoration-current">
                    See my experience
                  </a>
                </div>
              </div>
              <PersonalNotes />
            </div>
          </section>
          <Experience />
          <Explorations />
          <Details />
        </main>
        <Contact />
      </MotionConfig>
    </div>
  );
}
