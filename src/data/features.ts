export type FeatureIcon = "shield" | "zap" | "dollar" | "layers" | "check" | "globe";

export interface Feature {
  title: string;
  description: string;
  icon: FeatureIcon;
}

export const features: Feature[] = [
  {
    title: "Dijamin Penuh & Diaudit",
    description:
      "Setiap token USDX dijamin 1:1 oleh kas USD dan obligasi US Treasury, dengan audit rutin oleh firma pihak ketiga independen.",
    icon: "shield",
  },
  {
    title: "Penyelesaian Instan",
    description:
      "Transaksi diproses dalam hitungan detik di seluruh blockchain yang didukung, tersedia sepanjang waktu, 365 hari setahun.",
    icon: "zap",
  },
  {
    title: "Biaya Transaksi Nyaris Nol",
    description:
      "Transfer USDX ke seluruh dunia dengan biaya yang sangat rendah hingga nyaris nol, menjadikannya salah satu stablecoin paling hemat biaya.",
    icon: "dollar",
  },
  {
    title: "Dukungan Multi-Chain",
    description:
      "USDX tersedia di Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Solana, dan Base.",
    icon: "layers",
  },
  {
    title: "Patuh Regulasi",
    description:
      "USDX beroperasi dengan kepatuhan penuh terhadap standar regulasi yang berlaku, memastikan aset digital yang aman dan sah secara hukum.",
    icon: "check",
  },
  {
    title: "Akses Global 24/7",
    description:
      "Siapa pun dengan koneksi internet dan dompet digital dapat mengirim dan menerima USDX dari mana saja, kapan saja.",
    icon: "globe",
  },
];
