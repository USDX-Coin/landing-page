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

/** Display label for each language (used by the navbar dropdown). */
export const LANG_LABEL: Record<Lang, string> = {
  id: "Indonesia",
  en: "English",
};

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
  supportedBy: { id: "Didukung oleh", en: "Supported by" },

  hero: {
    badge: { id: "Stablecoin USD Teregulasi", en: "Regulated USD Stablecoin" },
    line1: { id: "Akses US Dolar Digital", en: "Easier Access to the" },
    line2: { id: "Lebih Mudah", en: "Digital US Dollar" },
    paragraph: {
      id: "USDX memberikan akses terhadap US Dolar digital yang aman kapan saja di mana saja. Didukung penuh 1:1 dengan US Dolar di kustodian Bank BNI secara transparan.",
      en: "USDX gives you secure access to the digital US Dollar anytime, anywhere — fully backed 1:1 by the US Dollar, held transparently in custody at Bank BNI.",
    },
    // shared wallet/labels (also used by the Features fee card)
    totalBalance: { id: "Total Saldo", en: "Total Balance" },
    actionSend: { id: "Kirim", en: "Send" },
    actionReceive: { id: "Terima", en: "Receive" },
    actionSwap: { id: "Tukar", en: "Swap" },
  },

  features: {
    eyebrow: { id: "Fitur Unggulan", en: "Featured" },
    heading1: { id: "Segala yang seharusnya", en: "Everything a modern" },
    heading2: { id: "dimiliki dolar modern", en: "dollar should be" },
    sub: {
      id: "Stabil seperti dolar, cepat seperti internet. Pelajari apa yang membuat USDX bekerja.",
      en: "Stable like the dollar, fast like the internet. Explore what makes USDX work.",
    },
    // wallet card mock
    walletCompany: { id: "ABC Company", en: "ABC Company" },
    walletNote: { id: "Menerima pembayaran", en: "Receiving payment" },
    gaugeLabel: { id: "Penyelesaian", en: "Settlement" },
    auditCta: { id: "Lihat Laporan Audit", en: "View Audit Report" },
  },

  ecosystem: {
    // Multi-chain copy — restore once USDX is live on more chains:
    // badge: { id: "Multi-chain", en: "Multi-chain" },
    // heading1: { id: "Hadir di blockchain yang", en: "Live on the chains" },
    // heading2: { id: "sudah Anda gunakan", en: "you already use" },
    // sub: {
    //   id: "USDX berpindah secara native di 8 blockchain utama — arahkan kursor untuk menjelajah, klik untuk masuk lebih dalam.",
    //   en: "USDX moves natively across 8 major blockchains — hover to explore each, click to dive in.",
    // },
    badge: { id: "Ekosistem", en: "Ecosystem" },
    heading1: { id: "Kini hadir di", en: "Now live on" },
    heading2: { id: "jaringan Polygon", en: "Polygon" },
    sub: {
      id: "USDX hadir secara native di jaringan Polygon dan dapat diperdagangkan melalui Uniswap — blockchain lain akan menyusul.",
      en: "USDX lives natively on the Polygon network and trades on Uniswap — more chains are on the way.",
    },
    availableOn: { id: "Tersedia di", en: "Available on" },
    partners: { id: "Jaringan Mitra yang Terpercaya", en: "A Trusted Partner Network" },
  },

  caseStudy: {
    eyebrow: { id: "Case Study", en: "Case Study" },
    heading1: { id: "Dolar stabil, di tangan yang", en: "A stable dollar, in the hands" },
    heading2: { id: "membutuhkan", en: "that need it" },
    ctaHeading: {
      id: "Jadilah Bagian dari 2.500+ Pengguna USDX di Seluruh Dunia",
      en: "Join 2,500+ USDX users around the world",
    },
    more: { id: "Case Study Lainnya", en: "More Case Studies" },
  },

  faq: {
    eyebrow: { id: "FAQ", en: "FAQ" },
    heading1: { id: "Pertanyaan yang paling", en: "The questions we get" },
    heading2: { id: "Sering Diajukan", en: "asked the most" },
    sub: {
      id: "Temukan jawaban atas pertanyaan umum seputar USDX, mulai dari cara kerja, keamanan aset, hingga proses pengiriman dan penerimaan token. Kami merangkum informasi penting untuk membantu Anda memahami USDX dengan lebih mudah.",
      en: "Find answers to common questions about USDX — from how it works and asset security to sending and receiving tokens. We've gathered the essentials to help you understand USDX with ease.",
    },
    contact: { id: "Hubungi Kami", en: "Contact Us" },
  },

  footer: {
    headline: { id: "Masa Depan Dolar Digital", en: "The Future of Digital Dollars" },
    tagline: {
      id: "Stablecoin USD yang transparan dan teregulasi. Dijamin penuh oleh cadangan kas Dolar AS dan obligasi US Treasury.",
      en: "The transparent and regulated USD stablecoin. Fully backed by US Dollar cash reserves and US Treasury bonds.",
    },
    quickLinks: { id: "Tautan Cepat", en: "Quick Links" },
    legal: { id: "Legal", en: "Legal" },
    social: { id: "Social Media", en: "Social Media" },
    privacy: { id: "Kebijakan Privasi", en: "Privacy & Policy" },
    terms: { id: "Syarat & Ketentuan", en: "Terms & Conditions" },
    compliance: { id: "Kepatuhan Data", en: "Data Compliance" },
    audit: { id: "Laporan Audit", en: "Audit Report" },
    status: { id: "All system normal", en: "All system normal" },
    rights: { id: "© 2026 USDX, Inc.", en: "© 2026 USDX, Inc." },
  },
} satisfies Record<string, unknown>;
