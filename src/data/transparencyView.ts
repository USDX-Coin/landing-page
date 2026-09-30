// What /transparency should show, decided here — away from the DOM.
//
// The page's browser script used to hold all of this inside the `<script>` block
// of transparency.astro, where nothing could import it and therefore nothing
// could test it, and the worst bugs on the page lived in exactly that code.
// Thirty-six green tests missed them, because not one of them could reach it.
//
// So the decisions live here as pure functions over `unknown`, and the script is
// left with nothing but "put this string in that element".
//
// THE DOCUMENT LIST IS NOT READ ANY MORE. The response still carries an
// `attestations` array, and this module used to turn it into the "Laporan
// Atestasi Bulanan" table. That table was removed from the page on 30 Sep 2026,
// so nothing below looks at the field: whatever it holds — a list, an empty
// list, null — changes neither the figures nor the status line.
//
// UNKNOWN, not TransparencyData. The response is typed in transparency.ts
// because that is the contract, but a type annotation is a statement about what
// the backend PROMISED, not about what arrived down the wire. Everything below
// checks.
// The `.ts` extensions are load-bearing: this module holds runtime VALUES from
// both imports (the copy, the formatters), and `pnpm test` runs it through
// Node's own type stripping, which resolves specifiers exactly as written.
// Vite and `allowImportingTsExtensions` handle them in the build.
import { ui, type Lang, type Translated } from "../i18n.ts";
import {
  RESERVE_CURRENCY,
  SUPPLY_UNIT,
  formatAmount,
  formatDateTimeWib,
  formatPegLine,
  formatRatio,
} from "./transparency.ts";

const t = ui.transparency;

// ── View shapes ──────────────────────────────────────────────────────────────

export interface FiguresView {
  /** Null means "not yet available" — never a zero, never a blank. */
  supply: Translated | null;
  supplyCaption: Translated;
  reserve: Translated | null;
  reserveCaption: Translated;
  ratio: Translated | null;
  /** The "1 USDX = USD 1,00" line. Null hides the line with the ratio. */
  peg: Translated | null;
  updatedCaption: Translated;
}

/**
 * Which status line belongs under the heading.
 *
 * The line describes the three figures and nothing else, because they are the
 * only part of the page that comes over the network:
 *
 * - "live" means at least one figure is on screen, read from the API.
 * - "unavailable" means none is. That is a state a WELL-FORMED response can
 *   produce, not only a failed one: the backend's total-outage payload (see
 *   `unavailableView` in transparency.service.ts) sends a null reserve, a null
 *   ratio and a null supply amount together, an empty reserve ledger plus a
 *   failed chain read does the same on a healthy API, and so does a payload
 *   whose currency or unit label disagrees with the ones this page prints (see
 *   buildFiguresView, which withholds every figure that depends on them).
 *   Answering any of those with "Live data from the USDX API", printed above
 *   three cards all reading "Belum tersedia", is the bug this type exists to
 *   prevent.
 */
export type TransparencyStatus = "live" | "unavailable";

export interface TransparencyView {
  figures: FiguresView;
  status: TransparencyStatus;
}

// ── Reading an untrusted payload ─────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function field(source: unknown, key: string): unknown {
  return isRecord(source) ? source[key] : undefined;
}

/** A non-blank string, or null. Blank is missing. */
function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Format a value into both languages, or null when there is nothing to format.
 *
 * Null is the honest answer and every caller turns it into words — this is the
 * single place a missing figure could have become a 0, and it does not.
 */
function bilingual(
  format: (value: string, lang: Lang) => string,
  value: unknown,
): Translated | null {
  const raw = text(value);
  if (raw === null) return null;
  const id = format(raw, "id");
  const en = format(raw, "en");
  return id && en ? { id, en } : null;
}

/** "<prefix> 10 Agustus 2026, 11.05 WIB", or a plain "no timestamp" line. */
function caption(prefix: Translated, value: unknown): Translated {
  const stamp = bilingual(formatDateTimeWib, value);
  if (!stamp) return t.captionUnavailable;
  return { id: `${prefix.id} ${stamp.id}`, en: `${prefix.en} ${stamp.en}` };
}

/**
 * Does the label the API sent match the one this page prints beside the number?
 *
 * The page prints its own constants (see RESERVE_CURRENCY / SUPPLY_UNIT), so a
 * response naming a different currency or unit would put a real figure under a
 * label that does not describe it — "USD 100.667,41" for a balance actually held
 * in rupiah is a far larger error than showing nothing. A missing label is fine:
 * there is then nothing to disagree with, and the constant stands.
 */
function labelMatches(value: unknown, expected: string): boolean {
  const label = text(value);
  return label === null || label.toLowerCase() === expected.toLowerCase();
}

// ── The three headline figures ───────────────────────────────────────────────

export function buildFiguresView(data: unknown): FiguresView {
  const supply = field(data, "circulatingSupply");
  const reserve = field(data, "reserve");
  const ratio = field(data, "collateralRatio");

  // The ratio is the reserve divided by the supply, and the line under it
  // states a value in RESERVE_CURRENCY per token. Both therefore rest on the
  // reserve being held in the currency this page names: a response reporting a
  // rupiah balance takes the ratio and the peg line down with the amount, or
  // the card would withhold "USD 100.667,41" while the line beneath it still
  // promised "1 USDX = USD 1,00". The contract already sends a null ratio for a
  // non-USD reserve (§ 2); this is what happens when it does not.
  const currencyAgrees = labelMatches(field(reserve, "currency"), RESERVE_CURRENCY);

  return {
    supply: labelMatches(field(supply, "unit"), SUPPLY_UNIT)
      ? bilingual(formatAmount, field(supply, "amount"))
      : null,
    supplyCaption: caption(t.supplyCaption, field(supply, "readAt")),
    // A negative or absent reserve is "not yet available" like any other
    // missing figure: the contract has the backend send null once the ledger
    // balance drops below zero, and formatAmount refuses a negative anyway.
    reserve: currencyAgrees ? bilingual(formatAmount, field(reserve, "amount")) : null,
    reserveCaption: caption(t.reserveCaption, field(reserve, "balanceAt")),
    ratio: currencyAgrees ? bilingual(formatRatio, ratio) : null,
    peg: currencyAgrees ? bilingual(formatPegLine, ratio) : null,
    updatedCaption: caption(t.updatedCaption, field(data, "updatedAt")),
  };
}

// ── The whole page ───────────────────────────────────────────────────────────

/**
 * Is there a single number on the screen?
 *
 * The peg line is not counted: it is derived from the ratio and hidden with it,
 * so it can never be the only thing present. The captions are not counted
 * either — "Terakhir diperbarui 11 Agustus 2026, 11.15 WIB" is a timestamp on
 * an empty card, and treating it as a figure is what would let the page stamp
 * "just now" on three blank slots and call the result live.
 */
function hasAnyFigure(figures: FiguresView): boolean {
  return figures.supply !== null || figures.reserve !== null || figures.ratio !== null;
}

/**
 * Pick the sentence that matches the screen.
 *
 * "Live" is a claim about what a reader can see, so it is read off the built
 * view — the figures as they will be rendered — and never off the payload. A
 * field can arrive and still not reach the screen: a rupiah reserve, a supply
 * counted in some other unit, a ratio that fails to parse. Whatever the page
 * withholds, the status line withholds with it.
 */
function statusFor(figures: FiguresView): TransparencyStatus {
  return hasAnyFigure(figures) ? "live" : "unavailable";
}

/**
 * The sentence that goes with each status.
 *
 * HERE, not in the page's `<script>` block, for the same reason as everything
 * else in this file: a mapping that cannot be imported cannot be tested, and
 * what a reader is told about the page is precisely the thing worth testing.
 * The status is only ever as honest as the sentence it selects.
 */
export const STATUS_LINE: Record<TransparencyStatus, Translated> = {
  live: t.statusLive,
  // The same line a failed fetch shows, and for the same reason: a response
  // that carried no figure leaves the reader exactly where a dropped
  // connection would — with nothing on screen to be out of date.
  unavailable: t.statusFallback,
};

/**
 * Build everything the page needs from one response body's `data`.
 *
 * Returns null only when there is no object to read at all. Every other shape
 * produces a view: some slots may say "not yet available", and the status line
 * says whether any figure made it — including the case where the answer is
 * "none of them", which a well-formed response is perfectly able to say.
 */
export function buildView(data: unknown): TransparencyView | null {
  if (!isRecord(data)) return null;
  const figures = buildFiguresView(data);
  return { figures, status: statusFor(figures) };
}
