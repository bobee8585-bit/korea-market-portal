"use client";

import { useEffect, useRef } from "react";
import type { SponsorPlacement } from "@/lib/monetization";

type SponsorSlotClientProps = {
  campaignId: string;
  sponsorName: string;
  sponsorUrl: string;
  label: string;
  placement: SponsorPlacement;
};

function recordSponsorEvent(campaignId: string, placement: SponsorPlacement, event: "impression" | "click") {
  const payload = JSON.stringify({ campaignId, placement, event, page: window.location.pathname });
  if (event === "click" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/ads/event", new Blob([payload], { type: "application/json" }));
    return;
  }
  void fetch("/api/ads/event", { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true });
}

export function SponsorSlotClient({ campaignId, sponsorName, sponsorUrl, label, placement }: SponsorSlotClientProps) {
  const slotRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      recordSponsorEvent(campaignId, placement, "impression");
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(slot);
    return () => observer.disconnect();
  }, [campaignId, placement]);

  return <aside ref={slotRef} className="adSlot" aria-label="Advertisement" data-placement={placement} data-campaign={campaignId}>
    <span>ADVERTISEMENT</span>
    <a href={sponsorUrl} rel="sponsored nofollow noopener" target="_blank" onClick={() => recordSponsorEvent(campaignId, placement, "click")}>
      <strong>{sponsorName}</strong><small>{label}</small>
    </a>
  </aside>;
}
