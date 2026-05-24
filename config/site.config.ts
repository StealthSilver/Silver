const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://silver-jet.vercel.app";

export const SITE = {
  name: "Silver",
  description:
    "Full-stack software engineer specializing in modern web development.",
  url: siteUrl,
  ogImage: "/og-img.png",
  twitterHandle: "@silver_srs",
};
