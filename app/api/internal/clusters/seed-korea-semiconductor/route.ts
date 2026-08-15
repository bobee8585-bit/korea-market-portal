import { NextRequest, NextResponse } from "next/server";
import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";

const GOVERNMENT_SOURCE =
  "https://www.molit.go.kr/USR/NEWS/dtl.jsp?id=95090534&lcmspage=72";

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const ecosystem = await db.ecosystem.findUnique({ where: { slug: "semiconductor" } });
  if (!ecosystem) {
    return NextResponse.json(
      { error: "SEMICONDUCTOR_ECOSYSTEM_NOT_FOUND", action: "Run ecosystem bootstrap first." },
      { status: 409 },
    );
  }

  const samsung = await db.company.findUnique({ where: { ticker: "005930" } });
  if (!samsung) {
    return NextResponse.json(
      { error: "SAMSUNG_NOT_FOUND", action: "Run semiconductor company seed first." },
      { status: 409 },
    );
  }

  const cluster = await db.industryCluster.upsert({
    where: { slug: "yongin-national-semiconductor-cluster" },
    update: {
      ecosystemId: ecosystem.id,
      name: "Yongin National Semiconductor Industrial Complex",
      country: "KR",
      region: "Gyeonggi-do",
      city: "Yongin",
      locationPrecision: "CITY",
      description:
        "Government-designated semiconductor national industrial complex in Yongin, planned as a major semiconductor manufacturing and materials-parts-equipment ecosystem.",
      sourceUrl: GOVERNMENT_SOURCE,
      evidenceStatus: EvidenceStatus.GOVERNMENT_CONFIRMED,
      verifiedAt: new Date(),
    },
    create: {
      ecosystemId: ecosystem.id,
      name: "Yongin National Semiconductor Industrial Complex",
      slug: "yongin-national-semiconductor-cluster",
      country: "KR",
      region: "Gyeonggi-do",
      city: "Yongin",
      locationPrecision: "CITY",
      description:
        "Government-designated semiconductor national industrial complex in Yongin, planned as a major semiconductor manufacturing and materials-parts-equipment ecosystem.",
      sourceUrl: GOVERNMENT_SOURCE,
      evidenceStatus: EvidenceStatus.GOVERNMENT_CONFIRMED,
      verifiedAt: new Date(),
    },
  });

  await db.clusterCompany.upsert({
    where: { clusterId_companyId: { clusterId: cluster.id, companyId: samsung.id } },
    update: {
      roleLabel: "Anchor semiconductor manufacturer / planned fab operator",
      evidenceStatus: EvidenceStatus.GOVERNMENT_CONFIRMED,
      sourceUrl: GOVERNMENT_SOURCE,
      verifiedAt: new Date(),
    },
    create: {
      clusterId: cluster.id,
      companyId: samsung.id,
      roleLabel: "Anchor semiconductor manufacturer / planned fab operator",
      evidenceStatus: EvidenceStatus.GOVERNMENT_CONFIRMED,
      sourceUrl: GOVERNMENT_SOURCE,
      verifiedAt: new Date(),
    },
  });

  return NextResponse.json({
    seeded: {
      cluster: cluster.slug,
      company: samsung.nameEn ?? samsung.nameKo,
      factoriesLinked: 0,
    },
    evidencePolicy:
      "Only government-confirmed cluster and company membership are published. Existing Yongin-area factories are not automatically treated as being inside the national industrial complex.",
  });
}
