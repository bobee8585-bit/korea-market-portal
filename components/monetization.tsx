import Script from "next/script";
import { monetization } from "@/lib/monetization";

export function AdProviderScripts() {
  if (!monetization.adsense.enabled || !monetization.adsense.client) return null;

  return (
    <Script
      id="adsense"
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${monetization.adsense.client}`}
    />
  );
}

export function DirectSponsorSlot({ placement = "home-inline" }: { placement?: string }) {
  if (!monetization.direct.enabled || !monetization.direct.sponsorName || !monetization.direct.sponsorUrl) {
    return null;
  }

  return (
    <aside className="adSlot" aria-label="Advertisement" data-placement={placement}>
      <span>ADVERTISEMENT</span>
      <a href={monetization.direct.sponsorUrl} rel="sponsored nofollow noopener" target="_blank">
        <strong>{monetization.direct.sponsorName}</strong>
        <small>Official KorPulse industry partner</small>
      </a>
    </aside>
  );
}
