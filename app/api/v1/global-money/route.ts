import { NextRequest, NextResponse } from "next/server";
import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";

const publicEvidence = [
  EvidenceStatus.REGULATOR_CONFIRMED,
  EvidenceStatus.GOVERNMENT_CONFIRMED,
  EvidenceStatus.COMPANY_CONFIRMED,
  EvidenceStatus.LICENSED_SOURCE,
];

export async function GET(request: NextRequest) {
  const manager = request.nextUrl.searchParams.get("manager")?.trim() || undefined;
  const target = request.nextUrl.searchParams.get("target")?.trim() || undefined;
  const items = await db.institutionalDisclosure.findMany({
    where: {
      evidenceStatus: { in: publicEvidence },
      ...(manager ? { managerName: { contains: manager, mode: "insensitive" } } : {}),
      ...(target
        ? {
            OR: [
              { targetCompanyName: { contains: target, mode: "insensitive" } },
              { targetIdentifier: { contains: target, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ reportedAt: "desc" }, { periodEnd: "desc" }],
    take: 200,
  });

  return NextResponse.json({
    methodology: "Only public, evidence-backed institutional disclosures are shown. A disclosed position is not treated as a recommendation or a real-time holding.",
    items,
  });
}
