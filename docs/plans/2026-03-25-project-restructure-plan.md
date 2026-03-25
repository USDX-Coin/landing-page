---
date: 2026-03-25
topic: project-restructure
brainstorm: ../brainstorms/2026-03-25-project-restructure-brainstorm.md
---

# Project Restructure & Code Cleanup — Implementation Plan

## Resolved Open Questions

1. **Favicon**: Generate simple unique SVG (teal circle + $ matching brand)
2. **Social links**: Keep as placeholder `"#"` for now
3. **CSP**: Allow `app.usdx.com` in `connect-src`
4. **Vercel best practices**: Apply ALL recommendations

---

## Phase 1: Install Vercel React Best Practices Skill

**Goal:** Get the skill installed so we can reference its rules throughout the other phases.

**Steps:**
1. Run `npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices -y` with Claude Code agent target
2. Read the installed skill file to understand all recommendations
3. Note which recommendations apply to this static landing page

**Commit:** `chore: install vercel-react-best-practices skill`

**Files changed:**
- `.claude/skills/vercel-react-best-practices.md` (new)

---

## Phase 2: Flatten Folder Structure

**Goal:** Move app from `landing-page/` subfolder to repo root. Standard Vite layout.

**Steps:**
1. Copy `.gitignore` from `landing-page/.gitignore` to repo root (replace empty one)
2. Add `.env` and `.env.*` exclusions to `.gitignore` (fix #15)
3. Move these from `landing-page/` to repo root:
   - `src/` (entire directory)
   - `public/` (entire directory)
   - `index.html`
   - `package.json`
   - `pnpm-lock.yaml`
   - `vite.config.ts`
   - `eslint.config.js`
   - `tsconfig.json`
   - `tsconfig.app.json`
   - `tsconfig.node.json`
4. Delete `landing-page/` directory (including its `README.md`, `CLAUDE.md`, `.vite/`)
5. Delete `docs/CLAUDE.md`
6. Delete `src/components/CLAUDE.md` (now at new location)
7. Delete `src/data/CLAUDE.md` (now at new location)
8. Run `pnpm install` from repo root to verify lockfile works
9. Run `pnpm build` to verify nothing broke

**Commit:** `refactor: flatten folder structure, move app to repo root`

**Files changed:**
- All files moved from `landing-page/` → root
- `landing-page/` deleted
- `docs/CLAUDE.md` deleted
- Nested CLAUDE.md files deleted
- `.gitignore` updated

---

## Phase 3: Fix Build-Breaking & Performance Issues (P0 + P1)

**Goal:** Fix the build-breaking type error and critical performance/security issues.

### 3a. Fix JSX.Element type (P0 #1)

**Files:** `src/components/Features.tsx`, `src/components/Footer.tsx`

```tsx
// Add at top of both files:
import type { ReactNode } from "react";

// Change:
const iconMap: Record<string, JSX.Element> = { ... };
// To:
const iconMap: Record<FeatureIcon, ReactNode> = { ... };  // Features.tsx
const socialIcons: Record<SocialIcon, ReactNode> = { ... }; // Footer.tsx
```

### 3b. Fix font loading (P1 #2)

**File removed from:** `src/index.css` line 2 (`@import url(...)`)
**File changed:** `index.html` — add preconnect + stylesheet links in `<head>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### 3c. Type-safe icon fields (P1 #3)

**File:** `src/data/features.ts`
```ts
export type FeatureIcon = "shield" | "zap" | "dollar" | "layers" | "check" | "globe";
export interface Feature {
  title: string;
  description: string;
  icon: FeatureIcon;
}
```

**File:** `src/data/socials.ts`
```ts
export type SocialIcon = "twitter" | "telegram" | "discord" | "github" | "medium";
export interface Social {
  name: string;
  url: string;
  icon: SocialIcon;
}
```

### 3d. Add CSP meta tag (P1 #4)

**File:** `index.html` — add in `<head>`:
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://app.usdx.com;" />
```

### 3e. Add security headers (P1 #5)

**File:** `vite.config.ts`
```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
})
```

**Commit:** `fix: resolve build-breaking JSX.Element type, improve font loading and security`

**Verification:** `pnpm build` must pass. `pnpm lint` must pass.

---

## Phase 4: Fix Data & Performance Issues (P2)

**Goal:** Eliminate duplicated code, improve data consistency, optimize performance.

### 4a. Extract shared navigation links (P2 #6)

**New file:** `src/data/navigation.ts`
```ts
export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Why USDX", href: "#why-usdx" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Ecosystem", href: "#ecosystem" },
];
```

**Files changed:** `Navbar.tsx` and `Footer.tsx` — remove inline `navLinks`/`footerLinks` arrays, import from `data/navigation.ts`.

### 4b. Extract WhyUsdx data (P2 #7)

**New file:** `src/data/why-usdx.ts`
```ts
export interface WhyUsdxPoint {
  title: string;
  description: string;
  icon: string; // SVG path identifier — use same union pattern if icons grow
}

export const whyUsdxPoints: WhyUsdxPoint[] = [
  { title: "USD Cash & Treasury Bonds", description: "...", icon: "shield" },
  { title: "Independent Audits", description: "...", icon: "clipboard" },
  { title: "Real-Time Transparency", description: "...", icon: "eye" },
];
```

**File changed:** `WhyUsdx.tsx` — import from data file, add distinct icons per card (fix #12).

### 4c. Passive scroll listener (P2 #8)

**File:** `src/components/Navbar.tsx`
```tsx
window.addEventListener("scroll", onScroll, { passive: true });
```

### 4d. Marquee GPU optimization (P2 #9)

**File:** `src/components/Ecosystem.tsx`
```tsx
className="flex animate-marquee w-max will-change-transform"
```

### 4e. FAQ CSS-based toggle (P2 #10)

**File:** `src/components/Faq.tsx`

Replace conditional render with CSS max-height transition:
```tsx
<div className={`px-6 overflow-hidden transition-all duration-300 ${
  openIndex === index ? "max-h-96 pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"
}`}>
  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
</div>
```

Always render the content div (no `{openIndex === index && ...}`).

**Commit:** `refactor: extract shared data, fix performance and remove duplicates`

**Verification:** `pnpm build` + `pnpm lint`

---

## Phase 5: Low-Priority Fixes (P3)

**Goal:** Clean up remaining small issues.

### 5a. FAQ key fix (#11)
`Faq.tsx`: `key={item.question}` instead of `key={index}`

### 5b. Remove unused CSS token (#13)
`src/index.css`: Remove `--color-dark-light: #2a2a4a;`

### 5c. Remove unused interface exports (#14)
All `src/data/*.ts`: Remove `export` from interfaces that are never imported elsewhere. Keep types that ARE used (like `FeatureIcon`, `SocialIcon`).

### 5d. Reduced motion (#16)
`Hero.tsx`: `motion-safe:animate-pulse` instead of `animate-pulse`

**Commit:** `fix: cleanup unused code, improve accessibility`

**Verification:** `pnpm build` + `pnpm lint`

---

## Phase 6: Generate USDX Favicon

**Goal:** Replace Vite default favicon with branded USDX icon.

**File:** `public/favicon.svg`

Design spec:
- 32x32 viewBox
- Teal circle (`#1eaed5`) as background
- White `$` symbol centered
- Simple, recognizable at small sizes
- Unique: subtle ring detail to differentiate from generic coin icons

**Commit:** `chore: replace default Vite favicon with USDX branded icon`

---

## Phase 7: Consolidate CLAUDE.md

**Goal:** Single comprehensive CLAUDE.md at repo root.

**Sections (merged from all 5 files):**

```markdown
# USDX Landing Page

## Overview
Single-page responsive landing page for USDX stablecoin.

## Tech Stack
React 19 + Vite 8 + TypeScript 5.9 + Tailwind CSS v4 + pnpm

## Project Structure
(flat layout — updated)

## Commands
pnpm dev / build / lint / preview

## Architecture Principles
- One component = one section
- Data-driven rendering
- Tailwind only
- Theme tokens in one place
- No premature abstractions

## Conventions

### Naming
(PascalCase components, camelCase data, etc.)

### Component Pattern
(section template from components/CLAUDE.md)

### Styling
(spacing, containers, cards, buttons, responsive)

### Color System
(primary, primary-dark, primary-light, dark)

### Data Pattern
(interface + typed const array, how to add content — from data/CLAUDE.md)

## Verification
agent-browser commands
```

**Commit:** `docs: consolidate 5 CLAUDE.md files into single root file`

---

## Phase 8: Write README.md

**Goal:** Proper project README.

**Content:**
- Project name + tagline
- Quick start instructions
- Project structure tree
- Components table (8 sections with descriptions)
- Data files table
- Theme/color reference
- License placeholder

**Commit:** `docs: write comprehensive README`

---

## Phase 9: Verify with Agent Browser

**Goal:** Visual verification that everything renders correctly after all changes.

**Steps:**
1. `pnpm dev &` (start dev server)
2. `agent-browser open http://localhost:5173`
3. `agent-browser screenshot --full /tmp/usdx-final.png`
4. Review screenshot for:
   - Favicon in browser tab
   - All sections render correctly
   - FAQ accordion works (CSS transition)
   - Marquee animates
   - Mobile hamburger menu
5. Fix any visual regressions found
6. Kill dev server

**No commit** — verification only (unless fixes needed).

---

## Summary

| Phase | Commit Message | Key Changes |
|-------|---------------|-------------|
| 1 | `chore: install vercel-react-best-practices skill` | Skill file |
| 2 | `refactor: flatten folder structure, move app to repo root` | Move all files, delete nesting |
| 3 | `fix: resolve build-breaking JSX.Element type, improve font loading and security` | P0+P1 fixes |
| 4 | `refactor: extract shared data, fix performance and remove duplicates` | P2 fixes |
| 5 | `fix: cleanup unused code, improve accessibility` | P3 fixes |
| 6 | `chore: replace default Vite favicon with USDX branded icon` | New favicon |
| 7 | `docs: consolidate 5 CLAUDE.md files into single root file` | Single CLAUDE.md |
| 8 | `docs: write comprehensive README` | New README |
| 9 | — | Visual verification + hotfix if needed |

**Total: 8 commits, 9 phases.**
