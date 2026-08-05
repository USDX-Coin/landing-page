export type SocialIcon = "twitter" | "linkedin" | "telegram" | "discord" | "github" | "medium";

export interface Social {
  name: string;
  url: string;
  icon: SocialIcon;
}

// Only accounts that actually exist. A dead social icon is one of the reasons
// PolygonScan rejects a token-info submission, so never ship an "#" here —
// add the entry back once the account is live.
export const socials: Social[] = [
  { name: "X (Twitter)", url: "https://x.com/usdx_id", icon: "twitter" },
  // { name: "LinkedIn", url: "", icon: "linkedin" },
  // { name: "GitHub", url: "", icon: "github" },
  // { name: "Telegram", url: "", icon: "telegram" },
  // { name: "Discord", url: "", icon: "discord" },
];
