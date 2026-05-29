import { useState, useEffect } from "react";
import { navLinks, APP_URL, resolveAppUrl } from "../data/navigation";
import { ui, meta, LANGS, DEFAULT_LANG, type Lang } from "../i18n";
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

function LangSwitch({ current, onChange }: { current: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="flex items-center rounded-lg border border-gray-200 p-0.5 text-xs font-semibold">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          aria-pressed={current === l}
          className={`px-2 py-1 rounded-md border-none cursor-pointer transition-colors ${
            current === l ? "bg-primary text-white" : "bg-transparent text-gray-500 hover:text-primary"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeLang = (next: Lang) => {
    applyLang(next);
    setLang(next);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-sm border-b border-gray-100" : ""
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 no-underline">
          <img src="/image/Logo.svg" alt="USDX" className="w-8 h-8" />
          <span className="text-primary font-bold text-xl">USDX</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-primary text-sm font-medium no-underline transition-colors"
            >
              <T t={link.label} />
            </a>
          ))}
        </div>

        {/* Language switch + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LangSwitch current={lang} onChange={changeLang} />
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors no-underline"
          >
            <T t={ui.cta} />
          </a>
        </div>

        {/* Mobile: language switch + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <LangSwitch current={lang} onChange={changeLang} />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
            aria-label={ui.toggleMenu[lang]}
          >
            <span
              className={`block w-5 h-0.5 bg-dark transition-transform duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-dark transition-opacity duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-dark transition-transform duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-gray-600 hover:text-primary text-sm font-medium no-underline"
            >
              <T t={link.label} />
            </a>
          ))}
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors no-underline"
          >
            <T t={ui.cta} />
          </a>
        </div>
      )}
    </nav>
  );
}
