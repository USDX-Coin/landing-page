---
date: 2026-03-26
topic: migrate-vite-to-astro
---

# Migrate from Vite+React to Astro

## What We're Building

Migrate the USDX landing page from the current Vite+React SPA to Astro for better performance (zero JS by default), SEO (static HTML output), and lighter bundle. Also integrate the real logo (`public/image/Logo.svg`) and chain icons (`public/icon/*.svg`) that have been added to the repo. The result must build and deploy correctly on Netlify.

## Why Astro

### Current Problems with Vite+React SPA

1. **SEO** — SPA renders client-side. Search engine crawlers see an empty `<div id="root">`. No server-rendered HTML, no meta tags in the actual HTML output. Google can index JS-rendered content but it's slower and less reliable.
2. **Bundle size** — 339KB JS (107KB gzipped) shipped to every visitor for a page that is 95% static content. React runtime alone is ~140KB. Only 2 components use state (Navbar scroll + FAQ accordion).
3. **Performance** — Time to Interactive is bottlenecked by JS parse/execute. The entire React tree must hydrate before the page is interactive, even though most sections are purely static.
4. **Icons** — 8 chain SVG icons and a logo SVG have been added to `public/` but aren't integrated yet. In Astro these can be directly used as components (no JS overhead).

### Why Astro Specifically

| Feature | Vite+React (current) | Astro |
|---------|---------------------|-------|
| Default JS shipped | All React runtime + app code (~107KB gz) | **0 KB** (static HTML) |
| SEO | Client-rendered, needs workarounds | **Static HTML** by default |
| Partial hydration | N/A (all-or-nothing) | **Islands architecture** — only interactive components ship JS |
| Tailwind CSS | Via Vite plugin | **First-class integration** (`@astrojs/tailwind`) |
| Build output | SPA (single HTML + JS bundle) | **Static site** (pre-rendered HTML per page) |
| Netlify deploy | Works | **Works** (static output, or with `@astrojs/netlify` adapter) |
| React components | Everything is React | **Opt-in** — only Navbar and FAQ need React (interactive) |

### What Changes, What Stays

**Stays the same:**
- All Tailwind classes and theme tokens (`index.css`)
- All data files (`src/data/*.ts`) — Astro supports TypeScript natively
- Component visual output and styling
- SVG icon maps and content
- `public/` folder structure (Astro uses same convention)
- Netlify deployment (just static files)

**Changes:**
- 6 of 8 section components convert from `.tsx` React to `.astro` (static, no JS)
- 2 components stay React with `client:visible` directive (Navbar, FAQ — need `useState`)
- `motion` animations on static sections convert to CSS-only (`@keyframes` + `IntersectionObserver` in a tiny vanilla script, or Astro `ViewTransitions`)
- Hero typewriter can stay as a React island (`client:load`) or convert to vanilla JS
- `App.tsx` replaced by `src/pages/index.astro`
- `main.tsx` removed (no React entry point)
- `vite.config.ts` replaced by `astro.config.mjs`
- Motion package likely removed (saves ~25KB gz) — replaced by CSS animations + a small intersection observer script

## Key Decisions

### 1. Motion (Framer Motion) → CSS + Vanilla JS

**Decision:** Remove `motion` package entirely. Replace with:
- CSS `@keyframes` for: float animation, marquee, typewriter cursor blink
- CSS `animation` + `IntersectionObserver` for: scroll-triggered fade-in, stagger
- Tiny inline `<script>` (~20 lines) for IntersectionObserver logic
- Tailwind `hover:` utilities for card hover effects (already existed before Motion)

**Rationale:** Motion adds ~25KB gzipped. Its only use is scroll animations and hover effects — both achievable with CSS. Astro's philosophy is zero-JS-by-default; shipping a React animation library contradicts this. The scroll fade-in can be done with a ~500 byte vanilla script.

### 2. Which Components Stay React (Islands)

| Component | Interactive? | Framework | Directive |
|-----------|-------------|-----------|-----------|
| Navbar | Yes (scroll state, mobile menu) | React | `client:load` |
| Hero | Typewriter animation | Astro + inline script | — |
| WhyUsdx | No | Astro | — |
| Features | No | Astro | — |
| HowItWorks | No | Astro | — |
| Ecosystem | No (marquee is CSS) | Astro | — |
| Faq | Yes (accordion state) | React | `client:visible` |
| Footer | No | Astro | — |

**Only 2 React islands:** Navbar (needs `client:load` for immediate scroll detection) and FAQ (can use `client:visible` to defer hydration until visible).

### 3. Integrate Real Icons and Logo

**New assets available:**
- `public/image/Logo.svg` — USDX brand logo (teal circle + X pattern)
- `public/icon/{ethereum,bnb,polygon,arbitrum,optimism,avalanche,solana,base}.svg` — chain logos

**Integration plan:**
- Replace the CSS `$` circle logo in Navbar/Footer with `<img src="/image/Logo.svg">`
- Replace text abbreviation circles in Ecosystem chain cards with `<img src="/icon/{chain}.svg">`
- Update `src/data/chains.ts` to include an `icon` field mapping to file paths

### 4. SEO Enhancements

Astro enables proper SEO that was impossible with the SPA:
- Static HTML output — crawlers get full content
- Add Open Graph meta tags (`og:title`, `og:description`, `og:image`)
- Add structured data (JSON-LD for Organization)
- Proper `<head>` management via Astro's built-in `<head>` in layouts
- Sitemap generation via `@astrojs/sitemap`

### 5. Netlify Deployment

**Decision:** Use static output mode (default Astro behavior), no SSR adapter needed.

- Astro builds to `dist/` with static HTML/CSS/JS
- Netlify auto-detects Astro projects, or configure:
  ```toml
  # netlify.toml
  [build]
    command = "npm run build"
    publish = "dist"
  ```
- No `@astrojs/netlify` adapter needed (that's for SSR only)
- The existing Netlify deployment just needs the build command updated

### 6. CSS Animation Strategy (replacing Motion)

**Scroll fade-in:**
```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
```

```html
<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
</script>
```

**Stagger:** Add `transition-delay` via inline style or Tailwind arbitrary values:
```html
<div class="animate-on-scroll" style="transition-delay: 0ms">Card 1</div>
<div class="animate-on-scroll" style="transition-delay: 100ms">Card 2</div>
<div class="animate-on-scroll" style="transition-delay: 200ms">Card 3</div>
```

**Hero typewriter:** Pure CSS + inline script (~15 lines) that reveals characters with `setTimeout`.

**Hover effects:** Tailwind `hover:-translate-y-1 hover:shadow-lg transition-all duration-300`.

## Project Structure (Target)

```
├── astro.config.mjs          # Astro config (replaces vite.config.ts)
├── netlify.toml               # Netlify build config
├── package.json               # Updated deps
├── tsconfig.json              # Astro tsconfig
├── public/
│   ├── favicon.svg
│   ├── icon/                  # Chain SVG icons (8 files)
│   └── image/                 # Logo SVG
├── src/
│   ├── layouts/
│   │   └── Layout.astro       # HTML shell (<html>, <head>, <body>)
│   ├── pages/
│   │   └── index.astro        # Main page (replaces App.tsx)
│   ├── components/
│   │   ├── Navbar.tsx          # React island (client:load)
│   │   ├── Hero.astro          # Static + inline typewriter script
│   │   ├── WhyUsdx.astro       # Static
│   │   ├── Features.astro      # Static
│   │   ├── HowItWorks.astro    # Static
│   │   ├── Ecosystem.astro     # Static
│   │   ├── Faq.tsx             # React island (client:visible)
│   │   └── Footer.astro        # Static
│   ├── data/                   # Same TypeScript data files
│   │   ├── navigation.ts
│   │   ├── features.ts
│   │   ├── why-usdx.ts
│   │   ├── faq.ts
│   │   ├── chains.ts
│   │   └── socials.ts
│   └── styles/
│       └── global.css          # Tailwind + theme tokens + animations (replaces index.css)
└── docs/                       # Same docs folder
```

## Open Questions

1. **Hero typewriter** — Keep as React island (`client:load`) for the existing Motion typewriter, or rewrite as vanilla JS? Vanilla is lighter but more work. I recommend vanilla JS since it's a one-time animation.

2. **Navbar** — The scroll shadow and mobile hamburger require client-side state. Keep as React island. Could also be rewritten as vanilla JS (`<script>` tag in `.astro` file) to eliminate React entirely, but this adds maintenance cost. Recommendation: keep React for now, consider vanilla later.

3. **prefers-reduced-motion** — Currently handled by `MotionConfig reducedMotion="user"`. After migration, need to add `@media (prefers-reduced-motion: reduce)` CSS rules to disable animations. Also wrap IntersectionObserver in a `prefers-reduced-motion` check.

4. **Testing strategy** — No test framework currently exists. Should we add Playwright for visual regression testing before migration, to verify pixel-perfect output? Or just use agent-browser screenshots as before/after comparison?

## Next Steps

→ Answer open questions, then `/ce:plan` for phased implementation
