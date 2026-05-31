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
      id: "Dijamin 1:1 oleh kas USD dan US Treasury, serta diaudit secara berkala oleh auditor independen.",
      en: "Backed 1:1 by USD cash and US Treasuries, and audited regularly by independent auditors.",
    },
    icon: "shield",
  },
  {
    title: { id: "Penyelesaian Instan", en: "Instant Settlement" },
    description: {
      id: "Transaksi diproses dalam hitungan detik, tersedia 24/7 sepanjang tahun.",
      en: "Transactions settle in seconds, available 24/7 all year round.",
    },
    icon: "zap",
  },
  {
    title: { id: "Biaya Transaksi Nyaris Nol", en: "Near-Zero Transaction Fees" },
    description: {
      id: "Kirim USDX ke seluruh dunia dengan biaya sangat rendah, bahkan nyaris nol.",
      en: "Send USDX anywhere in the world with extremely low fees — practically zero.",
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
      id: "USDX mematuhi standar regulasi untuk menghadirkan aset digital yang aman dan legal.",
      en: "USDX meets regulatory standards to deliver a secure, legally sound digital asset.",
    },
    icon: "check",
  },
  {
    title: { id: "Akses Global 24/7", en: "24/7 Global Access" },
    description: {
      id: "USDX dapat dikirim dan diterima oleh siapa saja, kapan saja, di mana saja.",
      en: "USDX can be sent and received by anyone, anytime, anywhere.",
    },
    icon: "globe",
  },
];
