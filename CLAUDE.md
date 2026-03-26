# USDX Landing Page

## Overview

Single-page responsive landing page for **USDX**, a USD-pegged stablecoin positioned as "The Transparent & Regulated USD Stablecoin". Brand color: `#1eaed5`.

## Tech Stack

- **Astro 5** — static site generator (zero JS by default, islands architecture)
- **React 19** — used only for interactive islands (Navbar, FAQ)
- **TypeScript 5.9** — strict mode
- **Tailwind CSS v4** — utility-first, configured via `@theme` in `global.css`
- **pnpm** — package manager
- **Inter** — primary font (Google Fonts, loaded via `<link>` in Layout.astro)
- **Netlify** — deployment target (static output)

## Project Structure

```
├── CLAUDE.md
├── README.md
├── astro.config.mjs         # Astro config (React + Tailwind v4 vite plugin)
├── netlify.toml             # Netlify build config + security headers
├── package.json
├── tsconfig.json            # Extends astro/tsconfigs/strict
├── public/
│   ├── favicon.svg          # USDX branded favicon
│   ├── icon/                # Chain SVG icons (8 files)
│   └── image/               # USDX Logo.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro     # HTML shell, meta tags, global CSS, scroll observer
│   ├── pages/
│   │   └── index.astro      # Main page — assembles all sections
│   ├── components/
│   │   ├── Navbar.tsx        # React island (client:load) — scroll shadow, mobile menu
│   │   ├── Hero.astro        # Static + typewriter vanilla JS script
│   │   ├── WhyUsdx.astro     # Static
│   │   ├── Features.astro    # Static
│   │   ├── HowItWorks.astro  # Static (gradient teal background)
│   │   ├── Ecosystem.astro   # Static (real chain icons)
│   │   ├── Faq.tsx           # React island (client:visible) — accordion
│   │   └── Footer.astro      # Static (real USDX logo)
│   ├── data/                 # Typed content arrays (unchanged from Vite era)
│   │   ├── navigation.ts
│   │   ├── features.ts
│   │   ├── why-usdx.ts
│   │   ├── faq.ts
│   │   ├── chains.ts        # Now includes icon path field
│   │   └── socials.ts
│   └── styles/
│       └── global.css        # Tailwind + @theme tokens + animation keyframes
└── docs/
    ├── brainstorms/
    ├── plans/
    └── reviews/
```

## Commands

```bash
pnpm dev        # Start Astro dev server (localhost:4321)
pnpm build      # Static build to dist/
pnpm preview    # Preview production build
pnpm lint       # ESLint check
```

## Architecture

### Astro Islands

Only 2 components ship JavaScript to the browser:
- **Navbar** (`client:load`) — needs immediate scroll detection + mobile menu state
- **FAQ** (`client:visible`) — accordion state, deferred until scrolled into view

All other sections are **static HTML** — zero JS shipped.

### Animations (no library)

- **Scroll fade-in**: CSS `.animate-on-scroll` class + IntersectionObserver in Layout.astro
- **Stagger**: `transition-delay` inline styles on cards
- **Typewriter**: Vanilla JS `setTimeout` loop in Hero.astro
- **Float**: CSS `@keyframes float` on hero coin
- **Marquee**: CSS `@keyframes marquee` on partner logos
- **Hover**: Tailwind `hover:-translate-y-1 hover:shadow-lg transition-all duration-300`
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables all animations

### Conventions

- **Astro components**: `.astro` files use `class` (HTML standard)
- **React components**: `.tsx` files use `className` (React standard)
- **Data files**: TypeScript in `src/data/`, imported in frontmatter
- **Icons**: Real SVG files in `public/icon/`, referenced via `<img src="/icon/...">`
- **Logo**: `public/image/Logo.svg`

### Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#1eaed5` | Buttons, links, accents |
| `primary-dark` | `#1899bc` | Hover states |
| `primary-light` | `#e8f7fb` | Icon backgrounds |
| `primary-900` | `#0e7490` | HowItWorks gradient end |
| `primary-950` | `#0a4f5c` | FAQ gradient start |
| `dark` | `#1a1a2e` | Headings, footer bg |

## Verification

```bash
pnpm dev &
agent-browser open http://localhost:4321
agent-browser screenshot --full /tmp/usdx-check.png
```
