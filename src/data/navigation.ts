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
  { label: ui.transparency.navLabel, href: "/transparency" },
  { label: ui.docs.navLabel, href: "/docs" },
  { label: { id: "FAQ", en: "FAQ" }, href: "#faq" },
  // "Dokumentasi" is back on: it now points at the official GitBook, which is
  // also the whitepaper (see data/whitepaper.ts). This is the site's ONLY link
  // to that destination — no duplicate "Whitepaper" entry in the footer.
  { label: { id: "Dokumentasi", en: "Docs" }, href: DOCUMENTATION_URL, external: true },
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
