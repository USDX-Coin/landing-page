export type FeatureIcon = "shield" | "zap" | "dollar" | "layers" | "check" | "globe";

export interface Feature {
  title: string;
  description: string;
  icon: FeatureIcon;
}

export const features: Feature[] = [
  {
    title: "Fully Backed & Audited",
    description:
      "Every USDX token is backed 1:1 by USD cash and US Treasury bonds, with regular audits conducted by independent third-party firms.",
    icon: "shield",
  },
  {
    title: "Instant Settlement",
    description:
      "Transactions are processed in seconds across all supported blockchains, available around the clock, 365 days a year.",
    icon: "zap",
  },
  {
    title: "Near-Zero Transaction Fees",
    description:
      "Transfer USDX globally with fees so low they are nearly zero, making it one of the most cost-effective stablecoins available.",
    icon: "dollar",
  },
  {
    title: "Multi-Chain Support",
    description:
      "USDX is available on Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Solana, and Base.",
    icon: "layers",
  },
  {
    title: "Regulatory Compliant",
    description:
      "USDX operates in full compliance with applicable regulatory standards, ensuring a secure and legally sound digital asset.",
    icon: "check",
  },
  {
    title: "24/7 Global Access",
    description:
      "Anyone with an internet connection and a digital wallet can send and receive USDX from anywhere in the world, at any time.",
    icon: "globe",
  },
];
