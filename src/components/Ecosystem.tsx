import { motion } from "motion/react";
import { chains, partners } from "../data/chains";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="py-24 px-6 bg-white">
      <motion.div
        className="max-w-[1200px] mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Ecosystem
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-dark">
            Supported Chains
          </h2>
        </div>

        {/* Chain logos grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {chains.map((chain) => (
            <motion.div
              key={chain.shortName}
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100"
            >
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-3">
                <span className="text-primary font-bold text-xs">
                  {chain.shortName}
                </span>
              </div>
              <span className="text-dark font-medium text-sm">
                {chain.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Partners marquee */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-dark">Trusted Partners</h3>
        </div>

        <div className="overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex animate-marquee w-max will-change-transform">
            {[...partners, ...partners].map((partner, i) => (
              <a
                key={`${partner.name}-${i}`}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-10 py-4 mx-2 rounded-lg border border-gray-100 hover:border-primary/30 transition-colors no-underline min-w-[160px]"
              >
                <span className="text-gray-500 font-semibold text-sm">
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
