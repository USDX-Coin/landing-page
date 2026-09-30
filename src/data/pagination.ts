// Page arithmetic for a list that is split into fixed-size pages in the
// browser — the attestation table on /transparency.
//
// Pure, and in its own module, for the same reason as transparencyView.ts: the
// page's `<script>` block cannot be imported, so anything decided there cannot
// be tested. The script only applies what these return.

/** How many pages `total` rows make. Never less than one: an empty list is one empty page. */
export function pageCount(total: number, pageSize: number): number {
  if (!Number.isInteger(pageSize) || pageSize < 1) return 1;
  if (!Number.isFinite(total) || total <= 0) return 1;
  return Math.ceil(total / pageSize);
}

/** Pull any requested page — NaN, 0, one past the end — back onto a real one. */
export function clampPage(page: number, count: number): number {
  if (!Number.isFinite(page)) return 1;
  return Math.min(Math.max(1, Math.trunc(page)), Math.max(1, count));
}

/** The rows on a page, as a half-open index range: `start` is shown, `end` is not. */
export function pageRange(
  page: number,
  pageSize: number,
  total: number,
): { start: number; end: number } {
  const size = Number.isInteger(pageSize) && pageSize >= 1 ? pageSize : Math.max(1, total);
  const current = clampPage(page, pageCount(total, size));
  const start = (current - 1) * size;
  return { start, end: Math.min(start + size, Math.max(0, total)) };
}
