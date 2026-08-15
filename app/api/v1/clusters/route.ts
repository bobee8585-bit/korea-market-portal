import { EvidenceStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const publicEvidence = [
  EvidenceStatus.REGULATOR_CONFIRMED,
  EvidenceStatus.GOVERNMENT_CONFIRMED,
  EvidenceStatus.COMPANY_CONFIRMED,
  EvidenceStatus.LICENSED_SOURCE,
];

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country")?.toUpperCase() ?? null;
  const ecosystem = request.nextUrl.searchParams.get("ecosystem") ?? null;

  const clusters = await db.industryCluster.findMany({
    where: {
      evidenceStatus: { in: publicEvidence },
      ...(country ? { country } : {}),
      ...(ecosystem ? { ecosystem: { slug: ecosystem } } : {}),
    },
    include: {
      ecosystem: { select: { name: true, slug: true } },
      companies: {
        where: { evidenceStatus: { in: publicEvidence } },
        include: {
          company: {
            select: {
              id: true,
              ticker: true,
              slug: true,
              nameKo: true,
              nameEn: true,
              country: true,
            },
          },
        },
      },
      factories: {
        where: { evidenceStatus: { in: publicEvidence } },
        include: {
          factory: {
            select: {
              id: true,
              name: true,
              country: true,
              region: true,
              city: true,
              status: true,
              factoryType: true,
              sourceUrl: true,
            },
          },
        },
      },
    },
    orderBy: [{ country: "asc" }, { region: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({
    methodology:
      "Only evidence-approved industry clusters, member companies and linked factories are public. Inferred or unverified cluster membership stays hidden.",
    filters: { country, ecosystem },
    clusters,
  });
}
