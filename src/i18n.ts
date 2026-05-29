// Client-side i18n for the landing page.
//
// All user-facing copy lives here (and in the typed data files that import the
// `Translated` type). Both languages are rendered into the static HTML; the
// inactive one is hidden via CSS keyed on `<html lang>` (see global.css and the
// <T> helper). The Navbar language switcher flips `<html lang>` + localStorage.

export const LANGS = ["id", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "id";

/** A string available in every supported language. */
export type Translated = Record<Lang, string>;

export const meta: { title: Translated; description: Translated } = {
  title: {
    id: "USDX — Stablecoin USD yang Transparan & Teregulasi",
    en: "USDX — The Transparent & Regulated USD Stablecoin",
  },
  description: {
    id: "USDX adalah dolar digital yang didukung penuh, dapat ditukar 1:1 dengan USD. Dijamin oleh obligasi US Treasury dan cadangan kas.",
    en: "USDX is a fully-backed digital dollar, redeemable 1:1 for USD. Secured by US Treasury bonds and cash reserves.",
  },
};

export const ui = {
  cta: { id: "Dapatkan USDX", en: "Get USDX" },
  toggleMenu: { id: "Buka menu", en: "Toggle menu" },

  hero: {
    badge: { id: "Stablecoin USD Teregulasi", en: "Regulated USD Stablecoin" },
    line1: { id: "Dolar,", en: "The dollar," },
    line2: { id: "yang dirancang ulang", en: "reimagined for" },
    line3: { id: "untuk dunia on-chain", en: "the on-chain world" },
    paragraph: {
      id: "USDX adalah dolar digital yang didukung penuh, dapat ditukar 1:1 dengan USD — dijamin oleh kas dan obligasi US Treasury, diaudit oleh firma independen, dan tersedia di 8 blockchain.",
      en: "USDX is a fully-backed digital dollar, redeemable 1:1 for USD — secured by cash and US Treasuries, audited by independent firms, and live across 8 chains.",
    },
    explore: { id: "Jelajahi fitur", en: "Explore features" },
    stat1: { id: "Dijamin USD", en: "USD Backed" },
    stat2: { id: "Blockchain", en: "Blockchains" },
    stat3: { id: "Akses Global", en: "Global Access" },
    floatAuditTitle: { id: "Diaudit Penuh", en: "Fully Audited" },
    floatAuditSub: { id: "Cadangan terverifikasi", en: "Reserves verified" },
    floatInstantTitle: { id: "Instan", en: "Instant" },
    floatInstantSub: { id: "Selesai dalam hitungan detik", en: "Settled in seconds" },
    appName: { id: "Aplikasi USDX", en: "USDX App" },
    totalBalance: { id: "Total Saldo", en: "Total Balance" },
    backedAudited: { id: "Dijamin 1:1 · Diaudit", en: "Backed 1:1 · Audited" },
    actionSend: { id: "Kirim", en: "Send" },
    actionReceive: { id: "Terima", en: "Receive" },
    actionSwap: { id: "Tukar", en: "Swap" },
    reserves: { id: "Cadangan", en: "Reserves" },
    backed100: { id: "100% dijamin", en: "100% backed" },
    cash: { id: "Kas 72%", en: "Cash 72%" },
    tbills: { id: "Obligasi 28%", en: "T-Bills 28%" },
    recentActivity: { id: "Aktivitas Terbaru", en: "Recent Activity" },
    seeAll: { id: "Lihat semua", en: "See all" },
  },

  features: {
    eyebrow: { id: "Fitur", en: "Features" },
    heading: {
      id: "Segala yang seharusnya dimiliki dolar modern",
      en: "Everything a modern dollar should be",
    },
    sub: {
      id: "Stabil seperti dolar, cepat seperti internet. Pelajari apa yang membuat USDX bekerja.",
      en: "Stable like the dollar, fast like the internet. Explore what makes USDX work.",
    },
    scroll: { id: "Gulir untuk menjelajah", en: "Scroll to explore" },
  },

  ecosystem: {
    badge: { id: "Multi-Chain", en: "Multi-Chain" },
    heading: {
      id: "Hadir di blockchain yang sudah Anda gunakan",
      en: "Live on the chains you already use",
    },
    sub: {
      id: "USDX berpindah secara native di 8 blockchain utama — arahkan kursor untuk menjelajah, klik untuk masuk lebih dalam.",
      en: "USDX moves natively across 8 major blockchains — hover to explore each, click to dive in.",
    },
    partners: { id: "Mitra Tepercaya", en: "Trusted Partners" },
  },

  faq: {
    eyebrow: { id: "FAQ", en: "FAQ" },
    heading: { id: "Pertanyaan, terjawab", en: "Questions, answered" },
    sub: {
      id: "Semua yang perlu Anda ketahui tentang bagaimana USDX tetap stabil, terjamin, dan menjadi milik Anda.",
      en: "Everything you need to know about how USDX stays stable, backed, and yours.",
    },
  },

  footer: {
    tagline: {
      id: "Stablecoin USD yang transparan dan teregulasi. Dijamin penuh oleh cadangan kas Dolar AS dan obligasi US Treasury.",
      en: "The transparent and regulated USD stablecoin. Fully backed by US Dollar cash reserves and US Treasury bonds.",
    },
    quickLinks: { id: "Tautan Cepat", en: "Quick Links" },
    community: { id: "Komunitas", en: "Community" },
    futurePrefix: { id: "Masa Depan", en: "The Future of" },
    futureHighlight: { id: "Dolar Digital", en: "Digital Dollars" },
    rights: { id: "© 2026 USDX. Hak cipta dilindungi.", en: "© 2026 USDX. All rights reserved." },
    terms: { id: "Syarat & Ketentuan", en: "Terms & Conditions" },
  },
} satisfies Record<string, unknown>;

export interface Txn {
  name: Translated;
  sub: Translated;
  amt: string;
  tone: "up" | "swap" | "down";
}

export const txns: Txn[] = [
  { name: { id: "Diterima", en: "Received" }, sub: { id: "Dari 0x8f…2a1", en: "From 0x8f…2a1" }, amt: "+1,200.00", tone: "up" },
  { name: { id: "Ditukar", en: "Swapped" }, sub: { id: "USDC → USDX", en: "USDC → USDX" }, amt: "+800.00", tone: "swap" },
  { name: { id: "Dikirim", en: "Sent" }, sub: { id: "Ke 0x3c…9be", en: "To 0x3c…9be" }, amt: "−450.00", tone: "down" },
];
