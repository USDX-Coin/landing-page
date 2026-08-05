import type { Translated } from "../i18n";

export interface CaseStudy {
  tag: Translated;
  title: Translated;
  description: Translated;
  image: string;
}

// Mirrors the official Use Cases page:
// https://usdx-co.gitbook.io/whitepaper-usdx/use-cases.md
//
// Every card below is one of the six use cases named there, and every
// description is a close paraphrase of that page's own wording — no new claims.
//
// The previous cards (E-Commerce, Payroll, Savings) were removed on purpose:
// they described domestic retail payments, salary payments and personal savings,
// which contradict the closing notice on that same page — USDX "is not intended
// to function as a domestic payment instrument in Indonesia and is not designed
// to replace the Indonesian Rupiah". That notice is now rendered under these
// cards (see CaseStudy.astro) and is echoed in the FAQ, so the site tells one
// story. Do not reintroduce domestic payment or savings framing here.
//
// Liquidity Management is the one official use case not shown, purely to keep
// the carousel at five cards; add it when a suitable image exists.
export const caseStudies: CaseStudy[] = [
  {
    tag: { id: "Penyelesaian Lintas Negara", en: "Cross-Border Settlement" },
    title: {
      id: "Penyelesaian Lintas Negara yang Lebih Cepat",
      en: "Faster Cross-Border Settlement",
    },
    description: {
      id: "USDX mendukung kegiatan penyelesaian lintas negara dengan memungkinkan transfer nilai berdenominasi Dolar AS melalui jaringan blockchain, sekaligus mengurangi friksi operasional pada proses lintas negara tradisional.",
      en: "USDX can support cross-border settlement by enabling faster, more transparent transfer of U.S. dollar-denominated value through blockchain networks, reducing the operational friction of traditional cross-border processes.",
    },
    image: "/image/hero-city.jpg",
  },
  {
    tag: { id: "Remitansi Internasional", en: "International Remittance" },
    title: {
      id: "Transfer Nilai Antar Yurisdiksi",
      en: "Transferring Value Across Jurisdictions",
    },
    description: {
      id: "USDX dapat digunakan sebagai bagian dari solusi remitansi digital, memungkinkan transfer nilai yang efisien antar pihak di yurisdiksi yang berbeda dan mengurangi ketergantungan pada proses penyelesaian tradisional.",
      en: "USDX can be used as part of digital remittance solutions, enabling efficient transfer of value between participants across different jurisdictions and reducing dependency on traditional settlement processes.",
    },
    image: "/image/cs-crossborder.jpg",
  },
  {
    tag: { id: "Perdagangan Aset Digital", en: "Digital Asset Trading" },
    title: {
      id: "Satuan Hitung yang Stabil di Pasar Aset Digital",
      en: "A Stable Unit of Account in Digital Asset Markets",
    },
    description: {
      id: "USDX dapat berfungsi sebagai aset penyelesaian di pasar aset digital, dan diintegrasikan ke bursa, platform perdagangan, serta layanan aset digital yang membutuhkan satuan hitung yang stabil.",
      en: "USDX can serve as a settlement asset within digital asset markets, and can be integrated into exchanges, trading platforms, and digital asset services that require a stable unit of account.",
    },
    image: "/image/cs-savings.jpg",
  },
  {
    tag: { id: "Manajemen Treasuri", en: "Treasury Management" },
    title: {
      id: "Operasi Treasuri Digital bagi Organisasi",
      en: "Digital Treasury Operations for Organizations",
    },
    description: {
      id: "Organisasi dapat menggunakan USDX untuk operasi treasuri digital, termasuk mengelola likuiditas, memindahkan nilai antar platform, dan mengakses infrastruktur keuangan berbasis blockchain.",
      en: "Organizations can use USDX for digital treasury operations, including managing liquidity, transferring value between platforms, and accessing blockchain-based financial infrastructure.",
    },
    image: "/image/eco-bg.jpg",
  },
  {
    tag: { id: "DeFi", en: "DeFi" },
    title: {
      id: "Dolar Digital untuk Aplikasi Keuangan Terprogram",
      en: "Digital Dollars for Programmable Finance",
    },
    description: {
      id: "USDX dapat diintegrasikan ke aplikasi keuangan terdesentralisasi, termasuk lending, borrowing, liquidity pool, dan layanan keuangan berbasis blockchain lainnya.",
      en: "USDX may be integrated into decentralized finance applications, including lending, borrowing, liquidity pools, and other blockchain-based financial services.",
    },
    image: "/image/cs-web3.jpg",
  },
];
