---
title: "feat: UI Design Improvements — Animations, Backgrounds, Hero Upgrade, Component Redesign"
type: feat
status: active
date: 2026-03-25
origin: docs/brainstorms/2026-03-25-ui-design-references-brainstorm.md
---

# UI Design Improvements

Visual upgrade of the USDX landing page inspired by IDRX (animations, component patterns) and Tether (backgrounds, color depth, premium feel). Four phases, each independently committable and verifiable.

## Resolved Decisions (from brainstorm)

1. **3D Coin** → SVG approximation with gradients, shadows, and perspective transforms
2. **Animation library** → `motion` package (formerly Framer Motion), import from `"motion/react"`
3. **Brand-color sections** → Creative choice: HowItWorks gets gradient teal bg, FAQ gets dark brand bg
4. **Phasing** → A → B → C → D, commit + verify per phase

---

## Phase A: Install Motion + Scroll Animations + Hover Effects

**Goal:** Biggest visual impact with no layout changes. Every section animates in on scroll, cards stagger, hover micro-interactions.

### A1. Install `motion` and configure App.tsx

**File:** `package.json` (add dependency)

```bash
pnpm add motion
```

**File:** `src/App.tsx`

Wrap all sections with `MotionConfig` for reduced-motion accessibility:

```tsx
import { MotionConfig } from "motion/react"

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        {/* ... all sections ... */}
      </div>
    </MotionConfig>
  )
}
```

### A2. Add scroll-triggered fade-in to all section components

**Files:** `WhyUsdx.tsx`, `Features.tsx`, `HowItWorks.tsx`, `Ecosystem.tsx`, `Faq.tsx`

Pattern for each section — wrap the section content container with `motion.div`:

```tsx
import { motion } from "motion/react"

// Wrap the inner content (not the <section> itself to preserve semantic HTML)
<section id="..." className="py-24 px-6 bg-white">
  <motion.div
    className="max-w-[1200px] mx-auto"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    {/* section content */}
  </motion.div>
</section>
```

Key rules:
- `viewport.once: true` — animate only first time (no re-trigger on scroll back)
- `viewport.amount: 0.2` — trigger when 20% visible
- `duration: 0.6` — smooth but not sluggish
- Do NOT animate the `<section>` element itself (breaks scroll anchoring)

### A3. Add staggered card animations

**Files:** `Features.tsx`, `WhyUsdx.tsx`, `Ecosystem.tsx` (chain grid)

Use variants pattern for stagger:

```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

// Parent grid
<motion.div
  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  {features.map((feature) => (
    <motion.div key={feature.title} variants={cardVariants} className="...">
      {/* card content */}
    </motion.div>
  ))}
</motion.div>
```

### A4. Add hover micro-interactions to cards

**Files:** `Features.tsx`, `WhyUsdx.tsx`, `Ecosystem.tsx`

Replace static hover classes with Motion hover:

```tsx
<motion.div
  whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  className="p-8 rounded-xl border border-gray-100"
>
```

Remove Tailwind `hover:shadow-md` from cards — Motion handles it now.

### A5. Add Hero entrance animation on page load

**File:** `Hero.tsx`

Use `animate` (not `whileInView`) for hero since it's above the fold:

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  className="flex-1 text-center md:text-left"
>
  {/* heading, description, CTAs */}
</motion.div>

<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
  className="flex-shrink-0"
>
  {/* coin illustration */}
</motion.div>
```

### A6. Replace Hero pulse with gentle float

**File:** `Hero.tsx`

Replace `motion-safe:animate-pulse` on outer ring with Motion float:

```tsx
<motion.div
  animate={{ y: [0, -8, 0] }}
  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  className="relative w-64 h-64 md:w-80 md:h-80"
>
  {/* coin rings and inner coin */}
</motion.div>
```

**Commit:** `feat: add Motion scroll animations, staggered cards, hover effects, hero entrance`

**Verify:** `pnpm build && pnpm lint` then `agent-browser screenshot --full /tmp/usdx-phase-a.png`

---

## Phase B: Background Patterns + Gradient Sections

**Goal:** Add visual depth via brand-colored section backgrounds, subtle patterns, and decorative shapes. Transform flat white/gray alternation into a more dynamic visual rhythm.

### B1. Add new theme tokens

**File:** `src/index.css`

```css
@theme {
  /* existing tokens... */
  --color-primary-900: #0e7490;
  --color-primary-950: #0a4f5c;
}
```

### B2. HowItWorks — Gradient brand background

**File:** `src/components/HowItWorks.tsx`

Change from `bg-gray-50` to a branded gradient:

```tsx
<section id="how-it-works" className="py-24 px-6 bg-gradient-to-br from-primary to-primary-900 relative overflow-hidden">
  {/* Decorative circle shapes */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

  <div className="max-w-[1200px] mx-auto relative z-10">
    {/* Update text colors: headings → text-white, body → text-white/80 */}
    {/* Update number circles: bg-white text-primary instead of bg-primary text-white */}
    {/* Update icon boxes: bg-white/10 instead of bg-primary-light */}
    {/* Update connector line: bg-white/20 instead of bg-primary/20 */}
  </div>
</section>
```

### B3. FAQ — Dark brand background

**File:** `src/components/Faq.tsx`

Change from `bg-gray-50` to dark brand:

```tsx
<section id="faq" className="py-24 px-6 bg-dark relative overflow-hidden">
  {/* Subtle decorative shape */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

  <div className="max-w-[800px] mx-auto relative z-10">
    {/* Update: label → text-primary, heading → text-white */}
    {/* Update: accordion items → bg-white/5 border-white/10 */}
    {/* Update: question text → text-white, answer → text-gray-400 */}
    {/* Update: chevron → text-gray-500 */}
  </div>
</section>
```

### B4. Hero — Subtle background pattern

**File:** `src/components/Hero.tsx`

Add a low-opacity SVG dot grid pattern behind the hero:

```tsx
<section className="pt-40 pb-20 px-6 bg-white relative overflow-hidden">
  {/* Dot grid pattern */}
  <div
    className="absolute inset-0 opacity-[0.03]"
    style={{
      backgroundImage: "radial-gradient(circle, #1eaed5 1px, transparent 1px)",
      backgroundSize: "24px 24px",
    }}
  />
  {/* Gradient glow */}
  <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

  <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
    {/* existing content */}
  </div>
</section>
```

### B5. WhyUsdx — Add decorative accent

**File:** `src/components/WhyUsdx.tsx`

Keep `bg-gray-50` but add a subtle gradient accent at the top:

```tsx
<section id="why-usdx" className="py-24 px-6 bg-gray-50 relative overflow-hidden">
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
  {/* ... existing content ... */}
</section>
```

**Commit:** `feat: add brand gradient backgrounds, decorative shapes, hero dot pattern`

**Verify:** `pnpm build && pnpm lint` then `agent-browser screenshot --full /tmp/usdx-phase-b.png`

---

## Phase C: Hero Upgrade — Typewriter + SVG 3D Coin

**Goal:** Replace the CSS circle illustration with a premium SVG coin, and add a typewriter animation to the heading.

### C1. Create SVG 3D coin component

**File:** `src/components/Hero.tsx` (inline, following "no premature abstractions" rule)

The SVG coin uses radial/linear gradients for a 3D metallic look with the $ symbol:

```tsx
const CoinSVG = (
  <svg viewBox="0 0 200 200" className="w-64 h-64 md:w-80 md:h-80">
    <defs>
      {/* Outer ring gradient */}
      <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1eaed5" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#1899bc" stopOpacity="0.1" />
      </linearGradient>
      {/* Main coin face gradient (3D effect) */}
      <radialGradient id="coinFace" cx="40%" cy="35%">
        <stop offset="0%" stopColor="#22c5e8" />
        <stop offset="50%" stopColor="#1eaed5" />
        <stop offset="100%" stopColor="#1580a0" />
      </radialGradient>
      {/* Coin edge gradient (thickness illusion) */}
      <linearGradient id="coinEdge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1899bc" />
        <stop offset="100%" stopColor="#0e6b82" />
      </linearGradient>
      {/* Highlight */}
      <radialGradient id="highlight" cx="35%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Outer ring */}
    <circle cx="100" cy="100" r="95" fill="none" stroke="url(#ring)" strokeWidth="2" />
    <circle cx="100" cy="100" r="85" fill="none" stroke="url(#ring)" strokeWidth="1" />

    {/* Coin edge (3D thickness) */}
    <ellipse cx="100" cy="108" rx="72" ry="72" fill="url(#coinEdge)" />

    {/* Coin face */}
    <circle cx="100" cy="100" r="72" fill="url(#coinFace)" />

    {/* Highlight overlay */}
    <circle cx="100" cy="100" r="72" fill="url(#highlight)" />

    {/* Inner ring detail */}
    <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />

    {/* $ symbol */}
    <text x="100" y="112" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="52" fill="white">$</text>

    {/* USDX label */}
    <text x="100" y="132" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="11" fill="white" opacity="0.8">USDX</text>

    {/* Shadow */}
    <ellipse cx="100" cy="185" rx="50" ry="8" fill="black" opacity="0.08" />
  </svg>
)
```

Replace the entire coin illustration `<div>` with:

```tsx
<motion.div
  animate={{ y: [0, -8, 0] }}
  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  className="flex-shrink-0"
>
  {CoinSVG}
</motion.div>
```

### C2. Typewriter heading animation

**File:** `src/components/Hero.tsx`

Replace the static `<h1>` with a typewriter effect:

```tsx
const headingParts = [
  { text: "The Transparent & Regulated ", color: "text-dark" },
  { text: "USD Stablecoin", color: "text-primary" },
]

// In JSX:
<motion.h1
  className="text-3xl md:text-5xl lg:text-[52px] font-bold leading-tight tracking-tight"
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.03, delayChildren: 0.5 } },
  }}
>
  {headingParts.map((part) =>
    part.text.split("").map((char, i) => (
      <motion.span
        key={`${part.text}-${i}`}
        className={part.color}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.01 } },
        }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))
  )}
  {/* Blinking cursor */}
  <motion.span
    className="text-primary"
    animate={{ opacity: [1, 0] }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "steps(1)" }}
  >
    |
  </motion.span>
</motion.h1>
```

### C3. Stagger hero CTAs

**File:** `src/components/Hero.tsx`

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 1.8 }}
  className="mt-8 flex flex-col sm:flex-row items-center gap-4 ..."
>
  {/* Get USDX button + Learn More link */}
</motion.div>
```

**Commit:** `feat: add SVG 3D coin illustration and typewriter hero heading`

**Verify:** `pnpm build && pnpm lint` then `agent-browser screenshot /tmp/usdx-phase-c.png`

---

## Phase D: Component Redesign — FAQ Style, Chain Logos, Section Labels

**Goal:** Refine individual component designs inspired by IDRX and Tether patterns.

### D1. FAQ redesign — line separators instead of card borders

**File:** `src/components/Faq.tsx`

Change from bordered cards to clean line-separated items (IDRX style), on the dark background from Phase B:

```tsx
{faqItems.map((item, index) => (
  <motion.div
    key={item.question}
    variants={cardVariants}
    className="border-b border-white/10 last:border-b-0"
  >
    <button className="w-full flex items-center justify-between py-6 text-left bg-transparent border-none cursor-pointer">
      <span className="text-white font-semibold pr-4">{item.question}</span>
      {/* chevron in text-gray-500 */}
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${
      openIndex === index ? "max-h-96 pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"
    }`}>
      <p className="text-gray-400 leading-relaxed">{item.answer}</p>
    </div>
  </motion.div>
))}
```

### D2. Chain logos — SVG circle icons with abbreviation (improved)

**File:** `src/components/Ecosystem.tsx`

Give each chain a distinct color based on their brand, with a more polished card:

```tsx
const chainColors: Record<string, string> = {
  ETH: "#627EEA",
  BSC: "#F0B90B",
  MATIC: "#8247E5",
  ARB: "#28A0F0",
  OP: "#FF0420",
  AVAX: "#E84142",
  SOL: "#9945FF",
  BASE: "#0052FF",
}

// In each chain card:
<motion.div
  variants={cardVariants}
  whileHover={{ y: -4 }}
  className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 bg-white"
>
  <div
    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
    style={{ backgroundColor: `${chainColors[chain.shortName]}15` }}
  >
    <span
      className="font-bold text-xs"
      style={{ color: chainColors[chain.shortName] }}
    >
      {chain.shortName}
    </span>
  </div>
  <span className="text-dark font-medium text-sm">{chain.name}</span>
</motion.div>
```

### D3. Section labels — dot indicator + divider line (IDRX pattern)

**Files:** All section components (WhyUsdx, Features, HowItWorks, Ecosystem, Faq)

Replace the plain label with the dot + line pattern:

```tsx
{/* Before: */}
<p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">LABEL</p>

{/* After: */}
<div className="flex items-center gap-3 mb-6">
  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
  <span className="text-primary font-semibold text-sm uppercase tracking-widest">LABEL</span>
</div>
<div className="h-px bg-gray-200 mb-8" />
```

For dark-background sections (HowItWorks, FAQ), adjust: `bg-white/20` for divider.

### D4. Feature cards — highlight first word in title

**File:** `src/components/Features.tsx`

```tsx
<h3 className="text-lg font-semibold text-dark mb-3">
  <span className="text-primary">{feature.title.split(" ")[0]}</span>{" "}
  {feature.title.split(" ").slice(1).join(" ")}
</h3>
```

### D5. Footer — add brand tagline

**File:** `src/components/Footer.tsx`

Add a large brand statement on the left side of the footer (Tether pattern):

Before the bottom bar, add:

```tsx
<div className="mb-12">
  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
    The Future of<br />
    <span className="text-primary">Digital Dollars</span>
  </h3>
</div>
```

**Commit:** `feat: redesign FAQ, chain logos, section labels, feature card titles, footer tagline`

**Verify:** `pnpm build && pnpm lint` then `agent-browser screenshot --full /tmp/usdx-phase-d.png`

---

## Acceptance Criteria

### Phase A
- [ ] `motion` package installed, `MotionConfig reducedMotion="user"` wraps app
- [ ] All sections (except Navbar) fade-in on scroll with `whileInView`
- [ ] Feature, WhyUsdx, and chain cards stagger in with 100ms delay
- [ ] Cards have spring hover effect (lift + shadow)
- [ ] Hero text and coin animate on page load
- [ ] Hero coin floats instead of pulsing
- [ ] `pnpm build` passes, `pnpm lint` passes

### Phase B
- [ ] HowItWorks has gradient teal-to-dark-teal background with decorative circles
- [ ] FAQ has dark brand background with subtle glow
- [ ] Hero has dot-grid pattern and gradient glow
- [ ] WhyUsdx has top accent gradient line
- [ ] All text colors adjusted for contrast on new backgrounds
- [ ] `pnpm build` passes, `pnpm lint` passes

### Phase C
- [ ] SVG coin replaces CSS circles — has 3D gradients, shadow, metallic look
- [ ] Typewriter animation on hero heading with blinking cursor
- [ ] Cursor disappears or stops blinking after animation completes
- [ ] `pnpm build` passes, `pnpm lint` passes

### Phase D
- [ ] FAQ uses line separators instead of card borders
- [ ] Chain logos have brand-colored backgrounds
- [ ] All sections have dot + label + divider pattern
- [ ] Feature card titles have first-word highlighting
- [ ] Footer has brand tagline
- [ ] `pnpm build` passes, `pnpm lint` passes

## Sources & References

### Origin

- **Brainstorm document:** [docs/brainstorms/2026-03-25-ui-design-references-brainstorm.md](../brainstorms/2026-03-25-ui-design-references-brainstorm.md) — Key decisions: SVG coin, Framer Motion, phased approach, creative brand-color sections

### Technical References

- Motion (Framer Motion) docs: https://motion.dev/docs/react
- Package: `motion` (not `framer-motion`), import from `"motion/react"`
- React accessibility / reduced motion: https://motion.dev/docs/react-accessibility
- Bundle size optimization: https://motion.dev/docs/react-reduce-bundle-size

### Design References

- IDRX (home.idrx.co) — scroll animations, section labels, card patterns, 3D coin
- Tether (tether.to) — brand-colored backgrounds, typewriter effect, geometric shapes, dark FAQ
