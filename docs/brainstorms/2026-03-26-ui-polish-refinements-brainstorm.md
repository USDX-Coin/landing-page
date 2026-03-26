---
date: 2026-03-26
topic: ui-polish-refinements
---

# UI Polish & Refinements

## What We're Building

A series of visual refinements to make the USDX landing page feel more premium, interactive, and polished. Focus areas: full-viewport hero, creative coin animation, brand-consistent colors, full-height sections, improved HowItWorks icons, and FAQ with white background + brand accents.

## Key Decisions

### 1. Header — USDX text matches logo color

- Change Navbar "USDX" text from `text-dark` to `text-primary` to match the teal logo
- Same change in Footer

### 2. Hero — Full viewport height (`min-h-screen`)

- Set hero section to `min-h-screen` so it fills the entire viewport on first load
- No content from the next section visible initially — clean first impression
- Center content vertically within the hero

### 3. Hero Coin — Proportional layout, creative animation, matches logo

- **Replace current SVG coin** with one that references the actual USDX logo pattern (the X inside a circle, matching `public/image/Logo.svg`)
- **Position**: Keep left text + right coin layout, but make it **proportional** — coin should not be clipped, properly sized to balance with the text side. Both sides should feel visually matched.
- **Layout balance**: Text area ~55%, coin area ~45%. Coin fully visible, vertically centered with the text block.
- **Animation ideas** (inspired by Tether's crypto icon constellation + IDRX's 3D coin):
  - Slow continuous rotation on Y-axis (CSS perspective + rotateY) for 3D feel
  - Floating orbit particles/dots around the coin (small circles orbiting)
  - Subtle glow pulse behind the coin (expanding/contracting radial glow)
  - The coin itself gently floats up and down (already have this)
- Keep it lightweight — CSS keyframes only, no JS

### 4. Hero Button — Hover effects

- "Get USDX" primary button: `hover:scale-105 hover:shadow-xl` transition
- "Learn More" text link: `hover:gap-3` (arrow moves right on hover)

### 5. WhyUsdx + Features — Full viewport height

- Both sections get `min-h-screen` and vertical centering (`flex items-center`)
- Content stays same, just more breathing room
- Feels more like distinct "pages" when scrolling

### 6. HowItWorks — Better icons + animation

- Replace flat line-art icons with more expressive 3D-style gradient icons:
  - Step 1 (Deposit): Credit card with gradient fill + shadow
  - Step 2 (Mint): Coin with sparkle/shine effect
  - Step 3 (Redeem): Arrow exchange with gradient
- Add subtle entrance animation: numbers count up or icons have a bounce-in
- Icon containers: larger (`w-16 h-16`), gradient background instead of `bg-white/10`

### 7. FAQ — White background with brand accents

- Change FAQ from dark gradient to **white background** (`bg-white`)
- Only footer stays dark
- Brand accents on FAQ:
  - Hover on question: left border accent `border-l-2 border-primary` appears
  - Expanded state: question text turns `text-primary`
  - Expanded answer area: subtle `bg-primary-light` background
  - Separator lines: `border-gray-200` (light theme)
- Chevron: turns `text-primary` when expanded

### 8. Section backgrounds (updated rhythm)

| Section | Background |
|---------|-----------|
| Hero | White + dot pattern (`min-h-screen`) |
| WhyUsdx | Gray-50 (`min-h-screen`) |
| Features | White (`min-h-screen`) |
| HowItWorks | Gradient teal (keep as-is) |
| Ecosystem | White |
| FAQ | **White** (was dark, now light with brand accents) |
| Footer | Dark (only dark section) |

## Open Questions

None — requirements are clear. Proceed directly to implementation.

## Next Steps

→ `/ce:work` for direct implementation (no plan doc needed — changes are straightforward UI tweaks)
