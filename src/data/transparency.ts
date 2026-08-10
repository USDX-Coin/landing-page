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
  unit: string;
  source: string;
  /** ISO timestamp of the on-chain read. Null alongside a null amount. */
  readAt: string | null;
}

export interface TransparencyReserve {
  /** Decimal string, e.g. "100667.41". */
  amount: string;
  currency: string;
  /**
   * Hardcoded server-side as a constant, never typed in by staff — a free-text
   * custodian field is how an account number ends up on a public page.
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
  /** Null while the reserve ledger is still empty. Never a zero balance. */
  reserve: TransparencyReserve | null;
  /**
   * Percentage as a decimal string, e.g. "100.00".
   *
   * Null when either side is unknown, when supply is zero, or when the reserve
   * is held in something other than USD. The "1 USDX = USD x,xx" line on the
   * page is DERIVED from this value (see formatPegLine) rather than sent as a
   * field of its own, so the ratio and the per-token figure cannot disagree.
   */
  collateralRatio: string | null;
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
 * Custodian shown when the API has not answered (or has no reserve balance to
 * report). This is a documented, unchanging fact about USDX rather than a
 * figure, so it is safe to state without a live response behind it — unlike the
 * amounts, which say "not yet available" until the API supplies them.
 *
 * The API sends the same string in `reserve.custodian`; when it does, that
 * value wins. Only the name ever appears — no account number, on the site or
 * anywhere near it.
 */
export const RESERVE_CUSTODIAN = "Bank Negara Indonesia (BNI)";

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
 * Parse a decimal string that is meant to carry a number.
 *
 * `Number("")` and `Number("   ")` are both 0, so a blank string handed to any
 * of the formatters below would print a confident, grouped "0,00" — the exact
 * substitution this page must never make. Blank in means empty out, and every
 * caller renders empty as "not yet available".
 */
function toNumber(value: string | null | undefined): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Decimal string -> grouped number with two decimals. Empty when unparsable. */
export function formatAmount(amount: string, lang: Lang): string {
  const value = toNumber(amount);
  if (value === null) return "";
  return new Intl.NumberFormat(LOCALE[lang], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** "101.25" -> "101,25%" / "101.25%". Empty when unparsable. */
export function formatRatio(ratio: string, lang: Lang): string {
  const value = toNumber(ratio);
  if (value === null) return "";
  return `${new Intl.NumberFormat(LOCALE[lang], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

/** "100" -> "100%". Trailing zeros are dropped: a share is not a money figure. */
export function formatShare(share: string, lang: Lang): string {
  const value = toNumber(share);
  if (value === null) return "";
  return `${new Intl.NumberFormat(LOCALE[lang], {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)}%`;
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
 */
export function formatPegLine(
  ratio: string,
  lang: Lang,
  symbol = "USDX",
  currency = "USD",
): string {
  const value = toNumber(ratio);
  if (value === null) return "";
  const perToken = new Intl.NumberFormat(LOCALE[lang], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value / 100);
  return `1 ${symbol} = ${currency} ${perToken}`;
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
 * `hourCycle: "h23"` keeps midnight at 00.00 in both languages; en-US would
 * otherwise render it as 24:00 with `hour12: false`, and as "11:05 AM WIB" by
 * default, which reads like two different clocks at once.
 */
export function formatDateTimeWib(value: string, lang: Lang): string {
  const date = parseDate(value);
  if (!date) return "";
  const day = new Intl.DateTimeFormat(LOCALE[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: WIB_TIME_ZONE,
  }).format(date);
  const time = new Intl.DateTimeFormat(LOCALE[lang], {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: WIB_TIME_ZONE,
  }).format(date);
  return `${day}, ${time} WIB`;
}

/** "2026-07" -> "Juli 2026" / "July 2026". Falls back to the raw string. */
export function formatPeriod(period: string, lang: Lang): string {
  const match = /^(\d{4})-(\d{2})$/.exec(period);
  if (!match) return period;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  return new Intl.DateTimeFormat(LOCALE[lang], {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(date);
}

function parseDate(value: string | null | undefined): Date | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  // Date-only strings are pinned to UTC midnight so the calendar day is stable.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = dateOnly
    ? new Date(Date.UTC(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
