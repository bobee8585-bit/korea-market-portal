import type { MetadataRoute } from "next";
import { industryCatalog } from "@/lib/industry-catalog";
import { industryStageSlug } from "@/lib/industry-stage-catalog";
const staticRoutes = ["", "/about", "/advertise", "/advertise/inquiry", "/sponsors", "/sponsorship-policy", "/industries", "/companies", "/ecosystems/semiconductor", "/ecosystems/semiconductor/compare", "/korea-inside", "/people-who-built-korea", "/mega-factories", "/clusters", "/news", "/market-events", "/global-money", "/fund-flow", "/ma", "/editorial-policy", "/corrections", "/translation-policy", "/disclaimer", "/privacy", "/terms", "/contact"];
const industryRoutes = industryCatalog.flatMap((industry) => [
  `/industries/${industry.slug}`,
  ...industry.chain.map((stage) => `/industries/${industry.slug}/${industryStageSlug(stage)}`),
]);
const publicRoutes = [...staticRoutes, ...industryRoutes];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://korpulse.com").replace(/\/$/, "");
  return publicRoutes.map((route) => ({ url: `${baseUrl}${route}`, changeFrequency: "daily" as const }));
}
