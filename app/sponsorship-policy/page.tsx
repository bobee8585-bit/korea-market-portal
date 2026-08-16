import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
export const metadata: Metadata = { title: "Sponsorship Policy" };
export default function Page() {
  return <InfoPage eyebrow="COMMERCIAL INDEPENDENCE" title="Sponsorship policy." intro="Commercial support may fund the service, but it cannot purchase KorPulse conclusions.">
    <h2>Clear labels</h2><p>Paid placements use Advertisement or Sponsored labels and sponsored outbound links use appropriate relationship attributes.</p>
    <h2>No editorial control</h2><p>Sponsors cannot select analytical outcomes, suppress relevant public facts, approve editorial copy or obtain preferential rankings.</p>
    <h2>Eligibility review</h2><p>Every advertiser and destination is reviewed for identity, relevance, misleading claims, user safety and conflicts with the information-only purpose of KorPulse.</p>
    <h2>Financial promotions</h2><p>KorPulse does not accept guaranteed-return claims, unlicensed solicitation or creatives framed as personalised trading instructions.</p>
    <h2>Corrections and complaints</h2><p>Advertising complaints can be submitted through the contact page. A campaign may be paused while a material safety or accuracy concern is reviewed.</p>
  </InfoPage>;
}
