# USDX Landing Page

Single-page responsive landing page for **USDX** — The Transparent & Regulated USD Stablecoin.

Built with Astro 5, React 19 (islands), TypeScript 5.9, and Tailwind CSS v4. Deployed on Netlify.

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # Static build to dist/
pnpm preview      # Preview production build
```

## Project Structure

```
├── src/
│   ├── layouts/        # Layout.astro (HTML shell, meta, global CSS)
│   ├── pages/          # index.astro (assembles all sections)
│   ├── components/     # 6 Astro static + 2 React islands
│   ├── data/           # Typed content arrays
│   └── styles/         # global.css (Tailwind + theme tokens)
├── public/
│   ├── icon/           # Chain SVG icons (8 files)
│   └── image/          # USDX Logo.svg (favicon + brand)
├── docs/               # Brainstorms, plans, reviews
├── astro.config.mjs    # Astro + React + Tailwind v4
├── netlify.toml        # Build config + security headers
└── tsconfig.json       # Extends astro/tsconfigs/strict
```

## Architecture

**Astro Islands** — only 2 components ship JavaScript:
- `Navbar.tsx` (`client:load`) — scroll shadow, mobile menu
- `Faq.tsx` (`client:visible`) — accordion, deferred hydration

All other sections are **static HTML** with zero JS.

## Sections

| Component | Type | Description |
|-----------|------|-------------|
| `Navbar` | React | Fixed nav, scroll shadow, mobile hamburger |
| `Hero` | Astro | Typewriter heading, SVG 3D coin, orbit animations |
| `WhyUsdx` | Astro | 3 trust cards with distinct icons |
| `Features` | Astro | 6 feature cards, first-word highlighting |
| `HowItWorks` | Astro | 3-step flow on teal gradient background |
| `Ecosystem` | Astro | 8 chain icons + partner marquee |
| `Faq` | React | Accordion with brand accent on expand |
| `Footer` | Astro | Dark footer with logo, links, social icons |

## Data Files

| File | Content |
|------|---------|
| `navigation.ts` | Nav links (Navbar + Footer) |
| `features.ts` | 6 features with typed icon keys |
| `why-usdx.ts` | 3 trust points |
| `faq.ts` | 6 FAQ items |
| `chains.ts` | 8 chains with icon paths + 8 partners |
| `socials.ts` | 5 social links |

## Theme

Configured via `@theme` in `src/styles/global.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#1eaed5` | Buttons, links, accents |
| `primary-dark` | `#1899bc` | Hover states |
| `primary-light` | `#e8f7fb` | Icon backgrounds |
| `primary-900` | `#0e7490` | HowItWorks gradient |
| `dark` | `#1a1a2e` | Headings, footer bg |

## Dependencies

- **Framework**: `astro`, `@astrojs/react`
- **Runtime**: `react`, `react-dom`
- **Styling**: `tailwindcss`, `@tailwindcss/vite`
- **Dev**: `typescript`, `eslint`

No routing library. No state management. No animation library (CSS + vanilla JS only).

## License

All rights reserved.
