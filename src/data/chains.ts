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
  logo: string;
}

export const partners: Partner[] = [
  { name: "Binance", url: "https://www.binance.com", logo: "/icon/partners/binance.svg" },
  { name: "Coinbase", url: "https://www.coinbase.com", logo: "/icon/partners/coinbase.svg" },
  { name: "Uniswap", url: "https://uniswap.org", logo: "/icon/partners/uniswap.png" },
  { name: "PancakeSwap", url: "https://pancakeswap.finance", logo: "/icon/partners/pancakeswap.png" },
  { name: "Aave", url: "https://aave.com", logo: "/icon/partners/aave.png" },
  { name: "Curve", url: "https://curve.fi", logo: "/icon/partners/curve.png" },
  { name: "SushiSwap", url: "https://www.sushi.com", logo: "/icon/partners/sushiswap.png" },
  { name: "1inch", url: "https://1inch.io", logo: "/icon/partners/1inch.png" },
];
