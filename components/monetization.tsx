import Script from "next/script";
import { activeCampaignFor, monetization, type SponsorPlacement } from "@/lib/monetization";

export function AdProviderScripts() {
  if (!monetization.adsense.enabled || !monetization.adsense.client) return null;
  return <Script id="adsense" strategy="afterInteractive" async crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${monetization.adsense.client}`} />;
}

export function DirectSponsorSlot({ placement = "home-inline" }: { placement?: SponsorPlacement }) {
  const campaign = activeCampaignFor(placement);
  if (!campaign) return null;

  return (
    <aside className="adSlot" aria-label="Advertisement" data-placement={placement} data-campaign={campaign.id}>
      <span>ADVERTISEMENT</span>
      <a href={campaign.sponsorUrl} rel="sponsored nofollow noopener" target="_blank">
        <strong>{campaign.sponsorName}</strong>
        <small>{campaign.label || "KorPulse industry partner"}</small>
      </a>
    </aside>
  );
}
