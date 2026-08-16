import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
export const metadata: Metadata = { title: "Privacy Policy" };
export default function Page() {
  return <InfoPage eyebrow="PRIVACY" title="Privacy by staged activation." intro="Effective 16 August 2026. This notice explains the current service and how future advertising tools will be activated.">
    <h2>Data we process</h2><p>Our hosting provider may process request information such as IP address, device details, requested URL, timestamps and security logs to deliver and protect the service.</p>
    <h2>Advertising</h2><p>Third-party advertising scripts remain disabled until the relevant provider is approved and consent requirements are implemented. When activated, this notice will identify the provider, purposes, retention and available controls.</p>
    <h2>Cookies and consent</h2><p>Essential security and delivery technologies may operate without advertising. Personalised advertising will not be enabled for jurisdictions requiring consent until an approved consent mechanism is active.</p>
    <h2>Contact and rights</h2><p>Use the contact page for privacy questions, access or deletion requests. We may request reasonable verification before acting on a request.</p>
    <h2>International processing</h2><p>Infrastructure and future service providers may process data outside a visitor's country under their applicable safeguards.</p>
  </InfoPage>;
}
