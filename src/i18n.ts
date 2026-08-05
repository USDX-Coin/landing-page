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
    // PDF (Cyberscope) and the attestation table on /transparency.
    auditCta: { id: "Lihat Laporan Audit", en: "View Audit Report" },
    transparencyCta: { id: "Lihat Dokumen Transparansi", en: "View Transparency Documents" },
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
    legalDisclaimer: { id: "Ketentuan Hukum & Sanggahan", en: "Legal & Disclaimer" },
    audit: { id: "Laporan Audit", en: "Audit Report" },
    // The whitepaper is the GitBook documentation, already reachable through the
    // "Dokumentasi" nav entry. A second footer link to the identical URL would be
    // padding, so this label is unused — restore it only if a standalone
    // whitepaper document ever ships at its own address.
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

  team: {
    eyebrow: { id: "Tim", en: "Team" },
    heading1: { id: "Orang di balik", en: "The people behind" },
    heading2: { id: "USDX", en: "USDX" },
    sub: {
      id: "Tim yang menjalankan penerbitan dan operasional USDX di PT Macan Asia Finance.",
      en: "The team running USDX issuance and operations at PT Macan Asia Finance.",
    },
    linkedin: { id: "Profil LinkedIn", en: "LinkedIn profile" },
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
  // The page is a document warehouse: the monthly attestation table, the
  // contract address, and the smart-contract audit. It used to lead with reserve
  // FIGURES (circulating supply, total reserves, collateral ratio, reserve
  // breakdown). Those are switched OFF — not deleted — because finance has not
  // published a reserve position yet, and a transparency page must never print a
  // number nobody can stand behind. Everything needed to bring them back is
  // parked in the commented "FIGURES" block below.
  //
  // The attestation table used to live on its own /docs page. That page is gone
  // and its copy was merged into this block, so there is one list in one place.
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
    // Both status lines used to end with "…the figures below are the last ones
    // embedded in this page", which only made sense while the figures were on.
    // Restore that wording together with the FIGURES block.
    // Nothing about the document list is baked into the HTML — the table is
    // built entirely from the API response — so a failed fetch leaves no list at
    // all. Saying it "may be incomplete" would imply there is something there.
    statusFallback: {
      id: "Data langsung tidak dapat dimuat saat ini, jadi daftar dokumen belum dapat ditampilkan.",
      en: "Live data could not be loaded right now, so the document list cannot be shown.",
    },
    statusNoJs: {
      id: "Peramban Anda tidak menjalankan JavaScript, jadi daftar dokumen belum dapat ditampilkan.",
      en: "Your browser is not running JavaScript, so the document list cannot be shown yet.",
    },

    notAvailable: { id: "Belum tersedia", en: "Not yet available" },

    // ── Attestation table (moved here from the old /docs page) ──────────────
    colId: { id: "ID", en: "ID" },
    colName: { id: "Nama", en: "Name" },
    colMonth: { id: "Bulan", en: "Month" },
    colYear: { id: "Tahun", en: "Year" },
    colAction: { id: "Aksi", en: "Action" },
    download: { id: "Unduh", en: "Download" },

    // The ID column used to be a running counter over whatever the API happened
    // to return (oldest = 1), while this note promised the number never moves.
    // It did move — in three ways: an older period uploaded late renumbered
    // everything after it, a revoked report pulled every later number down, and
    // the backend only ever returns the last 24 reports, so the window sliding
    // shifted the whole column. The ID is now the reporting period itself, which
    // is a property of the document and cannot be changed by anything else in
    // the list. Do not put a positional counter back without dropping this note.
    idNote: {
      id: "Nomor dokumen adalah periode laporannya (tahun-bulan), jadi nomor itu melekat pada dokumen dan tidak berubah ketika laporan lain terbit, dicabut, atau daftar diperbarui. Daftar ditampilkan dari yang terbaru.",
      en: "A document's ID is its reporting period (year-month), so the ID belongs to the document itself and does not change when other reports are published, withdrawn, or the list is refreshed. The list is shown newest first.",
    },
    // Shown ONLY after the API has answered with an empty list. It states a fact
    // about the world ("nothing has been published"), so it must never be the
    // page's initial state — see listPending.
    empty: {
      id: "Belum ada dokumen yang diterbitkan. Laporan atestasi bulanan akan muncul di tabel ini begitu diterbitkan.",
      en: "No document has been published yet. Monthly attestation reports will appear in this table as soon as they are published.",
    },
    // The initial, pre-answer state. Says how the list gets here and claims
    // nothing about how many documents exist — which is the only honest thing to
    // say to a crawler, a link-preview bot, or a reviewer with JavaScript off,
    // none of which ever see the API response.
    listPending: {
      id: "Daftar dokumen dimuat langsung dari API USDX saat halaman ini dibuka.",
      en: "The document list is loaded directly from the USDX API when this page opens.",
    },

    contractHeading: { id: "Alamat Kontrak", en: "Contract Address" },

    auditHeading: { id: "Audit Smart Contract", en: "Smart Contract Audit" },
    auditBody: {
      id: "Kontrak USDX telah diaudit oleh Cyberscope. Laporan lengkapnya tersedia dalam bentuk PDF.",
      en: "The USDX contract has been audited by Cyberscope. The full report is available as a PDF.",
    },

    // ── FIGURES — OFF until finance publishes a reserve position ─────────────
    //
    // Turning them back on, in this order:
    //   1. uncomment every key in this block;
    //   2. uncomment the three matching markup sections in
    //      src/pages/transparency.astro ("Headline figures", "Reserve breakdown"
    //      and "How the figures are read") and the figure lines in that page's
    //      render() — each one is marked with the same "FIGURES" label;
    //   3. put the published position into TRANSPARENCY_FALLBACK in
    //      src/data/transparency.ts so the numbers survive a failed fetch;
    //   4. restore the "figures below" wording in statusFallback / statusNoJs
    //      above, and point metaTitle / metaDescription / heading1 / heading2 /
    //      intro back at the reserve framing (kept below, commented).
    //
    // The fetch layer in src/data/transparency.ts and its tests were left fully
    // intact — the attestation table uses the same request, and the figure
    // fields on the response are simply not rendered right now.
    //
    // metaTitle: {
    //   id: "Transparansi Cadangan USDX — PT Macan Asia Finance",
    //   en: "USDX Reserve Transparency — PT Macan Asia Finance",
    // },
    // metaDescription: {
    //   id: "Jumlah token USDX yang beredar, cadangan US Dolar di kustodian Bank BNI, rasio jaminan, dan laporan atestasi bulanan.",
    //   en: "USDX circulating supply, US Dollar reserves held in custody at Bank BNI, collateral ratio, and monthly attestation reports.",
    // },
    // heading1: { id: "Token beredar", en: "Circulating supply" },
    // heading2: { id: "dan cadangan", en: "and reserves" },
    // intro: {
    //   id: "Setiap USDX yang beredar didukung oleh US Dolar yang disimpan di rekening kustodian Bank BNI. Halaman ini menampilkan posisi terakhir yang diterbitkan beserta tanggalnya, sehingga setiap angka bisa ditelusuri sumbernya.",
    //   en: "Every USDX in circulation is backed by US Dollars held in a custodian account at Bank BNI. This page shows the latest published position together with its date, so every figure can be traced back to a source.",
    // },
    //
    // supplyLabel: { id: "Jumlah Token Beredar", en: "Circulating Supply" },
    // reserveLabel: { id: "Total Cadangan", en: "Total Reserves" },
    // ratioLabel: { id: "Rasio Jaminan", en: "Collateral Ratio" },
    // asOf: { id: "Posisi", en: "As of" },
    // readAt: { id: "Dibaca dari rantai", en: "Read on-chain" },
    // updatedAt: { id: "Terakhir diperbarui", en: "Last updated" },
    //
    // methodHeading: { id: "Cara angka ini dibaca", en: "How these figures are read" },
    // supplyDefinitionTitle: {
    //   id: "Definisi jumlah token beredar",
    //   en: "Definition of circulating supply",
    // },
    // supplyDefinition: {
    //   id: "Jumlah token beredar adalah nilai totalSupply mentah yang dibaca langsung dari kontrak USDX di jaringan Polygon — tanpa pengurangan apa pun, termasuk token yang masih ditahan di alamat treasury. Angka yang sama dapat Anda periksa sendiri di halaman kontrak USDX di PolygonScan; kalau berbeda, yang berlaku adalah angka di rantai.",
    //   en: "Circulating supply is the raw totalSupply value read directly from the USDX contract on the Polygon network — with no deductions of any kind, including tokens still held at treasury addresses. You can check the same figure yourself on the USDX contract page on PolygonScan; if the two ever differ, the on-chain figure is the one that counts.",
    // },
    // ratioDefinitionTitle: { id: "Definisi rasio jaminan", en: "Definition of collateral ratio" },
    // ratioDefinition: {
    //   id: "Rasio jaminan adalah total cadangan dibagi jumlah token beredar. Cadangan berasal dari posisi yang diterbitkan PT Macan Asia Finance dan berlaku pada tanggal posisi yang tertera — bukan waktu nyata — sementara jumlah token beredar dibaca dari rantai saat halaman dibuka.",
    //   en: "The collateral ratio is total reserves divided by circulating supply. Reserves come from the position published by PT Macan Asia Finance and are valid as of the stated position date — not in real time — while circulating supply is read from the chain when this page loads.",
    // },
    //
    // reserveHeading: { id: "Rincian Cadangan", en: "Reserve Breakdown" },
    // reserveForm: { id: "Bentuk cadangan", en: "Reserve form" },
    // reserveFormValue: {
    //   id: "US Dolar di rekening kustodian",
    //   en: "US Dollars in a custodian account",
    // },
    // custodian: { id: "Kustodian", en: "Custodian" },
    // account: { id: "Rekening", en: "Account" },
    // issuer: { id: "Penerbit", en: "Issuer" },
    // note: { id: "Catatan", en: "Note" },
  },
} satisfies Record<string, unknown>;
