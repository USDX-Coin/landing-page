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
 * THE PAGE HAS TWO HALVES THAT FAIL SEPARATELY — the three figures and the
 * document list — so there are four states, not two, and each one gets the
 * sentence that describes it. Collapsing any pair of them puts a sentence on
 * screen that the screen disagrees with, which is the only bug this type has
 * ever had:
 *
 * - "figuresOnly" exists because the figures can arrive when the list does not,
 *   and the page used to lie when they did: three numbers rendered from the API
 *   under a status line reading "Live data could not be loaded right now, so
 *   the figures and the document list on this page cannot be shown".
 * - "unavailable" exists for the mirror of that. `attestations: null` is the
 *   backend's formal signal that NOTHING could be assembled (see
 *   `unavailableView` in transparency.service.ts, which sends a null reserve, a
 *   null ratio, a null supply amount and a null attestation list together), and
 *   deriving the status from the document list alone answered that payload with
 *   "The figures on this page are live from the USDX API" — printed above three
 *   cards all reading "Belum tersedia". Every cold start of a replica while the
 *   database is down produces exactly that payload.
 * - "listOnly" is the fourth corner, and reachable without any outage at all:
 *   an empty reserve ledger plus a failed chain read empties all three figures
 *   while the document list comes through intact, and so does a payload whose
 *   currency or unit label disagrees with the ones this page prints (see
 *   buildFiguresView, which withholds every figure that depends on them).
 */
export type TransparencyStatus = "live" | "figuresOnly" | "listOnly" | "unavailable";

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
 * Pick the sentence that matches the screen, from the two halves it describes.
 *
 * "Live" is a claim about what a reader can see, so it is read off the built
 * view — the figures as they will be rendered, the list as it will be rendered
 * — and never off the payload. A field can arrive and still not reach the
 * screen: a rupiah reserve, a supply counted in some other unit, a ratio that
 * fails to parse. Whatever the page withholds, the status line withholds with
 * it.
 *
 * An EMPTY document list counts as live. "No report has been published yet" is
 * a statement the API made, printed as it was made; only "unavailable" means
 * the page could not find out.
 */
function statusFor(figures: FiguresView, attestations: AttestationsView): TransparencyStatus {
  const figuresLive = hasAnyFigure(figures);
  const listLive = attestations.state !== "unavailable";
  if (figuresLive && listLive) return "live";
  if (figuresLive) return "figuresOnly";
  if (listLive) return "listOnly";
  return "unavailable";
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
  figuresOnly: t.statusFiguresOnly,
  listOnly: t.statusListOnly,
  // The same line a failed fetch shows, and for the same reason: a response
  // that carried neither a figure nor a list leaves the reader exactly where a
  // dropped connection would — with nothing on screen to be out of date.
  unavailable: t.statusFallback,
};

/**
 * Build everything the page needs from one response body's `data`.
 *
 * Returns null only when there is no object to read at all. Every other shape
 * produces a view: some slots may say "not yet available", and the status line
 * says which parts made it — including the case where the answer is "none of
 * them", which a well-formed response is perfectly able to say.
 */
export function buildView(data: unknown, apiBaseUrl: string): TransparencyView | null {
  if (!isRecord(data)) return null;
  const figures = buildFiguresView(data);
  const attestations = buildAttestationsView(data.attestations, apiBaseUrl);
  return { figures, attestations, status: statusFor(figures, attestations) };
}
