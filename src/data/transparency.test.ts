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
