// What /transparency decides to show, tested against the payloads it will
// actually meet — including the ones the locked contract says it never will.
//
// The page's 36 previous tests were all over pure formatters, and every screen
// bug it shipped lived in code no test could import: the figure slots, the
// status line. That code is now in transparencyView.ts, and this file is the
// reason it moved.
//
// The payloads below still carry `attestations`, because the API still sends
// it. The page stopped rendering that list on 30 Sep 2026, so what is tested
// about it now is that it has no say in anything.
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildFiguresView,
  buildView,
  STATUS_LINE,
  type TransparencyStatus,
  type TransparencyView,
} from "./transparencyView.ts";
import { ui } from "../i18n.ts";

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

/**
 * The backend's TOTAL-OUTAGE payload, field for field.
 *
 * Not an invented "broken" shape: this is `unavailableView()` in
 * transparency.service.ts, the well-formed 200 the API serves when it cannot
 * assemble anything and refuses to answer 500 (a 500 would send this page to
 * its own static figures, which are the stale claim the endpoint is avoiding).
 * The token block survives because it is pure configuration; every field that
 * needs the database or the chain comes back null, INCLUDING `attestations`.
 *
 * Every cold start of a replica while the database is down serves this, as does
 * any outage that outlives the age limit on the last good payload.
 */
function unavailablePayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    token: {
      symbol: "USDX",
      chain: "polygon",
      contractAddress: "0x1FF2A62Dd802D74d0B0cA6d36D43D2A13AB43a55",
      decimals: 6,
      explorerUrl: "https://polygonscan.com/token/0x1FF2",
    },
    circulatingSupply: { amount: null, unit: "USDX", source: "onchain", readAt: null },
    reserve: null,
    collateralRatio: null,
    attestations: null,
    // Stamped with the moment the request was served, not with the age of
    // anything on screen — which is why the page may not read a fresh timestamp
    // as evidence that there are figures behind it.
    updatedAt: "2026-08-11T04:15:00.000Z",
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
  const view = buildView(data);
  if (!view) throw new Error("expected a view, got null");
  return view;
}

/** Every figure slot empty, the way a healthy API can send it. */
const FIGURES_GONE = {
  circulatingSupply: { amount: null, unit: "USDX", source: "onchain", readAt: null },
  reserve: null,
  collateralRatio: null,
};

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
  it("reports live data when the figures arrived", () => {
    const view = viewOf(payload());
    assert.equal(view.status, "live");
    assert.deepEqual(view.figures.supply, { id: "100.667,00", en: "100,667.00" });
    assert.deepEqual(view.figures.reserve, { id: "100.667,41", en: "100,667.41" });
  });

  it("returns null only when there is no payload object to read at all", () => {
    for (const data of [null, undefined, "payload", 7, [], true]) {
      assert.equal(buildView(data), null);
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
      assert.doesNotThrow(() => buildView(shape));
    }
  });
});

// ── The document list has no say ─────────────────────────────────────────────
// The "Laporan Atestasi Bulanan" table is gone from the page, so the field that
// fed it must not reach the screen by another route. While the table existed the
// status line was derived partly from this list, and a null or malformed one
// produced "the document list cannot be shown right now" — a sentence about a
// card that is no longer there.

describe("buildView — the attestation list is ignored", () => {
  const lists: Array<[string, unknown]> = [
    ["a list of reports", [attestation()]],
    ["an empty list", []],
    ["null", null],
    ["a missing field", undefined],
    ["the admin endpoint's shape", { items: [attestation()] }],
    ["a string", "2026-07"],
  ];

  for (const [name, value] of lists) {
    it(`builds the same view whatever the list is: ${name}`, () => {
      assert.deepEqual(viewOf(payload({ attestations: value })), viewOf(payload()));
      assert.deepEqual(
        viewOf(payload({ ...FIGURES_GONE, attestations: value })),
        viewOf(payload(FIGURES_GONE)),
      );
    });
  }

  it("carries nothing about the list in the view", () => {
    assert.deepEqual(Object.keys(viewOf(payload())).sort(), ["figures", "status"]);
  });

  it("does not mention a document list in any status line", () => {
    const lines = [t.statusLoading, t.statusLive, t.statusFallback, t.statusNoJs];
    for (const line of lines) {
      assert.doesNotMatch(line.id, /daftar dokumen/i);
      assert.doesNotMatch(line.en, /document list/i);
    }
  });
});

// ── BLOCKER: the status line named figures that were not there ───────────────
// The backend's total-outage payload is a well-formed 200 with every figure
// null. Reading "a response arrived" as "the data is live" printed "Data
// langsung dari API USDX" above three cards all reading "Belum tersedia" and a
// caption stamped with the current minute.

describe("buildView — the status line describes the screen", () => {
  it("claims nothing is live for the backend's total-outage payload", () => {
    const view = viewOf(unavailablePayload());

    assert.equal(view.status, "unavailable");
    // Which is the same sentence a dropped connection shows, because it is the
    // same screen: nothing arrived either way.
    assert.deepEqual(STATUS_LINE[view.status], t.statusFallback);
    assert.notEqual(STATUS_LINE[view.status].id, t.statusLive.id);
  });

  it("has nothing on screen for that payload to describe", () => {
    // The other half of the claim above: the sentence is only right because
    // every slot it covers really is empty.
    const view = viewOf(unavailablePayload());
    assert.equal(view.figures.supply, null);
    assert.equal(view.figures.reserve, null);
    assert.equal(view.figures.ratio, null);
    assert.equal(view.figures.peg, null);
  });

  it("keeps the outage payload's fresh timestamp out of the decision", () => {
    // `updatedAt` is stamped with the moment the request was served even when
    // nothing behind it could be read, so a caption reading "terakhir
    // diperbarui: barusan" is not evidence of a single figure.
    const view = viewOf(unavailablePayload());
    assert.match(view.figures.updatedCaption.id, /11 Agustus 2026/);
    assert.equal(view.status, "unavailable");
  });

  it("claims nothing is live when a healthy API has no figure to send", () => {
    // No outage required: an empty reserve ledger and a failed chain read do
    // this on a completely healthy API.
    const view = viewOf(payload(FIGURES_GONE));
    assert.equal(view.status, "unavailable");
    assert.deepEqual(STATUS_LINE[view.status], t.statusFallback);
  });

  it("reads the status off the screen rather than off the payload", () => {
    // Every figure field ARRIVED here — and every one of them is withheld by
    // buildFiguresView, because the labels beside them disagree with the ones
    // this page prints. A status read from the payload would call that live.
    const view = viewOf(
      payload({
        circulatingSupply: {
          amount: "100667.000000",
          unit: "USDT",
          source: "onchain",
          readAt: "2026-08-10T04:00:00.000Z",
        },
        reserve: {
          amount: "1810000000.00",
          currency: "IDR",
          custodian: "Bank Negara Indonesia (BNI)",
          balanceAt: "2026-08-10T04:00:00.000Z",
        },
      }),
    );
    assert.equal(view.figures.supply, null);
    assert.equal(view.figures.reserve, null);
    assert.equal(view.figures.ratio, null);
    assert.equal(view.status, "unavailable");
  });

  it("calls the page live as soon as one figure is on screen", () => {
    // The supply read survives an empty reserve ledger, and one real number is
    // enough for "Data langsung dari API USDX" to be true.
    const view = viewOf(payload({ reserve: null, collateralRatio: null }));
    assert.deepEqual(view.figures.supply, { id: "100.667,00", en: "100,667.00" });
    assert.equal(view.figures.reserve, null);
    assert.equal(view.status, "live");
  });

  it("never shows the same sentence for two different screens", () => {
    const lines = (["live", "unavailable"] satisfies TransparencyStatus[]).map(
      (status) => STATUS_LINE[status],
    );
    for (const lang of ["id", "en"] as const) {
      const spoken = lines.map((line) => line[lang]);
      assert.equal(new Set(spoken).size, spoken.length, `two ${lang} status lines are identical`);
      for (const sentence of spoken) assert.notEqual(sentence.trim(), "");
    }
  });

  it("only promises live figures on a screen that has one", () => {
    // The single rule the status exists to keep, checked against the sentence a
    // reader actually gets rather than against the enum.
    const shapes: unknown[] = [
      unavailablePayload(),
      unavailablePayload({ attestations: [attestation()] }),
      payload(FIGURES_GONE),
      payload({ circulatingSupply: null, reserve: null, collateralRatio: null }),
      { attestations: [attestation()] },
      {},
    ];
    for (const shape of shapes) {
      const view = viewOf(shape);
      assert.equal(view.figures.supply, null);
      assert.equal(view.figures.reserve, null);
      assert.equal(view.figures.ratio, null);
      assert.notEqual(
        STATUS_LINE[view.status].id,
        t.statusLive.id,
        `"${STATUS_LINE[view.status].id}" was shown above three empty figure cards`,
      );
    }
  });
});

// ── Both languages, everywhere ───────────────────────────────────────────────

describe("bilingual copy", () => {
  it("carries every new line in both languages", () => {
    for (const key of ["statusLive", "statusFallback", "statusNoJs", "reserveBank"] as const) {
      assert.equal(typeof t[key].id, "string");
      assert.equal(typeof t[key].en, "string");
      assert.notEqual(t[key].id.trim(), "");
      assert.notEqual(t[key].en.trim(), "");
    }
  });

  it("builds every view string in both languages", () => {
    const view = viewOf(payload());
    const slots = [
      view.figures.supply,
      view.figures.reserve,
      view.figures.ratio,
      view.figures.peg,
      view.figures.supplyCaption,
      view.figures.reserveCaption,
      view.figures.updatedCaption,
    ];
    for (const value of slots) {
      if (!value) throw new Error("a view slot came back empty");
      assert.notEqual(value.id.trim(), "");
      assert.notEqual(value.en.trim(), "");
    }
  });
});
