import type { Metadata } from "next";
import { AdvertisingInquiryForm } from "@/components/advertising-inquiry-form";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Advertising Enquiry" };

export default function Page() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@korpulse.com";
  return <InfoPage eyebrow="FOUNDING PARTNER ENQUIRY" title="Tell us what you want the campaign to achieve." intro="KorPulse reviews the advertiser, destination, claims and category before any placement is accepted.">
    <AdvertisingInquiryForm email={email} />
    <h2>What happens next</h2><p>We review relevance, user safety, disclosure requirements and inventory availability. A proposal is only issued after that review; submitting an enquiry does not reserve or approve a campaign.</p>
  </InfoPage>;
}
