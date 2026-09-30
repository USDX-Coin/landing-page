// Client-side i18n for the landing page.
//
// All user-facing copy lives here (and in the typed data files that import the
// `Translated` type). Both languages are rendered into the static HTML; the
// inactive one is hidden via CSS keyed on `<html lang>` (see global.css and the
// <T> helper). The Navbar language switcher flips `<html lang>` + localStorage.

export const LANGS = ["id", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "id";

/** A string available in every supported language. */
export type Translated = Record<Lang, string>;

/** Display label for each language (used by the navbar dropdown). */
export const LANG_LABEL: Record<Lang, string> = {
  id: "Indonesia",
  en: "English",
};

export const meta: { title: Translated; description: Translated } = {
  // This is the <title> AND the og:title, so it is the single line every
  // explorer reviewer, crawler and link preview reads first. It used to call
  // USDX "Teregulasi" / "Regulated". Nothing in the twelve pages of the official
  // documentation supports that: "regulated", "licensed", "license", "OJK" and
  // "Bappebti" have zero occurrences there. The wording below follows the front
  // page of the documentation instead — "a trusted U.S. dollar stablecoin for
  // digital asset settlement, cross-border transactions, and institutional
  // liquidity" — trimmed to a length a <title> can carry. Do not put a
  // regulatory status back here without a licence number to point at.
  title: {
    id: "USDX — Stablecoin Dolar AS untuk Aset Digital & Lintas Negara",
    en: "USDX — The U.S. Dollar Stablecoin for Digital Asset & Cross-Border Use",
  },
  // Backing copy states one thing only: 100% U.S. dollar CASH reserves held at
  // Bank Negara Indonesia (BNI). The old "US Treasury bonds" line was generic
  // stablecoin copy and does not describe USDX's actual reserves — it must not
  // come back. "di kustodian Bank BNI" is gone for the same reason as in the
  // footer: it is the site's own word, not the documentation's.
  // Source: faq.md — "How is USDX backed?" and "Who issues USDX?".
  description: {
    id: "Stablecoin Dolar AS terbitan PT Macan Asia Finance, dijamin 100% oleh cadangan kas Dolar AS di Bank Negara Indonesia (BNI). Untuk aset digital dan lintas negara.",
    en: "A U.S. dollar stablecoin issued by PT Macan Asia Finance, backed by 100% U.S. dollar cash reserves held at Bank Negara Indonesia (BNI). For digital asset and cross-border use.",
  },
};

export const ui = {
  cta: { id: "Dapatkan USDX", en: "Get USDX" },
  toggleMenu: { id: "Buka menu", en: "Toggle menu" },
  supportedBy: { id: "Didukung oleh", en: "Supported by" },

  hero: {
    // The badge said "Teregulasi" / "Regulated" — an unbacked regulatory-status
    // claim (see the note on meta.title). It now names what USDX actually is.
    badge: { id: "Stablecoin Dolar AS", en: "U.S. Dollar Stablecoin" },
    // A plain statement of certification, backed by a real certificate: SNI
    // ISO/IEC 27001:2022, number ISMS 26302, issued by PT TSI Sertifikasi
    // Internasional under KAN accreditation — KAN being an IAF MLA signatory,
    // which is what makes it recognised outside Indonesia.
    //
    // A statement is not the certification MARK and is not restricted the same
    // way; the mark has its own rules and is not on the site yet. The number
    // and issuing body are not spelled out here because the link goes straight
    // to TSI's register, where both are shown by the body that issued them.
    // See data/certification.ts — including the expiry date, after which this
    // claim must come down.
    // Column label; the standard number itself is rendered untranslated beneath
    // it, since "ISO/IEC 27001:2022" reads the same in both languages.
    certifiedLabel: { id: "Bersertifikat", en: "Certified" },
    securityBadge: {
      id: "Bersertifikat ISO/IEC 27001:2022",
      en: "Certified to ISO/IEC 27001:2022",
    },
    securityBadgeTitle: {
      id: "Verifikasi sertifikat ISMS 26302 di portal resmi TSI",
      en: "Verify certificate ISMS 26302 on TSI's official portal",
    },
    line1: { id: "Akses US Dolar Digital", en: "Easier Access to the" },
    line2: { id: "Lebih Mudah", en: "Digital US Dollar" },
    // The old paragraph promised access "kapan saja di mana saja" / "anytime,
    // anywhere", which reads as open retail access and collides with the FAQ
    // further down the same page: minting and redemption are limited to
    // Authorized Customers, and USDX is not a domestic Indonesian payment
    // instrument. This is the documentation's own description of what USDX is
    // for. Source: faq.md — "What is USDX?" and "How is USDX backed?".
    paragraph: {
      id: "USDX adalah representasi digital dari Dolar AS untuk penyelesaian aset digital, transaksi lintas negara, dan operasi keuangan institusional. Dijamin 100% oleh cadangan kas Dolar AS di Bank Negara Indonesia (BNI).",
      en: "USDX is a digital representation of the U.S. dollar for digital asset settlement, cross-border transactions, and institutional financial operations. Backed by 100% U.S. dollar cash reserves held at Bank Negara Indonesia (BNI).",
    },
    // shared wallet/labels (also used by the Features fee card)
    totalBalance: { id: "Total Saldo", en: "Total Balance" },
    actionSend: { id: "Kirim", en: "Send" },
    actionReceive: { id: "Terima", en: "Receive" },
    actionSwap: { id: "Tukar", en: "Swap" },
  },

  features: {
    eyebrow: { id: "Fitur Unggulan", en: "Featured" },
    heading1: { id: "Segala yang seharusnya", en: "Everything a modern" },
    heading2: { id: "dimiliki dolar modern", en: "dollar should be" },
    sub: {
      id: "Stabil seperti dolar, cepat seperti internet. Pelajari apa yang membuat USDX bekerja.",
      en: "Stable like the dollar, fast like the internet. Explore what makes USDX work.",
    },
    // Wallet card mock (the near-zero-fee card). The row used to read "Menerima
    // pembayaran" / "Receiving payment", which pictures a merchant accepting
    // USDX — the domestic-payment framing the FAQ answers "No." to. It shows an
    // incoming cross-border settlement instead, which is a documented use case.
    // Source: use-cases.md — Cross-Border Settlement.
    walletCompany: { id: "ABC Company", en: "ABC Company" },
    walletNote: { id: "Penyelesaian lintas negara", en: "Cross-border settlement" },
    gaugeLabel: { id: "Penyelesaian", en: "Settlement" },
    // The two "Dokumen Transparansi dan Audit" links read as a pair: the audit
    // PDF (Cyberscope) and the /transparency page. Noun-style,
    // no "Lihat" prefix (same idiom as the footer's "Laporan Audit" link): with
    // the verb the pair only fit side by side on the very widest cards and
    // stacked everywhere else, which read as broken (12 Aug 2026). The arrow
    // icons already say "open".
    auditCta: { id: "Laporan Audit", en: "Audit Report" },
    transparencyCta: { id: "Dokumen Transparansi", en: "Transparency Documents" },
    // Certification card (see data/certification.ts for every fact). The visual
    // is a summary of what TSI's own register shows for ISMS 26302 — not a
    // reproduction of the certificate (forbidden) and not the TSI/KAN mark
    // (artwork must come from TSI, after a signed statement).
    certScheme: {
      id: "Sistem Manajemen Keamanan Informasi",
      en: "Information Security Management Systems",
    },
    certNoLabel: { id: "No. Sertifikat", en: "Certificate No." },
    certBodyLabel: { id: "Badan Sertifikasi", en: "Certification Body" },
    // Short form — the panel is too narrow for the body's full legal name,
    // which the section band and TSI's register both spell out.
    certBodyValue: { id: "TSI · Akreditasi KAN", en: "TSI · KAN accredited" },
    certValidLabel: { id: "Berlaku s.d.", en: "Valid until" },
    // Keep in step with CERTIFICATE_EXPIRY in data/certification.ts.
    certValidValue: { id: "23 Juni 2029", en: "23 June 2029" },
    certCta: { id: "Verifikasi Sertifikat", en: "Verify Certificate" },
  },

  // "Standar Internasional" — the certification band (Certification.astro).
  // Reference pattern: dcloud.co.id, a dedicated standards section that names
  // the certifier. Deliberately text-only: the combined TSI+KAN mark may only
  // be used once TSI supplies the artwork and MAF signs the mark-use statement
  // (see data/certification.ts), so until then the band carries a statement
  // plus the register facts — which TSI does not restrict.
  certification: {
    eyebrow: { id: "Standar Internasional", en: "International Standards" },
    heading1: { id: "Keamanan informasi", en: "Information security," },
    heading2: { id: "bersertifikat ISO/IEC 27001", en: "certified to ISO/IEC 27001" },
    body: {
      id: "PT Macan Asia Finance, penerbit USDX, tersertifikasi SNI ISO/IEC 27001:2022 — standar internasional untuk sistem manajemen keamanan informasi — dengan ruang lingkup platform layanan transaksi stablecoin. Sertifikat diterbitkan oleh PT TSI Sertifikasi Internasional di bawah akreditasi KAN, dan dapat diverifikasi langsung di portal resmi TSI.",
      en: "PT Macan Asia Finance, the issuer of USDX, is certified to SNI ISO/IEC 27001:2022 — the international standard for information security management systems — with a scope covering its stablecoin transaction services platform. The certificate is issued by PT TSI Sertifikasi Internasional under KAN accreditation, and can be verified directly on TSI's official register.",
    },
    verifyCta: { id: "Verifikasi di Portal TSI", en: "Verify on TSI's Register" },
    // Under the CTA, so the reader knows the link leaves the site and where to.
    verifyNote: {
      id: "Membuka hasil pencarian sertifikat ISMS 26302 di situs resmi PT TSI Sertifikasi Internasional.",
      en: "Opens the ISMS 26302 certificate lookup on PT TSI Sertifikasi Internasional's official site.",
    },
    factStandard: { id: "Standar", en: "Standard" },
    factNumber: { id: "Nomor sertifikat", en: "Certificate number" },
    factHolder: { id: "Pemegang sertifikat", en: "Certificate holder" },
    factBody: { id: "Badan sertifikasi", en: "Certification body" },
    factAccreditation: { id: "Akreditasi", en: "Accreditation" },
    factScope: { id: "Ruang lingkup", en: "Scope" },
    factValidity: { id: "Masa berlaku", en: "Valid" },
    // The scope as printed on the certificate, translated for the id column.
    scopeValue: {
      id: "Sistem Manajemen Keamanan Informasi untuk Platform Layanan Transaksi Stablecoin",
      en: "Information Security Management System for Stablecoin Transaction Services Platform",
    },
    // Keep in step with the issue/expiry dates in data/certification.ts.
    validityValue: { id: "24 Juni 2026 – 23 Juni 2029", en: "24 June 2026 – 23 June 2029" },
    accreditationValue: {
      id: "KAN LSSM-056-IDN · penandatangan IAF MLA",
      en: "KAN LSSM-056-IDN · IAF MLA signatory",
    },
  },

  ecosystem: {
    // Multi-chain copy — restore once USDX is live on more chains:
    // badge: { id: "Multi-chain", en: "Multi-chain" },
    // heading1: { id: "Hadir di blockchain yang", en: "Live on the chains" },
    // heading2: { id: "sudah Anda gunakan", en: "you already use" },
    // sub: {
    //   id: "USDX berpindah secara native di 8 blockchain utama — arahkan kursor untuk menjelajah, klik untuk masuk lebih dalam.",
    //   en: "USDX moves natively across 8 major blockchains — hover to explore each, click to dive in.",
    // },
    badge: { id: "Ekosistem", en: "Ecosystem" },
    heading1: { id: "Kini hadir di", en: "Now live on" },
    heading2: { id: "jaringan Polygon", en: "Polygon" },
    sub: {
      id: "USDX hadir secara native di jaringan Polygon dan dapat diperdagangkan melalui Uniswap — blockchain lain akan menyusul.",
      en: "USDX lives natively on the Polygon network and trades on Uniswap — more chains are on the way.",
    },
    availableOn: { id: "Tersedia di", en: "Available on" },
    // Label for the register group of the credential strip. It only renders
    // once data/listings.ts registeredWith has a citable entry — the gate and
    // the evidence rules are written there.
    registeredWith: { id: "Terdaftar di", en: "Registered with" },
    partners: { id: "Jaringan Mitra yang Terpercaya", en: "A Trusted Partner Network" },
  },

  caseStudy: {
    // Reframed from "Case Study" to the official Use Cases framing so the
    // section matches the documentation it is now sourced from.
    eyebrow: { id: "Kegunaan", en: "Use Cases" },
    heading1: { id: "Dibangun untuk aset digital", en: "Built for digital asset" },
    heading2: { id: "dan lintas negara", en: "and cross-border use" },
    // No user-count claim here until there is a number we can actually back up.
    ctaHeading: {
      id: "Mulai Gunakan USDX Hari Ini",
      en: "Start using USDX today",
    },
    // Verbatim from the closing "Important Notice" of the official Use Cases
    // page. It sits under the cards so the use cases can never be read as an
    // offer of domestic Indonesian payments.
    noticeTitle: { id: "Pemberitahuan Penting", en: "Important Notice" },
    notice: {
      id: "USDX ditujukan untuk kegunaan aset digital dan lintas negara. USDX tidak dimaksudkan untuk berfungsi sebagai instrumen pembayaran domestik di Indonesia dan tidak dirancang untuk menggantikan Rupiah. Seluruh penggunaan USDX harus mematuhi hukum, peraturan, dan ketentuan platform yang berlaku.",
      en: "USDX is intended for digital asset and cross-border use cases. USDX is not intended to function as a domestic payment instrument in Indonesia and is not designed to replace the Indonesian Rupiah. All use of USDX should comply with applicable laws, regulations, and platform requirements.",
    },
    more: { id: "Case Study Lainnya", en: "More Case Studies" },
  },

  faq: {
    eyebrow: { id: "FAQ", en: "FAQ" },
    heading1: { id: "Pertanyaan yang paling", en: "The questions we get" },
    heading2: { id: "Sering Diajukan", en: "asked the most" },
    sub: {
      id: "Temukan jawaban atas pertanyaan umum seputar USDX, mulai dari cara kerja, keamanan aset, hingga proses pengiriman dan penerimaan token. Kami merangkum informasi penting untuk membantu Anda memahami USDX dengan lebih mudah.",
      en: "Find answers to common questions about USDX — from how it works and asset security to sending and receiving tokens. We've gathered the essentials to help you understand USDX with ease.",
    },
    contact: { id: "Hubungi Kami", en: "Contact Us" },
  },

  footer: {
    headline: { id: "Masa Depan Dolar Digital", en: "The Future of Digital Dollars" },
    // "di kustodian Bank BNI" / "held in custody at Bank BNI" was the site's own
    // wording, not the documentation's. The hero and the FAQ both say what the
    // source says — the reserves are held AT Bank Negara Indonesia (BNI) — so
    // the footer says it the same way rather than adding a custody arrangement
    // no page of the documentation describes.
    // Source: faq.md — "How is USDX backed?".
    tagline: {
      id: "Stablecoin Dolar AS yang diterbitkan PT Macan Asia Finance. Dijamin 100% oleh cadangan kas Dolar AS di Bank Negara Indonesia (BNI).",
      en: "The U.S. dollar stablecoin issued by PT Macan Asia Finance. Backed by 100% U.S. dollar cash reserves held at Bank Negara Indonesia (BNI).",
    },
    quickLinks: { id: "Tautan Cepat", en: "Quick Links" },
    // No heading for the legal links any more, so no label to get wrong. Three
    // were tried: "Legal" did not cover the audit report beside it and read like
    // something to click; "Dokumen" echoed the "Dokumentasi" nav entry, which
    // goes somewhere else entirely; "Informasi" described nothing. The links now
    // sit in the bottom bar next to the copyright, which is where the convention
    // puts them and where readers look for them by habit.
    // legal: { id: "Legal", en: "Legal" },
    social: { id: "Media Sosial", en: "Social Media" },
    // The three legal pages have no copy yet, so their links were pulled out of
    // the footer rather than left pointing at "#". Restore these labels together
    // with the pages themselves (see the commented block in Footer.astro).
    // privacy: { id: "Kebijakan Privasi", en: "Privacy & Policy" },
    // terms: { id: "Syarat & Ketentuan", en: "Terms & Conditions" },
    // compliance: { id: "Kepatuhan Data", en: "Data Compliance" },
    // Kept close to the chapter's own title in the documentation so a reader
    // who follows the link lands on a page named the same thing.
    // Named after the chapter it opens, so the page a reader lands on carries
    // the same title they clicked. It is the terms-and-conditions document in
    // substance — eligibility, KYC, prohibited uses, suspension, liability.
    userPolicy: { id: "Ketentuan Pengguna", en: "User Policy" },
    legalDisclaimer: { id: "Ketentuan Hukum & Sanggahan", en: "Legal & Disclaimer" },
    audit: { id: "Laporan Audit", en: "Audit Report" },
    // The whitepaper is the GitBook documentation, reachable through the nav
    // entry — which is itself labelled "Whitepaper" now (see navigation.ts), so
    // the word appears verbatim in the navbar and the footer's Quick Links. A
    // second footer link to the identical URL would be padding, so this label
    // is unused — restore it only if a standalone whitepaper document ever
    // ships at its own address.
    // whitepaper: { id: "Whitepaper", en: "Whitepaper" },
    // "All system normal" was a static string, not a real status signal — the
    // same category of placeholder that got the token-info submission rejected.
    // Restore only if it is wired to something that can actually go red.
    // status: { id: "All system normal", en: "All system normal" },
    contact: { id: "Kontak", en: "Contact" },
    office: { id: "Kantor", en: "Office" },
    email: { id: "Email", en: "Email" },
    rights: { id: "© 2026 PT Macan Asia Finance", en: "© 2026 PT Macan Asia Finance" },
  },

  token: {
    eyebrow: { id: "Informasi Token", en: "Token Information" },
    heading1: { id: "Detail kontrak", en: "USDX contract" },
    heading2: { id: "USDX", en: "details" },
    sub: {
      id: "Periksa alamat kontrak di bawah sebelum bertransaksi. USDX hanya diterbitkan pada alamat ini di jaringan Polygon.",
      en: "Check the contract address below before transacting. USDX is only issued at this address on the Polygon network.",
    },
    name: { id: "Nama token", en: "Token name" },
    symbol: { id: "Simbol", en: "Symbol" },
    decimals: { id: "Desimal", en: "Decimals" },
    network: { id: "Jaringan", en: "Network" },
    contractAddress: { id: "Alamat kontrak", en: "Contract address" },
    copy: { id: "Salin alamat", en: "Copy address" },
    copied: { id: "Alamat tersalin", en: "Address copied" },
    explorer: { id: "Lihat di PolygonScan", en: "View on PolygonScan" },
  },

  // Copy for /transparency — "Dokumen Transparansi dan Audit".
  //
  // The page carries the three headline figures (circulating supply, reserve
  // assets, collateral ratio), what the reserve is made of, the contract
  // address, the smart-contract audit, and the published reserve attestation
  // report.
  //
  // Every figure has an unavailable state, and every one of them says "Belum
  // tersedia" in words. A transparency page must never print a number nobody
  // can stand behind, and a missing figure shown as 0 is worse than no figure
  // at all — it is a false one. See notAvailable below.
  //
  // The "Laporan Atestasi Bulanan" table and all of its copy (heading, column
  // labels, the empty / pending / unavailable lines) were removed on 30 Sep
  // 2026. The one published report is the attestation card further down.
  transparency: {
    navLabel: { id: "Transparansi", en: "Transparency" },
    metaTitle: {
      id: "Dokumen Transparansi dan Audit USDX — PT Macan Asia Finance",
      en: "USDX Transparency and Audit Documents — PT Macan Asia Finance",
    },
    metaDescription: {
      id: "Daftar laporan atestasi cadangan USDX bulanan yang diterbitkan Kantor Akuntan Publik, lengkap dengan periode dan berkas unduhan.",
      en: "The list of monthly USDX reserve attestation reports issued by the Public Accounting Firm, with their period and downloadable file.",
    },
    eyebrow: { id: "Transparansi", en: "Transparency" },
    heading1: { id: "Dokumen Transparansi", en: "Transparency and" },
    heading2: { id: "dan Audit", en: "Audit Documents" },
    intro: {
      id: "Cadangan USDX diverifikasi secara independen melalui atestasi bulanan yang dilakukan Kantor Akuntan Publik (KAP). Setiap laporan yang sudah terbit tercantum di bawah ini beserta periodenya dan dapat diunduh langsung.",
      en: "USDX reserves are independently verified through monthly attestations conducted by a Public Accounting Firm (KAP). Every published report is listed below with its period and can be downloaded directly.",
    },
    backHome: { id: "Kembali ke beranda", en: "Back to home" },

    statusLoading: { id: "Memuat data terbaru…", en: "Loading the latest data…" },
    statusLive: { id: "Data langsung dari API USDX.", en: "Live data from the USDX API." },
    // Neither line promises anything is still on screen after a failed fetch.
    // TRANSPARENCY_FALLBACK carries no figures, so a failed fetch really does
    // leave the three cards with nothing but "Belum tersedia". Saying the
    // numbers "may be out of date" would imply there are numbers there to be
    // out of date.
    //
    // If figures are ever baked into TRANSPARENCY_FALLBACK, both lines have to
    // change with them: they would then be showing a real, older position, and
    // the reader is owed that distinction.
    //
    // Shown for two situations that look identical to a reader, and should: a
    // fetch that failed, and a fetch that succeeded and carried no usable
    // figure — the backend's total-outage payload, which states its own
    // ignorance rather than answering 500. Either way the sentence is true as
    // written: the live data could not be loaded, and there is nothing on
    // screen for it to contradict.
    //
    // Both name the figures only. They used to name "the document list" too,
    // until the table it referred to was taken off the page.
    statusFallback: {
      id: "Data langsung tidak dapat dimuat saat ini, jadi angka di halaman ini belum dapat ditampilkan.",
      en: "Live data could not be loaded right now, so the figures on this page cannot be shown.",
    },
    statusNoJs: {
      id: "Peramban Anda tidak menjalankan JavaScript, jadi angka di halaman ini belum dapat ditampilkan.",
      en: "Your browser is not running JavaScript, so the figures on this page cannot be shown yet.",
    },

    notAvailable: { id: "Belum tersedia", en: "Not yet available" },

    contractHeading: { id: "Alamat Kontrak", en: "Contract Address" },

    auditHeading: { id: "Audit Smart Contract", en: "Smart Contract Audit" },
    auditBody: {
      id: "Kontrak USDX telah diaudit oleh Cyberscope. Laporan lengkapnya tersedia dalam bentuk PDF.",
      en: "The USDX contract has been audited by Cyberscope. The full report is available as a PDF.",
    },

    // ── AUP report over the reserve (sits directly under the audit above) ───
    // The section below the smart-contract audit, and deliberately built to
    // read as its counterpart rather than more of the same thing: the audit
    // above is about the code, this one is about the money behind it.
    //
    // THE PARAGRAPH IS MANAGEMENT'S WORDING, SUPPLIED VERBATIM (30 Sep 2026),
    // in both languages. It replaced two things: a sentence that described the
    // report behind the button — the KAP's agreed-upon procedures (SJT 4400)
    // over the position of 27 August 2026 and the 1:1 ratio they record — and
    // a note saying that the published file is redacted. Neither is on the page
    // any more; both are still in the PDF itself.
    //
    // It says "audit" ("dokumentasi audit transparansi") and "kepatuhan" /
    // "compliance". That is a deliberate exception to the rule the rest of this
    // block was written under, not a lifting of it: the report states in its
    // own letter that the procedures are not an audit or a review and that the
    // KAP expresses no opinion or assurance of any kind. So the heading and the
    // button still say "atestasi", and nothing may be added here that says the
    // KAP audited the reserves or gave an opinion on them. See data/audit.ts.
    attestationHeading: {
      id: "Laporan Atestasi Cadangan",
      en: "Reserve Attestation Report",
    },
    attestationBody: {
      id: "Akses dokumentasi audit transparansi yang lengkap untuk USDX, termasuk laporan terperinci mengenai cadangan dan kepatuhan. Kami menjunjung tinggi transparansi penuh untuk membangun kepercayaan dengan para pengguna kami. Klik tombol di bawah ini untuk mengunduh laporan transparansi terbaru.",
      en: "Access comprehensive transparency audit documentation for USDX, including detailed reports on reserves and compliance. We maintain full transparency to build trust with our users. Click the buttons below to download the latest transparency reports.",
    },
    attestationCta: {
      id: "Laporan Atestasi (PDF)",
      en: "Attestation Report (PDF)",
    },

    // ── Headline figures ───────────────────────────────────────────────────
    // Three cards, not four. "Underlying" is the same number as reserve assets
    // under another name, and "value per token" is the collateral ratio in
    // another unit — a fourth card would be a second printing of one of these.
    supplyLabel: { id: "Token beredar", en: "Circulating supply" },
    reserveLabel: { id: "Aset cadangan", en: "Reserve assets" },
    ratioLabel: { id: "Rasio jaminan", en: "Collateral ratio" },

    // Timestamp captions. Each is a PREFIX; the formatted WIB timestamp is
    // appended to it ("Dibaca dari rantai per 10 Agustus 2026, 11.05 WIB").
    //
    // Every one of them names a clock time, not just a date, because these
    // figures are live: circulating supply is read from the chain as the page
    // opens, and the reserve is a running ledger balance rather than a dated
    // snapshot. A date on its own would read as an end-of-day position.
    supplyCaption: { id: "Dibaca dari rantai per", en: "Read on-chain as of" },
    reserveCaption: { id: "Posisi per", en: "Balance as of" },
    updatedCaption: { id: "Terakhir diperbarui", en: "Last updated" },
    // Shown in place of a caption when there is no timestamp to print. Says
    // which thing is missing, since the figure above it says "Belum tersedia"
    // for its own reason.
    captionUnavailable: {
      id: "Waktu pembaruan belum tersedia",
      en: "Update time not yet available",
    },

    // ── Reserve breakdown ──────────────────────────────────────────────────
    reserveHeading: { id: "Rincian Cadangan", en: "Reserve Breakdown" },
    // The list itself is a structured content list, so it lives in
    // RESERVE_COMPOSITION in src/data/transparency.ts — which is also where the
    // reason nothing may be added to it is written down.
    //
    // States the absence explicitly. Readers arrive at this page having seen
    // other stablecoins list treasuries and money market funds, and will assume
    // the same mix unless told otherwise.
    // Names the page instead of a direction ("di bawah" / "below"), which
    // stays true whatever the cards are reordered into next. What it points at
    // is the reserve attestation card — see attestationHeading.
    reserveCompositionNote: {
      id: "Cadangan USDX seluruhnya berbentuk kas Dolar AS. Tidak ada surat utang negara, reksa dana pasar uang, atau instrumen lain di dalamnya. Isi cadangan diverifikasi secara independen lewat atestasi bulanan yang tercantum di halaman ini.",
      en: "USDX reserves are held entirely as U.S. dollar cash. They contain no treasury instruments, no money market funds and no other instruments. What the reserves hold is verified independently through the monthly attestations listed on this page.",
    },
    // NOT "Kustodian" / "Custodian". The official documentation says the
    // reserves are "held in U.S. dollar cash at Bank Negara Indonesia (BNI)"
    // and never once calls BNI a custodian — which is a licensed banking role
    // with a specific meaning, not a synonym for the bank an account is at.
    // The same phrase ("di kustodian Bank BNI") was already taken out of the
    // footer and the meta description for being the site's own wording rather
    // than the documentation's; putting it back on the transparency page, next
    // to the reserve figures, is the same unbacked claim in the worst possible
    // place. This label states where the money is and claims no role for
    // anyone. See RESERVE_BANK in src/data/transparency.ts.
    reserveBank: { id: "Bank penyimpan", en: "Held at" },
    issuer: { id: "Penerbit", en: "Issuer" },

    // ── How the figures are read ───────────────────────────────────────────
    methodHeading: { id: "Cara angka ini dibaca", en: "How these figures are read" },
    supplyDefinitionTitle: {
      id: "Definisi token beredar",
      en: "Definition of circulating supply",
    },
    supplyDefinition: {
      id: "Token beredar adalah nilai totalSupply mentah yang dibaca langsung dari kontrak USDX di jaringan Polygon — tanpa pengurangan apa pun, termasuk token yang masih ditahan di alamat treasury. Angka yang sama dapat Anda periksa sendiri di halaman kontrak USDX di PolygonScan; kalau berbeda, yang berlaku adalah angka di rantai.",
      en: "Circulating supply is the raw totalSupply value read directly from the USDX contract on the Polygon network — with no deductions of any kind, including tokens still held at treasury addresses. You can check the same figure yourself on the USDX contract page on PolygonScan; if the two ever differ, the on-chain figure is the one that counts.",
    },
    ratioDefinitionTitle: { id: "Definisi rasio jaminan", en: "Definition of collateral ratio" },
    ratioDefinition: {
      id: "Rasio jaminan adalah aset cadangan dibagi token beredar, dan baris “1 USDX = USD …” adalah rasio yang sama dinyatakan per token — bukan angka terpisah. Cadangan dicatat dalam buku besar yang bergerak setiap kali token dicetak, dibakar, atau ditebus, sementara token beredar dibaca dari rantai saat halaman dibuka; keduanya diberi keterangan waktu masing-masing.",
      en: "The collateral ratio is reserve assets divided by circulating supply, and the “1 USDX = USD …” line is that same ratio stated per token — not a separate figure. Reserves are recorded in a ledger that moves whenever tokens are minted, burned or redeemed, while circulating supply is read from the chain when this page opens; each carries its own timestamp.",
    },
  },
} satisfies Record<string, unknown>;
