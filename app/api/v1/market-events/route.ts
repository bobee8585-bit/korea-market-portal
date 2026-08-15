import { NextRequest, NextResponse } from "next/server";
import { EvidenceStatus, GlobalEventType } from "@prisma/client";
import { db } from "@/lib/db";

const publicEvidence = [
  EvidenceStatus.REGULATOR_CONFIRMED,
  EvidenceStatus.GOVERNMENT_CONFIRMED,
  EvidenceStatus.COMPANY_CONFIRMED,
  EvidenceStatus.LICENSED_SOURCE,
];

export async function GET(request: NextRequest) {
  const typeParam = request.nextUrl.searchParams.get("type")?.toUpperCase();
  const company = request.nextUrl.searchParams.get("company")?.trim() || undefined;
  const ecosystem = request.nextUrl.searchParams.get("ecosystem")?.trim() || undefined;
  const eventType = typeParam && Object.values(GlobalEventType).includes(typeParam as GlobalEventType)
    ? (typeParam as GlobalEventType)
    : undefined;

  const items = await db.marketImpactEvent.findMany({
    where: {
      evidenceStatus: { in: publicEvidence },
      ...(eventType ? { eventType } : {}),
      ...(company ? { companyIdentifier: company } : {}),
      ...(ecosystem ? { ecosystemSlug: ecosystem } : {}),
    },
    orderBy: { occurredAt: "desc" },
    take: 200,
  });

  return NextResponse.json({
    methodology: "Events are linked to companies or ecosystems only as evidence-backed relevance. No price direction, target price, or trade instruction is produced.",
    items,
  });
}
