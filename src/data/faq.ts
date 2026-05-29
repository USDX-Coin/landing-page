import type { Translated } from "../i18n";
import { iconPaths } from "./icons";

export interface FaqItem {
  question: Translated;
  answer: Translated;
  icon: keyof typeof iconPaths;
}

export const faqItems: FaqItem[] = [
  {
    question: { id: "Apa itu USDX?", en: "What is USDX?" },
    answer: {
      id: "USDX adalah stablecoin berbasis blockchain yang dipatok 1:1 terhadap Dolar AS. USDX dirancang untuk menyediakan aset digital yang stabil, transparan, dan teregulasi bagi individu, institusi, dan developer di seluruh dunia.",
      en: "USDX is a blockchain-based stablecoin pegged 1:1 to the US Dollar. It is designed to provide a stable, transparent, and regulated digital asset for individuals, institutions, and developers worldwide.",
    },
    icon: "dollar",
  },
  {
    question: { id: "Bagaimana USDX dijamin?", en: "How is USDX backed?" },
    answer: {
      id: "Setiap token USDX dijamin penuh oleh cadangan kas Dolar AS dan obligasi US Treasury. Cadangan kami diaudit secara rutin oleh firma pihak ketiga independen untuk memastikan transparansi dan akuntabilitas penuh.",
      en: "Every USDX token is fully backed by US Dollar cash reserves and US Treasury bonds. Our reserves are regularly audited by independent third-party firms to ensure complete transparency and accountability.",
    },
    icon: "shield",
  },
  {
    question: { id: "Bagaimana cara mendapatkan USDX?", en: "How do I get USDX?" },
    answer: {
      id: "Anda dapat memperoleh USDX melalui platform resmi USDX, atau melalui bursa dan protokol terdesentralisasi yang didukung di seluruh jaringan blockchain kami.",
      en: "You can acquire USDX through the official USDX platform, or through supported exchanges and decentralized protocols across our supported blockchain networks.",
    },
    icon: "globe",
  },
  {
    question: { id: "Blockchain apa saja yang didukung USDX?", en: "Which blockchains does USDX support?" },
    answer: {
      id: "USDX saat ini tersedia di delapan blockchain utama: Ethereum, BNB Smart Chain (BSC), Polygon, Arbitrum, Optimism, Avalanche, Solana, dan Base.",
      en: "USDX is currently available on eight major blockchains: Ethereum, BNB Smart Chain (BSC), Polygon, Arbitrum, Optimism, Avalanche, Solana, and Base.",
    },
    icon: "layers",
  },
  {
    question: { id: "Apakah USDX teregulasi?", en: "Is USDX regulated?" },
    answer: {
      id: "Ya. USDX beroperasi dengan kepatuhan penuh terhadap standar regulasi yang berlaku. Cadangan kami disimpan di institusi keuangan teregulasi dan menjalani audit independen secara rutin.",
      en: "Yes. USDX operates in full compliance with applicable regulatory standards. Our reserves are held at regulated financial institutions and are subject to regular independent audits.",
    },
    icon: "check",
  },
  {
    question: { id: "Bagaimana cara menukar USDX menjadi USD?", en: "How do I redeem USDX for USD?" },
    answer: {
      id: "Anda dapat menukar USDX menjadi USD dengan kurs terjamin 1:1 melalui platform resmi USDX. Cukup burn token USDX Anda dan terima USD senilai yang sama melalui transfer bank.",
      en: "You can redeem USDX for USD at a guaranteed 1:1 rate through the official USDX platform. Simply burn your USDX tokens and receive the equivalent USD via bank transfer or wire.",
    },
    icon: "clipboard",
  },
];
