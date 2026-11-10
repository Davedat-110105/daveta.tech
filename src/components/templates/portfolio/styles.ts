// Self-contained design system for the template. Scoped to the root
// `[data-slot="portfolio"]` so the palette, fonts and keyframes never leak
// into the consuming app. Tailwind reads the `--bg`/`--surface`/… channels
// through `hsl(var(--token))` arbitrary values; the rest is plain CSS.
export const PORTFOLIO_STYLES = `
[data-slot="portfolio"] {
  --bg: 0 0% 4%;
  --surface: 0 0% 8%;
  --text: 0 0% 96%;
  /* Three text roles. --text for headings and values, --body for running
     copy (12.6:1), --muted for metadata only: dates, labels, captions (7:1). */
  --body: 0 0% 80%;
  --muted: 0 0% 60%;
  --stroke: 0 0% 17%;
  --accent: 0 0% 96%;
  /* #89AACC, the light end of the accent gradient. The one colour that shows
     at rest, reserved for first-place marks. 8:1 on --bg. */
  --signal: 210 40% 67%;
  font-family: var(--font-portfolio-sans), ui-sans-serif, system-ui, sans-serif;
}
/* The scoped --accent is bare HSL channels, which made the global
   outline: var(--accent) invalid and left keyboard focus with no ring. */
[data-slot="portfolio"] :focus-visible {
  outline: 2px solid hsl(var(--text));
  outline-offset: 4px;
}
/* A fragment can focus an entire landmark. Reserve rings for its controls. */
[data-slot="portfolio"] :is(main, section, footer)[tabindex="-1"]:focus-visible {
  outline: none;
}
[data-slot="portfolio"] .blur-in:focus-within {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
}
[data-slot="portfolio"] .font-display {
  font-family: var(--font-portfolio-display), ui-serif, Georgia, serif;
}
[data-slot="portfolio"] .font-script {
  font-family: var(--font-script), ui-rounded, cursive;
}
[data-slot="portfolio"] .font-data {
  font-family: var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
  font-feature-settings: "tnum" 1;
}
[data-slot="portfolio"] .accent-gradient {
  background-image: linear-gradient(90deg, #89AACC 0%, #4E85BF 100%);
}
[data-slot="portfolio"] .accent-gradient-animated {
  background-image: linear-gradient(90deg, #89AACC 0%, #4E85BF 50%, #89AACC 100%);
  background-size: 200% 100%;
  animation: pf-gradient-shift 6s ease infinite;
}
[data-slot="portfolio"] .credential-marquee {
  overflow-x: clip;
}
[data-slot="portfolio"] .credential-track {
  animation: pf-credentials 64s linear infinite;
}
@keyframes pf-credentials {
  to { transform: translateX(-50%); }
}
@media (hover: hover) {
  [data-slot="portfolio"] .credential-marquee:hover .credential-track {
    animation-play-state: paused;
  }
}
[data-slot="portfolio"] .credential-marquee:has(:focus-visible) {
  overflow-x: auto;
}
[data-slot="portfolio"] .credential-marquee:has(:focus-visible) .credential-track {
  animation: none;
}
[data-slot="portfolio"] .credential-marquee:has(:focus-visible) .credential-copy {
  display: none;
}
[data-slot="portfolio"] .animate-role-fade-in {
  animation: pf-role-fade-in 0.4s ease-out both;
}
@keyframes pf-role-fade-in {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
/* A played note floats up off the keyboard and fades. */
[data-slot="portfolio"] .pf-note-rise {
  animation: pf-note-rise 1.2s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
}
@keyframes pf-note-rise {
  0% { opacity: 0; transform: translate(-50%, 6px) scale(0.8); }
  15% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -64px) scale(1.25) rotate(-12deg); }
}
@keyframes pf-gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  [data-slot="portfolio"] .credential-marquee {
    overflow-x: auto;
  }
  [data-slot="portfolio"] .credential-copy {
    display: none;
  }
  [data-slot="portfolio"] .pf-note-rise {
    display: none;
  }
  [data-slot="portfolio"] .credential-track,
  [data-slot="portfolio"] .accent-gradient-animated {
    animation: none;
  }
}
`;
