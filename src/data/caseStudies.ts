import type { Translated } from "../i18n";

export interface CaseStudy {
  tag: Translated;
  title: Translated;
  description: Translated;
  image: string;
}

export const caseStudies: CaseStudy[] = [
  {
    tag: { id: "Cross-Border Payment", en: "Cross-Border Payment" },
    title: {
      id: "Kirim Dolar ke Luar Negeri dalam Hitungan Menit",
      en: "Send Dollars Abroad in Minutes",
    },
    description: {
      id: "Transfer USDX ke keluarga, partner bisnis, atau freelancer di berbagai negara tanpa menunggu proses perbankan tradisional.",
      en: "Transfer USDX to family, business partners, or freelancers across countries without waiting on traditional banking rails.",
    },
    image: "/image/cs-crossborder.jpg",
  },
  {
    tag: { id: "E-Commerce", en: "E-Commerce" },
    title: {
      id: "Pembayaran Internasional Tanpa Konversi Mata Uang",
      en: "International Payments Without Currency Conversion",
    },
    description: {
      id: "Toko online dapat menerima pembayaran dalam USDX untuk mengurangi risiko fluktuasi mata uang.",
      en: "Online stores can accept payments in USDX to reduce exposure to currency fluctuation risk.",
    },
    image: "/image/cs-ecommerce.jpg",
  },
  {
    tag: { id: "Web3 & DeFi", en: "Web3 & DeFi" },
    title: {
      id: "Likuiditas Dolar untuk Aplikasi Blockchain",
      en: "Dollar Liquidity for Blockchain Apps",
    },
    description: {
      id: "USDX dapat digunakan sebagai aset dasar untuk trading, lending, staking, dan berbagai aplikasi DeFi di berbagai blockchain.",
      en: "USDX can serve as a base asset for trading, lending, staking, and a wide range of DeFi apps across chains.",
    },
    image: "/image/cs-web3.jpg",
  },
  {
    tag: { id: "Payroll", en: "Payroll" },
    title: {
      id: "Gaji Lintas Negara untuk Tim Remote",
      en: "Cross-Border Payroll for Remote Teams",
    },
    description: {
      id: "Bayar kontraktor dan karyawan remote di mana pun dalam USDX, instan dan tanpa biaya transfer yang mahal.",
      en: "Pay contractors and remote employees anywhere in USDX — instant and without costly transfer fees.",
    },
    image: "/image/cs-payroll.jpg",
  },
  {
    tag: { id: "Tabungan", en: "Savings" },
    title: {
      id: "Lindung Nilai dari Mata Uang yang Melemah",
      en: "A Hedge Against Weakening Currencies",
    },
    description: {
      id: "Simpan nilai dalam dolar digital yang stabil untuk melindungi tabungan dari inflasi mata uang lokal.",
      en: "Hold value in a stable digital dollar to protect savings from local currency inflation.",
    },
    image: "/image/cs-savings.jpg",
  },
];
