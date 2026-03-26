export interface Chain {
  name: string;
  icon: string;
}

export const chains: Chain[] = [
  { name: "Ethereum", icon: "/icon/ethereum.svg" },
  { name: "BNB Smart Chain", icon: "/icon/bnb.svg" },
  { name: "Polygon", icon: "/icon/polygon.svg" },
  { name: "Arbitrum", icon: "/icon/arbitrum.svg" },
  { name: "Optimism", icon: "/icon/optimism.svg" },
  { name: "Avalanche", icon: "/icon/avalanche.svg" },
  { name: "Solana", icon: "/icon/solana.svg" },
  { name: "Base", icon: "/icon/base.svg" },
];

export interface Partner {
  name: string;
  url: string;
}

export const partners: Partner[] = [
  { name: "Binance", url: "https://www.binance.com" },
  { name: "Coinbase", url: "https://www.coinbase.com" },
  { name: "Uniswap", url: "https://uniswap.org" },
  { name: "PancakeSwap", url: "https://pancakeswap.finance" },
  { name: "Aave", url: "https://aave.com" },
  { name: "Curve", url: "https://curve.fi" },
  { name: "SushiSwap", url: "https://www.sushi.com" },
  { name: "1inch", url: "https://1inch.io" },
];
