import { EvidenceStatus } from "@prisma/client";

const publicEvidence: readonly EvidenceStatus[] = [
  EvidenceStatus.REGULATOR_CONFIRMED,
  EvidenceStatus.GOVERNMENT_CONFIRMED,
  EvidenceStatus.COMPANY_CONFIRMED,
  EvidenceStatus.LICENSED_SOURCE,
];

export function isPublicEvidence(status: EvidenceStatus) {
  return publicEvidence.includes(status);
}

export function normalizeCountry(country?: string | null) {
  return (country ?? "").trim().toUpperCase();
}
