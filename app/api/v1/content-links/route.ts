import { NextRequest, NextResponse } from "next/server";
import { EvidenceStatus, ExternalContentType } from "@prisma/client";
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
  const contentType = typeParam && Object.values(ExternalContentType).includes(typeParam as ExternalContentType)
    ? (typeParam as ExternalContentType)
    : undefined;

  const items = await db.externalContentLink.findMany({
    where: {
      evidenceStatus: { in: publicEvidence },
      ...(contentType ? { contentType } : {}),
      ...(company ? { companyIdentifier: company } : {}),
      ...(ecosystem ? { ecosystemSlug: ecosystem } : {}),
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 200,
  });

  return NextResponse.json({
    methodology: "External media and broker research are link-first. Translation or analysis is exposed only when rights explicitly permit it.",
    items: items.map((item) => ({
      ...item,
      translatedTitle: item.translationAllowed ? item.translatedTitle : null,
    })),
  });
}
