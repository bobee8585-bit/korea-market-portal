import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
export const metadata: Metadata = { title: "Editorial Policy" };
export default function Page() {
  return <InfoPage eyebrow="EDITORIAL POLICY" title="Evidence before publication." intro="Our editorial and commercial systems are deliberately separated.">
    <h2>Source hierarchy</h2><p>Government, regulators, exchanges, company filings, public institutions and rights-cleared archives are preferred. Secondary reporting is used as a link or corroborating source when appropriate.</p>
    <h2>Corrections</h2><p>Material errors are corrected with the source and update date preserved where practical. Contact us with the exact page and supporting evidence.</p>
    <h2>Advertising independence</h2><p>Payment does not create favourable coverage. Sponsored material is labelled and is not included in analytical rankings unless the same published methodology applies.</p>
    <h2>AI assistance</h2><p>Automation may assist classification, translation and summarisation. Publication rules still require evidence, rights controls and human-review pathways for sensitive material.</p>
  </InfoPage>;
}
