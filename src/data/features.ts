import type { Translated } from "../i18n";

export type FeatureIcon = "shield" | "zap" | "dollar" | "layers" | "check" | "globe";

export interface Feature {
  title: Translated;
  description: Translated;
  icon: FeatureIcon;
}

// Every claim on these cards has to be traceable to the official documentation
// (https://docs.usdx.co.id). The source page is named above
// each card. Two mistakes are not allowed back in:
//
//   1. "US Treasury". USDX holds NO Treasury bonds — the reserve is 100% U.S.
//      dollar CASH at Bank Negara Indonesia (BNI). "Treasury" appears in the
//      documentation only as the name of the "Treasury Management" use case.
//   2. Mixing up the two independent checks. They are different things at
//      different rhythms, and merging them is what made the old copy false:
//        - RESERVES: verified by MONTHLY attestations from a Public Accounting
//          Firm (KAP).
//        - SMART CONTRACT: ONE independent security audit (Cyberscope, initial
//          audit 25 May 2026). Not "audited regularly".
export const features: Feature[] = [
  {
    // Source: faq.md — "How is USDX backed?" and "Is USDX audited?".
    title: { id: "Dijamin Penuh & Diverifikasi", en: "Fully Backed & Verified" },
    description: {
      id: "Dijamin 100% oleh cadangan kas Dolar AS di Bank Negara Indonesia (BNI). Cadangan diverifikasi lewat atestasi bulanan Kantor Akuntan Publik, dan smart contract-nya telah melalui audit keamanan independen.",
      en: "Backed by 100% U.S. dollar cash reserves held at Bank Negara Indonesia (BNI). The reserves are verified through monthly attestations by a Public Accounting Firm, and the smart contract has undergone an independent security audit.",
    },
    icon: "shield",
  },
  {
    title: { id: "Penyelesaian Instan", en: "Instant Settlement" },
    description: {
      id: "Transaksi diproses dalam hitungan detik, tersedia 24/7 sepanjang tahun.",
      en: "Transactions settle in seconds, available 24/7 all year round.",
    },
    icon: "zap",
  },
  {
    title: { id: "Biaya Transaksi Nyaris Nol", en: "Near-Zero Transaction Fees" },
    description: {
      id: "Kirim USDX ke seluruh dunia dengan biaya sangat rendah, bahkan nyaris nol.",
      en: "Send USDX anywhere in the world with extremely low fees — practically zero.",
    },
    icon: "dollar",
  },
  {
    // Multi-chain copy — restore once USDX is live on more chains:
    // title: { id: "Dukungan Multi-Chain", en: "Multi-Chain Support" },
    // description: {
    //   id: "USDX tersedia di Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Solana, dan Base.",
    //   en: "USDX is available on Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Solana, and Base.",
    // },
    title: { id: "Dibangun di Polygon", en: "Built on Polygon" },
    description: {
      id: "USDX hadir di jaringan Polygon — cepat, hemat biaya, dan siap diperluas ke lebih banyak blockchain.",
      en: "USDX is live on the Polygon network — fast, low-cost, and ready to expand to more chains.",
    },
    icon: "layers",
  },
  {
    // Replaces the old "Patuh Regulasi" / "Regulatory Compliant" card. The word
    // "regulated" (and "licensed", "OJK", "Bappebti") appears NOWHERE in the
    // twelve pages of the documentation — the furthest it goes is "developed
    // with careful consideration of Indonesia's regulatory landscape", and it
    // puts compliance on the user three separate times. A regulatory-status
    // claim with no licence number behind it is the standard explorer rejection,
    // so this card states the two things that ARE documented instead: who issues
    // USDX, and who may mint or redeem it.
    // Source: faq.md — "Who issues USDX?" and "Who can mint and redeem USDX?".
    title: { id: "Penerbit Berbadan Hukum Indonesia", en: "Issued by an Indonesian Entity" },
    description: {
      id: "USDX diterbitkan oleh PT Macan Asia Finance. Penerbitan (minting) dan penukaran (redemption) hanya tersedia bagi Authorized Customer yang telah menyelesaikan KYC dan KYB.",
      en: "USDX is issued by PT Macan Asia Finance. Minting and redemption are available only to Authorized Customers that have completed applicable KYC and KYB procedures.",
    },
    icon: "check",
  },
  {
    // The old card said USDX "can be sent and received by anyone, anytime,
    // anywhere". That contradicted the FAQ on this very page twice over: minting
    // and redemption are limited to Authorized Customers, and USDX is expressly
    // not a domestic Indonesian payment instrument. The reach that IS documented
    // is cross-border, between jurisdictions, over blockchain networks.
    // Source: use-cases.md (Cross-Border Settlement, International Remittance
    // and its closing Important Notice) + faq.md — "Can USDX be used for
    // payments in Indonesia?".
    title: { id: "Jangkauan Lintas Negara", en: "Cross-Border Reach" },
    description: {
      id: "USDX memindahkan nilai berdenominasi Dolar AS antar yurisdiksi melalui jaringan blockchain. Ditujukan untuk kegunaan aset digital dan lintas negara, bukan pembayaran domestik di Indonesia.",
      en: "USDX moves U.S. dollar-denominated value between jurisdictions over blockchain networks. It is intended for digital asset and cross-border use cases, not for domestic payments in Indonesia.",
    },
    icon: "globe",
  },
];
