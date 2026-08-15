import type { MetadataRoute } from "next";

const publicRoutes = [
  "",
  "/companies",
  "/ecosystems/semiconductor",
  "/ecosystems/semiconductor/compare",
  "/korea-inside",
  "/mega-factories",
  "/clusters",
  "/news",
  "/market-events",
  "/global-money",
  "/ma",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
  return publicRoutes.map((route) => ({ url: `${baseUrl}${route}`, changeFrequency: "daily" as const }));
}
