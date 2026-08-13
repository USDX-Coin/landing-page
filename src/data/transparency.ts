import type { Lang, Translated } from "../i18n";

// Public transparency endpoint — GET {API_BASE}/api/v1/public/transparency.
//
// The landing page is a static Netlify build, so this is fetched from the
// browser when /transparency opens. The per-domain mapping mirrors
// APP_URL_BY_HOST in navigation.ts: one build is served on several hostnames, so
// the right backend is resolved at runtime instead of baked in at build time.
const API_BASE_BY_HOST: Record<string, string> = {
  "usdxcoin.xyz": "https://api.usdx.co.id",
  "usdx.co.id": "https://api.usdx.co.id",
};

/** Default / fallback (also what the SSR-rendered markup assumes). */
export const API_BASE_URL = "https://api.usdx.co.id";

/** Dev backend — used by localhost and Netlify preview/branch deploys. */
export const API_BASE_URL_DEV = "https://api-dev.usdx.co.id";

export function resolveApiBaseUrl(hostname: string): string {
  const host = hostname.replace(/^www\./, "");
  const mapped = API_BASE_BY_HOST[host];
  if (mapped) return mapped;
  // Anything that is not a production landing domain (localhost, Netlify
  // previews, dev subdomains) talks to the dev backend so preview builds never
  // hit production.
  if (host === "localhost" || host === "127.0.0.1") return API_BASE_URL_DEV;
  if (host.endsWith(".netlify.app") || host.startsWith("dev.")) return API_BASE_URL_DEV;
  return API_BASE_URL;
}

export const TRANSPARENCY_PATH = "/api/v1/public/transparency";

// ── Response contract (locked with the backend) ──────────────────────────────

export interface TransparencyToken {
  symbol: string;
  chain: string;
  contractAddress: string;
  decimals: number;
  explorerUrl: string;
}

export interface TransparencySupply {
  /**
   * Decimal string, e.g. "100667.000000".
   *
   * Null — never "0" — when the chain read failed and there has never been a
   * successful one. An unconfigured chain counts as a failure, not as a
   * successful read of zero. The page renders null as "not yet available"; a
   * zero would be a claim that no USDX exists.
   */
  amount: string | null;
  /**
   * "USDX". Read for CHECKING only, never for display — the page prints its own
   * SUPPLY_UNIT constant beside the figure. See the note on that constant.
   */
  unit: string;
  source: string;
  /** ISO timestamp of the on-chain read. Null alongside a null amount. */
  readAt: string | null;
}

export interface TransparencyReserve {
  /** Decimal string, e.g. "100667.41". Never negative — see the note below. */
  amount: string;
  /**
   * "USD". Read for CHECKING only, never for display — the page prints its own
   * RESERVE_CURRENCY constant beside the figure.
   */
  currency: string;
  /**
   * Hardcoded server-side as a constant, never typed in by staff — a free-text
   * custodian field is how an account number ends up on a public page.
   *
   * The page does not render this value either: it prints the RESERVE_BANK
   * constant from this repo instead. The server-side hardcoding and the local
   * constant are the same string, so nothing is lost, and the free-text route
   * to this page is closed at both ends rather than one.
   */
  custodian: string;
  /**
   * ISO timestamp the balance is valid at.
   *
   * A timestamp rather than a date, because the reserve is a running ledger
   * balance now instead of a dated snapshot: it moves whenever tokens are
   * minted, burned or redeemed. The page prints the clock time with it (see
   * formatDateTimeWib) so nobody reads a live figure as an end-of-day position.
   */
  balanceAt: string;
}

export interface TransparencyAttestation {
  /** "YYYY-MM". */
  period: string;
  title: string;
  fileUrl: string;
  publishedAt: string;
}

export interface TransparencyData {
  token: TransparencyToken;
  circulatingSupply: TransparencySupply;
  /**
   * Null while the reserve ledger is still empty. Never a zero balance.
   *
   * Also null when the ledger balance has gone NEGATIVE — a mistyped
   * adjustment can do that, and the contract (§ 2) has the backend withhold
   * both `reserve` and `collateralRatio` in that case rather than publish
   * "-500,00" and "-0,50%". Staff screens show the negative balance, because
   * that is where it has to be seen and fixed. This page treats it as any other
   * "not yet available" state, and the formatters below refuse a negative
   * figure a second time in case the backend ever forgets.
   */
  reserve: TransparencyReserve | null;
  /**
   * Percentage as a decimal string, e.g. "100.00".
   *
   * Null when either side is unknown, when supply is zero, when the ledger
   * balance is negative, or when the reserve is held in something other than
   * USD. The "1 USDX = USD x,xx" line on the page is DERIVED from this value
   * (see formatPegLine) rather than sent as a field of its own, so the ratio
   * and the per-token figure cannot disagree.
   */
  collateralRatio: string | null;
  /**
   * The published attestation reports.
   *
   * DECLARING it an array does not make the network send one. The page never
   * trusts this field's type — see buildAttestationsView in transparencyView.ts,
   * which treats anything that is not an array as "list unavailable" rather
   * than as an empty list.
   */
  attestations: TransparencyAttestation[];
  updatedAt: string;
}

export interface TransparencyEnvelope {
  status?: unknown;
  metadata?: unknown;
  data?: TransparencyData | null;
  error?: unknown;
}

// ── Attestation file links ───────────────────────────────────────────────────

/**
 * Turn an attestation `fileUrl` from the public API into a value that is safe
 * to put in an href — or null if it is not usable.
 *
 * The backend serves attestation files through its own redirect route
 * (`/api/v1/public/transparency/attestations/{id}/file`) and only emits an
 * ABSOLUTE url when `TRANSPARENCY_PUBLIC_BASE_URL` is set on the server. With
 * that env unset the value arrives as a RELATIVE path.
 *
 * That distinction matters here and nowhere else: this site is served from
 * usdx.co.id while the API lives on a different host, so resolving a relative
 * path against the page origin would point every Download button at
 * `https://usdx.co.id/api/v1/...` — a page that does not exist, with no visible
 * error. Relative values therefore resolve against the API base the page is
 * actually talking to.
 *
 * Never assume the server env is set correctly — the site has to be right in
 * both cases.
 *
 * ORIGIN LOCK. Both shapes the backend can emit point at the API's own redirect
 * route, so a resolved url that lands anywhere else means something is wrong,
 * and the something is not benign: the "Download" button on this page carries
 * USDX branding on a page titled Transparency and Audit Documents, which is
 * exactly the surface used to hand out forged "attestation reports". A back
 * office account that has been taken over, or a compromised upstream, would
 * only need to store an off-site fileUrl to borrow that credibility. So the
 * resolved url must share the origin of the API base this page is talking to —
 * same scheme, host and port — and everything else returns null. Callers render
 * the row without a link for null, so a rejected value costs one document its
 * download button and never misleads anyone.
 *
 * Comparing origins (rather than hostnames) also refuses an http:// value
 * against an https:// API — a downgrade is as much a red flag as a foreign
 * host. Non-http(s) schemes (a `javascript:` url, say) fail the same check,
 * since their origin is never the API's.
 *
 * If attestation files are ever legitimately served from object storage on
 * another host, this is the function that has to learn about it — with an
 * explicit allowlist of that host, not by dropping the check.
 */
export function resolveAttestationFileUrl(
  fileUrl: string | null | undefined,
  apiBaseUrl: string,
): string | null {
  const raw = fileUrl?.trim();
  if (!raw) return null;
  let base: URL;
  try {
    base = new URL(apiBaseUrl);
  } catch {
    return null;
  }
  let url: URL;
  try {
    url = new URL(raw, base);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  // `origin` is "null" for opaque schemes, so this rejects them too.
  if (url.origin !== base.origin) return null;
  return url.href;
}

// ── What the reserve is made of ──────────────────────────────────────────────

/**
 * The bank the reserves are held at.
 *
 * A documented, unchanging fact about USDX rather than a figure, so it is
 * stated without a live response behind it — unlike the amounts, which say "not
 * yet available" until the API supplies them.
 *
 * ALWAYS THIS CONSTANT, never `reserve.custodian` from the response. The
 * contract hardcodes the same string server-side precisely so that no free-text
 * staff input can reach a public page carrying an account number; rendering the
 * repo's own constant closes that route at this end too, and the two strings are
 * identical, so nothing is lost. Only the bank's name ever appears here.
 *
 * NOT called a custodian. The official documentation says the reserves are
 * "held in U.S. dollar cash at Bank Negara Indonesia (BNI)" and never uses that
 * word; "custodian" is a specific, licensed banking role, and the same phrase
 * ("di kustodian Bank BNI") was already removed from the footer for being the
 * site's own wording rather than the documentation's. See `ui.transparency
 * .reserveBank` in src/i18n.ts for the label that goes with it.
 */
export const RESERVE_BANK = "Bank Negara Indonesia (BNI)";

/**
 * The currency the reserves are stated in, and the unit circulating supply is
 * counted in — both printed from here rather than from `reserve.currency` /
 * `circulatingSupply.unit` in the response.
 *
 * Same reasoning as RESERVE_BANK: a label that arrives over the network is a
 * label an upstream mistake (or an upstream compromise) can rewrite, and these
 * two sit directly against a number, where a wrong one changes what the number
 * means. The contract fixes both values for this phase, so a response that
 * disagrees is a contract violation — and the page then withholds the figure
 * rather than printing it under the wrong label. See buildFiguresView.
 */
export const RESERVE_CURRENCY = "USD";
export const SUPPLY_UNIT = "USDX";

export interface ReserveCompositionItem {
  label: Translated;
  /** Share of total reserves, percent as a decimal string. */
  share: string;
}

/**
 * The reserve breakdown, as a list.
 *
 * USDX reserves are 100% U.S. dollar CASH held at Bank Negara Indonesia. That
 * is the whole list, and it is deliberately the whole list: comparable pages
 * (USDI's, for instance) break their reserves down into US treasury
 * instruments and money market funds, and copying that shape would put
 * instruments on this page that USDX does not hold. The official documentation
 * says cash, so the site says cash — "Treasury" appears in that documentation
 * only as the name of a use case.
 *
 * Nothing may be added to this list without a reserve that actually contains
 * it, published in an attestation.
 *
 * Static rather than API-fed: the locked public payload (see
 * catatan/KONTRAK-API-TRANSPARANSI.md § 2) carries no composition field, and
 * a single 100% line is a claim from the documentation, not a live figure.
 *
 * The copy sits here rather than in src/i18n.ts for the same reason faq.ts and
 * features.ts hold theirs: it is a structured content list, not page chrome.
 * The prose around it (heading, note) is in i18n.ts as usual.
 */
export const RESERVE_COMPOSITION: ReserveCompositionItem[] = [
  {
    label: {
      id: "Kas Dolar AS di Bank Negara Indonesia (BNI)",
      en: "U.S. dollar cash at Bank Negara Indonesia (BNI)",
    },
    share: "100",
  },
];

// ── Baked-in fallback ────────────────────────────────────────────────────────

/**
 * Last known position, rendered straight into the static HTML so the page still
 * carries figures when the fetch fails (or when JavaScript is off).
 *
 * Everything is null right now, which is the honest state: the public endpoint
 * is not live yet, so the static HTML says "not yet available" in every figure
 * slot and the browser fills them in once the API answers. Never invent numbers
 * here — whatever is in this object is a public claim about the reserves, made
 * without a request behind it.
 *
 * A null value must NEVER be turned into a zero on the way to the screen. That
 * is the one rule this whole file exists to keep.
 *
 * If figures are ever baked in here, revisit `statusFallback` / `statusNoJs` in
 * src/i18n.ts — both are currently worded for a page that has nothing to show
 * when the fetch fails.
 */
export interface TransparencyFallback {
  circulatingSupply: TransparencySupply | null;
  reserve: TransparencyReserve | null;
  collateralRatio: string | null;
  /** ISO timestamp behind the "last updated" caption. */
  updatedAt: string | null;
}

export const TRANSPARENCY_FALLBACK: TransparencyFallback = {
  circulatingSupply: null,
  reserve: null,
  collateralRatio: null,
  updatedAt: null,
};

// ── Formatting ───────────────────────────────────────────────────────────────
// Shared by the page frontmatter (fallback markup) and the browser script (live
// data) so both render numbers identically.

const LOCALE: Record<Lang, string> = { id: "id-ID", en: "en-US" };

/** Indonesian time. Every figure on this page is stamped in it — see below. */
const WIB_TIME_ZONE = "Asia/Jakarta";

/**
 * Accept a plain decimal string, or nothing.
 *
 * A REGEX, not `Number()`. Every money value in the contract is a plain decimal
 * string, and `Number()` accepts a great deal more than that — silently, and in
 * bases nobody on this page is reading in. `Number("0x1FF2")` is 8178, so a
 * contract address landing in an amount field would have published "USD
 * 8.178,00"; `Number("0b101")` is 5, printing "5,00%" backing; `Number("1e3")`
 * is 1000, turning a ratio into "1 USDX = USD 10,00". `Number.isFinite` waves
 * all three through, because all three are finite numbers — they are just not
 * the numbers the strings say. `Number("")` and `Number("   ")` are 0, which
 * would print a confident, grouped "0,00" for a value nobody sent.
 *
 * Anything this rejects renders as "not yet available", which is the honest
 * answer for a value the page cannot read.
 */
const DECIMAL_STRING = /^-?\d+(?:\.\d+)?$/;

function toDecimal(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return DECIMAL_STRING.test(trimmed) ? trimmed : null;
}

/**
 * The same, but refusing negatives.
 *
 * No figure on this page can legitimately be negative: not circulating supply,
 * not the reserve balance, not the collateral ratio, not a composition share.
 * The contract already has the backend withhold `reserve` and `collateralRatio`
 * when the ledger balance goes below zero (§ 2), so a negative arriving here
 * means something upstream is wrong — and "-USD 500,00" or "-0,50%" under a
 * heading that says "Reserve assets" is a worse answer than "not yet
 * available". This is the second lock on the same door, not the first.
 */
function toPositiveDecimal(value: string | null | undefined): string | null {
  const decimal = toDecimal(value);
  return decimal === null || decimal.startsWith("-") ? null : decimal;
}

/**
 * Cut a decimal string to at most `maxFractionDigits` digits — TOWARDS ZERO,
 * never rounding up.
 *
 * Done on the STRING, before the value ever becomes a float. Rounding is what
 * leaks: at two decimals, `Intl` renders any ratio from 99.995 upwards as
 * "100,00%", and 0.99995 as "1,00" — a shortfall presented as full backing, in
 * the one direction this page must not err. Truncating cannot round up, so a
 * ratio below 100 can never print as 100.
 *
 * On the string rather than on the number because `Math.floor(v * 100) / 100`
 * has its own failure: 8.29 * 100 is 828.9999999999999 in binary floating
 * point, and flooring that gives 8.28 — a number nobody sent, in the other
 * direction. The digits are already there in the string; this just stops
 * reading.
 */
function truncateDecimal(decimal: string, maxFractionDigits: number): string {
  const dot = decimal.indexOf(".");
  if (dot < 0) return decimal;
  if (maxFractionDigits <= 0) return decimal.slice(0, dot);
  const end = dot + 1 + maxFractionDigits;
  return end >= decimal.length ? decimal : decimal.slice(0, end);
}

/** Divide a decimal string by 100 by moving the point, not by dividing. */
function divideByHundred(decimal: string): string {
  const negative = decimal.startsWith("-");
  const digits = negative ? decimal.slice(1) : decimal;
  const dot = digits.indexOf(".");
  const whole = dot < 0 ? digits : digits.slice(0, dot);
  const fraction = dot < 0 ? "" : digits.slice(dot + 1);
  const padded = whole.padStart(3, "0");
  const cut = padded.length - 2;
  const newWhole = padded.slice(0, cut).replace(/^0+(?=\d)/, "");
  return `${negative ? "-" : ""}${newWhole}.${padded.slice(cut)}${fraction}`;
}

function formatDecimal(
  decimal: string,
  lang: Lang,
  minimumFractionDigits: number,
  maximumFractionDigits: number,
): string {
  const value = Number(truncateDecimal(decimal, maximumFractionDigits));
  if (!Number.isFinite(value)) return "";
  return new Intl.NumberFormat(LOCALE[lang], {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/** Decimal string -> grouped number with two decimals. Empty when unparsable. */
export function formatAmount(amount: string, lang: Lang): string {
  const decimal = toPositiveDecimal(amount);
  if (decimal === null) return "";
  return formatDecimal(decimal, lang, 2, 2);
}

/** "101.25" -> "101,25%" / "101.25%". Empty when unparsable. */
export function formatRatio(ratio: string, lang: Lang): string {
  const decimal = toPositiveDecimal(ratio);
  if (decimal === null) return "";
  const formatted = formatDecimal(decimal, lang, 2, 2);
  return formatted === "" ? "" : `${formatted}%`;
}

/** "100" -> "100%". Trailing zeros are dropped: a share is not a money figure. */
export function formatShare(share: string, lang: Lang): string {
  const decimal = toPositiveDecimal(share);
  if (decimal === null) return "";
  const formatted = formatDecimal(decimal, lang, 0, 2);
  return formatted === "" ? "" : `${formatted}%`;
}

/**
 * Collateral ratio -> the plain-language line under it: "1 USDX = USD 1,00".
 *
 * Derived from the ratio rather than read from a field of its own, so the two
 * can never contradict each other on screen. A null ratio has no per-token
 * value either — callers hide the line rather than print "1 USDX = USD 0,00",
 * which would read as a total loss of backing rather than as missing data.
 *
 * Two to FOUR decimals, on purpose. Two alone would round a real shortfall away
 * — 99.6% backing would print as "1,00" — and overstating the backing is the
 * one direction this page must not round in. A ratio of exactly 100% still
 * prints "1,00", which is the common case.
 *
 * The token symbol and the currency come from the constants above rather than
 * from arguments or from the response. They used to be parameters that no
 * caller ever filled, so a payload holding the reserve in another currency
 * printed "1 USDX = USD 1,00" next to a card labelled with that other currency.
 * The card now prints the same two constants, so the line and the card cannot
 * fall out of step.
 */
export function formatPegLine(ratio: string, lang: Lang): string {
  const decimal = toPositiveDecimal(ratio);
  if (decimal === null) return "";
  const perToken = formatDecimal(divideByHundred(decimal), lang, 2, 4);
  return perToken === "" ? "" : `1 ${SUPPLY_UNIT} = ${RESERVE_CURRENCY} ${perToken}`;
}

/**
 * ISO timestamp -> "10 Agustus 2026, 11.05 WIB" / "August 10, 2026, 11:05 WIB".
 * Empty when the value is missing or unparsable.
 *
 * The CLOCK TIME is the point. These figures come from a running ledger and a
 * live `totalSupply()` read, not from a dated snapshot, so a date alone would
 * invite the reader to treat a number that moved an hour ago as yesterday's
 * closing position.
 *
 * Fixed to Jakarta time rather than the visitor's own: WIB is what every other
 * USDX record is kept in — the ledger's "today" is a WIB day — and a stamp that
 * shifts with the reader's laptop clock cannot be quoted back or compared
 * against an attestation. The zone is spelled out for the same reason.
 *
 * THAT PROMISE IS ONLY AS GOOD AS THE PARSING, which is why this does not hand
 * the string to `new Date()`. A timestamp with no `Z` and no offset —
 * "2026-08-10T04:00:00" — is parsed by every engine in the READER'S OWN zone,
 * so one payload printed "04.00 WIB" in Jakarta, "10.00 WIB" in London and
 * "15.00 WIB" in New York: a fourteen-hour spread, every one of them stamped
 * WIB, none of them detectable by the reader. `parseInstant` reads the string
 * itself and treats a missing zone as UTC, which is what the contract says
 * every timestamp is (§ 0). The output is then the same on every laptop on
 * earth.
 *
 * A DATE-ONLY value gets no clock at all. "2026-08-10" used to print "07.00
 * WIB" — Jakarta's rendering of UTC midnight, an hour of the day nobody sent.
 * The day is real, so the day is printed; the invented time and the zone label
 * that dressed it up are not.
 *
 * `hourCycle: "h23"` keeps midnight at 00.00 in both languages; en-US would
 * otherwise render it as 24:00 with `hour12: false`, and as "11:05 AM WIB" by
 * default, which reads like two different clocks at once.
 */
export function formatDateTimeWib(value: string, lang: Lang): string {
  const instant = parseInstant(value);
  if (!instant) return "";
  const day = new Intl.DateTimeFormat(LOCALE[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: WIB_TIME_ZONE,
  }).format(instant.date);
  if (!instant.hasTime) return day;
  const time = new Intl.DateTimeFormat(LOCALE[lang], {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: WIB_TIME_ZONE,
  }).format(instant.date);
  return `${day}, ${time} WIB`;
}

/** "2026-07" -> { year: 2026, month: 7 }, or null when it is not a period. */
export interface AttestationPeriod {
  year: number;
  /** 1–12. */
  month: number;
}

/**
 * Read a "YYYY-MM" reporting period.
 *
 * The MONTH IS RANGE-CHECKED, which `new Date(Date.UTC(y, m - 1, 1))` is not:
 * it rolls month 13 into January of the next year and month 0 back into
 * December of the previous one. That put a single row on screen reading
 * "ID 2026-13 · Month January 2027 · Year 2026" — three answers, none of them
 * agreeing, all from one malformed value. Out-of-range months are not periods,
 * so callers show the raw string and an em dash instead of inventing a date.
 */
export function parsePeriod(period: string | null | undefined): AttestationPeriod | null {
  if (typeof period !== "string") return null;
  const match = /^(\d{4})-(\d{2})$/.exec(period.trim());
  if (!match) return null;
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year: Number(match[1]), month };
}

/** "2026-07" -> "Juli 2026" / "July 2026". Falls back to the raw string. */
export function formatPeriod(period: string, lang: Lang): string {
  const parsed = parsePeriod(period);
  if (!parsed) return period;
  const date = new Date(Date.UTC(parsed.year, parsed.month - 1, 1));
  return new Intl.DateTimeFormat(LOCALE[lang], {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(date);
}

interface Instant {
  date: Date;
  /** False for a date-only value, which carries no time of day to print. */
  hasTime: boolean;
}

/**
 * ISO-8601 only, read digit by digit: date, optional time, optional zone.
 *
 * Deliberately strict. `new Date()` accepts a pile of non-ISO shapes on top of
 * the standard, differs between engines on several of them, and — the reason
 * this function exists — resolves a zone-less timestamp against the machine it
 * is running on. Rejecting what does not match is safe here: every caller
 * renders an unreadable timestamp as "not yet available".
 */
const ISO_TIMESTAMP =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?(Z|[+-]\d{2}:?\d{2})?)?$/i;

function parseInstant(value: string | null | undefined): Instant | null {
  if (typeof value !== "string") return null;
  const match = ISO_TIMESTAMP.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hasTime = match[4] !== undefined;
  const hour = hasTime ? Number(match[4]) : 0;
  const minute = hasTime ? Number(match[5]) : 0;
  const second = match[6] ? Number(match[6]) : 0;
  const millisecond = match[7] ? Number(match[7].slice(0, 3).padEnd(3, "0")) : 0;
  const zone = match[8];

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (hour > 23 || minute > 59 || second > 59) return null;

  let utc = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  if (Number.isNaN(utc)) return null;
  // Date.UTC rolls 2026-02-31 forward to 3 March rather than rejecting it.
  const rolled = new Date(utc);
  if (
    rolled.getUTCFullYear() !== year ||
    rolled.getUTCMonth() !== month - 1 ||
    rolled.getUTCDate() !== day
  ) {
    return null;
  }

  // No zone = UTC, per § 0 of the contract. Never the reader's own zone.
  if (zone && zone.toUpperCase() !== "Z") {
    const offsetHours = Number(zone.slice(1, 3));
    const offsetMinutes = Number(zone.slice(-2));
    if (offsetHours > 23 || offsetMinutes > 59) return null;
    const sign = zone.startsWith("-") ? -1 : 1;
    utc -= sign * (offsetHours * 60 + offsetMinutes) * 60_000;
  }

  return { date: new Date(utc), hasTime };
}
