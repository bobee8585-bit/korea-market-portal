import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { directCampaigns, isCampaignActive } from "@/lib/monetization";
export const metadata: Metadata = { title: "Sponsor Register" };
export const dynamic = "force-dynamic";

export default function Page() {
  const campaigns = directCampaigns();
  return <InfoPage eyebrow="TRANSPARENCY REGISTER" title="Sponsors and paid relationships." intro="This public register separates commercial support from editorial coverage.">
    {campaigns.length ? <div className="sponsorRegister">{campaigns.map((campaign) => <section key={campaign.id}><span>{isCampaignActive(campaign) ? "ACTIVE" : "INACTIVE"}</span><h2>{campaign.sponsorName}</h2><p>Placements: {campaign.placements.join(", ")}</p><p>Period: {campaign.startsAt || "Not specified"} — {campaign.endsAt || "Open-ended"}</p><a className="textLink" href={campaign.sponsorUrl} rel="sponsored nofollow noopener" target="_blank">Sponsor destination →</a></section>)}</div> : <div className="emptyDisclosure"><strong>No paid sponsors are currently registered.</strong><p>Future direct campaigns will appear here when they become active.</p></div>}
    <h2>What registration means</h2><p>Registration discloses a paid relationship. It does not indicate endorsement, favourable coverage or influence over evidence and ranking methods.</p>
  </InfoPage>;
}
