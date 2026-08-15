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
      corpCode: true,
      nameKo: true,
      nameEn: true,
      country: true,
      market: true,
      websiteUrl: true,
      irUrl: true,
      aliases: { select: { alias: true, language: true }, orderBy: { alias: "asc" } },
      roles: {
        where: { evidenceStatus: { in: publicEvidence } },
        select: {
          id: true,
          roleType: true,
          evidenceStatus: true,
          sourceUrl: true,
          verifiedAt: true,
          ecosystem: { select: { name: true, slug: true } },
          stage: { select: { name: true, sequence: true } },
          product: { select: { name: true, technologyGroup: true } },
        },
        orderBy: { ecosystem: { name: "asc" } },
      },
      factories: {
        select: {
          id: true,
          name: true,
          country: true,
          region: true,
          city: true,
          factoryType: true,
          status: true,
          sourceUrl: true,
          verifiedAt: true,
        },
        orderBy: [{ country: "asc" }, { name: "asc" }],
      },
      disclosures: {
        take: 20,
        orderBy: { filedAt: "desc" },
        select: {
          receiptNo: true,
          reportName: true,
          filedAt: true,
          eventType: true,
          originalUrl: true,
          source: { select: { name: true } },
        },
      },
    },
  });

  if (!company) {
    return NextResponse.json({ error: "COMPANY_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({
    company,
    policy: {
      verifiedRelationsOnly: true,
      investmentAdvice: false,
      description:
        "Ecosystem roles are shown only when backed by approved evidence. The service does not provide investment recommendations or trading instructions.",
    },
  });
}
