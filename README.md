# daveta.tech

Personal site for Dave Ta (Ta Tan Dat), a full-stack developer in Toronto.

**Live:** https://daveta.tech

## What it is

A single-page portfolio: selected work with case studies, a rail of live
deployments, competition record, and contact. Everything on the page is
source-grounded — no invented metrics, clients, or credentials.

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties for tokens |
| Type | Archivo (display), Geist (body), IBM Plex Mono (data) |
| Hero | Custom WebGL fragment shader — nebula, parallax star layers, signal traces |
| Hosting | Vercel |

## Notable bits

- **`src/components/HeroField.tsx`** — the hero background is one fullscreen
  quad running a single fragment shader. No textures, no geometry, no
  dependencies. DPR capped at 1.5, render loop stops when scrolled out of
  view, draws one static frame under `prefers-reduced-motion`.
- **`src/components/DeployRail.tsx`** — on a wide pointer-driven screen the
  deployment cards close into a fanned hand of cards; below that it stays a
  scrollable rail. All CSS, including the neighbour-spread on hover.
- **`src/components/SlotImage.tsx`** — image slots fall back to a drafting
  plate when an asset is missing, so a gap reads as reserved rather than broken.
- **`src/lib/site.ts`** — Person / WebSite / ProfilePage JSON-LD, rendered
  server-side, driven off the same base URL as the sitemap and canonical tags.

## Accessibility

WCAG AA contrast (ratios documented per token in `globals.css`), visible
keyboard focus, skip link, semantic landmarks, and `prefers-reduced-motion`
respected throughout — including an explicit off switch for the scroll-driven
hero animation, which ignores `animation-duration`.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build
npm run lint    # eslint
```

## Environment

`NEXT_PUBLIC_SITE_URL` overrides the canonical base URL (used by the sitemap,
robots, canonical tag, and Open Graph). Defaults to `https://daveta.tech`.
