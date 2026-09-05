"use client";

import * as React from "react";
import { motion } from "motion/react";

/**
 * The greeting, written rather than counted.
 *
 * The template shipped a 000–100 progress counter with a cycling word above it.
 * This is the unboxing greeting instead: a cursive "hello" that draws itself
 * left to right on black, holds, and dissolves into the page. The stroke is a
 * clip-path wipe across a script face — the same read as a pen moving, without
 * shipping a traced outline of anyone else's lettering.
 */
const WRITE_MS = 1500;
const HOLD_MS = 550;
const FADE_MS = 650;

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = React.useState(false);

  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    const write = reduce ? 0 : WRITE_MS;
    const toExit = setTimeout(() => setExiting(true), write + HOLD_MS);
    const done = setTimeout(
      () => onCompleteRef.current(),
      write + HOLD_MS + FADE_MS,
    );
    return () => {
      clearTimeout(toExit);
      clearTimeout(done);
    };
  }, [reduce]);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[hsl(var(--bg))]"
    >
      <motion.span
        initial={{ clipPath: reduce ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0 0 0)" }}
        transition={{
          duration: reduce ? 0 : WRITE_MS / 1000,
          // Quick off the mark, easing out as the last letters land — the
          // cadence of a hand finishing a word, not a constant-rate wipe.
          ease: [0.32, 0.08, 0.24, 1],
        }}
        className="font-script select-none text-7xl leading-none text-[hsl(var(--text))] sm:text-8xl md:text-9xl"
      >
        hello
      </motion.span>
    </motion.div>
  );
}
