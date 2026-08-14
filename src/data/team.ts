import type { Translated } from "../i18n";

export interface TeamMember {
  /** Full name, exactly as it appears on the member's own public profile. */
  name: string;
  role: Translated;
  /** Photo in `public/image/team/`, e.g. "/image/team/nama-orang.jpg". */
  photo: string;
  /** Full public Instagram profile URL. */
  instagram: string;
}

// Real people only. Do not add invented members, and do not pad the grid with
// empty or "coming soon" cards: a made-up team is worse than a short one, and
// the profiles listed here are checked by the people reviewing our listings.
//
// STILL OUTSTANDING: PolygonScan's token-info submission asks for team members
// with public *LinkedIn* profiles specifically. We only have Instagram for the
// people below, so that requirement is not met yet. When the LinkedIn URLs
// arrive, add a `linkedin` field alongside `instagram` rather than replacing it.
export const team: TeamMember[] = [
  {
    name: "Bintang Alexander",
    role: { id: "Chief Executive Officer", en: "Chief Executive Officer" },
    photo: "/image/team/bintang-alexander.jpg",
    instagram: "https://www.instagram.com/alexander_hermawan/",
  },
];
