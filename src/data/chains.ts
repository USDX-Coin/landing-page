export interface Chain {
  name: string;
  icon: string;
  url: string;
}

// Only chains where USDX is actually live. Uncomment the rest as we deploy.
export const chains: Chain[] = [
  { name: "Polygon", icon: "/icon/polygon.svg", url: "https://polygon.technology" },
  // { name: "Ethereum", icon: "/icon/ethereum.svg", url: "https://ethereum.org" },
  // { name: "BNB Smart Chain", icon: "/icon/bnb.svg", url: "https://www.bnbchain.org" },
  // { name: "Arbitrum", icon: "/icon/arbitrum.svg", url: "https://arbitrum.io" },
  // { name: "Optimism", icon: "/icon/optimism.svg", url: "https://www.optimism.io" },
  // { name: "Avalanche", icon: "/icon/avalanche.svg", url: "https://www.avax.network" },
  // { name: "Solana", icon: "/icon/solana.svg", url: "https://solana.com" },
  // { name: "Base", icon: "/icon/base.svg", url: "https://www.base.org" },
];

// The partner shortlist that used to live here moved to data/listings.ts,
// where it became the "Tersedia di" group of the credential strip — together
// with the gated "Terdaftar di" register group and the rules for enabling
// either. This file is chains only.
