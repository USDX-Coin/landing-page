import type { Translated } from "../i18n";

export interface TeamMember {
  /** Full name, exactly as it appears on the LinkedIn profile. */
  name: string;
  role: Translated;
  /** Photo in `public/image/team/`, e.g. "/image/team/nama-orang.jpg". */
  photo: string;
  /** Full public LinkedIn profile URL — PolygonScan asks for this specifically. */
  linkedin: string;
}

// Still waiting on management for names, roles, photos and LinkedIn URLs.
//
// While this array is empty the Team section is not rendered at all (see
// Team.astro). Do not fill it with invented people or empty cards: a made-up
// team is worse than no team section, and PolygonScan checks the LinkedIn
// profiles it is given.
//
// Example entry:
//   {
//     name: "Nama Lengkap",
//     role: { id: "Direktur Utama", en: "Chief Executive Officer" },
//     photo: "/image/team/nama-lengkap.jpg",
//     linkedin: "https://www.linkedin.com/in/nama-lengkap/",
//   },
export const team: TeamMember[] = [];
