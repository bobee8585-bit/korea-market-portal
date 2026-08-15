import { NextRequest, NextResponse } from "next/server";
import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";

const publicEvidence = [
  EvidenceStatus.REGULATOR_CONFIRMED,
  EvidenceStatus.GOVERNMENT_CONFIRMED,
  EvidenceStatus.COMPANY_CONFIRMED,
  EvidenceStatus.LICENSED_SOURCE,
];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const country = request.nextUrl.searchParams.get("country")?.toUpperCase() ?? null;

  const ecosystem = await db.ecosystem.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      stages: {
        orderBy: { sequence: "asc" },
        select: {
          id: true,
          name: true,
          sequence: true,
          products: {
            orderBy: { name: "asc" },
            select: { id: true, name: true, technologyGroup: true },
          },
          companyRoles: {
            where: {
              evidenceStatus: { in: publicEvidence },
              ...(country ? { company: { country } } : {}),
            },
            select: {
              id: true,
              roleType: true,
              evidenceStatus: true,
              sourceUrl: true,
              product: { select: { id: true, name: true, technologyGroup: true } },
              company: {
                select: {
                  id: true,
                  ticker: true,
                  slug: true,
                  nameKo: true,
                  nameEn: true,
                  country: true,
                  market: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!ecosystem) {
    return NextResponse.json({ error: "ECOSYSTEM_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({
    methodology: "Only regulator, government, company-confirmed or licensed ecosystem roles are public.",
    ecosystem,
    filter: { country },
  });
}
