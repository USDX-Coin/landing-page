// Run with: pnpm test   (Node's built-in test runner).
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { ATTESTATION_PAGE_SIZE, ATTESTATION_REPORTS } from "./audit.ts";

const PUBLIC_DIR = fileURLToPath(new URL("../../public", import.meta.url));

describe("ATTESTATION_REPORTS", () => {
  it("lists at least one report, so the table never ships with headers and no rows", () => {
    assert.ok(ATTESTATION_REPORTS.length > 0);
  });

  it("gives every report its own ID", () => {
    const ids = ATTESTATION_REPORTS.map((report) => report.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("lists the reports in ID order, the first one published at the top", () => {
    const ids = ATTESTATION_REPORTS.map((report) => report.id);
    assert.deepEqual(ids, [...ids].sort((a, b) => a - b));
  });

  it("pages the table five reports at a time", () => {
    assert.equal(ATTESTATION_PAGE_SIZE, 5);
  });

  it("points every Download button at a PDF this site serves itself", () => {
    for (const report of ATTESTATION_REPORTS) {
      assert.match(report.url, /^\/audit\/[^/?#\s]+\.pdf$/);
      // The URL is percent-encoded; the file on disk is not.
      const file = `${PUBLIC_DIR}${decodeURIComponent(report.url)}`;
      assert.ok(existsSync(file), `${report.url} is not in public/`);
    }
  });

  it("fills every cell in both languages", () => {
    for (const report of ATTESTATION_REPORTS) {
      for (const value of [report.title, report.month]) {
        assert.notEqual(value.id.trim(), "");
        assert.notEqual(value.en.trim(), "");
      }
      assert.match(report.year, /^\d{4}$/);
    }
  });

  // The reports are agreed-upon procedures, and say of themselves that they
  // are not an audit and express no opinion. See the note in audit.ts.
  it("never calls a report an audit", () => {
    for (const report of ATTESTATION_REPORTS) {
      assert.doesNotMatch(report.title.id, /audit|opini/i);
      assert.doesNotMatch(report.title.en, /audit|opinion/i);
    }
  });
});
