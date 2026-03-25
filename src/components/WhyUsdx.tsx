import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { WhyUsdxIcon } from "../data/why-usdx";
import { whyUsdxPoints } from "../data/why-usdx";

const iconMap: Record<WhyUsdxIcon, ReactNode> = {
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  ),
  clipboard: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  ),
  eye: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  ),
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function WhyUsdx() {
  return (
    <section id="why-usdx" className="py-24 px-6 bg-gray-50 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <motion.div
        className="max-w-[1200px] mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Why USDX</span>
        </div>
        <div className="h-px bg-gray-200 mb-8" />
        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
          Built on Transparency and Trust
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mb-12">
          USDX is designed from the ground up to be the most transparent and
          regulated USD stablecoin. Every token is fully backed, independently
          audited, and redeemable at a guaranteed 1:1 rate.
        </p>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {whyUsdxPoints.map((point) => (
            <motion.div
              key={point.title}
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {iconMap[point.icon]}
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-3">
                {point.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors no-underline"
          >
            View Audit Reports
          </a>
        </div>
      </motion.div>
    </section>
  );
}
