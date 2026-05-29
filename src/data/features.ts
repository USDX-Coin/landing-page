import type { Translated } from "../i18n";

export type FeatureIcon = "shield" | "zap" | "dollar" | "layers" | "check" | "globe";

export interface Feature {
  title: Translated;
  description: Translated;
  icon: FeatureIcon;
}

export const features: Feature[] = [
  {
    title: { id: "Dijamin Penuh & Diaudit", en: "Fully Backed & Audited" },
    description: {
      id: "Setiap token USDX dijamin 1:1 oleh kas USD dan obligasi US Treasury, dengan audit rutin oleh firma pihak ketiga independen.",
      en: "Every USDX token is backed 1:1 by USD cash and US Treasury bonds, with regular audits conducted by independent third-party firms.",
    },
    icon: "shield",
  },
  {
    title: { id: "Penyelesaian Instan", en: "Instant Settlement" },
    description: {
      id: "Transaksi diproses dalam hitungan detik di seluruh blockchain yang didukung, tersedia sepanjang waktu, 365 hari setahun.",
      en: "Transactions are processed in seconds across all supported blockchains, available around the clock, 365 days a year.",
    },
    icon: "zap",
  },
  {
    title: { id: "Biaya Transaksi Nyaris Nol", en: "Near-Zero Transaction Fees" },
    description: {
      id: "Transfer USDX ke seluruh dunia dengan biaya yang sangat rendah hingga nyaris nol, menjadikannya salah satu stablecoin paling hemat biaya.",
      en: "Transfer USDX globally with fees so low they are nearly zero, making it one of the most cost-effective stablecoins available.",
    },
    icon: "dollar",
  },
  {
    title: { id: "Dukungan Multi-Chain", en: "Multi-Chain Support" },
    description: {
      id: "USDX tersedia di Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Solana, dan Base.",
      en: "USDX is available on Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Solana, and Base.",
    },
    icon: "layers",
  },
  {
    title: { id: "Patuh Regulasi", en: "Regulatory Compliant" },
    description: {
      id: "USDX beroperasi dengan kepatuhan penuh terhadap standar regulasi yang berlaku, memastikan aset digital yang aman dan sah secara hukum.",
      en: "USDX operates in full compliance with applicable regulatory standards, ensuring a secure and legally sound digital asset.",
    },
    icon: "check",
  },
  {
    title: { id: "Akses Global 24/7", en: "24/7 Global Access" },
    description: {
      id: "Siapa pun dengan koneksi internet dan dompet digital dapat mengirim dan menerima USDX dari mana saja, kapan saja.",
      en: "Anyone with an internet connection and a digital wallet can send and receive USDX from anywhere in the world, at any time.",
    },
    icon: "globe",
  },
];
