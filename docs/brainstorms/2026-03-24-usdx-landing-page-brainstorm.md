---
date: 2026-03-24
topic: usdx-landing-page
---

# USDX Stablecoin Landing Page

## What We're Building

A single-page responsive landing page for **USDX**, a USD-pegged stablecoin positioned as **"The Transparent & Regulated USD Stablecoin"**. Built with **React + Vite**, targeting a general audience (retail users, institutions, and developers). The design follows a clean & minimal style inspired by IDRX (home.idrx.co), using brand color **#1eaed5**.

## Key Decisions

- **Positioning**: Transparent & Regulated — emphasis on trust, compliance, full backing by USD cash & US Treasury bonds with audit reports
- **Tech Stack**: React + Vite (SPA, lightweight, fast dev) — NOT Next.js
- **Design Style**: Clean & minimal (IDRX-inspired) — lots of whitespace, simple cards, straightforward layout
- **Language**: English only
- **Brand Color**: #1eaed5
- **Brand Name**: USDX

## Page Structure (Top to Bottom)

### 1. Navigation
- USDX logo (left)
- Menu: Why USDX, Features, How it Works, Ecosystem
- CTA button: "Get USDX" (links to app.usdx.com placeholder)

### 2. Hero Section
- Headline: Transparent & Regulated USD stablecoin messaging
- Subheadline: Brief description of USDX value proposition
- Primary CTA: "Get USDX" → links to app (app.usdx.com)
- Secondary CTA: "Read Docs" or "Learn More"
- Coin/token illustration on the right

### 3. Why USDX
- Core narrative: fully backed by USD cash & US Treasury bonds
- Emphasis on transparency, regulation, and audit reports
- Link to audit documentation

### 4. Features (6 cards)
1. **Fully Backed & Audited** — USD cash + US Treasury bonds, regular third-party audits
2. **Instant Settlement** — Transactions processed in seconds, 24/7
3. **Near-Zero Transaction Fees** — Minimal cost for global transfers
4. **Multi-Chain Support** — Available on 8 chains: Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Solana, Base
5. **Regulatory Compliant** — Full compliance with regulatory standards
6. **24/7 Global Access** — Anyone, anywhere, anytime with internet + wallet

### 5. How It Works (Mint & Redeem Flow)
3-step visual flow:
1. **Deposit USD** — User deposits USD to USDX platform
2. **Mint USDX** — USDX tokens are minted 1:1 against deposited USD
3. **Redeem** — Burn USDX tokens to receive USD back at 1:1 rate

### 6. Ecosystem
- Supported chains displayed with logos (Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Solana, Base)
- Partner/exchange logos in scrolling marquee (placeholder logos from major exchanges/DeFi: Binance, Coinbase, Uniswap, PancakeSwap, Aave, etc.)

### 7. FAQ Section
- Accordion style (like IDRX & Tether)
- Questions:
  - What is USDX?
  - How is USDX backed?
  - How do I get USDX?
  - Which blockchains does USDX support?
  - Is USDX regulated?
  - How do I redeem USDX for USD?

### 8. Footer
- USDX logo + brief description
- Social icons (placeholder links "#"): Twitter/X, Telegram, Discord, GitHub, Medium
- Copyright notice
- Terms & Conditions link

## Design Reference Notes

### From IDRX (primary reference):
- White background, clean typography
- Hero: left-aligned text + right-side coin illustration
- Feature cards with icons
- Ecosystem logos in scrolling marquee
- Accordion FAQs
- Minimal footer with social links

### From Tether (secondary reference):
- "100% backed and fully transparent" messaging approach
- Segment cards (For Individuals / Merchants / Exchanges)
- Typewriter animation in hero (optional enhancement)
- Strong emphasis on transparency narrative

### Brand System:
- Primary: #1eaed5
- Background: white (#ffffff)
- Text: dark gray/black
- Cards: light gray or white with subtle borders/shadows
- Typography: Clean sans-serif (Inter or similar)

## Target Audience Segments
- **Retail users**: Buy, hold, transfer stablecoins
- **Institutions/Business**: Integrate USDX for payments, treasury
- **Developers**: Build on USDX (DeFi, dApps, smart contracts)

## Responsive Breakpoints
- Desktop: 1280px+
- Tablet: 768px - 1279px
- Mobile: < 768px

## Resolved Questions
- **Logo**: Simple generated coin icon + "USDX" text (SVG/CSS-based)
- **Audit partner**: Generic statement — "Audited by independent third-party firms"
- **Tone**: Corporate/formal (like Tether)

## Next Steps
→ `/ce:plan` for implementation details
