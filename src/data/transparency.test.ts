// Run with: pnpm test   (Node's built-in test runner, no extra dependency —
// Node 22 strips the TypeScript types itself).
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatAmount,
  formatDateTimeWib,
  formatPegLine,
  formatPeriod,
  formatRatio,
  formatShare,
  parsePeriod,
  resolveApiBaseUrl,
  resolveAttestationFileUrl,
  RESERVE_BANK,
  RESERVE_COMPOSITION,
  TRANSPARENCY_FALLBACK,
} from "./transparency.ts";
import { ui } from "../i18n.ts";

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
  it("maps the production landing domain to the production API", () => {
    assert.equal(resolveApiBaseUrl("usdx.co.id"), API);
    assert.equal(resolveApiBaseUrl("www.usdx.co.id"), API);
  });

  it("keeps local and dev hosts off the production API", () => {
    assert.equal(resolveApiBaseUrl("localhost"), "https://api-dev.usdx.co.id");
    assert.equal(resolveApiBaseUrl("127.0.0.1"), "https://api-dev.usdx.co.id");
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

  // `Number()` reads bases and notations that no field on this page is written
  // in, and `Number.isFinite` cannot tell the difference: every value below is
  // a finite number, just not the number the string says. A contract address
  // landing in an amount field used to publish "USD 8.178,00".
  it("refuses anything that is not a plain decimal string", () => {
    assert.equal(formatAmount("0x1FF2", "id"), "");
    assert.equal(formatAmount("0b101", "id"), "");
    assert.equal(formatAmount("0o17", "id"), "");
    assert.equal(formatAmount("1e3", "id"), "");
    assert.equal(formatAmount("1_000", "id"), "");
    assert.equal(formatAmount("100,667.41", "id"), "");
    assert.equal(formatAmount("+100", "id"), "");
    assert.equal(formatAmount("100.", "id"), "");
    assert.equal(formatAmount(".41", "id"), "");
    assert.equal(formatRatio("0b101", "id"), "");
    assert.equal(formatPegLine("1e3", "id"), "");
    assert.equal(formatShare("0x64", "id"), "");
  });

  it("accepts a decimal string with stray whitespace around it", () => {
    assert.equal(formatAmount("  100667.41  ", "id"), "100.667,41");
  });

  // The contract has the backend withhold reserve and ratio once the ledger
  // balance goes negative (§ 2), so a negative arriving here means something
  // upstream is wrong. "-USD 500,00" under "Aset cadangan" is a worse answer
  // than "Belum tersedia".
  it("never renders a negative figure", () => {
    assert.equal(formatAmount("-500.00", "id"), "");
    assert.equal(formatAmount("-0.01", "en"), "");
    assert.equal(formatRatio("-0.50", "id"), "");
    assert.equal(formatPegLine("-0.50", "id"), "");
    assert.equal(formatShare("-100", "id"), "");
  });

  // Truncation, not rounding: the digits are in the string already.
  it("cuts extra decimals instead of rounding them up", () => {
    assert.equal(formatAmount("100667.999", "id"), "100.667,99");
    assert.equal(formatAmount("8.29", "id"), "8,29");
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

  // The band that leaks: rounding to two decimals turns everything from 99.995
  // upwards into "100,00%", and full backing is the one claim this page may not
  // make on a ratio that is short of it.
  it("never rounds a ratio below 100 up to 100", () => {
    assert.equal(formatRatio("99.995", "id"), "99,99%");
    assert.equal(formatRatio("99.999", "id"), "99,99%");
    assert.equal(formatRatio("99.9999999", "en"), "99.99%");
    assert.equal(formatRatio("99.99", "id"), "99,99%");
  });

  it("still prints a real 100 as 100", () => {
    assert.equal(formatRatio("100", "id"), "100,00%");
    assert.equal(formatRatio("100.00", "id"), "100,00%");
    assert.equal(formatRatio("100.004", "id"), "100,00%");
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

  // Four decimals still round: 0.99995 becomes "1,00" the moment rounding is
  // allowed to reach the last digit. A ratio under 100 must never print as a
  // whole dollar per token.
  it("never rounds a shortfall up to a whole dollar", () => {
    assert.equal(formatPegLine("99.995", "id"), "1 USDX = USD 0,9999");
    assert.equal(formatPegLine("99.999", "en"), "1 USDX = USD 0.9999");
    assert.equal(formatPegLine("99.99999", "id"), "1 USDX = USD 0,9999");
  });

  it("still prints a real 100 as one dollar per token", () => {
    assert.equal(formatPegLine("100", "id"), "1 USDX = USD 1,00");
    assert.equal(formatPegLine("100.0000", "en"), "1 USDX = USD 1.00");
  });

  // The currency and the symbol come from the same constants the cards print,
  // so the line beneath the ratio cannot name a different currency than the
  // card beside it. They used to be parameters no caller ever filled.
  it("names the same currency the reserve card does", () => {
    assert.match(formatPegLine("100.00", "id"), /^1 USDX = USD /);
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

  it("reads an explicit offset rather than assuming one", () => {
    // 11:00 in Jakarta's own offset is 11.00 WIB; the same instant written in
    // London's summer offset is the same stamp.
    assert.equal(formatDateTimeWib("2026-08-10T11:00:00+07:00", "id"), "10 Agustus 2026, 11.00 WIB");
    assert.equal(formatDateTimeWib("2026-08-10T05:00:00+01:00", "id"), "10 Agustus 2026, 11.00 WIB");
    assert.equal(formatDateTimeWib("2026-08-10T00:00:00-04:00", "id"), "10 Agustus 2026, 11.00 WIB");
  });

  it("rejects a date that does not exist", () => {
    assert.equal(formatDateTimeWib("2026-02-31T04:00:00Z", "id"), "");
    assert.equal(formatDateTimeWib("2026-13-01T04:00:00Z", "id"), "");
    assert.equal(formatDateTimeWib("2026-08-10T25:00:00Z", "id"), "");
  });

  // A date carries no time of day. "2026-08-10" used to print "07.00 WIB" —
  // Jakarta's rendering of UTC midnight, an hour nobody sent, dressed in a zone
  // label to look authoritative.
  it("prints a date-only value without inventing a clock time", () => {
    assert.equal(formatDateTimeWib("2026-08-10", "id"), "10 Agustus 2026");
    assert.equal(formatDateTimeWib("2026-08-10", "en"), "August 10, 2026");
  });
});

// A timestamp with no `Z` and no offset is resolved by `new Date()` against
// whatever zone the READER'S machine is in. One payload therefore printed
// "04.00 WIB" in Jakarta, "10.00 WIB" in London and "15.00 WIB" in New York —
// a fourteen-hour spread, all three labelled WIB, none of them detectable from
// the page. The contract says every timestamp is UTC (§ 0), so that is what a
// missing zone means, and the answer is the same on every machine.
describe("formatDateTimeWib, from anywhere in the world", () => {
  const ZONES = ["Asia/Jakarta", "Europe/London", "America/New_York", "Pacific/Kiritimati", "UTC"];

  function inZone<T>(zone: string, run: () => T): T {
    const previous = process.env.TZ;
    process.env.TZ = zone;
    try {
      return run();
    } finally {
      if (previous === undefined) delete process.env.TZ;
      else process.env.TZ = previous;
    }
  }

  it("stamps a zone-less timestamp identically in every reader's zone", () => {
    for (const zone of ZONES) {
      assert.equal(
        inZone(zone, () => formatDateTimeWib("2026-08-10T04:00:00", "id")),
        "10 Agustus 2026, 11.00 WIB",
        `zone-less timestamp drifted in ${zone}`,
      );
    }
  });

  it("stamps a date-only value identically in every reader's zone", () => {
    for (const zone of ZONES) {
      assert.equal(
        inZone(zone, () => formatDateTimeWib("2026-08-10", "id")),
        "10 Agustus 2026",
        `date-only value drifted in ${zone}`,
      );
    }
  });

  it("stamps a UTC timestamp identically in every reader's zone", () => {
    for (const zone of ZONES) {
      assert.equal(
        inZone(zone, () => formatDateTimeWib("2026-08-10T04:05:00.000Z", "en")),
        "August 10, 2026, 11:05 WIB",
        `UTC timestamp drifted in ${zone}`,
      );
    }
  });

  it("proves the test itself can see a zone change", () => {
    // Without this, a Node that ignored a mid-run TZ change would make the three
    // tests above pass for the wrong reason.
    const parsed = ZONES.map((zone) => inZone(zone, () => new Date("2026-08-10T04:00:00").getTime()));
    assert.equal(new Set(parsed).size > 1, true, "TZ changes are not reaching Date parsing");
  });
});

describe("formatPeriod", () => {
  it("names the month in both languages", () => {
    assert.equal(formatPeriod("2026-07", "id"), "Juli 2026");
    assert.equal(formatPeriod("2026-07", "en"), "July 2026");
    assert.equal(formatPeriod("2026-01", "id"), "Januari 2026");
    assert.equal(formatPeriod("2026-12", "en"), "December 2026");
  });

  // Date.UTC rolls month 13 into January of the next year and month 0 back into
  // December of the previous one, so one malformed period produced a row
  // reading "ID 2026-13 · Bulan Januari 2027 · Tahun 2026" — three answers, no
  // two of them agreeing.
  it("does not roll an impossible month into another year", () => {
    assert.equal(formatPeriod("2026-13", "id"), "2026-13");
    assert.equal(formatPeriod("2026-00", "id"), "2026-00");
    assert.equal(formatPeriod("2026-99", "en"), "2026-99");
    assert.equal(parsePeriod("2026-13"), null);
    assert.equal(parsePeriod("2026-00"), null);
  });

  it("returns the raw string for anything that is not a period", () => {
    assert.equal(formatPeriod("2026", "id"), "2026");
    assert.equal(formatPeriod("juli", "id"), "juli");
    assert.equal(parsePeriod(null), null);
    assert.equal(parsePeriod(undefined), null);
    assert.equal(parsePeriod("2026-7"), null);
  });

  it("reads a real period", () => {
    assert.deepEqual(parsePeriod("2026-07"), { year: 2026, month: 7 });
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
  // The official documentation says the reserves are "held in U.S. dollar cash
  // at Bank Negara Indonesia (BNI)" and never calls BNI a custodian. That is a
  // licensed banking role with a specific meaning, and the phrase was already
  // removed once from the footer and the meta description for being the site's
  // own word rather than the documentation's. It must not come back beside the
  // reserve figures.
  it("names the bank without claiming a custodian role for it", () => {
    assert.equal(RESERVE_BANK, "Bank Negara Indonesia (BNI)");
    const label = [ui.transparency.reserveBank.id, ui.transparency.reserveBank.en].join(" ");
    assert.doesNotMatch(label, /kustodian|custodian|custody/i);
    assert.match(label, /bank penyimpan/i);
    assert.match(label, /held at/i);
  });

  it("keeps the word out of every line of transparency copy", () => {
    const copy = JSON.stringify(ui.transparency);
    assert.doesNotMatch(copy, /kustodian|custodian|custody/i);
  });

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
