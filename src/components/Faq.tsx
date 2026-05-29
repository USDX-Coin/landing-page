import { useState } from "react";
import { faqItems } from "../data/faq";
import { iconPaths } from "../data/icons";
import { chains } from "../data/chains";
import { ui } from "../i18n";
import { T } from "./LangText";

export default function Faq() {
  // Click to toggle, single open at a time, and "all closed" is a valid state.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <section id="faq" className="py-24 md:py-32 px-6 bg-white">
      <div className="max-w-[960px] mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-primary font-semibold text-sm uppercase tracking-widest"><T t={ui.faq.eyebrow} /></span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-dark leading-[1.1] tracking-tight mb-3">
          <T t={ui.faq.heading} />
        </h2>
        <p className="text-gray-600 text-base sm:text-lg mb-12 max-w-xl">
          <T t={ui.faq.sub} />
        </p>

        <div className="flex flex-col gap-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${
                  isOpen
                    ? "border-primary/30 bg-gradient-to-br from-primary-light/40 to-white"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 px-5 sm:px-6 py-5 text-left bg-transparent border-none cursor-pointer"
                >
                  <span
                    className={`text-sm font-semibold tracking-widest transition-colors duration-300 ${
                      isOpen ? "text-primary" : "text-gray-300"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className={`flex-1 font-semibold text-base sm:text-lg transition-colors duration-300 ${
                      isOpen ? "text-primary" : "text-dark"
                    }`}
                  >
                    <T t={item.question} />
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen ? "bg-primary text-white rotate-180" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-6 flex flex-col sm:flex-row gap-5 sm:items-center">
                      <p className="text-gray-600 leading-relaxed flex-1"><T t={item.answer} /></p>
                      <div className="shrink-0 w-44 h-28 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/[0.02] border border-primary/10 relative overflow-hidden hidden sm:flex items-center justify-center">
                        <div
                          className="absolute inset-0 opacity-[0.06]"
                          style={{
                            backgroundImage: "radial-gradient(circle, #1eaed5 1px, transparent 1px)",
                            backgroundSize: "16px 16px",
                          }}
                        />
                        {item.icon === "layers" ? (
                          <div className="relative w-36 h-24">
                            {chains.slice(0, 6).map((c, ci) => (
                              <img
                                key={c.name}
                                src={c.icon}
                                alt={c.name}
                                className="absolute w-8 h-8 rounded-full bg-white shadow ring-1 ring-gray-100 p-1"
                                style={{
                                  top: [6, 0, 48, 54, 24, 40][ci],
                                  left: [8, 56, 2, 78, 40, 104][ci],
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="relative w-14 h-14 rounded-2xl bg-white shadow-md ring-1 ring-gray-100 flex items-center justify-center">
                            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={iconPaths[item.icon]} />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
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
