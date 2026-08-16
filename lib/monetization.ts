export type AdProvider = "direct" | "adsense" | "adfit" | "dable";
export type SponsorPlacement = "home-inline" | "site-footer" | "industry-inline" | "newsletter";
export type DirectCampaign = {
  id: string;
  sponsorName: string;
  sponsorUrl: string;
  label?: string;
  placements: SponsorPlacement[];
  startsAt?: string;
  endsAt?: string;
};

export const monetization = {
  direct: { enabled: process.env.NEXT_PUBLIC_DIRECT_ADS_ENABLED === "true" },
  adsense: { enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true", client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "" },
  adfit: { enabled: process.env.NEXT_PUBLIC_ADFIT_ENABLED === "true", unit: process.env.NEXT_PUBLIC_ADFIT_UNIT || "" },
  dable: { enabled: process.env.NEXT_PUBLIC_DABLE_ENABLED === "true", service: process.env.NEXT_PUBLIC_DABLE_SERVICE || "" },
} as const;

function isCampaign(value: unknown): value is DirectCampaign {
  if (!value || typeof value !== "object") return false;
  const campaign = value as Partial<DirectCampaign>;
  return typeof campaign.id === "string"
    && typeof campaign.sponsorName === "string"
    && /^https:\/\//.test(campaign.sponsorUrl || "")
    && Array.isArray(campaign.placements)
    && campaign.placements.length > 0;
}

export function directCampaigns(): DirectCampaign[] {
  const raw = process.env.DIRECT_AD_CAMPAIGNS_JSON;
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter(isCampaign);
    } catch {
      return [];
    }
  }

  const sponsorName = process.env.NEXT_PUBLIC_DIRECT_SPONSOR_NAME || "";
  const sponsorUrl = process.env.NEXT_PUBLIC_DIRECT_SPONSOR_URL || "";
  if (sponsorName && /^https:\/\//.test(sponsorUrl)) {
    return [{ id: "legacy-direct", sponsorName, sponsorUrl, placements: ["home-inline"] }];
  }
  return [];
}

export function isCampaignActive(campaign: DirectCampaign, now = new Date()) {
  const start = campaign.startsAt ? new Date(campaign.startsAt) : null;
  const end = campaign.endsAt ? new Date(campaign.endsAt) : null;
  return (!start || start <= now) && (!end || end > now);
}

export function activeCampaignFor(placement: SponsorPlacement, now = new Date()) {
  if (!monetization.direct.enabled) return null;
  return directCampaigns().find((campaign) => campaign.placements.includes(placement) && isCampaignActive(campaign, now)) || null;
}

export const revenueStages = [
  { stage: 1, key: "direct", label: "Direct sponsorship", condition: "Media kit live and sponsor inventory approved" },
  { stage: 2, key: "adsense-adfit", label: "AdSense / AdFit", condition: "Policy pages complete, original content established, network approval received" },
  { stage: 3, key: "dable", label: "Dable native ads", condition: "Sustained article traffic and publisher partnership approval" },
  { stage: 4, key: "newsletter", label: "Newsletter sponsorship", condition: "A consistent opted-in subscriber audience" },
  { stage: 5, key: "data", label: "Reports and data access", condition: "Repeat demand for verified industry datasets" },
] as const;

export function enabledProviders() {
  return Object.entries(monetization).filter(([, value]) => value.enabled).map(([key]) => key);
}
