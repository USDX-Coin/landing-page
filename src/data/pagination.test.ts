// Run with: pnpm test   (Node's built-in test runner).
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { clampPage, pageCount, pageRange } from "./pagination.ts";

describe("pageCount", () => {
  it("fits up to a page's worth of rows on one page", () => {
    assert.equal(pageCount(1, 5), 1);
    assert.equal(pageCount(5, 5), 1);
  });

  it("opens a new page for the row that does not fit", () => {
    assert.equal(pageCount(6, 5), 2);
    assert.equal(pageCount(10, 5), 2);
    assert.equal(pageCount(11, 5), 3);
  });

  it("counts an empty list as one page rather than none", () => {
    assert.equal(pageCount(0, 5), 1);
  });

  it("does not divide by a page size that is not one", () => {
    for (const size of [0, -5, 2.5, Number.NaN]) {
      assert.equal(pageCount(12, size), 1);
    }
  });
});

describe("clampPage", () => {
  it("keeps a page that exists", () => {
    assert.equal(clampPage(2, 3), 2);
  });

  it("pulls a page outside the range back to the nearest end", () => {
    assert.equal(clampPage(0, 3), 1);
    assert.equal(clampPage(-4, 3), 1);
    assert.equal(clampPage(4, 3), 3);
  });

  it("falls back to the first page for something that is not a number", () => {
    assert.equal(clampPage(Number.NaN, 3), 1);
  });
});

describe("pageRange", () => {
  it("shows five reports on the first page and the rest on the next", () => {
    assert.deepEqual(pageRange(1, 5, 12), { start: 0, end: 5 });
    assert.deepEqual(pageRange(2, 5, 12), { start: 5, end: 10 });
    assert.deepEqual(pageRange(3, 5, 12), { start: 10, end: 12 });
  });

  it("covers every row exactly once across the pages", () => {
    for (const total of [1, 4, 5, 6, 10, 11, 23]) {
      const seen: number[] = [];
      for (let page = 1; page <= pageCount(total, 5); page += 1) {
        const { start, end } = pageRange(page, 5, total);
        assert.ok(end - start >= 1 && end - start <= 5, `page ${page} of ${total} is the wrong size`);
        for (let index = start; index < end; index += 1) seen.push(index);
      }
      assert.deepEqual(seen, Array.from({ length: total }, (_, index) => index));
    }
  });

  it("never leaves the table empty for a page that does not exist", () => {
    assert.deepEqual(pageRange(9, 5, 12), { start: 10, end: 12 });
    assert.deepEqual(pageRange(0, 5, 12), { start: 0, end: 5 });
  });

  it("shows everything when there is a single page", () => {
    assert.deepEqual(pageRange(1, 5, 1), { start: 0, end: 1 });
    assert.deepEqual(pageRange(1, 5, 0), { start: 0, end: 0 });
  });
});
