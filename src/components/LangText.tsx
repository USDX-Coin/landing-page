import type { Translated } from "../i18n";

// React counterpart of T.astro. Both languages render; the inactive one is
// hidden via the global `[data-l]` CSS rule keyed on `<html lang>`.
export function T({ t }: { t: Translated }) {
  return (
    <>
      <span data-l="id">{t.id}</span>
      <span data-l="en">{t.en}</span>
    </>
  );
}
