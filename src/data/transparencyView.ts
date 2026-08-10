// What /transparency should show, decided here — away from the DOM.
//
// The page's browser script used to hold all of this inside the `<script>` block
// of transparency.astro, where nothing could import it and therefore nothing
// could test it. Two of the worst bugs on the page lived in exactly that code:
// a payload whose `attestations` was not an array threw a TypeError halfway
// through rendering (after the "loading" line had already been hidden, leaving
// an empty 98px box), and a payload with no `attestations` field at all was
// treated as an empty list, so a page whose whole purpose is to list attestation
// reports announced that none had ever been published. Thirty-six green tests
// missed both, because not one of them could reach the code.
//
// So the decisions live here as pure functions over `unknown`, and the script is
// left with nothing but "put this string in that element".
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
  formatPeriod,
  formatRatio,
  parsePeriod,
  resolveAttestationFileUrl,
} from "./transparency.ts";

const t = ui.transparency;

/** Shown wherever a value exists but cannot be read. */
const EM_DASH = "—";

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

export interface AttestationRow {
  /** The reporting period, which is the document's public ID. */
  id: string;
  title: string;
  month: Translated;
  year: string;
  /** Null when the file link is missing or fails the origin lock. */
  href: string | null;
}

/**
 * Which of the attestation card's three states to show.
 *
 * "empty" is a claim about the world — "nothing has been published" — and is
 * therefore reachable from exactly one input: an API response carrying an
 * attestation list with no entries in it. Everything else that is not a usable
 * list is "unavailable", which claims nothing.
 */
export type AttestationsView =
  | { state: "list"; rows: AttestationRow[] }
  | { state: "empty" }
  | { state: "unavailable" };

/**
 * Which status line belongs under the heading.
 *
 * "partial" exists because the page can half-succeed, and used to lie when it
 * did: the figures rendered from the API while the status line above them read
 * "Live data could not be loaded right now, so the figures and the document
 * list on this page cannot be shown" — a sentence contradicted by the three
 * numbers directly beneath it.
 */
export type TransparencyStatus = "live" | "partial";

export interface TransparencyView {
  figures: FiguresView;
  attestations: AttestationsView;
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

// ── The attestation table ────────────────────────────────────────────────────

interface SortableRow {
  /** Normalised period, or "" for a row with no readable period. */
  key: string;
  row: AttestationRow;
}

function toRow(entry: Record<string, unknown>, apiBaseUrl: string): SortableRow {
  const rawPeriod = text(entry.period) ?? "";
  const parsed = parsePeriod(rawPeriod);
  const monthLabel = parsed
    ? { id: formatPeriod(rawPeriod, "id"), en: formatPeriod(rawPeriod, "en") }
    : { id: rawPeriod || EM_DASH, en: rawPeriod || EM_DASH };

  return {
    key: parsed ? rawPeriod : "",
    row: {
      // The ID is the period itself, so nothing else in the list can move it.
      // A period that cannot be read gets an em dash rather than an invented ID.
      id: parsed ? rawPeriod : EM_DASH,
      title: text(entry.title) ?? EM_DASH,
      month: monthLabel,
      year: parsed ? String(parsed.year) : EM_DASH,
      href: resolveAttestationFileUrl(text(entry.fileUrl), apiBaseUrl),
    },
  };
}

/**
 * Decide what the attestation card shows, from whatever the API sent.
 *
 * ONE ROW MAY NOT TAKE THE TABLE DOWN WITH IT. The old code sorted with
 * `b.period.localeCompare(a.period)`, so a single entry whose `period` was null
 * threw a TypeError, and the whole table — every other document in it —
 * disappeared behind a status line saying the page could not load. Each entry is
 * read on its own terms here, and an unreadable field costs that row a cell.
 *
 * ANYTHING THAT IS NOT AN ARRAY IS "UNAVAILABLE", NOT "EMPTY". `attestations ??
 * []` used to collapse three very different situations — a list with nothing in
 * it, a field that never arrived, and a value of some other shape (the admin
 * endpoint's `{ items: [...] }` being the realistic mistake) — into the single
 * sentence "no document has been published yet". On a page that exists to list
 * attestation reports, that is the most expensive sentence available, and two of
 * those three inputs do not support it.
 */
export function buildAttestationsView(value: unknown, apiBaseUrl: string): AttestationsView {
  if (!Array.isArray(value)) return { state: "unavailable" };
  if (value.length === 0) return { state: "empty" };

  const rows = value.filter(isRecord).map((entry) => toRow(entry, apiBaseUrl));
  // Entries arrived, but none of them were readable objects. That is a broken
  // list, not an empty one.
  if (rows.length === 0) return { state: "unavailable" };

  // Newest period first; rows with no readable period keep their relative order
  // at the end. Plain comparison rather than localeCompare — "2026-07" against
  // "2026-11" is a digit comparison, and locale rules have no business in it.
  const sorted = rows
    .slice()
    .sort((a, b) => (a.key < b.key ? 1 : a.key > b.key ? -1 : 0))
    .map((entry) => entry.row);

  return { state: "list", rows: sorted };
}

// ── The whole page ───────────────────────────────────────────────────────────

/**
 * Build everything the page needs from one response body's `data`.
 *
 * Returns null only when there is no object to read at all, which is the one
 * case where the page really has nothing and the "could not load" status is
 * true. Every other shape produces a view: some slots may say "not yet
 * available", and the status line says which parts made it.
 */
export function buildView(data: unknown, apiBaseUrl: string): TransparencyView | null {
  if (!isRecord(data)) return null;
  const attestations = buildAttestationsView(data.attestations, apiBaseUrl);
  return {
    figures: buildFiguresView(data),
    attestations,
    status: attestations.state === "unavailable" ? "partial" : "live",
  };
}
