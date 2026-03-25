export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "What is USDX?",
    answer:
      "USDX is a blockchain-based stablecoin pegged 1:1 to the US Dollar. It is designed to provide a stable, transparent, and regulated digital asset for individuals, institutions, and developers worldwide.",
  },
  {
    question: "How is USDX backed?",
    answer:
      "Every USDX token is fully backed by US Dollar cash reserves and US Treasury bonds. Our reserves are regularly audited by independent third-party firms to ensure complete transparency and accountability.",
  },
  {
    question: "How do I get USDX?",
    answer:
      "You can acquire USDX through the official USDX platform at app.usdx.com, or through supported exchanges and decentralized protocols across our supported blockchain networks.",
  },
  {
    question: "Which blockchains does USDX support?",
    answer:
      "USDX is currently available on eight major blockchains: Ethereum, BNB Smart Chain (BSC), Polygon, Arbitrum, Optimism, Avalanche, Solana, and Base.",
  },
  {
    question: "Is USDX regulated?",
    answer:
      "Yes. USDX operates in full compliance with applicable regulatory standards. Our reserves are held at regulated financial institutions and are subject to regular independent audits.",
  },
  {
    question: "How do I redeem USDX for USD?",
    answer:
      "You can redeem USDX for USD at a guaranteed 1:1 rate through the official USDX platform. Simply burn your USDX tokens and receive the equivalent USD via bank transfer or wire.",
  },
];
