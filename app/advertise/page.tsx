import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
export const metadata: Metadata = { title: "Advertise" };

const products = [
  { name: "Industry partner", status: "Available now", placement: "Relevant industry and ecosystem pages", format: "Clearly labelled partner strip", fit: "Manufacturing, logistics, B2B technology, professional services" },
  { name: "Display placement", status: "Available now", placement: "Home inline or global footer", format: "Responsive text-led display unit", fit: "Brand awareness without interrupting research" },
  { name: "Newsletter sponsor", status: "Planned", placement: "One sponsor per opted-in briefing", format: "Header or mid-brief disclosure", fit: "Campaigns seeking a recurring professional audience" },
  { name: "Research support", status: "Selective", placement: "Named public-interest research series", format: "Funding disclosure, no editorial control", fit: "Institutions supporting documented industrial history" },
];

export default function Page() {
  return <InfoPage eyebrow="PARTNER WITH KORPULSE" title="Reach readers who follow Korea's industrial ecosystem." intro="KorPulse keeps inventory limited, disclosures visible and editorial decisions independent. Founding-partner campaigns are quoted individually until verified audience benchmarks are established.">
    <div className="inventoryGrid">{products.map((item) => <section key={item.name}><span>{item.status}</span><h2>{item.name}</h2><dl><dt>Placement</dt><dd>{item.placement}</dd><dt>Format</dt><dd>{item.format}</dd><dt>Best fit</dt><dd>{item.fit}</dd></dl></section>)}</div>
    <h2>Launch inventory</h2>
    <div className="specTable" role="table" aria-label="Advertising inventory">
      <div role="row"><strong role="columnheader">Placement</strong><strong role="columnheader">Desktop</strong><strong role="columnheader">Mobile</strong><strong role="columnheader">Density rule</strong></div>
      <div role="row"><span>Home inline</span><span>Full content width</span><span>Stacked responsive</span><span>Maximum one unit</span></div>
      <div role="row"><span>Site footer</span><span>Full content width</span><span>Stacked responsive</span><span>Maximum one unit</span></div>
      <div role="row"><span>Industry inline</span><span>Within relevant analysis</span><span>Between sections</span><span>Never beside a trading action</span></div>
    </div>
    <h2>Measurement</h2><p>Direct campaigns record placement impressions and outbound interactions without cookies or persistent user identifiers. Reporting distinguishes delivery from interaction and does not make unverified audience claims.</p>
    <h2>Editorial safeguards</h2><p>Sponsored placements are labelled Advertisement or Sponsored. Partners receive no influence over company rankings, evidence standards or editorial conclusions. Active and completed paid relationships are disclosed on the sponsor register.</p>
    <h2>Categories we do not accept</h2><p>Misleading financial promotions, guaranteed-return claims, unlicensed investment solicitation, political persuasion, gambling and products that conflict with publisher safety standards.</p>
    <div className="contactCta"><strong>Request a founding-partner proposal</strong><p>Tell us your organisation, destination URL, target market, campaign dates and preferred industry category.</p><a href="/advertise/inquiry">Prepare advertising enquiry →</a></div>
  </InfoPage>;
}
