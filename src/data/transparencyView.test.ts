// What /transparency decides to show, tested against the payloads it will
// actually meet — including the ones the locked contract says it never will.
//
// The page's 36 previous tests were all over pure formatters, and every screen
// bug it shipped lived in code no test could import: the attestation state
// machine, the figure slots, the status line. That code is now in
// transparencyView.ts, and this file is the reason it moved.
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildAttestationsView,
  buildFiguresView,
  buildView,
  type AttestationRow,
  type TransparencyView,
} from "./transparencyView.ts";
import { ui } from "../i18n.ts";

const API = "https://api.usdx.co.id";
const t = ui.transparency;

/** A complete, contract-shaped payload. Individual tests bend one field. */
function payload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    token: {
      symbol: "USDX",
      chain: "polygon",
      contractAddress: "0x1FF2A62Dd802D74d0B0cA6d36D43D2A13AB43a55",
      decimals: 6,
      explorerUrl: "https://polygonscan.com/token/0x1FF2",
    },
    circulatingSupply: {
      amount: "100667.000000",
      unit: "USDX",
      source: "onchain",
      readAt: "2026-08-10T04:00:00.000Z",
    },
    reserve: {
      amount: "100667.41",
      currency: "USD",
      custodian: "Bank Negara Indonesia (BNI)",
      balanceAt: "2026-08-10T04:00:00.000Z",
    },
    collateralRatio: "100.00",
    attestations: [
      {
        period: "2026-07",
        title: "Laporan Atestasi Juli 2026",
        fileUrl: "/api/v1/public/transparency/attestations/abc/file",
        publishedAt: "2026-08-05T04:00:00.000Z",
      },
    ],
    updatedAt: "2026-08-10T04:00:00.000Z",
    ...overrides,
  };
}

function attestation(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    period: "2026-07",
    title: "Laporan Atestasi Juli 2026",
    fileUrl: "/api/v1/public/transparency/attestations/abc/file",
    publishedAt: "2026-08-05T04:00:00.000Z",
    ...overrides,
  };
}

function viewOf(data: unknown): TransparencyView {
  const view = buildView(data, API);
  if (!view) throw new Error("expected a view, got null");
  return view;
}

function rowsOf(value: unknown): AttestationRow[] {
  const view = buildAttestationsView(value, API);
  assert.equal(view.state, "list", `expected a table, got "${view.state}"`);
  return view.state === "list" ? view.rows : [];
}

// ── The document list ────────────────────────────────────────────────────────

describe("buildAttestationsView — the happy path", () => {
  it("builds one row per document, newest period first", () => {
    const rows = rowsOf([
      attestation({ period: "2026-06", title: "Juni" }),
      attestation({ period: "2026-08", title: "Agustus" }),
      attestation({ period: "2026-07", title: "Juli" }),
    ]);
    assert.deepEqual(
      rows.map((row) => row.id),
      ["2026-08", "2026-07", "2026-06"],
    );
    assert.deepEqual(
      rows.map((row) => row.title),
      ["Agustus", "Juli", "Juni"],
    );
  });

  it("names the month in both languages and the year on its own", () => {
    const [row] = rowsOf([attestation({ period: "2026-07" })]);
    assert.deepEqual(row.month, { id: "Juli 2026", en: "July 2026" });
    assert.equal(row.year, "2026");
    assert.equal(row.id, "2026-07");
  });

  it("resolves the download link against the API host", () => {
    const [row] = rowsOf([attestation()]);
    assert.equal(row.href, `${API}/api/v1/public/transparency/attestations/abc/file`);
  });

  it("drops a link that points off the API's own origin", () => {
    // The origin lock lives in resolveAttestationFileUrl; this is the wiring
    // that makes a rejected link cost one row its button and nothing more.
    const [row] = rowsOf([attestation({ fileUrl: "https://evil.example.com/laporan.pdf" })]);
    assert.equal(row.href, null);
    assert.equal(row.title, "Laporan Atestasi Juli 2026");
  });

  it("sorts on the period digits, not on locale rules", () => {
    const rows = rowsOf([
      attestation({ period: "2026-01" }),
      attestation({ period: "2026-11" }),
      attestation({ period: "2026-02" }),
    ]);
    assert.deepEqual(
      rows.map((row) => row.id),
      ["2026-11", "2026-02", "2026-01"],
    );
  });
});

// ── BLOCKER: a list that is not a list ───────────────────────────────────────
// `[...attestations]` threw a TypeError on every shape below, AFTER the
// "loading" line had been hidden — leaving an empty dark box with no sentence
// in it — and the catch in load() then reported the whole page as failed, over
// three figure cards that had just been filled from the same response.

describe("buildAttestationsView — payloads that are not a list", () => {
  const notLists: Array<[string, unknown]> = [
    ["an object", { "2026-07": "Laporan Juli" }],
    ["the admin endpoint's shape", { items: [attestation()] }],
    ["a string", "2026-07"],
    ["a number", 3],
    ["null", null],
    ["a missing field", undefined],
    ["a boolean", false],
  ];

  for (const [name, value] of notLists) {
    it(`reports ${name} as unavailable rather than as an empty list`, () => {
      assert.deepEqual(buildAttestationsView(value, API), { state: "unavailable" });
    });
  }

  it("never throws on any of them", () => {
    for (const [, value] of notLists) {
      assert.doesNotThrow(() => buildAttestationsView(value, API));
    }
  });

  it("says nothing about how many reports exist", () => {
    // The copy shown for "unavailable" must not be the copy for "empty": one is
    // about this page's connection, the other is a claim about USDX.
    assert.notEqual(t.listUnavailable.id, t.empty.id);
    assert.doesNotMatch(t.listUnavailable.id, /belum ada dokumen/i);
    assert.doesNotMatch(t.listUnavailable.en, /no document has been published/i);
  });
});

// ── BLOCKER: a missing field is not an empty list ────────────────────────────
// `data.attestations ?? []` made "the field never arrived" indistinguishable
// from "the API says there are none", and answered both with the single most
// expensive sentence this page can print.

describe("buildAttestationsView — empty means empty", () => {
  it("claims nothing has been published ONLY for a list the API sent with nothing in it", () => {
    assert.deepEqual(buildAttestationsView([], API), { state: "empty" });
  });

  it("does not claim it for a payload with no attestations field", () => {
    const view = buildView(payload({ attestations: undefined }), API);
    assert.equal(view?.attestations.state, "unavailable");
  });

  it("does not claim it for a payload where the field is null", () => {
    const view = buildView(payload({ attestations: null }), API);
    assert.equal(view?.attestations.state, "unavailable");
  });

  it("does not claim it when every entry is unreadable", () => {
    // Entries arrived, so the list is broken rather than empty.
    assert.deepEqual(buildAttestationsView([null, "2026-07", 7], API), { state: "unavailable" });
  });
});

// ── BLOCKER: one bad row may not take the table down ─────────────────────────

describe("buildAttestationsView — one unreadable entry", () => {
  it("keeps every other document when one entry has no period", () => {
    const rows = rowsOf([
      attestation({ period: "2026-07", title: "Juli" }),
      attestation({ period: null, title: "Rusak" }),
      attestation({ period: "2026-06", title: "Juni" }),
    ]);
    assert.equal(rows.length, 3);
    assert.deepEqual(
      rows.map((row) => row.title),
      ["Juli", "Juni", "Rusak"],
    );
  });

  it("gives the unreadable row an em dash instead of an invented ID", () => {
    const [row] = rowsOf([attestation({ period: null })]);
    assert.equal(row.id, "—");
    assert.equal(row.year, "—");
    assert.deepEqual(row.month, { id: "—", en: "—" });
  });

  it("does not throw when a period is missing, null, or of another type", () => {
    for (const period of [null, undefined, 202607, {}, [], ""]) {
      assert.doesNotThrow(() => buildAttestationsView([attestation({ period })], API));
    }
  });

  it("survives an entry that is not an object at all", () => {
    const rows = rowsOf([attestation({ title: "Juli" }), null, "rusak", 7]);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].title, "Juli");
  });

  it("shows an impossible month as it arrived, without rolling it into a year", () => {
    // "2026-13" used to render as ID 2026-13, month "Januari 2027", year 2026.
    const [row] = rowsOf([attestation({ period: "2026-13" })]);
    assert.equal(row.id, "—");
    assert.equal(row.year, "—");
    assert.deepEqual(row.month, { id: "2026-13", en: "2026-13" });
  });

  it("falls back to an em dash for a missing title rather than a blank cell", () => {
    const [row] = rowsOf([attestation({ title: "   " })]);
    assert.equal(row.title, "—");
  });
});

// ── The three headline figures ───────────────────────────────────────────────

describe("buildFiguresView", () => {
  it("fills every slot from a complete payload", () => {
    const figures = buildFiguresView(payload());
    assert.deepEqual(figures.supply, { id: "100.667,00", en: "100,667.00" });
    assert.deepEqual(figures.reserve, { id: "100.667,41", en: "100,667.41" });
    assert.deepEqual(figures.ratio, { id: "100,00%", en: "100.00%" });
    assert.deepEqual(figures.peg, {
      id: "1 USDX = USD 1,00",
      en: "1 USDX = USD 1.00",
    });
    assert.equal(figures.reserveCaption.id, "Posisi per 10 Agustus 2026, 11.00 WIB");
    assert.equal(figures.updatedCaption.en, "Last updated August 10, 2026, 11:00 WIB");
  });

  it("leaves a missing figure null so the page can say it in words", () => {
    const figures = buildFiguresView(
      payload({
        reserve: null,
        collateralRatio: null,
        circulatingSupply: { amount: null, unit: "USDX", source: "onchain", readAt: null },
      }),
    );
    assert.equal(figures.supply, null);
    assert.equal(figures.reserve, null);
    assert.equal(figures.ratio, null);
    assert.equal(figures.peg, null);
    assert.equal(figures.supplyCaption.id, t.captionUnavailable.id);
    assert.equal(figures.reserveCaption.id, t.captionUnavailable.id);
  });

  // A ledger that has gone below zero: the contract has the backend send null
  // for both, and the page must treat a negative that reaches it anyway as a
  // missing figure rather than print "-USD 500,00" and "-0,50%".
  it("treats a negative balance as not yet available", () => {
    const negative = buildFiguresView(
      payload({
        reserve: {
          amount: "-500.00",
          currency: "USD",
          custodian: "Bank Negara Indonesia (BNI)",
          balanceAt: "2026-08-10T04:00:00.000Z",
        },
        collateralRatio: "-0.50",
      }),
    );
    assert.equal(negative.reserve, null);
    assert.equal(negative.ratio, null);
    assert.equal(negative.peg, null);

    // Which is exactly what the contract-compliant response looks like — the
    // backend withholding both fields — so the two land in the same state.
    const withheld = buildFiguresView(payload({ reserve: null, collateralRatio: null }));
    assert.deepEqual(
      { reserve: negative.reserve, ratio: negative.ratio, peg: negative.peg },
      { reserve: withheld.reserve, ratio: withheld.ratio, peg: withheld.peg },
    );
  });

  it("withholds a figure whose label disagrees with the one the page prints", () => {
    // The card prints "USD" from a repo constant. A rupiah balance under it
    // would be a far larger error than showing nothing.
    const rupiah = buildFiguresView(
      payload({
        reserve: {
          amount: "1810000000.00",
          currency: "IDR",
          custodian: "Bank Negara Indonesia (BNI)",
          balanceAt: "2026-08-10T04:00:00.000Z",
        },
      }),
    );
    assert.equal(rupiah.reserve, null);
    // And the ratio goes with it: "1 USDX = USD 1,00" beneath a withheld rupiah
    // balance would be the same wrong claim, made in the one place on the card
    // that spells the currency out.
    assert.equal(rupiah.ratio, null);
    assert.equal(rupiah.peg, null);

    const otherToken = buildFiguresView(
      payload({
        circulatingSupply: {
          amount: "100667.000000",
          unit: "USDT",
          source: "onchain",
          readAt: "2026-08-10T04:00:00.000Z",
        },
      }),
    );
    assert.equal(otherToken.supply, null);
  });

  it("accepts the contract's own labels whatever their case, and a missing one", () => {
    const lower = buildFiguresView(
      payload({
        reserve: {
          amount: "100667.41",
          currency: "usd",
          custodian: "Bank Negara Indonesia (BNI)",
          balanceAt: "2026-08-10T04:00:00.000Z",
        },
      }),
    );
    assert.deepEqual(lower.reserve, { id: "100.667,41", en: "100,667.41" });

    const missing = buildFiguresView(
      payload({ reserve: { amount: "100667.41", balanceAt: "2026-08-10T04:00:00.000Z" } }),
    );
    assert.deepEqual(missing.reserve, { id: "100.667,41", en: "100,667.41" });
  });

  it("never turns an unreadable figure into a zero", () => {
    const figures = buildFiguresView(
      payload({
        circulatingSupply: { amount: "", unit: "USDX", source: "onchain", readAt: "" },
        reserve: {
          amount: "   ",
          currency: "USD",
          custodian: "BNI",
          balanceAt: "not a date",
        },
        collateralRatio: "0x64",
      }),
    );
    assert.equal(figures.supply, null);
    assert.equal(figures.reserve, null);
    assert.equal(figures.ratio, null);
    assert.equal(figures.peg, null);
  });

  it("reads a genuine zero as the claim it is", () => {
    const figures = buildFiguresView(payload({ collateralRatio: "0.00" }));
    assert.deepEqual(figures.ratio, { id: "0,00%", en: "0.00%" });
  });

  it("does not fall over on a payload with nothing in it", () => {
    const figures = buildFiguresView({});
    assert.equal(figures.supply, null);
    assert.equal(figures.reserve, null);
    assert.equal(figures.ratio, null);
    assert.equal(figures.updatedCaption.id, t.captionUnavailable.id);
  });
});

// ── The page as a whole ──────────────────────────────────────────────────────

describe("buildView", () => {
  it("reports live data when the whole payload arrived", () => {
    const view = buildView(payload(), API);
    assert.equal(view?.status, "live");
    assert.equal(view?.attestations.state, "list");
  });

  it("reports live data when the API sent an empty list", () => {
    const view = buildView(payload({ attestations: [] }), API);
    assert.equal(view?.status, "live");
    assert.equal(view?.attestations.state, "empty");
  });

  // BLOCKER: the figures rendered from the response while the status line above
  // them announced that the figures could not be shown.
  it("reports a partial load when the figures arrived but the list did not", () => {
    const view = buildView(payload({ attestations: { items: [] } }), API);
    assert.equal(view?.status, "partial");
    assert.deepEqual(view?.figures.supply, { id: "100.667,00", en: "100,667.00" });
    assert.deepEqual(view?.figures.reserve, { id: "100.667,41", en: "100,667.41" });
  });

  it("does not describe a half-loaded page as a failed one", () => {
    // The "partial" line has to name the figures as present. statusFallback
    // says the opposite, and was what this state used to show.
    assert.notEqual(t.statusLivePartial.id, t.statusFallback.id);
    assert.match(t.statusLivePartial.id, /angka/i);
    assert.match(t.statusLivePartial.en, /figures/i);
  });

  it("returns null only when there is no payload object to read at all", () => {
    for (const data of [null, undefined, "payload", 7, [], true]) {
      assert.equal(buildView(data, API), null);
    }
  });

  it("does not throw on any hostile payload shape", () => {
    const shapes: unknown[] = [
      payload({ circulatingSupply: "100667", reserve: 5, collateralRatio: {} }),
      payload({ attestations: [attestation({ fileUrl: { href: "x" } })] }),
      payload({ updatedAt: 20260810 }),
      { attestations: [{}] },
      {},
    ];
    for (const shape of shapes) {
      assert.doesNotThrow(() => buildView(shape, API));
    }
  });
});

// ── Both languages, everywhere ───────────────────────────────────────────────

describe("bilingual copy", () => {
  it("carries every new line in both languages", () => {
    for (const key of ["docsHeading", "listUnavailable", "statusLivePartial", "reserveBank"] as const) {
      assert.equal(typeof t[key].id, "string");
      assert.equal(typeof t[key].en, "string");
      assert.notEqual(t[key].id.trim(), "");
      assert.notEqual(t[key].en.trim(), "");
    }
  });

  it("builds every view string in both languages", () => {
    const view = viewOf(payload());
    const rows = view.attestations.state === "list" ? view.attestations.rows : [];
    const slots = [
      view.figures.supply,
      view.figures.reserve,
      view.figures.ratio,
      view.figures.peg,
      view.figures.supplyCaption,
      view.figures.reserveCaption,
      view.figures.updatedCaption,
      ...rows.map((row) => row.month),
    ];
    for (const value of slots) {
      if (!value) throw new Error("a view slot came back empty");
      assert.notEqual(value.id.trim(), "");
      assert.notEqual(value.en.trim(), "");
    }
  });
});
