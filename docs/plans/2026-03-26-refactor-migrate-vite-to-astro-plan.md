---
title: "refactor: Migrate from Vite+React SPA to Astro static site"
type: refactor
status: active
date: 2026-03-26
origin: docs/brainstorms/2026-03-26-migrate-vite-to-astro-brainstorm.md
---

# Migrate from Vite+React to Astro

## Overview

Replace the Vite+React SPA with Astro static site for zero-JS-by-default, SEO (static HTML), and lighter bundles. Integrate real USDX logo and chain icons. Keep Navbar and FAQ as React islands. Replace Motion library with CSS animations + vanilla JS. Deploy to Netlify.

## Resolved Decisions

1. **Hero typewriter** → vanilla JS (inline `<script>` in .astro)
2. **Navbar** → keep as React island (`client:load`)
3. **Testing** → `astro build` + `astro preview` + agent-browser screenshots. No integration tests.
4. **Tailwind v4** → Use `@tailwindcss/vite` plugin in `vite.plugins` (NOT `@astrojs/tailwind`)
5. **Motion** → Remove entirely, replace with CSS transitions + IntersectionObserver script

---

## Phase 1: Scaffold Astro Project + Migrate Config

**Goal:** Set up Astro with React + Tailwind v4, create layout, verify build works.

### 1.1 Install Astro and integrations

```bash
pnpm add astro @astrojs/react
# Keep existing: react, react-dom, tailwindcss, @tailwindcss/vite
# Remove: motion, vite, @vitejs/plugin-react, eslint-plugin-react-refresh
```

### 1.2 Create `astro.config.mjs`

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### 1.3 Update `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

Delete `tsconfig.app.json` and `tsconfig.node.json`.

### 1.4 Update `package.json` scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "eslint ."
  }
}
```

### 1.5 Create `src/layouts/Layout.astro`

```astro
---
import "../styles/global.css";

interface Props {
  title?: string;
  description?: string;
}

const {
  title = "USDX — The Transparent & Regulated USD Stablecoin",
  description = "USDX is a fully-backed digital dollar, redeemable 1:1 for USD. Secured by US Treasury bonds and cash reserves.",
} = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### 1.6 Rename `src/index.css` → `src/styles/global.css`

Move the file. Add CSS animation classes (replacing Motion):

```css
@import "tailwindcss";

@theme {
  --color-primary: #1eaed5;
  --color-primary-dark: #1899bc;
  --color-primary-light: #e8f7fb;
  --color-dark: #1a1a2e;
  --color-primary-900: #0e7490;
  --color-primary-950: #0a4f5c;
  --font-sans: 'Inter', sans-serif;
  --animate-marquee: marquee 30s linear infinite;
  --animate-float: float 4s ease-in-out infinite;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Scroll-triggered animations */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll {
    opacity: 1;
    transform: none;
    transition: none;
  }
  html { scroll-behavior: auto; }
}
```

### 1.7 Create `src/pages/index.astro` (minimal)

```astro
---
import Layout from "../layouts/Layout.astro";
---
<Layout>
  <h1>USDX — Coming Soon</h1>
</Layout>
```

### 1.8 Create `netlify.toml`

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 1.9 Delete old Vite files

- `vite.config.ts`
- `index.html` (Astro generates its own)
- `src/main.tsx`
- `src/App.tsx`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `eslint.config.js` (recreate simpler one for Astro)

**Commit:** `refactor: scaffold Astro project with React + Tailwind v4`

**Verify:** `pnpm build` passes, `pnpm dev` starts, agent-browser shows placeholder page.

---

## Phase 2: Convert Static Sections to .astro

**Goal:** Convert 6 static components from React to Astro. Keep data files unchanged.

### 2.1 Update `src/data/chains.ts` — add icon paths

```ts
export interface Chain {
  name: string;
  shortName: string;
  icon: string; // path to SVG in public/icon/
}

export const chains: Chain[] = [
  { name: "Ethereum", shortName: "ETH", icon: "/icon/ethereum.svg" },
  { name: "BNB Smart Chain", shortName: "BSC", icon: "/icon/bnb.svg" },
  { name: "Polygon", shortName: "MATIC", icon: "/icon/polygon.svg" },
  { name: "Arbitrum", shortName: "ARB", icon: "/icon/arbitrum.svg" },
  { name: "Optimism", shortName: "OP", icon: "/icon/optimism.svg" },
  { name: "Avalanche", shortName: "AVAX", icon: "/icon/avalanche.svg" },
  { name: "Solana", shortName: "SOL", icon: "/icon/solana.svg" },
  { name: "Base", shortName: "BASE", icon: "/icon/base.svg" },
];
```

### 2.2 Convert Hero.tsx → Hero.astro

Key changes:
- Remove Motion imports and `motion.div` wrappers
- Use CSS classes `animate-on-scroll`, `animate-float` instead
- Typewriter: render all characters as `<span>` with `opacity: 0`, reveal via inline `<script>`
- Replace CSS coin circles with SVG coin (keep from Phase C)
- Use real logo reference where applicable
- Add `data-delay` attributes for stagger

### 2.3 Convert WhyUsdx.tsx → WhyUsdx.astro

- Import data in frontmatter: `import { whyUsdxPoints } from "../data/why-usdx";`
- Replace `motion.div` → plain `<div class="animate-on-scroll">`
- Add stagger delays: `style={\`transition-delay: ${index * 100}ms\`}`
- Replace Motion hover with Tailwind: `hover:-translate-y-1 hover:shadow-lg transition-all duration-300`
- Keep inline SVG iconMap as a function in frontmatter

### 2.4 Convert Features.tsx → Features.astro

Same pattern as WhyUsdx. Use stagger delays on cards.

### 2.5 Convert HowItWorks.tsx → HowItWorks.astro

- Gradient background stays (Tailwind classes)
- Steps data stays inline (already was inline)
- Stagger delays on step cards

### 2.6 Convert Ecosystem.tsx → Ecosystem.astro

- Use real chain icons: `<img src={chain.icon} alt={chain.name} class="w-8 h-8" />`
- Remove `chainColors` map (icons have their own colors)
- Marquee stays CSS-only (already was)

### 2.7 Convert Footer.tsx → Footer.astro

- Import navLinks and socials in frontmatter
- Replace `$` circle logo with `<img src="/image/Logo.svg" alt="USDX" class="w-8 h-8" />`
- Keep socialIcons as inline SVG (these are small)

**Commit:** `refactor: convert 6 static sections from React to Astro components`

**Verify:** `pnpm build` + agent-browser full-page screenshot comparison.

---

## Phase 3: Keep React Islands (Navbar + FAQ)

**Goal:** Adapt Navbar and FAQ as React islands with client directives.

### 3.1 Simplify Navbar.tsx for Astro

- Remove Motion imports
- Keep `useState` + `useEffect` for scroll detection and mobile menu
- Replace logo `$` circle with `<img src="/image/Logo.svg" />`
- Keep as `.tsx` file
- In `index.astro`: `<Navbar client:load />`

### 3.2 Simplify Faq.tsx for Astro

- Remove Motion imports
- Keep `useState` for accordion
- Use CSS transitions (already using `max-h` / `opacity`)
- In `index.astro`: `<Faq client:visible />`

**Commit:** `refactor: adapt Navbar and FAQ as React islands`

**Verify:** `pnpm build` + agent-browser: test navbar scroll shadow, mobile menu, FAQ accordion.

---

## Phase 4: Add Scroll Animation Script + Typewriter

**Goal:** Add the vanilla JS IntersectionObserver and typewriter scripts.

### 4.1 Create scroll observer script

In `Layout.astro` (before `</body>`):

```astro
<script>
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('visible'));
  }
</script>
```

### 4.2 Add typewriter script in Hero.astro

```astro
<script>
  const heading = document.getElementById('hero-heading');
  if (heading && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const spans = heading.querySelectorAll<HTMLSpanElement>('span[data-char]');
    spans.forEach((span, i) => {
      setTimeout(() => { span.style.opacity = '1'; }, i * 30 + 500);
    });
    // Hide cursor after typewriter completes
    const cursor = document.getElementById('hero-cursor');
    if (cursor) {
      setTimeout(() => { cursor.style.display = 'none'; }, spans.length * 30 + 2000);
    }
  } else {
    // Reduced motion: show all immediately
    document.querySelectorAll<HTMLSpanElement>('#hero-heading span[data-char]')
      .forEach(s => { s.style.opacity = '1'; });
  }
</script>
```

**Commit:** `feat: add vanilla JS scroll animations and typewriter effect`

**Verify:** `pnpm build` + agent-browser: scroll through page, verify animations trigger, typewriter works.

---

## Phase 5: Assemble Page + Cleanup + Netlify Verify

**Goal:** Wire everything in `index.astro`, remove old files, verify Netlify build.

### 5.1 Complete `src/pages/index.astro`

```astro
---
import Layout from "../layouts/Layout.astro";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero.astro";
import WhyUsdx from "../components/WhyUsdx.astro";
import Features from "../components/Features.astro";
import HowItWorks from "../components/HowItWorks.astro";
import Ecosystem from "../components/Ecosystem.astro";
import Faq from "../components/Faq";
import Footer from "../components/Footer.astro";
---
<Layout>
  <div class="min-h-screen bg-white">
    <Navbar client:load />
    <Hero />
    <WhyUsdx />
    <Features />
    <HowItWorks />
    <Ecosystem />
    <Faq client:visible />
    <Footer />
  </div>
</Layout>
```

### 5.2 Delete old files

- `src/App.tsx`
- `src/main.tsx`
- `index.html`
- `vite.config.ts`
- `tsconfig.app.json`
- `tsconfig.node.json`

### 5.3 Remove unused packages

```bash
pnpm remove motion @vitejs/plugin-react eslint-plugin-react-refresh vite @types/node
```

### 5.4 Update `package.json` — clean dependencies

Final dependencies should be:
- `astro`, `@astrojs/react`, `react`, `react-dom`
- `tailwindcss`, `@tailwindcss/vite`

Dev dependencies:
- `typescript`, `@types/react`, `@types/react-dom`
- `eslint` (optional, can simplify)

### 5.5 Update CLAUDE.md

Update project structure, commands, and conventions to reflect Astro.

**Commit:** `refactor: complete Astro migration, remove Vite/Motion, update docs`

**Verify:**
1. `pnpm build` — static HTML in `dist/`
2. `pnpm preview` — serves locally
3. Agent-browser full-page screenshot comparison with pre-migration screenshot
4. Check `dist/index.html` has full static HTML content (not empty `<div id="root">`)
5. Check JS bundle size (should be drastically smaller)
6. Netlify deploy (push to branch, verify build on Netlify)

---

## Acceptance Criteria

### Phase 1
- [ ] `astro build` produces `dist/` with static HTML
- [ ] `astro dev` starts dev server
- [ ] Tailwind v4 `@theme` tokens work
- [ ] `netlify.toml` exists with correct config

### Phase 2
- [ ] 6 sections render as static HTML (no JS shipped)
- [ ] Real chain icons from `public/icon/` displayed
- [ ] Real USDX logo from `public/image/Logo.svg` in Footer
- [ ] All Tailwind styles preserved (no visual regression)
- [ ] Stagger animation delays on cards

### Phase 3
- [ ] Navbar scroll shadow works (React `client:load`)
- [ ] Navbar mobile hamburger works
- [ ] FAQ accordion open/close works (React `client:visible`)
- [ ] Navbar uses real USDX logo

### Phase 4
- [ ] Scroll fade-in animations trigger on all sections
- [ ] Stagger delays work on card grids
- [ ] Hero typewriter animates character by character
- [ ] Cursor blinks then disappears
- [ ] `prefers-reduced-motion` respected

### Phase 5
- [ ] `dist/index.html` contains full static HTML content
- [ ] JS bundle size < 20KB gzipped (only React islands)
- [ ] All sections visually match pre-migration appearance
- [ ] Netlify build succeeds
- [ ] No `motion`, `vite`, `@vitejs/plugin-react` in dependencies

---

## Sources & References

### Origin

- **Brainstorm:** [docs/brainstorms/2026-03-26-migrate-vite-to-astro-brainstorm.md](../brainstorms/2026-03-26-migrate-vite-to-astro-brainstorm.md)
  - Key decisions: remove Motion, vanilla JS typewriter, React islands for Navbar+FAQ, static Netlify deploy

### Technical References

- Tailwind CSS v4 + Astro setup: use `@tailwindcss/vite` in `vite.plugins`, NOT `@astrojs/tailwind`
- Astro React integration: https://docs.astro.build/en/guides/integrations-guide/react/
- Astro client directives: https://docs.astro.build/en/reference/directives-reference/
- Astro inline scripts: https://docs.astro.build/en/guides/client-side-scripts/
- Deploy Astro to Netlify: https://docs.astro.build/en/guides/deploy/netlify/
- Astro tsconfig: `extends: "astro/tsconfigs/strict"` with `jsx: "react-jsx"`
