import { NextRequest, NextResponse } from "next/server";
import { DealStatus, EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";

const publicEvidence = [
  EvidenceStatus.REGULATOR_CONFIRMED,
  EvidenceStatus.GOVERNMENT_CONFIRMED,
  EvidenceStatus.COMPANY_CONFIRMED,
  EvidenceStatus.LICENSED_SOURCE,
];

export async function GET(request: NextRequest) {
  const statusParam = request.nextUrl.searchParams.get("status")?.toUpperCase();
  const ecosystem = request.nextUrl.searchParams.get("ecosystem")?.trim() || undefined;
  const status = statusParam && Object.values(DealStatus).includes(statusParam as DealStatus)
    ? (statusParam as DealStatus)
    : undefined;

  const items = await db.mnaEvent.findMany({
    where: {
      evidenceStatus: { in: publicEvidence },
      ...(status ? { status } : {}),
      ...(ecosystem ? { ecosystemSlug: ecosystem } : {}),
    },
    orderBy: { announcedAt: "desc" },
    take: 200,
  });

  return NextResponse.json({
    methodology: "Only announced or officially evidenced transactions are shown. Deal status and value are factual fields, not investment judgments.",
    items,
  });
}
