// Run with: pnpm test   (Node's built-in test runner, no extra dependency —
// Node 22 strips the TypeScript types itself).
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatAmount,
  formatDateTimeWib,
  formatPegLine,
  formatRatio,
  formatShare,
  resolveApiBaseUrl,
  resolveAttestationFileUrl,
  RESERVE_COMPOSITION,
  TRANSPARENCY_FALLBACK,
} from "./transparency.ts";

const API = "https://api.usdx.co.id";

describe("resolveAttestationFileUrl", () => {
  // The regression this exists for: the backend only emits an absolute fileUrl
  // when TRANSPARENCY_PUBLIC_BASE_URL is set. Unset, it sends a relative path,
  // and the landing page is served from a DIFFERENT host than the API. Resolving
  // against the page origin would silently produce a dead link on usdx.co.id.
  it("resolves a relative fileUrl against the API host, not the page", () => {
    assert.equal(
      resolveAttestationFileUrl("/api/v1/public/transparency/attestations/abc/file", API),
      "https://api.usdx.co.id/api/v1/public/transparency/attestations/abc/file",
    );
  });

  it("resolves a relative fileUrl against whichever API base the page is using", () => {
    assert.equal(
      resolveAttestationFileUrl("/api/v1/public/transparency/attestations/abc/file", "https://api-dev.usdx.co.id"),
      "https://api-dev.usdx.co.id/api/v1/public/transparency/attestations/abc/file",
    );
  });

  it("keeps an absolute fileUrl that is on the API host", () => {
    const absolute = "https://api.usdx.co.id/api/v1/public/transparency/attestations/abc/file";
    assert.equal(resolveAttestationFileUrl(absolute, API), absolute);
  });

  it("does not double up slashes when the API base has a trailing slash", () => {
    assert.equal(
      resolveAttestationFileUrl("/api/v1/x/file", "https://api.usdx.co.id/"),
      "https://api.usdx.co.id/api/v1/x/file",
    );
  });

  it("rejects non-http(s) schemes so nothing hostile reaches an href", () => {
    assert.equal(resolveAttestationFileUrl("javascript:alert(1)", API), null);
    assert.equal(resolveAttestationFileUrl("data:text/html,<script>", API), null);
  });

  // ── Origin lock ────────────────────────────────────────────────────────────
  // The backend always builds fileUrl against its own redirect route, so any
  // other origin means the value was tampered with somewhere upstream — a back
  // office account gone bad being the realistic case. A USDX-branded "Download"
  // button on the transparency page is exactly the wrapper a forged attestation
  // wants, so a foreign origin loses its link rather than being rendered.

  it("rejects an absolute fileUrl on a foreign host", () => {
    assert.equal(
      resolveAttestationFileUrl("https://storage.example.com/usdx/atestasi-2026-07.pdf", API),
      null,
    );
    assert.equal(
      resolveAttestationFileUrl("https://evil.example.com/laporan-atestasi-usdx.pdf", API),
      null,
    );
  });

  it("rejects a host that merely looks like the API host", () => {
    // Suffix and prefix lookalikes: a bare `endsWith`/`startsWith` check would
    // wave both of these through.
    assert.equal(resolveAttestationFileUrl("https://api.usdx.co.id.evil.test/f.pdf", API), null);
    assert.equal(resolveAttestationFileUrl("https://evil-api.usdx.co.id.co/f.pdf", API), null);
    assert.equal(resolveAttestationFileUrl("https://notapi.usdx.co.id/f.pdf", API), null);
  });

  it("rejects the API host on a different port", () => {
    assert.equal(resolveAttestationFileUrl("https://api.usdx.co.id:8443/f.pdf", API), null);
  });

  it("rejects a downgrade to http on the API host", () => {
    assert.equal(resolveAttestationFileUrl("http://api.usdx.co.id/f.pdf", API), null);
  });

  it("rejects the production API host while the page is talking to dev, and vice versa", () => {
    const DEV = "https://api-dev.usdx.co.id";
    assert.equal(resolveAttestationFileUrl(`${API}/f.pdf`, DEV), null);
    assert.equal(resolveAttestationFileUrl(`${DEV}/f.pdf`, API), null);
  });

  it("accepts an absolute fileUrl on whichever API base the page is using", () => {
    const DEV = "https://api-dev.usdx.co.id";
    assert.equal(resolveAttestationFileUrl(`${DEV}/f.pdf`, DEV), `${DEV}/f.pdf`);
  });

  it("rejects a protocol-relative url, which escapes the API host without looking like it", () => {
    assert.equal(resolveAttestationFileUrl("//evil.example.com/f.pdf", API), null);
  });

  it("still accepts a relative value with no leading slash", () => {
    assert.equal(
      resolveAttestationFileUrl("attestations/abc/file", "https://api.usdx.co.id/api/v1/public/"),
      "https://api.usdx.co.id/api/v1/public/attestations/abc/file",
    );
  });

  it("rejects empty, blank and missing values", () => {
    assert.equal(resolveAttestationFileUrl("", API), null);
    assert.equal(resolveAttestationFileUrl("   ", API), null);
    assert.equal(resolveAttestationFileUrl(null, API), null);
    assert.equal(resolveAttestationFileUrl(undefined, API), null);
  });

  it("returns null rather than throwing when the API base is unusable", () => {
    assert.equal(resolveAttestationFileUrl("/api/v1/x/file", "not a url"), null);
  });
});

describe("resolveApiBaseUrl", () => {
  it("maps both production landing domains to the production API", () => {
    assert.equal(resolveApiBaseUrl("usdx.co.id"), API);
    assert.equal(resolveApiBaseUrl("www.usdx.co.id"), API);
    assert.equal(resolveApiBaseUrl("usdxcoin.xyz"), API);
    assert.equal(resolveApiBaseUrl("www.usdxcoin.xyz"), API);
  });

  it("keeps local and preview hosts off the production API", () => {
    assert.equal(resolveApiBaseUrl("localhost"), "https://api-dev.usdx.co.id");
    assert.equal(resolveApiBaseUrl("deploy-preview-12--usdx.netlify.app"), "https://api-dev.usdx.co.id");
    assert.equal(resolveApiBaseUrl("dev.usdx.co.id"), "https://api-dev.usdx.co.id");
  });
});

// ── Figures ──────────────────────────────────────────────────────────────────
// The rule every test below defends: a value that is not known must come out
// EMPTY, so the page can render it as "Belum tersedia". It must never come out
// as a formatted zero, because "0,00" is not a missing figure — it is the claim
// that no USDX exists, or that the reserves are gone.

describe("formatAmount", () => {
  it("groups a decimal string per language", () => {
    assert.equal(formatAmount("100667.41", "id"), "100.667,41");
    assert.equal(formatAmount("100667.41", "en"), "100,667.41");
  });

  it("keeps the on-chain unit scale readable", () => {
    // circulatingSupply.amount arrives with six decimals (token decimals).
    assert.equal(formatAmount("100667.000000", "id"), "100.667,00");
  });

  // Number("") and Number("   ") are both 0. Without a guard, a blank amount
  // would print a confident "0,00" — the exact substitution this page forbids.
  it("returns empty for blank and whitespace, never a zero", () => {
    assert.equal(formatAmount("", "id"), "");
    assert.equal(formatAmount("   ", "id"), "");
    assert.equal(formatAmount("", "en"), "");
  });

  it("returns empty for values that are not numbers", () => {
    assert.equal(formatAmount("n/a", "id"), "");
    assert.equal(formatAmount("Infinity", "id"), "");
  });

  it("still formats a genuine zero when the API sends one", () => {
    // A real "0" is a claim the backend made on purpose; the page reports it
    // rather than hiding it. Only the ABSENCE of a value is unavailable.
    assert.equal(formatAmount("0", "id"), "0,00");
  });
});

describe("formatRatio", () => {
  it("renders a percentage in both languages", () => {
    assert.equal(formatRatio("100.00", "id"), "100,00%");
    assert.equal(formatRatio("100.00", "en"), "100.00%");
    assert.equal(formatRatio("101.25", "id"), "101,25%");
  });

  it("returns empty for blank and unparsable values", () => {
    assert.equal(formatRatio("", "id"), "");
    assert.equal(formatRatio("  ", "id"), "");
    assert.equal(formatRatio("abc", "en"), "");
  });
});

describe("formatShare", () => {
  it("drops the decimals a share does not need", () => {
    assert.equal(formatShare("100", "id"), "100%");
    assert.equal(formatShare("100", "en"), "100%");
    assert.equal(formatShare("12.5", "id"), "12,5%");
  });

  it("returns empty for blank values", () => {
    assert.equal(formatShare("", "id"), "");
  });
});

describe("formatPegLine", () => {
  it("derives the per-token value from the collateral ratio", () => {
    assert.equal(formatPegLine("100.00", "id"), "1 USDX = USD 1,00");
    assert.equal(formatPegLine("100.00", "en"), "1 USDX = USD 1.00");
  });

  // Two decimals alone would round 99.6% backing up to a reassuring "1,00".
  // Overstating the backing is the one direction this page must not round in.
  it("does not round a shortfall away", () => {
    assert.equal(formatPegLine("99.60", "id"), "1 USDX = USD 0,996");
    assert.equal(formatPegLine("99.60", "en"), "1 USDX = USD 0.996");
  });

  it("keeps surplus backing visible too", () => {
    assert.equal(formatPegLine("101.25", "id"), "1 USDX = USD 1,0125");
  });

  // A null ratio has no per-token value either. Empty tells the page to hide
  // the line rather than announce "1 USDX = USD 0,00", which reads as a total
  // loss of backing rather than as a missing figure.
  it("returns empty for blank and unparsable ratios", () => {
    assert.equal(formatPegLine("", "id"), "");
    assert.equal(formatPegLine("   ", "en"), "");
    assert.equal(formatPegLine("tidak diketahui", "id"), "");
  });
});

describe("formatDateTimeWib", () => {
  // These figures are live, so the caption carries the clock time, and it is
  // pinned to Jakarta rather than the reader's own zone: a stamp that moves
  // with the visitor's laptop cannot be quoted back or matched to a ledger
  // entry. 04:05 UTC is 11:05 WIB.
  it("stamps an ISO timestamp in Jakarta time, with the hour", () => {
    assert.equal(
      formatDateTimeWib("2026-08-10T04:05:00.000Z", "id"),
      "10 Agustus 2026, 11.05 WIB",
    );
    assert.equal(
      formatDateTimeWib("2026-08-10T04:05:00.000Z", "en"),
      "August 10, 2026, 11:05 WIB",
    );
  });

  it("rolls the date forward for a UTC evening that is already tomorrow in WIB", () => {
    assert.equal(
      formatDateTimeWib("2026-08-10T18:30:00.000Z", "id"),
      "11 Agustus 2026, 01.30 WIB",
    );
  });

  // en-US renders midnight as 24:00 under `hour12: false`; `hourCycle: "h23"`
  // is what keeps both languages on the same clock.
  it("renders WIB midnight as 00, not 24", () => {
    assert.equal(formatDateTimeWib("2026-08-09T17:00:00.000Z", "id"), "10 Agustus 2026, 00.00 WIB");
    assert.equal(formatDateTimeWib("2026-08-09T17:00:00.000Z", "en"), "August 10, 2026, 00:00 WIB");
  });

  it("returns empty for blank and unparsable timestamps", () => {
    assert.equal(formatDateTimeWib("", "id"), "");
    assert.equal(formatDateTimeWib("   ", "id"), "");
    assert.equal(formatDateTimeWib("bukan tanggal", "en"), "");
  });
});

describe("published claims", () => {
  // Nothing may be baked in here without a published position behind it. All
  // null is the honest state while the public endpoint is not live: the static
  // HTML then says "Belum tersedia" in every figure slot.
  it("ships no invented figures in the static fallback", () => {
    assert.equal(TRANSPARENCY_FALLBACK.circulatingSupply, null);
    assert.equal(TRANSPARENCY_FALLBACK.reserve, null);
    assert.equal(TRANSPARENCY_FALLBACK.collateralRatio, null);
    assert.equal(TRANSPARENCY_FALLBACK.updatedAt, null);
  });

  // USDX reserves are 100% U.S. dollar cash at BNI. Comparable pages break
  // their reserves into treasury instruments and money market funds; copying
  // that shape would put instruments on this page that USDX does not hold.
  it("states the reserve as cash only, adding up to 100%", () => {
    const total = RESERVE_COMPOSITION.reduce((sum, item) => sum + Number(item.share), 0);
    assert.equal(total, 100);
    const copy = RESERVE_COMPOSITION.flatMap((item) => [item.label.id, item.label.en]).join(" ");
    assert.match(copy, /BNI/);
    assert.doesNotMatch(copy, /treasur/i);
    assert.doesNotMatch(copy, /money market/i);
    assert.doesNotMatch(copy, /obligasi|surat utang|reksa dana/i);
  });
});
