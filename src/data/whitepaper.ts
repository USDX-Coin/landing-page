// Official USDX documentation, published on GitBook. This single URL is both the
// whitepaper and the documentation site — its landing page is titled
// "Whitepaper USDX" — so it is exposed exactly once in the UI, through the
// "Dokumentasi" / "Docs" nav entry in navigation.ts.
//
// There is deliberately no second link to this same destination elsewhere (the
// footer used to carry a separate "Whitepaper" entry): two links pointing at an
// identical URL read as padding to an explorer reviewer.
//
// Served on the project's own subdomain. The GitBook custom domain now serves
// the space at the ROOT, so there is no "/whitepaper-usdx" path segment any
// more — sub-pages are /faq, /use-cases, /transparency, and so on. The old
// usdx-co.gitbook.io address 307-redirects here, so nothing breaks for anyone
// holding the previous link.
//
// Verified reachable (HTTP 200), as are the FAQ and Use Cases pages that the
// site's FAQ and case-study copy are sourced from.
export const DOCUMENTATION_URL = "https://docs.usdx.co.id";

/**
 * The whitepaper is the documentation site itself — there is no standalone PDF.
 * Kept as a named export so the intent stays greppable if one ever ships.
 */
export const WHITEPAPER_URL: string = DOCUMENTATION_URL;

/**
 * "Legal & Disclaimer" chapter of the documentation — intended use, no
 * guarantee of value, user responsibility, technology risks. This is what the
 * footer's Legal column points at until dedicated privacy/terms pages exist.
 * Verified reachable (HTTP 200).
 */
export const LEGAL_DISCLAIMER_URL = `${DOCUMENTATION_URL}/legal-and-disclaimer`;

/**
 * "User Policy Standard" chapter — this is the terms-and-conditions document.
 * Eighteen clauses covering eligibility and KYC, permitted and prohibited uses,
 * compliance monitoring, minting and redemption, wallet responsibility,
 * suspension, limitation of liability and governing law.
 *
 * It does NOT cover personal data handling, so it is not a privacy policy and
 * must not be labelled as one. A privacy policy is still owed — /privacy,
 * /privacy-policy and /terms all return 404 on the documentation today — and it
 * is needed both for UU PDP and for the PolygonScan submission. Add it here the
 * same way once it is published.
 *
 * Verified reachable (HTTP 200).
 */
export const USER_POLICY_URL = `${DOCUMENTATION_URL}/user-policy-standard`;
