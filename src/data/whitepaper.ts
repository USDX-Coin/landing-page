// Official USDX documentation, published on GitBook. This single URL is both the
// whitepaper and the documentation site — its landing page is titled
// "Whitepaper USDX" — so it is exposed exactly once in the UI, through the
// "Dokumentasi" / "Docs" nav entry in navigation.ts.
//
// There is deliberately no second link to this same destination elsewhere (the
// footer used to carry a separate "Whitepaper" entry): two links pointing at an
// identical URL read as padding to an explorer reviewer.
//
// Verified reachable (HTTP 200), as are the FAQ and Use Cases pages that the
// site's FAQ and case-study copy are sourced from.
export const DOCUMENTATION_URL = "https://usdx-co.gitbook.io/whitepaper-usdx";

/**
 * The whitepaper is the documentation site itself — there is no standalone PDF.
 * Kept as a named export so the intent stays greppable if one ever ships.
 */
export const WHITEPAPER_URL: string = DOCUMENTATION_URL;
