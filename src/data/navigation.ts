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

import { ui, type Translated } from "../i18n";
import { DOCUMENTATION_URL } from "./whitepaper";

export interface NavLink {
  label: Translated;
  href: string;
  /** Opens in a new tab (files, off-site destinations). */
  external?: boolean;
}

export const navLinks: NavLink[] = [
  { label: { id: "Beranda", en: "Home" }, href: "#hero" },
  { label: { id: "Fitur", en: "Features" }, href: "#features" },
  { label: { id: "Ekosistem", en: "Ecosystem" }, href: "#ecosystem" },
  // One transparency entry, one destination. The old "Dokumen" entry pointed at
  // a separate /docs page that held the attestation table; that table now lives
  // on /transparency itself, so the second entry was removed with the page.
  { label: ui.transparency.navLabel, href: "/transparency" },
  { label: { id: "FAQ", en: "FAQ" }, href: "#faq" },
  // The official GitBook — which IS the whitepaper (its landing page is titled
  // "Whitepaper USDX"; see data/whitepaper.ts). The entry was labelled
  // "Dokumentasi" / "Docs" until 12 Aug 2026, and that label is exactly why
  // listing reviewers (CMC, CoinGecko, PolygonScan, OJK) reported "no
  // whitepaper": they search for the literal word. USDI does it right — its
  // footer link says "White Paper" verbatim. So this entry now says
  // "Whitepaper" in both languages (the term is used as-is in Indonesian
  // crypto contexts), and through navLinks it appears in the navbar AND the
  // footer's Quick Links column. Do not rename it back to a synonym.
  { label: { id: "Whitepaper", en: "Whitepaper" }, href: DOCUMENTATION_URL, external: true },
  // "Artikel" stays removed — there is no articles page, and a nav link to "#"
  // reads as an unfinished placeholder to explorer reviewers.
  // { label: { id: "Artikel", en: "Articles" }, href: "" },
];

/**
 * Nav entries that start with "#" are anchors into the landing page. On any
 * other page they have to be prefixed ("/#features") or they would point at
 * sections that do not exist there — i.e. dead links.
 */
export function navHref(href: string, base = ""): string {
  return href.startsWith("#") ? `${base}${href}` : href;
}
