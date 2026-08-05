import type { Translated } from "../i18n";
import { iconPaths } from "./icons";

export interface FaqItem {
  question: Translated;
  answer: Translated;
  /** Small accent glyph shown beside the answer. Omit for a plain row. */
  icon?: keyof typeof iconPaths;
  /** Richer per-row visual. Only the supported-network row uses one today. */
  visual?: "chains";
}

// The official USDX FAQ, mirrored from the documentation:
// https://docs.usdx.co.id/faq
//
// All eleven questions, in source order. The English column is the source text
// verbatim (the two source paragraphs joined into one); the Indonesian column is
// a faithful translation — this is quasi-legal copy, so nothing is softened,
// dropped or embellished. In particular "Can USDX be used for payments in
// Indonesia?" keeps its flat "No." / "Tidak." opening.
//
// If the GitBook changes, this file is what has to follow it — the site must not
// state anything the documentation does not.
export const faqItems: FaqItem[] = [
  {
    question: { id: "Apa itu USDX?", en: "What is USDX?" },
    answer: {
      id: "USDX adalah stablecoin berdenominasi Dolar AS yang diterbitkan oleh PT Macan Asia Finance. USDX dirancang untuk menyediakan representasi digital dari Dolar AS bagi penyelesaian transaksi aset digital, transaksi lintas negara, dan operasi keuangan institusional. Setiap USDX dirancang untuk mempertahankan nilai yang setara dengan satu Dolar AS (1 USDX = 1 USD) dan dijamin penuh oleh cadangan kas Dolar AS sebesar 100%.",
      en: "USDX is a U.S. dollar-denominated stablecoin issued by PT Macan Asia Finance. It is designed to provide a digital representation of the U.S. dollar for digital asset settlement, cross-border transactions, and institutional financial operations. Each USDX is designed to maintain a value equivalent to one U.S. dollar (1 USDX = 1 USD) and is fully backed by 100% U.S. dollar cash reserves.",
    },
    icon: "dollar",
  },
  {
    question: { id: "Siapa yang menerbitkan USDX?", en: "Who issues USDX?" },
    answer: {
      id: "USDX diterbitkan oleh PT Macan Asia Finance.",
      en: "USDX is issued by PT Macan Asia Finance.",
    },
  },
  {
    question: { id: "Bagaimana USDX dijamin?", en: "How is USDX backed?" },
    answer: {
      id: "Setiap USDX yang beredar dijamin oleh cadangan kas Dolar AS sebesar 100% yang disimpan di Bank Negara Indonesia (BNI). Cadangan tersebut diverifikasi secara independen melalui atestasi bulanan yang dilakukan oleh Kantor Akuntan Publik (KAP) independen.",
      en: "Each USDX in circulation is backed by 100% U.S. dollar cash reserves held at Bank Negara Indonesia (BNI). The reserves are independently verified through monthly attestations conducted by an independent Public Accounting Firm (KAP).",
    },
    icon: "shield",
  },
  {
    question: { id: "Bagaimana cara memperoleh USDX?", en: "How can I obtain USDX?" },
    answer: {
      id: "USDX dapat diperoleh melalui kanal dan layanan resmi yang didukung oleh Authorized Customer. Layanan penerbitan (minting) dan penukaran (redemption) secara langsung hanya tersedia bagi Authorized Customer yang memenuhi syarat dan telah menyelesaikan ketentuan KYC dan KYB yang berlaku.",
      en: "USDX can be obtained through approved channels and services supported by Authorized Customers. Direct minting and redemption services are available exclusively to eligible Authorized Customers that have successfully completed applicable KYC and KYB requirements.",
    },
  },
  {
    question: {
      id: "Bagaimana USDX mempertahankan nilainya?",
      en: "How does USDX maintain its value?",
    },
    answer: {
      id: "USDX dirancang untuk mempertahankan nilai yang setara dengan satu Dolar AS (1 USDX = 1 USD) melalui model penjaminan cadangan penuh. USDX baru diterbitkan ketika pelanggan yang memenuhi syarat menyelesaikan proses minting, dan USDX ditarik dari peredaran ketika ditukarkan kembali.",
      en: "USDX is designed to maintain a value equivalent to one U.S. dollar (1 USDX = 1 USD) through its full reserve backing model. New USDX is issued when eligible customers complete the minting process, and USDX is removed from circulation when redeemed.",
    },
  },
  {
    question: {
      id: "Jaringan blockchain apa yang mendukung USDX?",
      en: "Which blockchain network supports USDX?",
    },
    answer: {
      id: "USDX pada tahap awal diterbitkan di jaringan Polygon. Jaringan blockchain lain dapat didukung di kemudian hari berdasarkan kebutuhan ekosistem, pertimbangan teknis, dan kebutuhan adopsi.",
      en: "USDX is initially issued on the Polygon network. Additional blockchain networks may be supported in the future based on ecosystem needs, technical considerations, and adoption requirements.",
    },
    visual: "chains",
  },
  {
    question: {
      id: "Apakah USDX bisa digunakan untuk pembayaran di Indonesia?",
      en: "Can USDX be used for payments in Indonesia?",
    },
    answer: {
      id: "Tidak. USDX tidak dimaksudkan untuk berfungsi sebagai instrumen pembayaran domestik di Indonesia dan tidak dirancang untuk menggantikan Rupiah. USDX ditujukan untuk kegunaan aset digital dan lintas negara.",
      en: "No. USDX is not intended to function as a domestic payment instrument in Indonesia and is not designed to replace the Indonesian Rupiah. USDX is intended for digital asset and cross-border use cases.",
    },
  },
  {
    question: {
      id: "Siapa yang dapat melakukan minting dan redemption USDX?",
      en: "Who can mint and redeem USDX?",
    },
    answer: {
      id: "Layanan minting dan redemption hanya tersedia bagi Authorized Customer yang telah menyelesaikan prosedur KYC dan KYB yang berlaku.",
      en: "Minting and redemption services are available only to Authorized Customers that have successfully completed applicable KYC and KYB procedures.",
    },
    icon: "clipboard",
  },
  {
    question: {
      id: "Apa perbedaan USDX dengan Dolar AS tradisional?",
      en: "What is the difference between USDX and traditional U.S. dollars?",
    },
    answer: {
      id: "USDX merupakan bentuk digital dari nilai Dolar AS yang beroperasi di atas infrastruktur blockchain. Berbeda dengan dolar berbasis perbankan tradisional, USDX dapat ditransfer melalui jaringan blockchain, sehingga memungkinkan penyelesaian transaksi aset digital dan integrasi dengan aplikasi blockchain.",
      en: "USDX represents a digital form of U.S. dollar value that operates on blockchain infrastructure. Unlike traditional bank-based dollars, USDX can be transferred through blockchain networks, enabling digital asset settlement and integration with blockchain applications.",
    },
  },
  {
    question: { id: "Apakah USDX diaudit?", en: "Is USDX audited?" },
    answer: {
      id: "Smart contract USDX telah menjalani audit keamanan independen. Selain itu, cadangan USDX diverifikasi secara independen melalui atestasi bulanan yang dilakukan oleh Kantor Akuntan Publik (KAP).",
      en: "The USDX smart contract has undergone an independent security audit. In addition, USDX reserves are independently verified through monthly attestations conducted by a Public Accounting Firm (KAP).",
    },
    icon: "check",
  },
  {
    question: {
      id: "Di mana saya bisa menemukan informasi lebih lanjut tentang USDX?",
      en: "Where can I find more information about USDX?",
    },
    answer: {
      // The source says "throughout this documentation". This FAQ is rendered on
      // the website, not inside the documentation, so the referent is named
      // explicitly instead of left as a dangling "this".
      id: "Informasi lebih lanjut mengenai USDX, termasuk transparansi cadangan, keamanan, dan proses operasional, tersedia di seluruh dokumentasi resmi USDX.",
      en: "Additional information regarding USDX, including reserve transparency, security, and operational processes, is available throughout the official USDX documentation.",
    },
    icon: "globe",
  },
];
