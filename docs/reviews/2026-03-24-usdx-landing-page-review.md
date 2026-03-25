---
date: 2026-03-24
project: usdx-landing
reviewers: pattern-recognition, performance, security, typescript, simplicity
---

# USDX Landing Page — Code Review

## Executive Summary

A lean, well-structured single-page React landing page (858 LOC across 15 source files). The architecture is clean: flat component structure, data-driven rendering, minimal state, zero unnecessary dependencies. The codebase is already minimal for what it does.

**Overall Rating: GOOD — with a few actionable fixes**

| Area | Rating | Key Finding |
|------|--------|-------------|
| Patterns & Consistency | Good | Minor data-sourcing inconsistencies |
| Performance | Good | Font loading and animation optimizations needed |
| Security | Low Risk | Missing CSP headers (important for financial product) |
| TypeScript | Needs Fix | Build-breaking `JSX.Element` import issue |
| Simplicity | Excellent | ~28 lines of dead/duplicate code, no YAGNI violations |

---

## CRITICAL — Must Fix

### 1. Build-Breaking: `JSX.Element` namespace not found

**Files:** `src/components/Features.tsx:3`, `src/components/Footer.tsx:10`

Both files use `JSX.Element` without importing it. In React 19 with `verbatimModuleSyntax: true`, the global `JSX` namespace is not available. **This prevents `pnpm build` from completing.**

```tsx
// BROKEN
const iconMap: Record<string, JSX.Element> = { ... };

// FIX — add import at top of file
import type { ReactNode } from "react";
const iconMap: Record<string, ReactNode> = { ... };
```

**Impact:** Production build is blocked. Fix immediately.

---

### 2. Render-Blocking Google Fonts via CSS `@import`

**File:** `src/index.css:2`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

CSS `@import` for external resources creates a request chain: browser must download CSS → parse → discover import → fetch fonts. This blocks First Contentful Paint by 300-1500ms on slow connections. Vite also warns that `@import` rules must precede all other rules.

**Fix:** Move to `index.html` with preconnect hints:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

Remove line 2 from `src/index.css`.

---

## HIGH — Should Fix

### 3. Unsafe Icon Map Lookups (Stringly-Typed)

**Files:** `src/data/features.ts:5`, `src/data/socials.ts:4`

The `icon` field is typed as `string`, allowing any value. A typo like `icon: "sheild"` will silently render `undefined` inside the SVG with no compiler warning.

**Fix:** Use string literal unions:

```ts
// features.ts
export type FeatureIcon = "shield" | "zap" | "dollar" | "layers" | "check" | "globe";
export interface Feature {
  title: string;
  description: string;
  icon: FeatureIcon;
}

// socials.ts
export type SocialIcon = "twitter" | "telegram" | "discord" | "github" | "medium";
export interface Social {
  name: string;
  url: string;
  icon: SocialIcon;
}
```

Then in components: `Record<FeatureIcon, ReactNode>` ensures compile-time safety.

### 4. Missing Content Security Policy (CSP)

**File:** `index.html`

No CSP meta tag exists. For a financial product landing page, this is a security gap — a compromised CDN or injected script would execute without restriction.

**Fix:** Add to `index.html` `<head>`:

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self';" />
```

### 5. Missing Anti-Clickjacking Headers

**File:** `vite.config.ts`

No `X-Frame-Options: DENY` header configured. The USDX page could be embedded in a malicious iframe for clickjacking attacks.

**Fix:** Configure at hosting/CDN level. For Vite preview:

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

---

## MEDIUM — Worth Fixing

### 6. Duplicated Navigation Links

**Files:** `src/components/Navbar.tsx:3-8`, `src/components/Footer.tsx:3-8`

The same 4 nav links are defined independently in both files. If a section is renamed, both must be updated manually.

**Fix:** Extract to `src/data/navigation.ts` and import in both components.

### 7. Inline Data in WhyUsdx Breaks Convention

**File:** `src/components/WhyUsdx.tsx:1-17`

The `points` array is defined inline. Every other section that renders data arrays imports from `src/data/`. This breaks the established data-sourcing convention.

**Fix:** Move to `src/data/why-usdx.ts` with an interface, matching the pattern of other data files.

### 8. Scroll Listener Missing `passive: true`

**File:** `src/components/Navbar.tsx:14-18`

```tsx
window.addEventListener("scroll", onScroll);
```

Without `{ passive: true }`, the browser cannot optimize scroll performance. On mobile this can cause scroll jank.

**Fix:**
```tsx
window.addEventListener("scroll", onScroll, { passive: true });
```

### 9. Marquee Animation Missing GPU Promotion

**File:** `src/components/Ecosystem.tsx:45`

The marquee animates `transform: translateX()` on a container with 16 child elements. Without explicit GPU layer promotion, browsers may paint on the main thread.

**Fix:** Add `will-change-transform` class:
```tsx
className="flex animate-marquee w-max will-change-transform"
```

### 10. FAQ Mounts/Unmounts DOM on Toggle

**File:** `src/components/Faq.tsx:52-57`

Conditional rendering (`{openIndex === index && ...}`) destroys and recreates DOM nodes on each toggle. CSS-based show/hide would enable smooth transitions.

**Fix:**
```tsx
<div className={`px-6 overflow-hidden transition-all duration-300 ${
  openIndex === index ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
}`}>
```

---

## LOW — Nice to Have

### 11. FAQ Uses Array Index as Key

**File:** `src/components/Faq.tsx:26`

`key={index}` should be `key={item.question}` for semantic correctness per React best practices.

### 12. Duplicated SVG Icon Paths

The shield icon SVG path appears identically in both `WhyUsdx.tsx:52` and `Features.tsx:9`. The dollar icon appears in both `HowItWorks.tsx:23-26` and `Features.tsx:22-26`.

### 13. WhyUsdx Uses Same Icon for All 3 Cards

**File:** `src/components/WhyUsdx.tsx:48-52`

All three trust cards render the identical shield icon. Consider using distinct icons for visual variety.

### 14. Unused CSS Theme Token

**File:** `src/index.css:9`

`--color-dark-light: #2a2a4a` is defined but never used in any component. Dead CSS.

### 15. Exported Interfaces Never Imported

**Files:** All `src/data/*.ts` files

`Feature`, `Chain`, `Partner`, `FaqItem`, `Social` interfaces are exported but never imported by any consuming component. Consider removing the `export` keyword or removing them entirely (rely on inference).

### 16. `.gitignore` Missing Explicit `.env` Exclusion

**File:** `usdx-landing/.gitignore`

Only `*.local` is excluded. Add explicit `.env` and `.env.*` entries to prevent accidental secret exposure as the project grows.

### 17. Hero Pulse Animation Ignores `prefers-reduced-motion`

**File:** `src/components/Hero.tsx:51`

`animate-pulse` runs indefinitely. Add `motion-safe:` prefix for accessibility:
```tsx
className="... motion-safe:animate-pulse"
```

### 18. Placeholder `href="#"` Links

**Files:** `WhyUsdx.tsx:68` ("View Audit Reports"), `Footer.tsx:98` ("Terms & Conditions"), `socials.ts` (all 5 social links)

These are dead links on a financial product page. Replace with real URLs or remove before production.

---

## Positive Findings

### What the Project Does Well

1. **Zero XSS vectors** — No `dangerouslySetInnerHTML`, no `eval()`, no `innerHTML`. All content rendered through React JSX auto-escaping.

2. **All `target="_blank"` links have `rel="noopener noreferrer"`** — Correctly prevents reverse tabnapping across all 5 files with external links.

3. **Zero dependency vulnerabilities** — `pnpm audit` reports no issues. Minimal, well-maintained dependency tree.

4. **Clean architecture** — Flat component structure, data-driven rendering, minimal state (only Navbar + Faq use `useState`), no prop drilling, no context providers.

5. **No unnecessary abstractions** — No HOCs, no wrapper components, no base components, no shared utility functions. Each section is self-contained.

6. **No dead code** — No commented-out code, no unused files, no unused imports (verified by `tsc --noEmit` + manual review).

7. **Consistent component pattern** — All 8 sections follow the same template (section with id → max-width container → label → heading → content).

8. **TypeScript strict mode** — Enabled with `noUnusedLocals` and `noUnusedParameters` enforced.

9. **Data-content separation** — Feature cards, FAQ items, chain lists, and social links all live in typed data files separate from rendering logic.

10. **Alternating section backgrounds** — Consistent `bg-white` / `bg-gray-50` pattern maintained correctly throughout.

---

## OWASP Top 10 Compliance

| # | Category | Status |
|---|----------|--------|
| A01 | Broken Access Control | N/A (no auth) |
| A02 | Cryptographic Failures | PASS |
| A03 | Injection | PASS |
| A04 | Insecure Design | PASS |
| A05 | Security Misconfiguration | NEEDS WORK (CSP, headers) |
| A06 | Vulnerable Components | PASS (zero audit vulns) |
| A07 | Auth Failures | N/A |
| A08 | Data Integrity Failures | LOW RISK (external font CDN) |
| A09 | Logging/Monitoring | N/A (static site) |
| A10 | SSRF | N/A |

---

## Action Plan

| Priority | # | Issue | Effort |
|----------|---|-------|--------|
| P0 | 1 | Fix `JSX.Element` import (build is broken) | 2 min |
| P1 | 2 | Move font loading to HTML `<link>` with preconnect | 5 min |
| P1 | 3 | Type icon fields as string literal unions | 10 min |
| P1 | 4 | Add CSP meta tag to `index.html` | 5 min |
| P1 | 5 | Add security headers for production | 5 min |
| P2 | 6 | Extract shared nav links to data file | 5 min |
| P2 | 7 | Move WhyUsdx `points` to data file | 5 min |
| P2 | 8 | Add `passive: true` to scroll listener | 1 min |
| P2 | 9 | Add `will-change-transform` to marquee | 1 min |
| P2 | 10 | Switch FAQ to CSS-based show/hide | 10 min |
| P3 | 11-18 | Low-priority cleanup items | 15 min |

**Total estimated effort: ~65 minutes for all items.**
P0+P1 items (must-fix + should-fix): ~27 minutes.
