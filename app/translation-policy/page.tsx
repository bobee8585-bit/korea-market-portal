import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Translation Policy" };

export default function Page() {
  return <InfoPage eyebrow="TRANSLATION POLICY" title="Translation must preserve legal and factual meaning." intro="KorPulse translation is an aid to discovery. The linked original remains authoritative.">
    <h2>No added certainty</h2><p>Terms such as alleged, reportedly, may, could, estimated and under investigation must remain qualified. Investigation, allegation, charge, judgment and final conviction are not interchangeable.</p>
    <h2>Attribution remains visible</h2><p>Statements by a company, regulator, court, government agency or third party remain attributed to that source. A translated statement is not converted into a KorPulse conclusion.</p>
    <h2>Numbers and defined terms</h2><p>Currency, units, reporting periods, accounting scope, legal terms, names and official job titles require source-level checking. Converted figures must show the conversion basis and date.</p>
    <h2>Sensitive material</h2><p>Litigation, enforcement, workplace incidents, safety failures, financial distress and allegations of misconduct require sentence-level comparison and human review before publication. Low-confidence translations remain unpublished.</p>
    <h2>Corrections</h2><p>Material translation corrections preserve the source, the corrected wording and the update date where practical. The translation never replaces a filing, judgment or regulator notice.</p>
    <div className="evidenceNotice"><strong>Reader notice</strong><p>Use the original document for legal, investment, compliance or contractual decisions. Contact KorPulse with the page URL and exact source wording if a translation appears incomplete or inaccurate.</p></div>
  </InfoPage>;
}
