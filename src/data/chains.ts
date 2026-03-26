export interface Chain {
  name: string;
  shortName: string;
  icon: string;
}

export const chains: Chain[] = [
  { name: "Ethereum", shortName: "ETH", icon: "/icon/ethereum.svg" },
  { name: "BNB Smart Chain", shortName: "BSC", icon: "/icon/bnb.svg" },
  { name: "Polygon", shortName: "MATIC", icon: "/icon/polygon.svg" },
  { name: "Arbitrum", shortName: "ARB", icon: "/icon/arbitrum.svg" },
  { name: "Optimism", shortName: "OP", icon: "/icon/optimism.svg" },
  { name: "Avalanche", shortName: "AVAX", icon: "/icon/avalanche.svg" },
  { name: "Solana", shortName: "SOL", icon: "/icon/solana.svg" },
  { name: "Base", shortName: "BASE", icon: "/icon/base.svg" },
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
