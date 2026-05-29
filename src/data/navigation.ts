// Per-domain app links. The same static build is deployed to both landing
// domains, so the correct app URL is resolved at runtime from the hostname.
const APP_URL_BY_HOST: Record<string, string> = {
  "usdxcoin.xyz": "https://app.usdxcoin.xyz/",
  "usdx.co.id": "https://app.usdx.co.id/",
};

// Default / fallback (also the SSR-rendered href before client resolution).
export const APP_URL = "https://app.usdxcoin.xyz/";

export function resolveAppUrl(hostname: string): string {
  const host = hostname.replace(/^www\./, "");
  return APP_URL_BY_HOST[host] ?? APP_URL;
}

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Fitur", href: "#features" },
  { label: "Ekosistem", href: "#ecosystem" },
  { label: "FAQ", href: "#faq" },
];
