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
    <section id="faq" className="relative mx-auto w-full max-w-[1376px] mb-4 rounded-2xl border border-white/[0.07] bg-[#0f0f0f] overflow-hidden">
      <div className="px-6 sm:px-10 lg:px-11 py-12 lg:py-[52px] grid lg:grid-cols-2 gap-8 lg:gap-4">
        {/* Left: heading + CTA (CTA pinned to bottom) */}
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 items-start">
              <span
                className="inline-flex items-center gap-3 pl-2 pr-5 py-2 rounded-full text-white text-base font-medium font-tight"
                style={{ backgroundImage: "linear-gradient(90deg,rgba(239,183,79,0.4) 0%,rgba(98,0,0,0) 100%)" }}
              >
                <span className="w-7 h-7 rounded-full bg-[#F7A100] flex items-center justify-center text-white shrink-0">
                  <span className="text-sm font-bold leading-none">?</span>
                </span>
                <T t={ui.faq.eyebrow} />
              </span>
              <h2 className="font-serif font-medium text-4xl sm:text-5xl lg:text-[56px] lg:leading-[60px] tracking-tight bg-[linear-gradient(180deg,#fff_0%,rgba(255,255,255,0.4)_100%)] bg-clip-text text-transparent">
                <span className="block"><T t={ui.faq.heading1} /></span>
                <span className="block"><T t={ui.faq.heading2} /></span>
              </h2>
            </div>
            <p className="hidden lg:block text-white text-base leading-[26px] max-w-[511px]">
              <T t={ui.faq.sub} />
            </p>
          </div>
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 lg:mt-auto inline-flex w-fit items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors no-underline"
          >
            <T t={ui.faq.contact} />
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Right: accordion — separate rounded cards (Figma); open card is lighter */}
        <div className="flex flex-col gap-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-[10px] overflow-hidden border transition-colors duration-300 ${
                  isOpen ? "bg-[#1b1b1b] border-white/10" : "bg-[#0c0c0c] border-white/[0.06] hover:border-white/15"
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-6 px-5 py-4 text-left bg-transparent border-none cursor-pointer"
                >
                  <span className="flex-1 font-medium text-base text-white leading-5">
                    <T t={item.question} />
                  </span>
                  <span className="shrink-0 text-white relative w-6 h-6 flex items-center justify-center">
                    <span className="absolute w-3.5 h-0.5 bg-current rounded-full" />
                    <span className={`absolute w-0.5 h-3.5 bg-current rounded-full transition-transform duration-300 ${isOpen ? "scale-y-0" : "scale-y-100"}`} />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-zinc-300 leading-6 text-sm">
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
