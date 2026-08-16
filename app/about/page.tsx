import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
export const metadata: Metadata = { title: "About" };
export default function Page() {
  return <InfoPage eyebrow="ABOUT KORPULSE" title="Korea's industrial story, connected to evidence." intro="KorPulse explains where Korean companies, factories and people sit inside global industry without turning public facts into trading instructions.">
    <h2>Our purpose</h2><p>We connect official disclosures, public archives, factories, companies and global value chains in a form international readers can verify.</p>
    <h2>Our standard</h2><p>Official and rights-cleared sources come first. Every material relationship should be traceable to evidence, publication dates and source links.</p>
    <h2>Our independence</h2><p>Advertising and sponsorship never determine rankings, conclusions or editorial coverage.</p>
  </InfoPage>;
}
