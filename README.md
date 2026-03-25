# USDX Landing Page

Single-page responsive landing page for **USDX** — The Transparent & Regulated USD Stablecoin.

Built with React 19, Vite 8, TypeScript 5.9, and Tailwind CSS v4.

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # Type check + production build
pnpm lint         # ESLint
pnpm preview      # Preview production build
```

## Project Structure

```
├── src/
│   ├── components/     # One component per page section (8 total)
│   ├── data/           # Typed content arrays
│   ├── App.tsx         # Root — assembles all sections
│   ├── main.tsx        # ReactDOM entry
│   └── index.css       # Tailwind + theme tokens
├── public/             # Static assets (favicon)
├── docs/               # Design brainstorms, plans, reviews
├── index.html          # Entry HTML with CSP + font preloading
├── vite.config.ts      # Vite + React + Tailwind plugins
└── tsconfig.json       # TypeScript project references
```

## Sections

| Component | Description |
|-----------|-------------|
| `Navbar` | Fixed top nav with scroll shadow and mobile hamburger |
| `Hero` | Headline, CTAs, animated coin illustration |
| `WhyUsdx` | 3 trust cards: Treasury bonds, audits, transparency |
| `Features` | 6 feature cards in responsive grid |
| `HowItWorks` | 3-step mint/redeem flow |
| `Ecosystem` | 8 supported chains + partner marquee |
| `Faq` | Accordion with smooth CSS transitions |
| `Footer` | Dark footer with links and social icons |

## Data Files

Content is separated from components for easy editing:

| File | Content |
|------|---------|
| `navigation.ts` | Nav links shared by Navbar + Footer |
| `features.ts` | 6 features with typed icon keys |
| `why-usdx.ts` | 3 trust points with distinct icons |
| `faq.ts` | 6 FAQ question/answer pairs |
| `chains.ts` | 8 blockchain chains + 8 partners |
| `socials.ts` | 5 social media links |

## Theme

Configured via `@theme` in `src/index.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#1eaed5` | Buttons, links, accents |
| `primary-dark` | `#1899bc` | Hover states |
| `primary-light` | `#e8f7fb` | Icon backgrounds |
| `dark` | `#1a1a2e` | Headings, footer |

## Dependencies

- **Runtime**: `react`, `react-dom`, `tailwindcss`, `@tailwindcss/vite`
- **Build**: `vite`, `@vitejs/plugin-react`, `typescript`
- **Lint**: `eslint`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`

No routing library. No state management library. No UI component library.

## License

All rights reserved.
