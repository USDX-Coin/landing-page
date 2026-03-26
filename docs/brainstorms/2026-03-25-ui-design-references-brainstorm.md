---
date: 2026-03-25
topic: ui-design-references
---

# UI Design References for USDX Landing Page Improvement

## What We're Building

A visual upgrade of the USDX landing page, inspired by two stablecoin competitor websites: **IDRX** (home.idrx.co) for animations and component patterns, and **Tether** (tether.to) for backgrounds, color depth, and premium feel. The goal is to elevate USDX from a functional landing page to a visually compelling, trust-building financial product page.

---

## Reference Analysis: IDRX (home.idrx.co)

### Hero Section
- **3D coin illustration** — Large, photorealistic 3D-rendered coin with metallic blue finish, shown at an angle with depth/perspective. Has a glossy reflection and shadow. Much more premium than our current CSS-drawn circles.
- **Clean left-right layout** — Text on left (60%), 3D coin on right (40%). Very similar to our current hero layout but with a real 3D asset instead of CSS art.
- **Typography** — Bold, black, all-caps heading "INDONESIAN RUPIAH-BACKED STABLECOIN". Very large (~52-60px). Body text is gray (#666), lighter weight.
- **CTAs** — Primary: solid blue pill button ("Get IDRX"). Secondary: text link with no border ("Read Docs"). Identical pattern to ours.
- **White background** — Clean, minimal hero. No gradient, no pattern. Relies on the 3D coin for visual impact.

### Supported Chains Section
- **Chain logos as actual colored icons** — Real protocol logos (not text placeholders like ours). Displayed in a horizontal row, centered. Each logo is ~40px, spaced evenly.
- **Label** — "SUPPORTED CHAIN" in gray uppercase tracking-widest, centered above icons.

### Ecosystem Section
- **Section label pattern** — Blue dot + "ECOSYSTEM" text, left-aligned, with a horizontal divider line below. This is a distinctive IDRX pattern for section headers.
- **Partner logos** — Full grayscale logos of exchanges (INDODAX, Nusa, Tokenomy, etc.) in a grid, not a marquee. Static layout, clean.

### Features Section (4-card grid)
- **Card design** — Rounded corners, subtle gray border, light shadow on hover. White background. No colored borders.
- **Icon style** — Blue/teal background circle with white line-art icon inside. ~48px icons. Very similar to our icon pattern.
- **Card structure** — Icon → Title (bold, black) → Description (gray, sm). Same as ours.
- **Grid** — 4 columns on desktop. Cards are wider/shorter than ours (more horizontal).

### Utility Section (3-card grid)
- **Illustration cards** — Each card has a LARGE custom illustration (~200px height) at the top, followed by title and description below.
- **Illustrations** — Blue monochrome, flat-style illustrations (Web3 cloud, balance scale, shield/checkmark). Custom vector art, not generic icons.
- **Title pattern** — First word in **blue**, rest in **black** ("**Web3** Financial Integration"). Adds visual hierarchy without extra elements.
- **Card design** — Light gray background (`~#f8f9fa`), rounded corners, no visible border.

### How It Works / Where to Get Section
- **Split layout** — Left: heading + description text. Right: large exchange logos in 2x2 grid.
- **Exchange logos** — Full brand logos (Aerodrome, INDODAX, Uniswap, PancakeSwap). Gray on white, not in cards.

### FAQ Section
- **Centered layout** — `max-w-[700px]`, centered heading.
- **Accordion** — Thin line separators between items (not card borders). Chevron on right. Blue accent line at the bottom of each separator.
- **Background** — Light gray/off-white (`#f8f9fa`).

### Footer
- **Dark background** — Near-black (`#1a1a2e` similar to ours).
- **Simple layout** — Logo + tagline on left. Social buttons on right ("Follow X", "Join Telegram") as pill buttons with icons.
- **Bottom bar** — Copyright + Terms & Conditions + "Back to Top" link.

### Animations Observed (from static screenshots)
- **3D coin** — Likely has subtle floating/rotation animation on the hero coin.
- **Scroll-triggered content** — Sections appear to fade/slide in on scroll (content areas were blank in full-page screenshot, suggesting lazy animation loading).
- **Large whitespace sections** — Between hero and content there are large empty areas that likely have animated content that loads on scroll.

---

## Reference Analysis: Tether (tether.to)

### Hero Section
- **Typewriter effect** — Heading animates with a typewriter/cursor effect: "Tether token / The World's First / Stableco|" (cursor blinking). Premium and attention-grabbing.
- **Background pattern** — Subtle, light gray geometric pattern with abstract crypto/blockchain icons (shields, diamonds, currency symbols). Low opacity (~10-15%), adds texture without distraction.
- **Transparent navbar** — Navbar sits on top of the hero background. Clean, minimal. Logo on left, links centered, "Sign Up" teal button with rounded border on right.
- **Color scheme** — Teal/gold as primary (`#1a9e8f` teal, `#c49b5c` gold). Dark charcoal for text. Very distinctive.

### "Driving the Future of Money" Section
- **Large circular teal illustration** — Custom icon inside a big teal circle (~300px diameter). The Tether diamond logo with a ring effect.
- **Split layout** — Illustration on left, text on right. Long paragraph describing the product. CTA: "Learn How Tether Works" as outlined button.
- **Clean white background** with generous spacing.

### "100% Backed and Fully Transparent" Section
- **Full-width teal/gray gradient background** — This is Tether's signature look. A large section with a gray-teal gradient background covering the entire viewport width.
- **Abstract geometric shapes** — Large leaf/petal shapes in darker and lighter teal tones create an artistic, organic composition. The Tether logo and $ symbol are embedded within these shapes.
- **Text on left** — White heading on teal background. Gray body text. Outlined CTA button ("Go to Transparency Page").
- **Art direction** — The geometric/organic shapes are NOT random. They form a pinwheel/flower pattern with the Tether logo integrated. This is bespoke brand art.

### "Widespread Adoption" Section
- **Exchange logo marquee** — Partner logos (OKCoin, OKX, Poloniex, Poolin, Binance) in a horizontal scrolling ticker. Grayscale logos on light gray background strip.
- **Text-centered** — Long paragraph above the logos, centered text.

### "The Token Disrupting Global Finance" Section
- **3-column use case cards** — "Tether for Individuals", "Tether for Merchants", "Tether for Exchanges". Each with icon, heading, description.
- **Icons** — Simple line-art icons in the brand gold/teal color.
- **White background**, clean spacing.

### FAQ Section
- **Dark teal background** — Full-width dark teal (`~#1a7a6d` or similar) background for the entire FAQ section. Text is light/gold.
- **Background art** — Subtle large geometric shapes (same style as transparency section) visible in the dark teal background at low opacity.
- **Accordion** — Gold heading text for questions. Thin line separators. Expanded answer text in lighter gray.
- **Distinct CTA** — "Read all FAQs" button centered below accordion, outlined style.

### Footer
- **Very dark background** — Near-black with slight teal undertone.
- **Multi-column mega footer** — 5 columns: Tether, Company, Resources, Products, Solutions. Each with 5-8 links.
- **Brand statement** — Large heading "Driving the Future of Money" on the left side of footer, creating visual weight.
- **Comprehensive link structure** — Much more extensive than IDRX or our current footer.

### Key Design Patterns from Tether
- **Colored section backgrounds** — Not just white/gray alternation. Full teal sections, gradient sections, dark sections. Creates dramatic visual rhythm.
- **Geometric/organic brand shapes** — Large abstract shapes in the background that incorporate the brand logo. Not generic blobs.
- **Typewriter animation** — Hero text animates character by character.
- **Gold accent color** — Uses gold/amber as secondary accent alongside teal.
- **Serious typography** — Larger font sizes, more weight variation. Headings feel authoritative.

---

## Improvement Opportunities for USDX

### From IDRX (animations & components)

| Element | IDRX Pattern | USDX Improvement |
|---------|-------------|------------------|
| **Hero coin** | 3D rendered metallic coin | Replace CSS circles with 3D-looking coin (CSS or SVG with gradients/shadows) |
| **Section labels** | Blue dot + text + divider line | Add dot indicators and horizontal rules to section headers |
| **Feature icons** | Larger custom illustrations | Upgrade from tiny line icons to larger, more distinctive illustrations |
| **Utility cards** | Large illustration + split-color title | Add "highlight first word" pattern to card titles |
| **Chain logos** | Real protocol logos (colored) | Replace text abbreviations with actual chain logos or better SVG icons |
| **Scroll animations** | Fade-in on scroll (IntersectionObserver) | Add scroll-triggered entrance animations to all sections |
| **FAQ separators** | Thin colored lines, not card borders | Simplify FAQ to line-separated items instead of bordered cards |

### From Tether (backgrounds & premium feel)

| Element | Tether Pattern | USDX Improvement |
|---------|---------------|------------------|
| **Hero background** | Subtle geometric pattern with crypto icons | Add a low-opacity SVG pattern/grid behind the hero |
| **Typewriter effect** | Animated heading with cursor | Add typewriter or text reveal animation to hero heading |
| **Colored sections** | Full teal/dark background sections | Make WhyUsdx or HowItWorks use a full brand-colored background |
| **Background shapes** | Large abstract geometric/organic shapes | Add subtle large decorative shapes behind key sections |
| **FAQ section** | Dark teal background with light text | Make FAQ use a dark/colored background instead of gray-50 |
| **Footer** | Mega footer with brand statement | Add a large brand tagline in footer, expand link columns |
| **Gradient sections** | Multi-tone teal gradients | Add gradient overlays to at least one section |
| **Text animation** | Content appears on scroll | Add staggered fade-in for cards and text blocks |

---

## Specific Animation Recommendations

### 1. Scroll-Triggered Entrance Animations
- **Fade up** — Elements fade in and slide up 20-30px on scroll into view
- **Staggered cards** — Feature/chain cards animate in sequence (100ms delay between each)
- **Implementation** — IntersectionObserver + CSS classes, no animation library needed

### 2. Hero Animations
- **Typewriter heading** — Animate the heading text character by character, with a blinking cursor
- **Coin float** — Subtle up/down float animation on the hero coin (slower than current pulse)
- **Fade-in entrance** — Hero content fades in on page load with slight upward slide

### 3. Counter/Stats Animation
- **Animated numbers** — If we add stats (e.g., "Total Supply", "Chains Supported"), use counting animation
- **Trigger** — Start when section enters viewport

### 4. Hover Micro-interactions
- **Cards** — Slight lift (translateY -4px) + shadow increase on hover
- **Buttons** — Scale(1.02) + color transition on hover
- **Chain logos** — Grayscale to color on hover

### 5. Background Effects
- **Subtle grid/dot pattern** — Low-opacity SVG pattern behind hero section
- **Gradient mesh** — Soft teal glow in corners of hero area
- **Decorative shapes** — Large semi-transparent circles or abstract shapes positioned behind sections (using absolute positioning + blur)

---

## Open Questions

1. **3D Coin asset** — Should we create a CSS/SVG 3D-looking coin, or use a flat modern design? IDRX uses a full 3D render. We could do a CSS approximation with gradients and shadows.
2. **Animation library** — Pure CSS + IntersectionObserver (lightweight), or use Framer Motion (more capable but adds ~30KB to bundle)?
3. **Color sections** — Which section should get the full brand-color background treatment? Options: (a) WhyUsdx, (b) HowItWorks, (c) FAQ, (d) a new CTA section before footer.
4. **Scope** — Implement all improvements at once, or prioritize in phases? Recommended phases:
   - Phase A: Scroll animations + hover effects (biggest visual impact, no layout changes)
   - Phase B: Background patterns + gradient sections (visual depth)
   - Phase C: Hero upgrade (typewriter + better coin illustration)
   - Phase D: Component redesign (FAQ style, chain logos, card illustrations)

## Next Steps

→ Answer open questions above, then `/ce:plan` for detailed implementation
