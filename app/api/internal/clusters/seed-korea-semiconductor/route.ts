import { NextRequest, NextResponse } from "next/server";
import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";

const YONGIN_GOVERNMENT_SOURCE =
  "https://www.molit.go.kr/USR/NEWS/dtl.jsp?id=95090534&lcmspage=72";
const SAMSUNG_PYEONGTAEK_SOURCE =
  "https://semiconductor.samsung.com/foundry/manufacturing/manufacturing-sites/";
const SK_ICHON_SOURCE =
  "https://news.skhynix.com/sk-hynix-announces-the-completion-of-m16-plant-construction/";
const SK_CHEONGJU_SOURCE =
  "https://news.skhynix.com/sk-hynix-to-produce-dram-from-m15x-in-cheongju/";

type HubSeed = {
  name: string;
  slug: string;
  region: string;
  city: string;
  description: string;
  sourceUrl: string;
  evidenceStatus: EvidenceStatus;
  companies: Array<{
    ticker: string;
    roleLabel: string;
    sourceUrl: string;
    evidenceStatus: EvidenceStatus;
  }>;
  factories: Array<{
    companyTicker: string;
    factoryName: string;
    sourceUrl: string;
    evidenceStatus: EvidenceStatus;
  }>;
};

const hubs: HubSeed[] = [
  {
    name: "Yongin National Semiconductor Industrial Complex",
    slug: "yongin-national-semiconductor-cluster",
    region: "Gyeonggi-do",
    city: "Yongin",
    description:
      "Government-designated semiconductor national industrial complex planned as a major manufacturing and materials-parts-equipment ecosystem. Existing nearby fabs are not automatically treated as members of the complex.",
    sourceUrl: YONGIN_GOVERNMENT_SOURCE,
    evidenceStatus: EvidenceStatus.GOVERNMENT_CONFIRMED,
    companies: [
      {
        ticker: "005930",
        roleLabel: "Anchor semiconductor manufacturer / planned fab operator",
        sourceUrl: YONGIN_GOVERNMENT_SOURCE,
        evidenceStatus: EvidenceStatus.GOVERNMENT_CONFIRMED,
      },
      {
        ticker: "000660",
        roleLabel: "Semiconductor manufacturer / Yongin cluster investment participant",
        sourceUrl: SK_CHEONGJU_SOURCE,
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
      },
    ],
    factories: [],
  },
  {
    name: "Pyeongtaek Semiconductor Manufacturing Hub",
    slug: "pyeongtaek-semiconductor-manufacturing-hub",
    region: "Gyeonggi-do",
    city: "Pyeongtaek",
    description:
      "Regional manufacturing hub centered on Samsung Electronics' verified Pyeongtaek semiconductor campus. This is a portal grouping for verified regional production, not a claim of a separately designated government industrial complex.",
    sourceUrl: SAMSUNG_PYEONGTAEK_SOURCE,
    evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
    companies: [
      {
        ticker: "005930",
        roleLabel: "Semiconductor manufacturing hub operator",
        sourceUrl: SAMSUNG_PYEONGTAEK_SOURCE,
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
      },
    ],
    factories: [
      {
        companyTicker: "005930",
        factoryName: "Samsung Pyeongtaek Campus",
        sourceUrl: SAMSUNG_PYEONGTAEK_SOURCE,
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
      },
    ],
  },
  {
    name: "Icheon Semiconductor Manufacturing Hub",
    slug: "icheon-semiconductor-manufacturing-hub",
    region: "Gyeonggi-do",
    city: "Icheon",
    description:
      "Regional semiconductor production hub centered on SK hynix's Icheon manufacturing base, including the company-confirmed M16 DRAM fab.",
    sourceUrl: SK_ICHON_SOURCE,
    evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
    companies: [
      {
        ticker: "000660",
        roleLabel: "Memory semiconductor manufacturing hub operator",
        sourceUrl: SK_ICHON_SOURCE,
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
      },
    ],
    factories: [
      {
        companyTicker: "000660",
        factoryName: "SK hynix M16 Icheon",
        sourceUrl: SK_ICHON_SOURCE,
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
      },
    ],
  },
  {
    name: "Cheongju AI Memory Manufacturing Hub",
    slug: "cheongju-ai-memory-manufacturing-hub",
    region: "Chungcheongbuk-do",
    city: "Cheongju",
    description:
      "Regional AI-memory production hub centered on SK hynix's Cheongju facilities. M15X is officially described as a next-generation DRAM production base focused on expanding capacity for HBM demand.",
    sourceUrl: SK_CHEONGJU_SOURCE,
    evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
    companies: [
      {
        ticker: "000660",
        roleLabel: "AI memory / DRAM manufacturing hub operator",
        sourceUrl: SK_CHEONGJU_SOURCE,
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
      },
    ],
    factories: [
      {
        companyTicker: "000660",
        factoryName: "SK hynix M15X Cheongju",
        sourceUrl: SK_CHEONGJU_SOURCE,
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
      },
    ],
  },
];

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

  const results: Array<{
    cluster: string;
    companiesLinked: number;
    factoriesLinked: number;
  }> = [];

  for (const seed of hubs) {
    const cluster = await db.industryCluster.upsert({
      where: { slug: seed.slug },
      update: {
        ecosystemId: ecosystem.id,
        name: seed.name,
        country: "KR",
        region: seed.region,
        city: seed.city,
        locationPrecision: "CITY",
        description: seed.description,
        sourceUrl: seed.sourceUrl,
        evidenceStatus: seed.evidenceStatus,
        verifiedAt: new Date(),
      },
      create: {
        ecosystemId: ecosystem.id,
        name: seed.name,
        slug: seed.slug,
        country: "KR",
        region: seed.region,
        city: seed.city,
        locationPrecision: "CITY",
        description: seed.description,
        sourceUrl: seed.sourceUrl,
        evidenceStatus: seed.evidenceStatus,
        verifiedAt: new Date(),
      },
    });

    let companiesLinked = 0;
    for (const membership of seed.companies) {
      const company = await db.company.findUnique({ where: { ticker: membership.ticker } });
      if (!company) {
        return NextResponse.json(
          {
            error: "COMPANY_NOT_FOUND",
            ticker: membership.ticker,
            action: "Run the semiconductor company seed before the cluster seed.",
          },
          { status: 409 },
        );
      }

      await db.clusterCompany.upsert({
        where: { clusterId_companyId: { clusterId: cluster.id, companyId: company.id } },
        update: {
          roleLabel: membership.roleLabel,
          evidenceStatus: membership.evidenceStatus,
          sourceUrl: membership.sourceUrl,
          verifiedAt: new Date(),
        },
        create: {
          clusterId: cluster.id,
          companyId: company.id,
          roleLabel: membership.roleLabel,
          evidenceStatus: membership.evidenceStatus,
          sourceUrl: membership.sourceUrl,
          verifiedAt: new Date(),
        },
      });
      companiesLinked += 1;
    }

    let factoriesLinked = 0;
    for (const membership of seed.factories) {
      const company = await db.company.findUnique({ where: { ticker: membership.companyTicker } });
      if (!company) {
        return NextResponse.json({ error: "COMPANY_NOT_FOUND", ticker: membership.companyTicker }, { status: 409 });
      }

      const factory = await db.factory.findFirst({
        where: { companyId: company.id, name: membership.factoryName },
      });
      if (!factory) {
        return NextResponse.json(
          {
            error: "FACTORY_NOT_FOUND",
            factory: membership.factoryName,
            action: "Run the semiconductor factory seed before the cluster seed.",
          },
          { status: 409 },
        );
      }

      await db.clusterFactory.upsert({
        where: { clusterId_factoryId: { clusterId: cluster.id, factoryId: factory.id } },
        update: {
          evidenceStatus: membership.evidenceStatus,
          sourceUrl: membership.sourceUrl,
          verifiedAt: new Date(),
        },
        create: {
          clusterId: cluster.id,
          factoryId: factory.id,
          evidenceStatus: membership.evidenceStatus,
          sourceUrl: membership.sourceUrl,
          verifiedAt: new Date(),
        },
      });
      factoriesLinked += 1;
    }

    results.push({ cluster: cluster.slug, companiesLinked, factoriesLinked });
  }

  return NextResponse.json({
    seeded: results,
    evidencePolicy:
      "Government-designated complexes and portal-defined regional manufacturing hubs are distinguished in their descriptions and evidence status. A factory is linked to a hub only when its location and operator are directly supported by an approved source.",
  });
}
