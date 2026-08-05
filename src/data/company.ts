import type { Translated } from "../i18n";

// Issuing entity. The legal name is confirmed; the office address and the
// official project-domain email address are still being confirmed by management.
//
// Anything left empty here is simply not rendered — the footer contact block and
// the FAQ "Contact Us" button disappear rather than showing a placeholder or a
// dead `mailto:`. Etherscan/PolygonScan require a real project-domain email, so
// this is the one field that still blocks a complete submission.

/** Confirmed. Not "USDX, Inc." — there is no US entity. */
export const COMPANY_LEGAL_NAME = "PT Macan Asia Finance";

/**
 * Full office address. Kept as `Translated` so the surrounding copy stays
 * consistent with the rest of the site; in practice both languages will carry
 * the same Indonesian address.
 *
 * Example once confirmed:
 *   export const COMPANY_ADDRESS: Translated | null = {
 *     id: "Gedung X Lantai 0, Jl. Contoh No. 1, Jakarta Selatan 12345, Indonesia",
 *     en: "Gedung X Lantai 0, Jl. Contoh No. 1, Jakarta Selatan 12345, Indonesia",
 *   };
 */
export const COMPANY_ADDRESS: Translated | null = null;

/**
 * Official email on the project domain (required by the Etherscan token-info
 * rules). Example once confirmed: "info@usdx.co.id".
 */
export const COMPANY_EMAIL: string = "";
