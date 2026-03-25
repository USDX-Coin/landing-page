import { useState } from "react";
import { faqItems } from "../data/faq";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-gray-50">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-dark">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqItems.map((item, index) => (
            <div
              key={item.question}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-6 text-left bg-transparent border-none cursor-pointer"
              >
                <span className="text-dark font-semibold pr-4">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
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
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"
                }`}
              >
                <p className="text-gray-600 leading-relaxed">
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
