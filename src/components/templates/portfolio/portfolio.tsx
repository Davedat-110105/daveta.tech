"use client";

import * as React from "react";
import { MotionConfig } from "motion/react";

import { cn } from "@/lib/utils";

import { Contact } from "./contact";
import { Details } from "./details";
import { Experience } from "./experience";
import { Explorations } from "./explorations";
import { dancingScript, inter, instrumentSerif } from "./fonts";
import { Hero } from "./hero";
import { Journal } from "./journal";
import { LoadingScreen } from "./loading-screen";
import { SelectedWorks } from "./selected-works";
import { PORTFOLIO_STYLES } from "./styles";

export default function Portfolio() {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div
      data-slot="portfolio"
      id="main-content"
      tabIndex={-1}
      className={cn(
        inter.variable,
        instrumentSerif.variable,
        dancingScript.variable,
        "min-h-svh bg-[hsl(var(--bg))] text-[hsl(var(--text))] antialiased",
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: PORTFOLIO_STYLES }} />

      <MotionConfig reducedMotion="user">
        {isLoading ? (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        ) : null}

        <Hero start={!isLoading} />
        <SelectedWorks />
        <Journal />
        <Experience />
        <Explorations />
        <Details />
        <Contact />
      </MotionConfig>
    </div>
  );
}
