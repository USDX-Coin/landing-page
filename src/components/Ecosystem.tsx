import { chains, partners } from "../data/chains";

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="py-24 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Ecosystem
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-dark">
            Supported Chains
          </h2>
        </div>

        {/* Chain logos grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20">
          {chains.map((chain) => (
            <div
              key={chain.shortName}
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-3">
                <span className="text-primary font-bold text-xs">
                  {chain.shortName}
                </span>
              </div>
              <span className="text-dark font-medium text-sm">
                {chain.name}
              </span>
            </div>
          ))}
        </div>

        {/* Partners marquee */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-dark">Trusted Partners</h3>
        </div>

        <div className="overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex animate-marquee w-max">
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
      </div>
    </section>
  );
}
