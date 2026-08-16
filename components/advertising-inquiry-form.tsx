"use client";

import { useState, type FormEvent } from "react";

const fields = [
  ["organisation", "Organisation", "Company or institution name"],
  ["website", "Website", "https://example.com"],
  ["market", "Target market", "Country, region or audience"],
  ["dates", "Campaign dates", "Preferred start and end dates"],
  ["category", "Industry category", "Manufacturing, logistics, B2B technology…"],
] as const;

export function AdvertisingInquiryForm({ email }: { email: string }) {
  const [status, setStatus] = useState("");

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const summary = fields.map(([name, label]) => `${label}: ${String(data.get(name) || "").trim()}`);
    const notes = String(data.get("notes") || "").trim();
    const body = [...summary, `Campaign notes: ${notes || "Not provided"}`].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent("KorPulse founding-partner enquiry")}&body=${encodeURIComponent(body)}`;
    setStatus("Your email app should now open with the campaign details prepared.");
  }

  return <form className="advertisingInquiry" onSubmit={prepareEmail}>
    <div className="inquiryFields">
      {fields.map(([name, label, placeholder]) => <label key={name}>
        <span>{label}</span>
        <input name={name} placeholder={placeholder} type={name === "website" ? "url" : "text"} required />
      </label>)}
    </div>
    <label>
      <span>Campaign notes</span>
      <textarea name="notes" placeholder="Placement preference, objectives and any compliance context" rows={5} />
    </label>
    <p className="inquiryPrivacy">Nothing entered here is stored by KorPulse. Selecting the button prepares an email in your own email application.</p>
    <button type="submit">Prepare advertising enquiry</button>
    <p className="inquiryStatus" aria-live="polite">{status}</p>
  </form>;
}
