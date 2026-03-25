export interface Chain {
  name: string;
  shortName: string;
}

export const chains: Chain[] = [
  { name: "Ethereum", shortName: "ETH" },
  { name: "BNB Smart Chain", shortName: "BSC" },
  { name: "Polygon", shortName: "MATIC" },
  { name: "Arbitrum", shortName: "ARB" },
  { name: "Optimism", shortName: "OP" },
  { name: "Avalanche", shortName: "AVAX" },
  { name: "Solana", shortName: "SOL" },
  { name: "Base", shortName: "BASE" },
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
