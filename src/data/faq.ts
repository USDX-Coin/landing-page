import { iconPaths } from "./icons";

export interface FaqItem {
  question: string;
  answer: string;
  icon: keyof typeof iconPaths;
}

export const faqItems: FaqItem[] = [
  {
    question: "Apa itu USDX?",
    answer:
      "USDX adalah stablecoin berbasis blockchain yang dipatok 1:1 terhadap Dolar AS. USDX dirancang untuk menyediakan aset digital yang stabil, transparan, dan teregulasi bagi individu, institusi, dan developer di seluruh dunia.",
    icon: "dollar",
  },
  {
    question: "Bagaimana USDX dijamin?",
    answer:
      "Setiap token USDX dijamin penuh oleh cadangan kas Dolar AS dan obligasi US Treasury. Cadangan kami diaudit secara rutin oleh firma pihak ketiga independen untuk memastikan transparansi dan akuntabilitas penuh.",
    icon: "shield",
  },
  {
    question: "Bagaimana cara mendapatkan USDX?",
    answer:
      "Anda dapat memperoleh USDX melalui platform resmi USDX, atau melalui bursa dan protokol terdesentralisasi yang didukung di seluruh jaringan blockchain kami.",
    icon: "globe",
  },
  {
    question: "Blockchain apa saja yang didukung USDX?",
    answer:
      "USDX saat ini tersedia di delapan blockchain utama: Ethereum, BNB Smart Chain (BSC), Polygon, Arbitrum, Optimism, Avalanche, Solana, dan Base.",
    icon: "layers",
  },
  {
    question: "Apakah USDX teregulasi?",
    answer:
      "Ya. USDX beroperasi dengan kepatuhan penuh terhadap standar regulasi yang berlaku. Cadangan kami disimpan di institusi keuangan teregulasi dan menjalani audit independen secara rutin.",
    icon: "check",
  },
  {
    question: "Bagaimana cara menukar USDX menjadi USD?",
    answer:
      "Anda dapat menukar USDX menjadi USD dengan kurs terjamin 1:1 melalui platform resmi USDX. Cukup burn token USDX Anda dan terima USD senilai yang sama melalui transfer bank.",
    icon: "clipboard",
  },
];
