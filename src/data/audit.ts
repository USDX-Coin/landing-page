// The two documents that vouch for USDX, and the reason they are two files and
// not one: they check different things on different rhythms, and the site is
// not allowed to blur them (see CLAUDE.md, "Two different checks, two different
// rhythms").
//
// Both PDFs live in public/audit/ so the static build serves them itself,
// same-origin, with no third-party host in between.
import type { Translated } from "../i18n";

/** Cyberscope smart-contract security audit (initial audit: 25 May 2026). */
export const AUDIT_REPORT_URL = "/audit/usdx-smart-contract-audit-cyberscope.pdf";

/**
 * KAP Griselda, Wisnu & Arum — agreed-upon procedures (SJT 4400) over the USDX
 * collateral balance, position 27 August 2026, report no.
 * 00001/SJT/05/1829/1/VIII/2026.
 *
 * TWO THINGS ABOUT THIS FILE THAT MUST SURVIVE ANY EDIT.
 *
 * 1. IT IS NOT AN AUDIT, AND THE COPY MUST NOT CALL IT ONE. The report says so
 *    itself, in both languages: "prosedur yang kami laksanakan bukan merupakan
 *    suatu audit atau reviu ... kami tidak menyatakan suatu opini atau
 *    kesimpulan maupun bentuk keyakinan lainnya". An AUP engagement reports
 *    findings from procedures the client agreed to; it expresses no opinion.
 *    Writing "diaudit oleh KAP" here would put a claim on the page that the
 *    document it links to explicitly disclaims.
 *
 * 2. THE PUBLISHED FILE IS REDACTED, AND ON PURPOSE. Appendix 3 is a balance
 *    letter from BNI listing three corporate accounts. The published version
 *    masks the account numbers and covers the two IDR accounts, which are not
 *    USDX collateral and have no business being on a public page; the USD
 *    100,667.88 collateral balance and every other page are untouched, and the
 *    redacted page says on its face that it was redacted. Appendix 3 was
 *    rasterised to do it, so the digits are gone from the file rather than
 *    merely hidden behind a box.
 *
 *    The unredacted original is NOT in this repository. Never replace this file
 *    with a copy straight from the KAP without redoing the redaction.
 *
 * The filename carries the reporting period (2026-08) rather than a counter:
 * the period is a property of the document, so the URL of a published report
 * never moves.
 */
export const ATTESTATION_REPORT_URL =
  "/audit/usdx-reserve-attestation-aup-2026-08.pdf";

/** One row of the "Laporan Atestasi Cadangan" table on /transparency. */
export interface AttestationReport {
  /**
   * The number in the ID column. Assigned by hand, once, and never reused or
   * renumbered: it is how a reader refers to a document, so it has to mean the
   * same document next year. It is NOT the row's position in the list.
   */
  id: number;
  /**
   * The document's name as the table prints it. Bound by rule 1 above like
   * every other line about these reports: "atestasi", never "audit".
   */
  title: Translated;
  /** The month the reported position falls in, spelled out. */
  month: Translated;
  year: string;
  /** A same-origin path under public/audit/. */
  url: string;
}

/**
 * Every published reserve attestation report, NEWEST FIRST — the table prints
 * them in this order.
 *
 * Static, and meant to be: a report gets onto the page by someone adding its
 * redacted PDF to public/audit/ and an entry here, in a reviewed commit. To
 * publish the next one, put it at the TOP with the next unused `id`.
 *
 * The paragraph above the table (`attestationBody` in i18n.ts) describes the
 * 27 August 2026 report specifically. It has to be rewritten, not just left
 * standing, when a second report joins this list.
 */
export const ATTESTATION_REPORTS: AttestationReport[] = [
  {
    id: 1,
    title: {
      id: "Laporan Atestasi Cadangan USDX Agustus 2026",
      en: "USDX Reserve Attestation Report August 2026",
    },
    month: { id: "Agustus", en: "August" },
    year: "2026",
    url: ATTESTATION_REPORT_URL,
  },
];
