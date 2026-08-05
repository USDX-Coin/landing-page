// On-chain identity of the USDX token, as shown in the Token Information
// section on the landing page.
//
// The mainnet contract address is NOT confirmed yet. Publishing the wrong
// address on the official site is exactly the mistake scammers exploit, so the
// whole section stays hidden until someone confirms the address — see
// TokenInfo.astro, which renders nothing while `contractAddress` is empty.
//
// Candidate (do NOT publish before it is confirmed on-chain by DevOps):
// `app/.env.local` in the sibling repo carries
// NEXT_PUBLIC_USDX_CONTRACT_ADDRESS=0x2702d7043693651BB8A3D2Ec1C296B20692C7426
// with a comment claiming symbol=USDX / decimals=6 on Polygon mainnet. That is
// a dev environment file, not a confirmation.

export interface TokenInfo {
  /** Ticker as it appears in the contract. */
  symbol: string;
  /**
   * Token name as it appears in the contract. Note the open question: the
   * CoinGecko submission used "MAF USDX" while the site says "USDX" — reviewers
   * compare the contract name with the site, so confirm which one is on-chain
   * before this section goes live.
   */
  name: string;
  decimals: number;
  /** Human-readable network name. */
  network: string;
  /** Checksummed contract address, or "" while unconfirmed. */
  contractAddress: string;
}

export const tokenInfo: TokenInfo = {
  symbol: "USDX",
  name: "USDX",
  decimals: 6,
  network: "Polygon",
  contractAddress: "",
};

/** PolygonScan token page for an address. */
export function polygonscanTokenUrl(address: string): string {
  return `https://polygonscan.com/token/${address}`;
}
