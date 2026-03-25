import { motion } from "motion/react";

const headingParts = [
  { text: "The Transparent & Regulated ", color: "text-dark" },
  { text: "USD Stablecoin", color: "text-primary" },
];

const typewriterContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.5 } },
};

const letterVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

const coinSvg = (
  <svg viewBox="0 0 200 200" className="w-64 h-64 md:w-80 md:h-80">
    <defs>
      <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1eaed5" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#1899bc" stopOpacity="0.1" />
      </linearGradient>
      <radialGradient id="coinFace" cx="40%" cy="35%">
        <stop offset="0%" stopColor="#22c5e8" />
        <stop offset="50%" stopColor="#1eaed5" />
        <stop offset="100%" stopColor="#1580a0" />
      </radialGradient>
      <linearGradient id="coinEdge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1899bc" />
        <stop offset="100%" stopColor="#0e6b82" />
      </linearGradient>
      <radialGradient id="highlight" cx="35%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Outer rings */}
    <circle cx="100" cy="100" r="95" fill="none" stroke="url(#ring)" strokeWidth="2" />
    <circle cx="100" cy="100" r="85" fill="none" stroke="url(#ring)" strokeWidth="1" />
    {/* Coin edge (3D thickness) */}
    <ellipse cx="100" cy="108" rx="72" ry="72" fill="url(#coinEdge)" />
    {/* Coin face */}
    <circle cx="100" cy="100" r="72" fill="url(#coinFace)" />
    {/* Highlight */}
    <circle cx="100" cy="100" r="72" fill="url(#highlight)" />
    {/* Inner ring detail */}
    <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
    {/* $ symbol */}
    <text x="100" y="112" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="52" fill="white">$</text>
    {/* USDX label */}
    <text x="100" y="132" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="11" fill="white" opacity="0.8">USDX</text>
    {/* Shadow */}
    <ellipse cx="100" cy="185" rx="50" ry="8" fill="black" opacity="0.08" />
  </svg>
);

export default function Hero() {
  return (
    <section className="pt-40 pb-20 px-6 bg-white relative overflow-hidden">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #1eaed5 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Gradient glow */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <motion.h1
            className="text-3xl md:text-5xl lg:text-[52px] font-bold leading-tight tracking-tight"
            variants={typewriterContainer}
            initial="hidden"
            animate="visible"
          >
            {headingParts.map((part) =>
              part.text.split("").map((char, i) => (
                <motion.span
                  key={`${part.color}-${i}`}
                  className={part.color}
                  variants={letterVariant}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))
            )}
            <motion.span
              className="text-primary inline-block"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            >
              |
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl"
          >
            USDX is a fully-backed digital dollar, redeemable 1:1 for USD.
            Secured by US Treasury bonds and cash reserves, audited by
            independent third-party firms.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.0 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 md:justify-start justify-center"
          >
            <a
              href="https://app-usdx.netlify.app/"
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
          </motion.div>
        </motion.div>

        {/* SVG 3D Coin */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex-shrink-0"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {coinSvg}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
