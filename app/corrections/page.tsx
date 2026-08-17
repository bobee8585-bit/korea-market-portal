import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Corrections and Rights Requests" };

export default function Page() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@korpulse.com";

  return <InfoPage eyebrow="CORRECTIONS & RIGHTS" title="Correct the record without hiding the evidence." intro="KorPulse reviews factual, translation, attribution, privacy and rights concerns against the original source.">
    <h2>What to send</h2><p>Identify the exact KorPulse page, disputed wording, reason for the request, authoritative supporting source and the correction or action requested. Send the material to <a className="textLink" href={`mailto:${email}`}>{email}</a>.</p>
    <h2>How we assess a request</h2><p>We compare the published wording with the linked original, its date, the legal or procedural status described, and any later official correction. A company statement remains attributed to the company; it is not converted into an independently verified conclusion.</p>
    <h2>Urgent restriction</h2><p>Content may be temporarily hidden while we verify a credible claim involving personal data, mistaken identity, unlawful disclosure, source-rights infringement or a material safety risk. Temporary restriction is not an admission that the request is valid.</p>
    <h2>Correction outcomes</h2><p>Where the evidence supports a change, we may correct, clarify, update attribution, replace a translation, add a later official development, restrict access or remove material. Material corrections preserve the source and update date where practical.</p>
    <h2>Requests we do not automatically accept</h2><p>Unfavourable but accurately attributed public information is not removed solely because it is inconvenient. Promotional wording, unsupported rankings and requests to erase relevant source context are not adopted as editorial fact.</p>
    <h2>Translation review</h2><p>For disputed translations, include the original sentence and proposed rendering. Sensitive legal, regulatory, safety and misconduct language requires sentence-level human comparison before republication.</p>
    <div className="evidenceNotice"><strong>Do not send confidential material unnecessarily</strong><p>Provide only information needed to identify and assess the issue. KorPulse may request reasonable verification before acting on a privacy or identity-based request.</p></div>
  </InfoPage>;
}
