import { useState } from "react";
import { faqItems } from "../data/faq";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-gradient-to-b from-primary-950 to-dark relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-[800px] mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">FAQ</span>
        </div>
        <div className="h-px bg-white/20 mb-8" />
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col">
          {faqItems.map((item, index) => (
            <div
              key={item.question}
              className="border-b border-white/10 last:border-b-0"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between py-6 text-left bg-transparent border-none cursor-pointer"
              >
                <span className="text-white font-semibold pr-4">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"
                }`}
              >
                <p className="text-gray-400 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
