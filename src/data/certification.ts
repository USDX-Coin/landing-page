// ISO/IEC 27001 certification held by the issuer, PT Macan Asia Finance.
//
// Certificate details, verified against the certificate document:
//   Standard   SNI ISO/IEC 27001:2022 — Information Security Management Systems
//              (SNI is Indonesia's national adoption; the content is ISO/IEC
//              27001:2022 itself, which is why the badge names the ISO number.)
//   Number     ISMS 26302
//   Body       PT TSI Sertifikasi Internasional
//   Accredited KAN LSSM-056-IDN, an IAF MLA signatory — this is what carries the
//              certificate's international recognition.
//   Scope      Information Security Management System for Stablecoin
//              Transaction Services Platform
//   Issued     24 June 2026        Expires  23 June 2029
//
// ─── WHY THERE IS NO CERTIFICATE PDF HERE ───────────────────────────────────
// The certificate was briefly published in public/certificate/ and has been
// withdrawn. TSI's own mark guidance (TSI-SD-CM-02 Rev.2 Ed.5, 3 March 2026,
// tsicertification.com/logo-guideline) forbids it in two places:
//
//   §2b  clients are not permitted to "publish the certificates that have been
//        obtained in print and electronic media such as company profiles,
//        websites, etc."
//   §3.2 for websites specifically: "in order to maintain information security,
//        it is not permitted to display the certificate in its entirety, only
//        the logo below is permitted to be displayed next to the company logo"
//
// §6 grades the sanctions: repeat or unaddressed violations escalate to a major
// nonconformity that freezes the certificate, and ultimately to withdrawal.
// Publishing the PDF would put the certification itself at risk — do not add it
// back, and do not link to a copy hosted anywhere else either.
//
// ─── WHAT THE MARK REQUIRES, WHEN WE GET IT ─────────────────────────────────
// The artwork is the combined TSI + KAN mark, requested from TSI at
// certification@tsicertification.co.id. Before using it at all, MAF must sign
// TSI's statement on the use of the certification mark (§2b). The rules that
// then bind the layout:
//
//   §2d  the mark must always sit ADJACENT TO THE COMPANY LOGO and may never
//        stand alone — neither the TSI nor the KAN mark on its own
//   §2e  the certificate number must appear on the mark
//   §3.2 the mark must not stand alone and must "constitute a single unit"
//   §5   minimum height 17mm, width proportional; font and colour follow the
//        scheme and come from TSI, not from us
//
// Note the design consequence: the mark belongs beside the USDX logo, so the
// navbar or footer lockup is its home — not a free-floating pill in the hero.
//
// A plain text statement of certification is a different thing from the mark
// and is not restricted the same way, which is what the hero carries today.
//
// EXPIRY: after 23 June 2029 this certificate lapses and the claim must go with
// it. Recertification normally issues a new number.
export const CERTIFICATE_NUMBER = "ISMS 26302";

/**
 * TSI's own public verification portal, deep-linked to this certificate. Opens
 * on the result: PT MACAN ASIA FINANCE — ISMS 26302 — Valid.
 *
 * This is what the badge links to instead of the certificate file. Pointing at
 * the issuer's register breaks none of the rules above — we publish nothing —
 * and it is stronger evidence than a PDF, because the reader sees the live
 * status straight from the body that issued it. A withdrawn or lapsed
 * certificate stops showing here, which a PDF on our own server never would.
 */
export const CERTIFICATE_VERIFY_URL =
  "https://certificate.tsicertification.com/search?q=ISMS%2026302";
export const CERTIFICATION_BODY = "PT TSI Sertifikasi Internasional";
/** Short form for the badge, where the full legal name will not fit. */
export const CERTIFICATION_BODY_SHORT = "TSI";
export const CERTIFICATE_EXPIRY = "2029-06-23";
