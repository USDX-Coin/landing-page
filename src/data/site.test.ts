// Run with: pnpm test   (Node's built-in test runner).
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { absoluteUrl } from "./site.ts";

describe("absoluteUrl", () => {
  describe("positive", () => {
    it("adds the trailing slash to a page path, matching the internal links", () => {
      assert.equal(absoluteUrl("/transparency"), "https://usdx.co.id/transparency/");
    });

    it("keeps a page path that already ends in a slash", () => {
      assert.equal(absoluteUrl("/transparency/"), "https://usdx.co.id/transparency/");
    });
  });

  describe("negative", () => {
    it("leaves a file path alone (og:image must not become a directory)", () => {
      assert.equal(absoluteUrl("/image/hero-city.jpg"), "https://usdx.co.id/image/hero-city.jpg");
    });
  });

  describe("edge cases", () => {
    it("maps the root to the bare domain with one slash", () => {
      assert.equal(absoluteUrl("/"), "https://usdx.co.id/");
    });
  });
});
