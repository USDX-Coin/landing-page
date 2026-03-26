export type WhyUsdxIcon = "shield" | "clipboard" | "eye";

export interface WhyUsdxPoint {
  title: string;
  description: string;
  icon: WhyUsdxIcon;
}

export const whyUsdxPoints: WhyUsdxPoint[] = [
  {
    title: "USD Cash & Treasury Bonds",
    description:
      "Every USDX token is backed 1:1 by a combination of US Dollar cash reserves and short-term US Treasury bonds.",
    icon: "shield",
  },
  {
    title: "Independent Audits",
    description:
      "Our reserves are regularly audited by independent third-party firms to verify full backing at all times.",
    icon: "clipboard",
  },
  {
    title: "Real-Time Transparency",
    description:
      "We publish reserve reports and attestations so you can verify the backing of every USDX token in circulation.",
    icon: "eye",
  },
];
