const points = [
  {
    title: "USD Cash & Treasury Bonds",
    description:
      "Every USDX token is backed 1:1 by a combination of US Dollar cash reserves and short-term US Treasury bonds.",
  },
  {
    title: "Independent Audits",
    description:
      "Our reserves are regularly audited by independent third-party firms to verify full backing at all times.",
  },
  {
    title: "Real-Time Transparency",
    description:
      "We publish reserve reports and attestations so you can verify the backing of every USDX token in circulation.",
  },
];

export default function WhyUsdx() {
  return (
    <section id="why-usdx" className="py-24 px-6 bg-gray-50">
      <div className="max-w-[1200px] mx-auto">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
          Why USDX
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
          Built on Transparency and Trust
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mb-12">
          USDX is designed from the ground up to be the most transparent and
          regulated USD stablecoin. Every token is fully backed, independently
          audited, and redeemable at a guaranteed 1:1 rate.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {points.map((point) => (
            <div
              key={point.title}
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-5">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-3">
                {point.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors no-underline"
          >
            View Audit Reports
          </a>
        </div>
      </div>
    </section>
  );
}
