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

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-50">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-dark">
            Mint and Redeem with Ease
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-primary/20" />

          {steps.map((step) => (
            <div key={step.number} className="text-center relative">
              {/* Number circle */}
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-6 text-lg font-bold relative z-10">
                {step.number}
              </div>
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {step.icon}
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
