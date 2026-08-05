// Absolute site identity — only needed for meta tags that must carry a full
// URL (og:url, og:image). Everything else on the site uses relative paths so the
// same static build works on every domain it is deployed to.
//
// The same build is served on usdxcoin.xyz and usdx.co.id, but og:url has to be
// one absolute URL, so the primary domain wins. Change this if the primary
// domain changes.
export const SITE_URL = "https://usdx.co.id";

// Social preview image. This is a stopgap: it is the hero photo already shipped
// with the site — opaque (no alpha, so it cannot render as invisible text on a
// light card) and close enough to the 1.91:1 preview crop to be usable.
// TODO: replace with a purpose-made 1200x630 image (logo + wordmark on a solid
// dark background). Until then link previews show a photo, not the brand.
export const OG_IMAGE_PATH = "/image/hero-city.jpg";
export const OG_IMAGE_WIDTH = "1600";
export const OG_IMAGE_HEIGHT = "1067";

/**
 * Absolute URL for a path on the canonical domain.
 *
 * The trailing slash is dropped (except on the root) so canonical/og:url match
 * the internal links exactly — Netlify's pretty URLs serve `/transparency`, and
 * announcing `/transparency/` would point crawlers at a redirect.
 */
export function absoluteUrl(path: string): string {
  const url = new URL(path, SITE_URL);
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, "");
  return url.href;
}
