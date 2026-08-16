export type AdProvider = "direct" | "adsense" | "adfit" | "dable";

export const monetization = {
  direct: {
    enabled: process.env.NEXT_PUBLIC_DIRECT_ADS_ENABLED === "true",
    sponsorName: process.env.NEXT_PUBLIC_DIRECT_SPONSOR_NAME || "",
    sponsorUrl: process.env.NEXT_PUBLIC_DIRECT_SPONSOR_URL || "",
  },
  adsense: {
    enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true",
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  },
  adfit: {
    enabled: process.env.NEXT_PUBLIC_ADFIT_ENABLED === "true",
    unit: process.env.NEXT_PUBLIC_ADFIT_UNIT || "",
  },
  dable: {
    enabled: process.env.NEXT_PUBLIC_DABLE_ENABLED === "true",
    service: process.env.NEXT_PUBLIC_DABLE_SERVICE || "",
  },
} as const;

export const revenueStages = [
  { stage: 1, key: "direct", label: "Direct sponsorship", condition: "Media kit live and sponsor inventory approved" },
  { stage: 2, key: "adsense-adfit", label: "AdSense / AdFit", condition: "Policy pages complete, original content established, network approval received" },
  { stage: 3, key: "dable", label: "Dable native ads", condition: "Sustained article traffic and publisher partnership approval" },
  { stage: 4, key: "newsletter", label: "Newsletter sponsorship", condition: "A consistent opted-in subscriber audience" },
  { stage: 5, key: "data", label: "Reports and data access", condition: "Repeat demand for verified industry datasets" },
] as const;

export function enabledProviders() {
  return Object.entries(monetization)
    .filter(([, value]) => value.enabled)
    .map(([key]) => key);
}
