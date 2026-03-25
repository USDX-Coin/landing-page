import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="pt-40 pb-20 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-3xl md:text-5xl lg:text-[52px] font-bold text-dark leading-tight tracking-tight">
            The Transparent &amp; Regulated{" "}
            <span className="text-primary">USD Stablecoin</span>
          </h1>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl">
            USDX is a fully-backed digital dollar, redeemable 1:1 for USD.
            Secured by US Treasury bonds and cash reserves, audited by
            independent third-party firms.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 md:justify-start justify-center">
            <a
              href="https://app.usdx.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors no-underline text-base"
            >
              Get USDX
            </a>
            <a
              href="#why-usdx"
              className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors no-underline text-base"
            >
              Learn More
              <svg
                className="ml-2 w-4 h-4"
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
            </a>
          </div>
        </motion.div>

        {/* Coin Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex-shrink-0"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-64 h-64 md:w-80 md:h-80"
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            {/* Middle ring */}
            <div className="absolute inset-4 rounded-full border-2 border-primary/30" />
            {/* Inner coin */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-xl">
              <div className="text-center">
                <span className="text-white text-5xl md:text-6xl font-bold">
                  $
                </span>
                <p className="text-white/80 text-sm font-semibold mt-1">
                  USDX
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
