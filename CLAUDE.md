# USDX Landing Page

## Overview

Single-page responsive landing page for **USDX**, a USD-pegged stablecoin positioned as "The Transparent & Regulated USD Stablecoin". Brand color: `#1eaed5`.

## Tech Stack

- **React 19** + **Vite 8** + **TypeScript 5.9** (SPA, no routing)
- **Tailwind CSS v4** — utility-first, configured via `@theme` in `index.css`
- **pnpm** — package manager
- **Inter** — primary font (Google Fonts, loaded via `<link>` in `index.html`)
- No external UI libraries — all components hand-built

## Project Structure

```
├── CLAUDE.md              # This file
├── README.md              # Project documentation
├── docs/
│   ├── brainstorms/       # Design brainstorm outputs
│   ├── plans/             # Implementation plans
│   └── reviews/           # Code review reports
├── public/
│   └── favicon.svg        # USDX branded favicon
├── src/
│   ├── App.tsx            # Root — assembles all sections
│   ├── main.tsx           # ReactDOM entry
│   ├── index.css          # Tailwind directives + theme tokens
│   ├── components/        # One component per page section
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── WhyUsdx.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Ecosystem.tsx
│   │   ├── Faq.tsx
│   │   └── Footer.tsx
│   └── data/              # Typed content arrays
│       ├── navigation.ts  # Shared nav links (Navbar + Footer)
│       ├── features.ts    # Feature cards
│       ├── why-usdx.ts    # WhyUsdx trust points
│       ├── faq.ts         # FAQ items
│       ├── chains.ts      # Chain + partner data
│       └── socials.ts     # Social media links
├── index.html
├── package.json
├── vite.config.ts
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.node.json
```

## Commands

```bash
pnpm dev        # Start dev server (localhost:5173)
pnpm build      # Type check + production build
pnpm lint       # ESLint check
pnpm preview    # Preview production build
```

## Architecture Principles

- **One component = one page section** — Navbar, Hero, WhyUsdx, Features, HowItWorks, Ecosystem, Faq, Footer
- **Data-driven** — content lives in `src/data/*.ts` with typed interfaces, components consume and render
- **Tailwind only** — no CSS modules, no CSS-in-JS, no component-scoped stylesheets
- **Theme tokens in one place** — brand colors, fonts, animations defined in `src/index.css` via `@theme`
- **No premature abstractions** — no shared utility components, no HOCs, no context providers

## Conventions

### Naming

- Components: PascalCase files + default export (`Hero.tsx` → `export default function Hero()`)
- Data files: camelCase or kebab-case (`features.ts`, `why-usdx.ts`)
- Interfaces: PascalCase singular (`Feature`, `FaqItem`, `Chain`)
- Type unions: PascalCase + suffix (`FeatureIcon`, `SocialIcon`, `WhyUsdxIcon`)
- Section IDs: kebab-case (`#why-usdx`, `#how-it-works`)

### Component Pattern

Every section component follows this structure:

```tsx
export default function SectionName() {
  return (
    <section id="section-id" className="py-24 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
          LABEL
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-dark">Heading</h2>
        {/* Content */}
      </div>
    </section>
  );
}
```

**Section order (as rendered in App.tsx):**

1. `Navbar.tsx` — Fixed top nav, scroll shadow, hamburger on mobile
2. `Hero.tsx` — Headline, subtext, CTAs, coin illustration
3. `WhyUsdx.tsx` — Transparency narrative, 3 trust cards with distinct icons
4. `Features.tsx` — 6 feature cards in 3x2 grid
5. `HowItWorks.tsx` — 3-step mint/redeem flow with connector line
6. `Ecosystem.tsx` — 8 chain logos + partner scrolling marquee
7. `Faq.tsx` — Accordion with CSS max-height transition, one open at a time
8. `Footer.tsx` — Dark bg, logo, quick links, social icons

**Patterns:**

- Alternating backgrounds: `bg-white` → `bg-gray-50` → `bg-white` → ...
- Icons: SVG paths stored in module-level `iconMap` objects with typed keys
- State: Only Navbar (scroll + mobile menu) and Faq (accordion index) use `useState`
- No props: Components are self-contained; they import their own data

### Styling

- Section padding: `py-24 px-6`
- Container: `max-w-[1200px] mx-auto`
- Cards: `rounded-xl border border-gray-100 p-8`
- Buttons: `px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark`
- Responsive: mobile-first with `md:` and `lg:` breakpoints

### Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#1eaed5` | Buttons, links, accents |
| `primary-dark` | `#1899bc` | Hover states |
| `primary-light` | `#e8f7fb` | Icon backgrounds |
| `dark` | `#1a1a2e` | Headings, footer bg |

### Data Pattern

Each data file exports a type union (for icon keys), an interface, and a typed const array:

```ts
export type IconName = "a" | "b" | "c";

export interface TypeName {
  field: string;
  icon: IconName;
}

export const items: TypeName[] = [
  { field: "value", icon: "a" },
];
```

**Adding content:**

- **New feature**: Add to `features` array in `features.ts`. Icon must match `FeatureIcon` union.
- **New FAQ**: Add `{ question, answer }` to `faqItems` in `faq.ts`.
- **New chain**: Add `{ name, shortName }` to `chains` in `chains.ts`.
- **New partner**: Add `{ name, url }` to `partners` in `chains.ts`.
- **New social**: Add to `socials` in `socials.ts`. Icon must match `SocialIcon` union.
- **New nav link**: Add to `navLinks` in `navigation.ts` (shared by Navbar + Footer).

## Security

- CSP meta tag in `index.html` restricts script/style/font/connect sources
- Security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`) configured for preview server
- All `target="_blank"` links include `rel="noopener noreferrer"`
- No `dangerouslySetInnerHTML`, no `eval()`, no `innerHTML`

## Verification

```bash
pnpm dev &
agent-browser open http://localhost:5173
agent-browser screenshot --full /tmp/usdx-check.png
```
