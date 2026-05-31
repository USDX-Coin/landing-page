export type SocialIcon = "twitter" | "linkedin" | "telegram" | "discord" | "github" | "medium";

export interface Social {
  name: string;
  url: string;
  icon: SocialIcon;
}

export const socials: Social[] = [
  { name: "X (Twitter)", url: "#", icon: "twitter" },
  { name: "LinkedIn", url: "#", icon: "linkedin" },
  { name: "GitHub", url: "#", icon: "github" },
  { name: "Telegram", url: "#", icon: "telegram" },
  { name: "Discord", url: "#", icon: "discord" },
];
