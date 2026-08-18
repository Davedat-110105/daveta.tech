---
name: Dave Ta
description: Personal portfolio composed like a piano score.
colors:
  ivory: "#F1EDE3"
  paper: "#E7E1D4"
  ink: "#12141A"
  muted: "#3A3D46"
  cobalt: "#1C3A6E"
  staff: "#1C3A6E24"
  gold: "#A4844A"
  gold-deep: "#8A6E3A"
typography:
  display:
    fontFamily: "Bodoni Moda, Palatino, Times New Roman, serif"
    fontSize: "clamp(3.25rem, 8vw, 6rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Source Sans 3, Segoe UI, Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0.01em"
  mono:
    fontFamily: "Azeret Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  none: "0px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
  section: "clamp(4.5rem, 10vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.ivory}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 0"
---

# Design

## Overview

Concert-score language for Dave Ta's public work. The page is ivory paper with cobalt staff lines; content sits on the staff like notes. Gold is the single played accent. Piano is a composing metaphor (rhythm, practice, timing), never a claim of professional performance and never a literal keyboard background.

**THESIS:** Refuse the developer-template (centered name, three project cards, neon terminal). Own a five-line staff grid and a Prelude / Movements / Practice / Coda reading order.

**OWN-WORLD:** Ivory field, ink type, cobalt structure, muted gold attack. Bodoni Moda display, Source Sans 3 body, Azeret Mono for measures and annotations. Radius 0. Hairline rules instead of cards.

**STORY:** A hiring manager or collaborator should leave knowing Dave builds systems across AI products, education technology, and embedded infrastructure, and how to write.

**FIRST VIEWPORT:** Name on the staff, gold notehead, one sentence, one CTA to selected work, annotation plate at right (place, current role, languages).

**FORM:** Brief-pinned score composition. CSS motion only. No motion library.

## Colors

Light is the authored mode (recital program under house light). Dark follows `prefers-color-scheme` as night practice: near-ink field, ivory type, the same gold.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| ivory / surface | `#F1EDE3` | `#12141A` | Page field |
| ink | `#12141A` | `#F1EDE3` | Primary type |
| muted | `#3A3D46` | `#C4C0B6` | Secondary type |
| cobalt | `#1C3A6E` | `#8FA4C8` | Structure, maps, nav hover |
| gold | `#A4844A` | `#C4A56A` | Played note, focus, one accent |
| staff | cobalt at ~14% | ivory at ~16% | Five-line grid |

Gold is never body text on ivory (contrast). Use it for the notehead, focus ring, and a single underline or rule.

## Typography

- Display: Bodoni Moda (concert program). Max 6rem. Tracking floor -0.03em. Italic only for a short phrase, with 1.1 line-height if descenders appear.
- Body: Source Sans 3. Measure 65ch. Weight 400/600.
- Mono: Azeret Mono for measure labels, TODOs, language codes, diagram captions. Not as a costume for all technical copy.

One kicker in the hero. Later sections use the movement name as the headline.

## Layout

Desktop: 12-column inner grid inside `max-width: 1400px`, plus a 28px measure rail on the left (short/long bar rhythm from piano grouping, not a pictorial keyboard). Hero uses `min-height: 100dvh`.

Mobile (`< 768px`): single column, rail hidden, staff remains as three to five tighter lines, annotation plate stacks under the name. Nav collapses to a disclosure.

Section families must not repeat: split staff hero, featured diagram spread, two evidence studies, compact index list, practice clusters, large-type coda.

## Elevation & Depth

Flat paper. Hierarchy from staff rules, ink weight, and whitespace. No drop shadows, no glass, no gradient blobs. Optional 4% paper grain on a fixed, non-interactive overlay.

## Shapes

Radius 0 everywhere (buttons, plates, focus offset). Focus: 2px gold outline, 3px offset. Hairlines at 1px.

## Components

- **Primary button:** ink fill, ivory label, press `translateY(1px)`. Hover to cobalt.
- **Evidence plate:** paper tint, staff hairlines, mono caption. Not a card grid of icons.
- **System map:** SVG nodes and annotated hops. Synthetic diagrams; never fake product screenshots.
- **TODO markers:** mono, gold rule, only where Dave must supply a photo, link, screenshot, date, or permission.

## Do's and Don'ts

- Do place type on the staff. Do sequence entrance like an attack, then rest.
- Do keep stealth and homelab wording source-grounded.
- Don't ship a giant keyboard, fake terminal, neon, glass, scroll-jacking, or WebGL.
- Don't invent metrics, logos, volunteer roles, or credentials.
- Don't invert a mid-page section into a different theme except the system dark-mode swap.
