---
date: 2026-03-25
topic: project-restructure
---

# Project Restructure & Code Cleanup

## What We're Building

A comprehensive cleanup of the USDX landing page project: flatten the folder structure (remove nested `landing-page/` directory), fix all code issues found in the existing review, consolidate scattered CLAUDE.md files into one, write a proper README, and apply Vercel React best practices.

## Why This Approach

The project currently has a confusing nested structure (`landing-page/landing-page/`), 5 separate CLAUDE.md files, a nearly empty root README, and several code issues (build-breaking type error, performance, security). Approach A (flatten to root) was chosen over Approach B (just rename subfolder) because it produces a standard Vite project layout with no unnecessary nesting.

## Key Decisions

### 1. Folder Structure: Flatten to Root

**Current:**
```
landing-page/              ← repo root
├── CLAUDE.md
├── README.md              ← 1 line: "# landing-page"
├── docs/
│   ├── CLAUDE.md
│   ├── brainstorms/
│   ├── plans/
│   └── reviews/
└── landing-page/          ← unnecessary nesting
    ├── CLAUDE.md
    ├── README.md           ← actual content here
    ├── src/
    │   ├── components/
    │   │   └── CLAUDE.md
    │   └── data/
    │       └── CLAUDE.md
    ├── index.html
    ├── package.json
    └── ...
```

**Target:**
```
landing-page/              ← repo root
├── CLAUDE.md              ← single, comprehensive
├── README.md              ← proper README
├── docs/
│   ├── brainstorms/
│   ├── plans/
│   └── reviews/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/        ← 8 section components
│   ├── data/              ← typed content arrays
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── .gitignore
```

**Rationale:** Standard Vite project layout. No confusion about where the app lives. `docs/` stays separate for design artifacts.

**Steps:**
1. Move all files from `landing-page/` to repo root
2. Delete empty `landing-page/` directory
3. Delete `docs/CLAUDE.md` (content merged into root CLAUDE.md)
4. Delete `landing-page/src/components/CLAUDE.md` (content merged)
5. Delete `landing-page/src/data/CLAUDE.md` (content merged)
6. Update root `.gitignore` with contents from `landing-page/.gitignore`

### 2. Code Fixes (from existing review)

All fixes from `docs/reviews/2026-03-24-usdx-landing-page-review.md`:

#### P0 — Build Breaking

| # | File | Fix |
|---|------|-----|
| 1 | `Features.tsx:3`, `Footer.tsx:10` | Replace `JSX.Element` with `import type { ReactNode } from "react"` → `Record<string, ReactNode>` |

#### P1 — Should Fix

| # | File | Fix |
|---|------|-----|
| 2 | `index.css:2` → `index.html` | Move Google Fonts `@import` to `<link>` tags with `preconnect` hints. Remove line from CSS. |
| 3 | `features.ts`, `socials.ts` | Create `FeatureIcon` and `SocialIcon` string literal union types. Update `Record` types in components. |
| 4 | `index.html` | Add `<meta http-equiv="Content-Security-Policy">` for financial product security |
| 5 | `vite.config.ts` | Add security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) for preview server |

#### P2 — Worth Fixing

| # | File | Fix |
|---|------|-----|
| 6 | `Navbar.tsx`, `Footer.tsx` | Extract shared nav links to `src/data/navigation.ts` |
| 7 | `WhyUsdx.tsx` | Move `points` array to `src/data/why-usdx.ts` with `WhyUsdxPoint` interface |
| 8 | `Navbar.tsx:14` | Add `{ passive: true }` to scroll event listener |
| 9 | `Ecosystem.tsx:45` | Add `will-change-transform` class to marquee container |
| 10 | `Faq.tsx:52-57` | Switch from conditional render to CSS `max-h` / `opacity` toggle for smooth animation |

#### P3 — Low Priority

| # | File | Fix |
|---|------|-----|
| 11 | `Faq.tsx:26` | Change `key={index}` to `key={item.question}` |
| 12 | `WhyUsdx.tsx` | Add distinct icons for each trust card (currently all use shield) |
| 13 | `index.css:9` | Remove unused `--color-dark-light` token |
| 14 | `src/data/*.ts` | Remove unused `export` on interfaces (or keep if vercel best practices recommend it) |
| 15 | `.gitignore` | Add `.env` and `.env.*` exclusions |
| 16 | `Hero.tsx:51` | Add `motion-safe:` prefix to `animate-pulse` |
| 17 | Placeholder `href="#"` links | Note: keep as-is since these are intentionally placeholder for now |

### 3. CLAUDE.md Consolidation

Merge 5 files into 1 root CLAUDE.md with these sections:

```
# USDX Landing Page

## Overview
## Tech Stack
## Project Structure          ← updated to reflect flat layout
## Commands
## Architecture Principles
## Conventions
  ### Naming
  ### Component Pattern       ← from components/CLAUDE.md
  ### Styling
  ### Color System
  ### Data Pattern             ← from data/CLAUDE.md
## Verification
```

**Delete after merge:**
- `docs/CLAUDE.md`
- `landing-page/CLAUDE.md` (moved up)
- `landing-page/src/components/CLAUDE.md`
- `landing-page/src/data/CLAUDE.md`

### 4. README.md

Write a proper README at repo root covering:
- Project name + one-line description
- Tech stack badges (React 19, Vite 8, TypeScript 5.9, Tailwind v4)
- Quick start (pnpm install, dev, build, lint)
- Project structure (updated flat layout)
- Section component overview table
- Data file overview table
- Theme/color system
- Deployment notes

### 5. Vercel React Best Practices

Install via: `npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices`

Select **Claude Code** (`.claude/skills`) as target agent.

After install, review the skill's recommendations and apply relevant ones:
- Likely relevant: component patterns, performance, accessibility
- Likely N/A: routing, state management, data fetching (this is a static landing page)

### 6. Replace Default Favicon

Current `public/favicon.svg` is the Vite default (purple lightning bolt). Should be replaced with a USDX-branded favicon (teal circle with `$` symbol matching the Navbar/Hero logo).

## Open Questions

1. **Favicon**: Should we generate a simple SVG favicon matching the USDX logo (teal circle + $), or do you have a custom favicon file to use?
2. **Social links**: All 5 social URLs in `socials.ts` are `"#"` placeholders. Do you have real URLs to fill in, or keep as-is for now?
3. **CSP strictness**: The CSP meta tag will allow `fonts.googleapis.com` and `fonts.gstatic.com`. Should we also allow `app.usdx.com` in `connect-src` for future API calls?
4. **`vercel-react-best-practices` scope**: After install, should I apply ALL recommendations, or only the ones relevant to a static landing page (skip routing/data-fetching patterns)?

## Execution Order

1. Install vercel-react-best-practices skill
2. Flatten folder structure
3. Fix all code issues (P0 → P3)
4. Consolidate CLAUDE.md
5. Write README.md
6. Replace favicon
7. Run `pnpm build` + `pnpm lint` to verify
8. Visual check with agent-browser

## Next Steps

→ Answer open questions above, then proceed to execution (or `/ce:plan` for detailed implementation steps)
