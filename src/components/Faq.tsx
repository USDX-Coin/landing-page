import { useState } from "react";
import { faqItems } from "../data/faq";
import { APP_URL } from "../data/navigation";
import { ui } from "../i18n";
import { T } from "./LangText";

export default function Faq() {
  // Click to toggle; single open at a time; first item open by default.
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <section id="faq" className="relative mx-auto w-full max-w-[1320px] rounded-[28px] border border-white/[0.07] bg-[#0b0b0b] overflow-hidden">
      <div className="px-5 sm:px-8 lg:px-12 py-12 md:py-16 grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: heading + CTA */}
        <div className="lg:pt-4">
          <span
            className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full text-white text-sm font-semibold shadow-md shadow-black/30 border border-white/10"
            style={{ backgroundImage: "linear-gradient(90deg,#EFB74F 0%,#620000 40%)" }}
          >
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F8DD93] to-[#E0A93C] flex items-center justify-center text-[#5a0f0f] shrink-0">
              <span className="text-[13px] font-bold leading-none">?</span>
            </span>
            <T t={ui.faq.eyebrow} />
          </span>
          <h2 className="mt-6 font-serif font-medium text-4xl sm:text-5xl lg:text-[52px] leading-[1.08] tracking-tight">
            <span className="block text-white"><T t={ui.faq.heading1} /></span>
            <span className="block text-gray-500"><T t={ui.faq.heading2} /></span>
          </h2>
          <p className="mt-5 text-gray-400 text-base leading-relaxed max-w-md">
            <T t={ui.faq.sub} />
          </p>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors no-underline shadow-lg shadow-primary/20"
          >
            <T t={ui.faq.contact} />
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Right: accordion */}
        <div className="flex flex-col gap-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl border overflow-hidden transition-colors duration-300 ${
                  isOpen ? "border-gold/25 bg-[#161310]" : "border-white/[0.08] bg-[#121212] hover:border-white/15"
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 px-5 sm:px-6 py-4 text-left bg-transparent border-none cursor-pointer"
                >
                  <span className={`flex-1 font-semibold text-base transition-colors duration-300 ${isOpen ? "text-white" : "text-gray-200"}`}>
                    <T t={item.question} />
                  </span>
                  <span className="shrink-0 text-gray-400 relative w-4 h-4 flex items-center justify-center">
                    <span className="absolute w-4 h-0.5 bg-current rounded-full" />
                    <span className={`absolute w-0.5 h-4 bg-current rounded-full transition-transform duration-300 ${isOpen ? "scale-y-0" : "scale-y-100"}`} />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-5 text-gray-400 leading-relaxed text-sm">
                      <T t={item.answer} />
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
