import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
export const metadata: Metadata = { title: "Disclaimer" };
export default function Page() {
  return <InfoPage eyebrow="DISCLAIMER" title="Information, not investment advice." intro="KorPulse provides public-information discovery and industry context.">
    <h2>No recommendation</h2><p>Nothing on this service is an offer, solicitation, investment recommendation, price forecast or instruction to buy, sell or hold a security.</p>
    <h2>Verify current information</h2><p>Sources may be delayed, corrected or superseded. Readers should review the linked official filing or publication before relying on any fact.</p>
    <h2>Professional decisions</h2><p>Investment, legal, tax and accounting decisions require appropriately qualified independent advice.</p>
    <h2>Sponsored content</h2><p>Advertising is labelled and does not represent KorPulse endorsement of an advertiser's products, claims or suitability.</p>
  </InfoPage>;
}
