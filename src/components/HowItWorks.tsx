import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Deposit USD",
    description:
      "Deposit USD into your USDX account through bank transfer or wire.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    ),
  },
  {
    number: "02",
    title: "Mint USDX",
    description:
      "USDX tokens are minted 1:1 and sent to your wallet instantly.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    ),
  },
  {
    number: "03",
    title: "Redeem",
    description:
      "Burn USDX anytime to receive USD back at a guaranteed 1:1 rate.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-gradient-to-br from-primary to-primary-900 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <motion.div
        className="max-w-[1200px] mx-auto relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center mb-16">
          <p className="text-white/70 font-semibold text-sm uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Mint and Redeem with Ease
          </h2>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-white/20" />

          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="text-center relative"
            >
              {/* Number circle */}
              <div className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center mx-auto mb-6 text-lg font-bold relative z-10">
                {step.number}
              </div>
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {step.icon}
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-white/70 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
