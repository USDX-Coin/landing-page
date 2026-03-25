export type SocialIcon = "twitter" | "telegram" | "discord" | "github" | "medium";

export interface Social {
  name: string;
  url: string;
  icon: SocialIcon;
}

export const socials: Social[] = [
  { name: "Twitter", url: "#", icon: "twitter" },
  { name: "Telegram", url: "#", icon: "telegram" },
  { name: "Discord", url: "#", icon: "discord" },
  { name: "GitHub", url: "#", icon: "github" },
  { name: "Medium", url: "#", icon: "medium" },
];
