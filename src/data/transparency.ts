import type { Lang } from "../i18n";

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
  /** Decimal string, e.g. "1234567.00". */
  amount: string;
  unit: string;
  source: string;
  /** ISO timestamp of the on-chain read. */
  readAt: string;
}

export interface TransparencyReserve {
  /** Decimal string, e.g. "1250000.00". */
  amount: string;
  currency: string;
  custodian: string;
  accountLabel: string;
  /** Date-only, e.g. "2026-07-31". */
  asOf: string;
  note: string | null;
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
  /** Null until finance publishes a reserve snapshot. */
  reserve: TransparencyReserve | null;
  /** Percentage as a decimal string, e.g. "101.25". Null with no reserve. */
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
 * actually talking to; absolute values are used as-is and the base is ignored.
 *
 * Never assume the server env is set correctly — the site has to be right in
 * both cases.
 *
 * Anything that is not http(s) (a `javascript:` url, say) returns null so a
 * broken or hostile value can never reach an href.
 */
export function resolveAttestationFileUrl(
  fileUrl: string | null | undefined,
  apiBaseUrl: string,
): string | null {
  const raw = fileUrl?.trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw, apiBaseUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  return url.href;
}

// ── Baked-in fallback ────────────────────────────────────────────────────────

/**
 * Last published position, rendered straight into the static HTML so the page
 * still carries real, dated numbers when the fetch fails (or when JavaScript is
 * off). A transparency page that only says "failed to load" is worse than one
 * showing a figure with a date on it.
 *
 * Everything is null right now because finance has not published a reserve
 * position yet — the page renders an honest "not yet available" instead. Never
 * invent numbers here: whatever is in this object is a public claim about the
 * reserves. When a snapshot is published, copy its exact values across and keep
 * `asOf` truthful.
 *
 * Example:
 *   reserve: {
 *     amount: "1250000.00",
 *     currency: "USD",
 *     custodian: "Bank BNI",
 *     accountLabel: "Rekening Cadangan USDX",
 *     asOf: "2026-07-31",
 *     note: null,
 *   },
 */
export interface TransparencyFallback {
  circulatingSupply: TransparencySupply | null;
  reserve: TransparencyReserve | null;
  collateralRatio: string | null;
}

export const TRANSPARENCY_FALLBACK: TransparencyFallback = {
  circulatingSupply: null,
  reserve: null,
  collateralRatio: null,
};

// ── Formatting ───────────────────────────────────────────────────────────────
// Shared by the page frontmatter (fallback markup) and the browser script (live
// data) so both render numbers identically.

const LOCALE: Record<Lang, string> = { id: "id-ID", en: "en-US" };

/** Decimal string -> grouped number with two decimals. Empty when unparsable. */
export function formatAmount(amount: string, lang: Lang): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "";
  return new Intl.NumberFormat(LOCALE[lang], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** "101.25" -> "101,25%" / "101.25%". Empty when unparsable. */
export function formatRatio(ratio: string, lang: Lang): string {
  const value = Number(ratio);
  if (!Number.isFinite(value)) return "";
  return `${new Intl.NumberFormat(LOCALE[lang], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

/**
 * "2026-07-31" -> "31 Juli 2026" / "July 31, 2026".
 * Formatted in UTC on purpose: a date-only value must not slide to the previous
 * day for a visitor west of Greenwich.
 */
export function formatDate(value: string, lang: Lang): string {
  const date = parseDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(LOCALE[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** ISO timestamp -> date + time (UTC), for on-chain reads and "last updated". */
export function formatDateTime(value: string, lang: Lang): string {
  const date = parseDate(value);
  if (!date) return "";
  return `${new Intl.DateTimeFormat(LOCALE[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date)} UTC`;
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

function parseDate(value: string): Date | null {
  if (!value) return null;
  // Date-only strings are pinned to UTC midnight so the calendar day is stable.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = dateOnly
    ? new Date(Date.UTC(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
