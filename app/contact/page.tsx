import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
export const metadata: Metadata = { title: "Contact" };
export default function Page() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@korpulse.com";
  return <InfoPage eyebrow="CONTACT" title="Contact KorPulse." intro="Send corrections, rights questions, source suggestions or commercial enquiries with enough detail for review.">
    <h2>Email</h2><p><a className="textLink" href={`mailto:${email}`}>{email}</a></p>
    <h2>Correction requests</h2><p>Include the page URL, disputed statement, authoritative source and requested correction.</p>
    <h2>Advertising enquiries</h2><p>Include the organisation name, website, campaign dates, target market and industry category. Advertising does not purchase editorial influence.</p><p><a className="textLink" href="/advertise/inquiry">Prepare a structured advertising enquiry →</a></p>
  </InfoPage>;
}
