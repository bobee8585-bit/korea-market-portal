import { NextResponse } from "next/server";
import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";

const publicEvidence = [
  EvidenceStatus.REGULATOR_CONFIRMED,
  EvidenceStatus.GOVERNMENT_CONFIRMED,
  EvidenceStatus.COMPANY_CONFIRMED,
  EvidenceStatus.LICENSED_SOURCE,
];

export async function GET(
  _request: Request,
  context: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await context.params;

  const company = await db.company.findUnique({
    where: { ticker },
    select: {
      id: true,
      ticker: true,
      nameKo: true,
      nameEn: true,
      country: true,
      roles: {
        where: { evidenceStatus: { in: publicEvidence } },
        select: {
          roleType: true,
          evidenceStatus: true,
          sourceUrl: true,
          ecosystem: { select: { id: true, slug: true, name: true } },
          product: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!company) {
    return NextResponse.json({ error: "COMPANY_NOT_FOUND" }, { status: 404 });
  }

  const comparisons = [];

  for (const role of company.roles) {
    if (!role.product) continue;

    const peers = await db.companyEcosystemRole.findMany({
      where: {
        ecosystemId: role.ecosystem.id,
        productId: role.product.id,
        roleType: role.roleType,
        evidenceStatus: { in: publicEvidence },
        companyId: { not: company.id },
      },
      select: {
        roleType: true,
        evidenceStatus: true,
        sourceUrl: true,
        company: {
          select: {
            id: true,
            ticker: true,
            nameKo: true,
            nameEn: true,
            country: true,
            market: true,
            websiteUrl: true,
          },
        },
      },
      orderBy: { company: { country: "asc" } },
    });

    comparisons.push({
      ecosystem: role.ecosystem,
      product: role.product,
      roleType: role.roleType,
      subjectEvidence: {
        status: role.evidenceStatus,
        sourceUrl: role.sourceUrl,
      },
      peers,
    });
  }

  return NextResponse.json({
    company: {
      ticker: company.ticker,
      nameKo: company.nameKo,
      nameEn: company.nameEn,
      country: company.country,
    },
    methodology: "Peers are derived only from companies with the same verified ecosystem, product and role. No investment ranking or recommendation is produced.",
    comparisons,
  });
}
