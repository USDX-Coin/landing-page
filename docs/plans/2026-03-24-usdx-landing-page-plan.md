---
date: 2026-03-24
topic: usdx-landing-page
brainstorm: ../brainstorms/2026-03-24-usdx-landing-page-brainstorm.md
---

# USDX Landing Page — Implementation Plan

## Overview

Single-page responsive landing page for USDX stablecoin. React + Vite SPA with clean minimal design, brand color #1eaed5. Verified via agent-browser after each milestone.

## Tech Stack

- **React 18** + **Vite 6** (SPA) + **TypeScript**
- **Tailwind CSS v4** — utility-first styling, configured with USDX brand tokens
- **pnpm** — package manager
- **Inter** font via Google Fonts
- **No external UI library** — all components hand-built for zero bloat
- **Single page** — no routing, all sections rendered in one `App.tsx`

## Project Structure

```
usdx-landing/
├── index.html
├── package.json
├── tsconfig.json              # TypeScript config
├── tsconfig.app.json          # App-specific TS config
├── vite.config.ts             # Vite config (TypeScript)
├── tailwind.config.ts         # Tailwind config with USDX brand tokens
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx               # Entry point
│   ├── App.tsx                # Single page — assembles all sections
│   ├── index.css              # Tailwind directives + marquee keyframe
│   ├── vite-env.d.ts          # Vite type declarations
│   ├── components/
│   │   ├── Navbar.tsx         # Fixed nav with logo + menu + CTA
│   │   ├── Hero.tsx           # Headline + sub + CTAs + coin illustration
│   │   ├── WhyUsdx.tsx        # Transparency & regulation narrative
│   │   ├── Features.tsx       # 6 feature cards in grid
│   │   ├── HowItWorks.tsx     # 3-step mint/redeem flow
│   │   ├── Ecosystem.tsx      # Chain logos + partner marquee
│   │   ├── Faq.tsx            # Accordion FAQ
│   │   └── Footer.tsx         # Logo + socials + copyright
│   └── data/
│       ├── features.ts        # Feature card data (typed)
│       ├── faq.ts             # FAQ questions & answers (typed)
│       ├── chains.ts          # Supported chain names & icons (typed)
│       └── socials.ts         # Social media links & icons (typed)
```

### Architecture Principles
- **One component = one section** — no wrapper/layout components needed for a single page
- **Data files separate from components** — content in `src/data/`, rendering in `src/components/`
- **Tailwind config as single source of truth** — brand colors, fonts, spacing defined once in `tailwind.config.js`
- **No duplicate styles** — reuse Tailwind utilities; only custom CSS for marquee animation in `index.css`
- **No utility components** — each section is self-contained; no premature abstractions
- **No CSS Module files** — all styling via Tailwind classes inline in JSX

## Implementation Phases

---

### PHASE 1: Foundation
**Goal:** Project scaffolding, tooling, and brand tokens configured. Dev server runs with blank page.

| Step | Task | Files |
|------|------|-------|
| 1.1 | Scaffold React + Vite + TS | `pnpm create vite usdx-landing --template react-ts` |
| 1.2 | Install Tailwind CSS v4 | `pnpm add tailwindcss @tailwindcss/vite` |
| 1.3 | Configure Vite + Tailwind plugin | `vite.config.ts` |
| 1.4 | Configure Tailwind brand tokens | `tailwind.config.ts` |
| 1.5 | Setup base CSS (Tailwind directives, Inter font, marquee keyframe) | `src/index.css` |
| 1.6 | Create all data files with types | `src/data/features.ts`, `faq.ts`, `chains.ts`, `socials.ts` |
| 1.7 | Clean up Vite boilerplate (remove App.css, default content) | `src/App.tsx`, delete unused files |

**Tailwind config tokens:**
```ts
colors: {
  primary: { DEFAULT: '#1eaed5', dark: '#1899bc', light: '#e8f7fb' },
  dark: '#1a1a2e',
}
fontFamily: { sans: ['Inter', 'sans-serif'] }
animation: { marquee: 'marquee 30s linear infinite' }
```

**Verification:** `pnpm dev` runs, blank page loads, Tailwind classes work.

---

### PHASE 2: Above the Fold (Navbar + Hero)
**Goal:** First impression complete — visitor sees nav bar, headline, CTAs, and coin illustration.

| Step | Task | File |
|------|------|------|
| 2.1 | Navbar — fixed, white bg, border on scroll | `src/components/Navbar.tsx` |
| 2.2 | Navbar — USDX SVG coin icon + text logo (left) | `src/components/Navbar.tsx` |
| 2.3 | Navbar — menu links: Why USDX, Features, How it Works, Ecosystem (smooth scroll) | `src/components/Navbar.tsx` |
| 2.4 | Navbar — "Get USDX" CTA button (primary color, right) | `src/components/Navbar.tsx` |
| 2.5 | Navbar — mobile hamburger menu toggle | `src/components/Navbar.tsx` |
| 2.6 | Hero — two-column layout (text left, coin right) | `src/components/Hero.tsx` |
| 2.7 | Hero — H1: "The Transparent & Regulated USD Stablecoin" | `src/components/Hero.tsx` |
| 2.8 | Hero — subtext about USDX value proposition | `src/components/Hero.tsx` |
| 2.9 | Hero — primary CTA "Get USDX" → app.usdx.com | `src/components/Hero.tsx` |
| 2.10 | Hero — secondary CTA "Learn More" → scrolls to #why-usdx | `src/components/Hero.tsx` |
| 2.11 | Hero — SVG/CSS coin illustration (brand color) | `src/components/Hero.tsx` |
| 2.12 | Hero — mobile: stacked layout (text → coin → CTAs) | `src/components/Hero.tsx` |
| 2.13 | Wire up Navbar + Hero in App.tsx | `src/App.tsx` |

**Verification:** Agent-browser screenshot — navbar and hero visible, responsive on mobile.

---

### PHASE 3: Content Sections (Why + Features + How It Works)
**Goal:** Core value proposition sections complete.

| Step | Task | File |
|------|------|------|
| 3.1 | WhyUsdx — section subtitle "WHY USDX" + heading "Built on Transparency and Trust" | `src/components/WhyUsdx.tsx` |
| 3.2 | WhyUsdx — two-column: narrative text left, key stats/visual right | `src/components/WhyUsdx.tsx` |
| 3.3 | WhyUsdx — key points: backed by USD + Treasury bonds, audited, transparent | `src/components/WhyUsdx.tsx` |
| 3.4 | WhyUsdx — "View Audit Reports" CTA button | `src/components/WhyUsdx.tsx` |
| 3.5 | Features — section subtitle "FEATURES" + heading "Key Features" | `src/components/Features.tsx` |
| 3.6 | Features — 3x2 grid (desktop), 2x3 (tablet), 1-col (mobile) | `src/components/Features.tsx` |
| 3.7 | Features — 6 cards with SVG icons, titles, descriptions from `data/features.ts` | `src/components/Features.tsx` |
| 3.8 | HowItWorks — section subtitle "HOW IT WORKS" + heading "Mint and Redeem with Ease" | `src/components/HowItWorks.tsx` |
| 3.9 | HowItWorks — 3 steps horizontal (desktop) / vertical (mobile) | `src/components/HowItWorks.tsx` |
| 3.10 | HowItWorks — step connectors (line/arrow between steps) | `src/components/HowItWorks.tsx` |
| 3.11 | HowItWorks — each step: number circle + icon + title + description | `src/components/HowItWorks.tsx` |
| 3.12 | Wire up all 3 sections in App.tsx | `src/App.tsx` |

**Step content:**
1. **Deposit USD** — "Deposit USD into your USDX account through bank transfer or wire."
2. **Mint USDX** — "USDX tokens are minted 1:1 and sent to your wallet instantly."
3. **Redeem** — "Burn USDX anytime to receive USD back at a guaranteed 1:1 rate."

**Verification:** Agent-browser screenshot — all 3 sections render, cards and steps display correctly.

---

### PHASE 4: Ecosystem + FAQ + Footer
**Goal:** All remaining sections complete. Full page assembled.

| Step | Task | File |
|------|------|------|
| 4.1 | Ecosystem — section subtitle "ECOSYSTEM" + heading "Supported Chains" | `src/components/Ecosystem.tsx` |
| 4.2 | Ecosystem — 8 chain logos grid (Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Solana, Base) | `src/components/Ecosystem.tsx` |
| 4.3 | Ecosystem — "Trusted Partners" sub-heading | `src/components/Ecosystem.tsx` |
| 4.4 | Ecosystem — scrolling marquee with CSS animation (placeholder partner logos) | `src/components/Ecosystem.tsx` |
| 4.5 | FAQ — section subtitle "FAQ" + heading "Frequently Asked Questions" | `src/components/Faq.tsx` |
| 4.6 | FAQ — accordion with expand/collapse (React state, one open at a time) | `src/components/Faq.tsx` |
| 4.7 | FAQ — 6 questions from `data/faq.ts` | `src/components/Faq.tsx` |
| 4.8 | Footer — dark bg, USDX logo + tagline (left) | `src/components/Footer.tsx` |
| 4.9 | Footer — quick links center (Why USDX, Features, How it Works, Ecosystem) | `src/components/Footer.tsx` |
| 4.10 | Footer — social icons right (Twitter/X, Telegram, Discord, GitHub, Medium) — placeholder "#" | `src/components/Footer.tsx` |
| 4.11 | Footer — bottom bar: copyright + Terms & Conditions | `src/components/Footer.tsx` |
| 4.12 | Wire up all sections in App.tsx — final page assembly | `src/App.tsx` |

**Verification:** Agent-browser screenshot — full page top to bottom, marquee scrolls, FAQ accordion works.

---

### PHASE 5: Responsive Polish & Final Verification
**Goal:** Pixel-perfect responsive at all breakpoints. No bugs, no duplicate code.

| Step | Task |
|------|------|
| 5.1 | Test desktop (1280px) — all sections, grids, two-column layouts |
| 5.2 | Test tablet (768px) — features 2-col, stacked layouts |
| 5.3 | Test mobile (375px) — hamburger nav, 1-col everything, vertical steps |
| 5.4 | Fix any layout/spacing issues found |
| 5.5 | Verify smooth scroll navigation works for all anchor links |
| 5.6 | Verify all CTAs point to correct targets |
| 5.7 | Code review: remove any duplicate Tailwind classes or unused code |
| 5.8 | Final agent-browser verification (desktop + mobile screenshots) |

**Verification Checklist:**
- [ ] All 8 sections render correctly
- [ ] Navigation smooth-scrolls to each section
- [ ] "Get USDX" CTA links to app.usdx.com
- [ ] Feature cards display all 6 items
- [ ] How It Works shows 3 steps with connecting flow
- [ ] 8 chain logos visible in Ecosystem
- [ ] Partner marquee scrolls continuously
- [ ] FAQ accordion opens/closes correctly (one at a time)
- [ ] Mobile layout works at 375px
- [ ] Tablet layout works at 768px
- [ ] No duplicate code — all brand values via Tailwind config
- [ ] No unused components or dead code
- [ ] Only custom CSS is marquee keyframe in index.css
