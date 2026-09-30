// Venue and register logos for the Ecosystem credential strip ("Jaringan
// Mitra yang Terpercaya"). Two groups carrying two different kinds of claim:
//
//   availableOn    "Tersedia di"  — markets where USDX can actually be bought
//   registeredWith "Terdaftar di" — official registers that list USDX
//
// ─── THE GATE (why most entries are commented out) ──────────────────────────
// "Terdaftar di OJK/CFX" is a legal statement about a financial product, and
// "Tersedia di Indodax" implies the same one: an asset may only trade on an
// Indonesian exchange once it is in the CFX-maintained, OJK-regime Daftar
// Aset Kripto (POJK 27/2024). None of it was verifiable when these entries
// were staged. Checked directly against the primary sources on 18 and 21 Aug
// 2026:
//
//   - Indodax pairs API (indodax.com/api/pairs): no USDX market (506 pairs)
//   - CFX Daftar Aset Kripto (cfx.co.id/id/products-and-services/
//     crypto-asset-list): no USDX — the alphabetical slot jumps straight from
//     USDTB to USDY — and no "Macan" entry anywhere
//   - No OJK record for PT Macan Asia Finance in the ITSK/sandbox registers
//
// An unbacked regulatory claim is the standard explorer rejection, and a
// false "terdaftar di OJK" is worse than that: it is the exact category of
// statement Satgas PASTI acts on, and it would surface in the due diligence
// of the very listings being pursued. The logos are already staged in
// public/icon/partners/ so that activation is a one-line uncomment — BUT ONLY
// once the fact is citable: USDX visible in the CFX list, a live Indodax
// market URL, or an OJK letter number. Record the citation in the entry's
// comment when enabling it, and link the entry straight to the register.
export interface Listing {
  name: string;
  url: string;
  logo: string;
  /** Wordmark-style artwork: rendered at natural width, no name label. */
  wide?: boolean;
}

// Only venues where USDX verifiably trades today.
export const availableOn: Listing[] = [
  { name: "Uniswap", url: "https://uniswap.org", logo: "/icon/partners/uniswap.png" },
  // GATED — see the gate note above. Enable only when a USDX market is live
  // on Indodax, and point the URL at that market page.
  // { name: "Indodax", url: "https://indodax.com/market/USDXIDR", logo: "/icon/partners/indodax.png" },
  // Aspirational integrations, carried over from the old partner shortlist —
  // uncomment as each actually goes live:
  // { name: "Binance", url: "https://www.binance.com", logo: "/icon/partners/binance.svg" },
  // { name: "Coinbase", url: "https://www.coinbase.com", logo: "/icon/partners/coinbase.svg" },
  // { name: "PancakeSwap", url: "https://pancakeswap.finance", logo: "/icon/partners/pancakeswap.png" },
  // { name: "Aave", url: "https://aave.com", logo: "/icon/partners/aave.png" },
  // { name: "Curve", url: "https://curve.fi", logo: "/icon/partners/curve.png" },
  // { name: "SushiSwap", url: "https://www.sushi.com", logo: "/icon/partners/sushiswap.png" },
  // { name: "1inch", url: "https://1inch.io", logo: "/icon/partners/1inch.png" },
];

// Renders nothing while empty — the "Terdaftar di" label only appears once
// there is a register entry to point at.
export const registeredWith: Listing[] = [
  // GATED — see the gate note above. Enable each WITH its citation, and link
  // it to the register entry itself (the same pattern as the ISO card, which
  // links to TSI's register rather than asserting the fact bare).
  // The staged ojk.png is the site-header lockup (114×51) — swap in a
  // higher-resolution official asset at activation.
  // { name: "OJK", url: "https://ojk.go.id", logo: "/icon/partners/ojk.png", wide: true },
  // { name: "CFX", url: "https://www.cfx.co.id/id/products-and-services/crypto-asset-list", logo: "/icon/partners/cfx.webp", wide: true },
];
