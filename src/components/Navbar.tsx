import { useState, useEffect, useRef } from "react";
import { navLinks, APP_URL, resolveAppUrl } from "../data/navigation";
import { ui, meta, LANGS, LANG_LABEL, DEFAULT_LANG, type Lang } from "../i18n";
import { T } from "./LangText";

function applyLang(next: Lang) {
  document.documentElement.lang = next;
  try {
    localStorage.setItem("lang", next);
  } catch {
    /* ignore storage failures (private mode) */
  }
  document.title = meta.title[next];
  document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description[next]);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.title[next]);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.description[next]);
}

/** Small circular flag glyph for the language selector. */
function Flag({ lang }: { lang: Lang }) {
  if (lang === "id") {
    return (
      <span className="inline-block w-5 h-5 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0">
        <span className="block h-1/2 bg-[#e70011]" />
        <span className="block h-1/2 bg-white" />
      </span>
    );
  }
  // English — US flag-ish blue/red circle
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0 bg-[#16245c] text-[8px] font-bold text-white">
      EN
    </span>
  );
}

function LangDropdown({
  current,
  onChange,
  align = "right",
}: {
  current: Lang;
  onChange: (l: Lang) => void;
  align?: "right" | "left";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <Flag lang={current} />
        <span className="hidden sm:inline">{LANG_LABEL[current]}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute top-full mt-2 ${align === "right" ? "right-0" : "left-0"} min-w-[160px] rounded-xl border border-white/10 bg-[#161616] shadow-2xl shadow-black/50 p-1.5 z-50`}
        >
          {LANGS.map((l) => (
            <li key={l}>
              <button
                role="option"
                aria-selected={current === l}
                onClick={() => {
                  onChange(l);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-left transition-colors cursor-pointer ${
                  current === l ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <Flag lang={l} />
                <span>{LANG_LABEL[l]}</span>
                {current === l && (
                  <svg className="w-4 h-4 ml-auto text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appUrl, setAppUrl] = useState(APP_URL);
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    setAppUrl(resolveAppUrl(window.location.hostname));
    const current = document.documentElement.lang === "en" ? "en" : "id";
    setLang(current);
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeLang = (next: Lang) => {
    applyLang(next);
    setLang(next);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0a0a0a]/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      {/* Main nav (single row; language lives here, not a separate top bar) */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[76px] h-[72px] flex items-center justify-between border-b border-white/10">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 no-underline shrink-0">
          <img src="/image/Logo.svg" alt="USDX" className="w-9 h-9" />
          <span className="font-bold text-xl tracking-tight text-gold-light">USDX</span>
        </a>

        {/* Desktop: nav links + language + CTA */}
        <div className="hidden lg:flex items-center gap-5">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label.en}
                href={link.href}
                className="text-white/90 hover:text-white text-sm font-medium no-underline transition-colors"
              >
                <T t={link.label} />
              </a>
            ))}
          </div>
          <LangDropdown current={lang} onChange={changeLang} />
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors no-underline"
          >
            <T t={ui.cta} />
          </a>
        </div>

        {/* Mobile: language dropdown + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <LangDropdown current={lang} onChange={changeLang} />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
            aria-label={ui.toggleMenu[lang]}
          >
            <span
              className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-opacity duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0d0d0d]/95 backdrop-blur-md border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label.en}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-gray-300 hover:text-white text-sm font-medium no-underline"
            >
              <T t={link.label} />
            </a>
          ))}
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors no-underline"
          >
            <T t={ui.cta} />
          </a>
        </div>
      )}
    </nav>
  );
}
