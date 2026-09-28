// Absolute site identity — only needed for meta tags that must carry a full
// URL (og:url, og:image). Everything else on the site uses relative paths so the
// same static build works on every domain it is deployed to.
//
// og:url has to be one absolute URL, so it is pinned to the production domain.
// Change this if the domain changes.
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
 * A page URL always ends in "/" — every page is a directory on disk
 * (dist/transparency/index.html), and the server answers the slash-less form
 * with a 301 to the slashed one. Announcing `/transparency` in canonical/og:url
 * would point crawlers at that redirect, so the slash is added, matching the
 * internal links. A file path (anything whose last segment has an extension,
 * e.g. the og:image) is left as is.
 */
export function absoluteUrl(path: string): string {
  const url = new URL(path, SITE_URL);
  const lastSegment = url.pathname.slice(url.pathname.lastIndexOf("/") + 1);
  if (!lastSegment.includes(".") && !url.pathname.endsWith("/")) url.pathname += "/";
  return url.href;
}
