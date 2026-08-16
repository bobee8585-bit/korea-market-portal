import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
export const metadata: Metadata = { title: "Advertise" };
const products = [
  ["Industry partner", "A clearly labelled sponsor position on a relevant industry or ecosystem page."],
  ["Display placement", "A limited, non-disruptive placement on selected high-intent pages."],
  ["Newsletter sponsor", "A future single-sponsor position in an opted-in industry briefing."],
  ["Research support", "Transparent support for a public-interest research series without editorial control."],
];
export default function Page() {
  return <InfoPage eyebrow="PARTNER WITH KORPULSE" title="Reach readers who follow Korea's industrial ecosystem." intro="KorPulse offers limited, clearly labelled sponsorship for organisations serving industry, trade, logistics, technology and professional markets.">
    <div className="mediaKitGrid">{products.map(([name, copy]) => <section key={name}><h2>{name}</h2><p>{copy}</p></section>)}</div>
    <h2>Editorial safeguards</h2><p>Sponsored placements are labelled Advertisement or Sponsored. Partners receive no influence over company rankings, evidence standards or editorial conclusions.</p>
    <h2>Categories we do not accept</h2><p>Misleading financial promotions, guaranteed-return claims, unlicensed investment solicitation, political persuasion, gambling and products that conflict with publisher safety standards.</p>
    <div className="contactCta"><strong>Request the media kit</strong><p>Tell us your organisation, target market, campaign period and preferred industry category.</p><a href="/contact">Contact KorPulse →</a></div>
  </InfoPage>;
}
