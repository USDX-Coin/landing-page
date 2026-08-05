# USDX Landing Page

## Overview

Single-page responsive landing page for **USDX**, a U.S. dollar stablecoin issued by **PT Macan Asia Finance**, positioned — in the words of its own documentation — as "a trusted U.S. dollar stablecoin for digital asset settlement, cross-border transactions, and institutional liquidity". Brand color: `#1eaed5`.

The site previously called USDX "The Transparent & Regulated USD Stablecoin". It is **not** described as regulated or licensed anywhere in the official documentation, and an unbacked regulatory claim is a standard block-explorer rejection, so that positioning is gone and must not return without a licence number to cite.

### Claims discipline

The single source of truth for every factual statement on this site is the official documentation at <https://usdx-co.gitbook.io/whitepaper-usdx> (12 pages; see its `llms.txt`). Nothing may be stated on the site that is not stated there. In particular:

- **Backing.** 100% U.S. dollar **cash** reserves held at Bank Negara Indonesia (BNI). There are no US Treasury bonds — "Treasury" appears in the documentation only as the name of the "Treasury Management" use case.
- **Two different checks, two different rhythms.** Reserves are verified by **monthly attestations** from a Public Accounting Firm (KAP). The **smart contract** has had **one** independent security audit (Cyberscope, initial audit 25 May 2026). Merging the two into "audited regularly" is how the old backing copy became false.
- **Not a domestic payment instrument.** The FAQ answers "Can USDX be used for payments in Indonesia?" with a flat "No.", and the Use Cases page closes with the same notice. No section may read as an offer of domestic Indonesian payments.
- **Not open to everyone.** Minting and redemption are available only to Authorized Customers who have completed KYC and KYB. Copy must not promise access to "anyone".
- **No invented numbers, people or addresses.** `team.ts`, `token.ts` and `company.ts` are deliberately empty in places; their sections render nothing rather than a placeholder.

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
│   ├── favicon.svg          # Legacy (unused, Logo.svg is the actual favicon)
│   ├── icon/                # Chain SVG icons (8 files)
│   └── image/               # USDX Logo.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro     # HTML shell, meta tags, global CSS, scroll observer
│   ├── pages/
│   │   └── index.astro      # Main page — assembles all sections
│   ├── components/
│   │   ├── Navbar.tsx        # React island (client:load) — scroll shadow, mobile menu
│   │   ├── Hero.astro        # Static + GSAP (phone wallet mockup, intro timeline, scroll parallax)
│   │   ├── Features.astro    # Static + GSAP (trust ribbon + horizontal pinned-scroll card track; mobile swipe carousel)
│   │   ├── Ecosystem.astro   # Static + GSAP (USDX hub + single ring of chains orbiting clockwise; scroll-scale; hover tooltip + pause; click-through to chain) + partners marquee
│   │   ├── Faq.tsx           # React island (client:visible) — click accordion (toggle, all-closeable) + per-row visuals
│   │   └── Footer.astro      # Static (real USDX logo)
│   ├── data/                 # Typed content arrays (unchanged from Vite era)
│   │   ├── navigation.ts
│   │   ├── features.ts
│   │   ├── whyUsdx.ts        # Trust points — now consumed by Features trust ribbon
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

Only 2 components hydrate React in the browser:
- **Navbar** (`client:load`) — needs immediate scroll detection + mobile menu state
- **FAQ** (`client:visible`) — accordion state, deferred until scrolled into view

Hero & Features stay **static HTML** but ship small GSAP `<script>` modules (no React hydration). Smooth scroll + ScrollTrigger are wired globally in `Layout.astro`.

### Animations (GSAP + Lenis)

- **Smooth scroll**: Lenis (inertia/easing) initialized in `Layout.astro`, synced to GSAP's ticker; anchor links routed through `lenis.scrollTo`
- **Hero**: GSAP intro timeline (headline lines, copy, phone, balance count-up), idle float, ScrollTrigger parallax on phone + background blobs
- **Features**: trust-ribbon reveals + a **horizontal pinned scroll** card track via `gsap.matchMedia('(min-width:1024px)')` (ScrollTrigger `pin` + scrubbed `x` translate, `invalidateOnRefresh`). The left-aligned heading lives inside the pinned section, which is `lg:h-screen flex-col justify-center` so heading + track sit centered as one group. Cards grow on `xl`/`2xl` (up to 460px) so the track keeps overflowing — and stays legible — on large monitors; the pin is compressed (full card travel mapped over ~0.6× the vertical scroll, so the "travel room" stays short) and only skipped when there is genuinely no overflow. Below `lg` the track is a native `overflow-x-auto` snap carousel (no pin)
- **FAQ**: click-toggle accordion (single open, can be all-closed); smooth height via `grid-rows-[0fr]→[1fr]`; open row reveals answer + a styled visual (chain icons for the multi-chain question)
- **Ecosystem**: USDX logo hub with a single ring of chains (positions = % of a square stage, so they scale at any size). One `[data-orbit]` ring rotates clockwise; each `[data-counter]` icon counter-rotates to stay upright. ScrollTrigger scrubs the stage scale (small→large on entry); orbit pauses on chain hover (tooltip + scale); each chain is an `<a>` to its site. Light bg, works desktop + mobile
- **Legacy reveal**: CSS `.animate-on-scroll` + IntersectionObserver in Layout.astro (still used by Ecosystem/Footer)
- **Marquee**: CSS `@keyframes marquee` on partner logos
- **Reduced motion**: every script checks `prefers-reduced-motion`; Lenis is skipped and content renders fully visible

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
| `dark` | `#1a1a2e` | Headings, footer bg |

## Verification

```bash
pnpm dev &
agent-browser open http://localhost:4321
agent-browser screenshot --full /tmp/usdx-check.png
```
