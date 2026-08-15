import { EvidenceStatus } from "@prisma/client";

export function isPublicEvidence(status: EvidenceStatus) {
  return [
    EvidenceStatus.REGULATOR_CONFIRMED,
    EvidenceStatus.GOVERNMENT_CONFIRMED,
    EvidenceStatus.COMPANY_CONFIRMED,
    EvidenceStatus.LICENSED_SOURCE,
  ].includes(status);
}

export function normalizeCountry(country?: string | null) {
  return (country ?? "").trim().toUpperCase();
}
