import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
export const metadata: Metadata = { title: "Terms of Use" };
export default function Page() {
  return <InfoPage eyebrow="TERMS" title="Terms of use." intro="Effective 16 August 2026. By using KorPulse, you agree to use the service lawfully and verify important information at its source.">
    <h2>Permitted use</h2><p>You may browse and link to public pages. Automated extraction, republication or commercial reuse may require prior permission and must respect source rights.</p>
    <h2>No warranty</h2><p>The service is provided on an as-available basis. We do not guarantee uninterrupted access, completeness or suitability for a particular decision.</p>
    <h2>Prohibited conduct</h2><p>Do not interfere with security, misrepresent affiliation, upload malicious material, manipulate advertising interactions or use the service unlawfully.</p>
    <h2>Third-party links</h2><p>Links lead to independent services governed by their own terms. A link is not an endorsement.</p>
  </InfoPage>;
}
