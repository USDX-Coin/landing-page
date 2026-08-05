// Run with: pnpm test   (Node's built-in test runner, no extra dependency —
// Node 22 strips the TypeScript types itself).
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveAttestationFileUrl, resolveApiBaseUrl } from "./transparency.ts";

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

  it("keeps an absolute fileUrl and ignores the API base", () => {
    const absolute = "https://api.usdx.co.id/api/v1/public/transparency/attestations/abc/file";
    assert.equal(resolveAttestationFileUrl(absolute, "https://api-dev.usdx.co.id"), absolute);
  });

  it("keeps an absolute fileUrl pointing at object storage", () => {
    const stored = "https://storage.example.com/usdx/atestasi-2026-07.pdf";
    assert.equal(resolveAttestationFileUrl(stored, API), stored);
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
