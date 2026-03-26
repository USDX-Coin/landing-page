import { useState } from "react";
import { faqItems } from "../data/faq";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-white">
      <div className="max-w-[800px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">FAQ</span>
        </div>
        <div className="h-px bg-gray-200 mb-8" />
        <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`border-b border-gray-200 last:border-b-0 transition-all duration-300 ${
                  isOpen ? "border-l-2 border-l-primary pl-4" : "border-l-2 border-l-transparent pl-4"
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between py-6 text-left bg-transparent border-none cursor-pointer group"
                >
                  <span
                    className={`font-semibold pr-4 transition-colors duration-300 ${
                      isOpen ? "text-primary" : "text-dark group-hover:text-primary"
                    }`}
                  >
                    {item.question}
                  </span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                      isOpen ? "rotate-180 text-primary" : "text-gray-400"
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
                    isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"
                  }`}
                >
                  <div className="bg-primary-light/50 rounded-lg p-4">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
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
