import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  // /whitepaper is the URL listing reviewers (CMC, CoinGecko, PolygonScan, OJK)
  // probe by convention; the document itself lives on the docs site. This used
  // to be a 302 in netlify.toml. A static build can only emit it as a page with
  // <meta http-equiv="refresh"> (dist/whitepaper/index.html) — a browser lands
  // on the docs, but the HTTP status is 200, not a redirect.
  redirects: {
    "/whitepaper": "https://docs.usdx.co.id",
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
