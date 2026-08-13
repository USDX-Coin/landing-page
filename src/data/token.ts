// On-chain identity of the USDX token, as shown in the Token Information
// section on the landing page and on the /transparency contract card.
//
// The mainnet address below is CONFIRMED. Publishing the wrong address on the
// official site is exactly the mistake scammers exploit, so the rule stands:
// nothing goes in here that has not been read back off the chain. Anything left
// empty renders nothing rather than a placeholder — see TokenInfo.astro.
//
// THERE ARE TWO USDX DEPLOYMENTS ON POLYGON MAINNET, and only one of them
// belongs on this site:
//
//   production  0x1FF2A62Dd802D74d0B0cA6d36D43D2A13AB43a55  <- published here
//               deployed 5 June 2026 at block 87955482, verified on
//               PolygonScan, has the Uniswap pool, and is the address the
//               whitepaper publishes. Same value as POLYGON_USDX_ADDRESS in
//               the production backend environment.
//
//   dev/staging 0x2702d7043693651BB8A3D2Ec1C296B20692C7426  <- NEVER publish
//               deployed 4 May 2026, pre-PR #5. This is the abandoned
//               deployment the development backend still points at; an earlier
//               note in this file listed it as the "candidate" address for the
//               site, which it never was. It must not come back.
//
// Source of truth for both: `DEPLOYED.md` in the `usdx-contract` repo.
// Read back from Polygon mainnet on 10 Aug 2026 against the production proxy:
// name() = "USDX", symbol() = "USDX", decimals() = 6.

export interface TokenInfo {
  /** Ticker as it appears in the contract. */
  symbol: string;
  /**
   * Token name as it appears in the contract. The CoinGecko submission used
   * "MAF USDX", which did not match; `name()` on the production proxy returns
   * "USDX", so that is what the site states.
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
  contractAddress: "0x1FF2A62Dd802D74d0B0cA6d36D43D2A13AB43a55",
};

/** PolygonScan token page for an address. */
export function polygonscanTokenUrl(address: string): string {
  return `https://polygonscan.com/token/${address}`;
}
