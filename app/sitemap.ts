import type { MetadataRoute } from "next";
const publicRoutes = ["", "/about", "/advertise", "/advertise/inquiry", "/sponsors", "/sponsorship-policy", "/industries", "/companies", "/ecosystems/semiconductor", "/ecosystems/semiconductor/compare", "/korea-inside", "/people-who-built-korea", "/mega-factories", "/clusters", "/news", "/market-events", "/global-money", "/ma", "/editorial-policy", "/translation-policy", "/disclaimer", "/privacy", "/terms", "/contact"];
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://korpulse.com").replace(/\/$/, "");
  return publicRoutes.map((route) => ({ url: `${baseUrl}${route}`, changeFrequency: "daily" as const }));
}
