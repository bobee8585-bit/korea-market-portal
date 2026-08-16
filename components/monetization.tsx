import Script from "next/script";
import { activeCampaignFor, monetization, type SponsorPlacement } from "@/lib/monetization";
import { SponsorSlotClient } from "@/components/sponsor-slot-client";

export function AdProviderScripts() {
  if (!monetization.adsense.enabled || !monetization.adsense.client) return null;
  return <Script id="adsense" strategy="afterInteractive" async crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${monetization.adsense.client}`} />;
}

export function DirectSponsorSlot({ placement = "home-inline" }: { placement?: SponsorPlacement }) {
  const campaign = activeCampaignFor(placement);
  if (!campaign) return null;

  return <SponsorSlotClient campaignId={campaign.id} sponsorName={campaign.sponsorName} sponsorUrl={campaign.sponsorUrl} label={campaign.label || "KorPulse industry partner"} placement={placement} />;
}
