import { NextRequest, NextResponse } from "next/server";
import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";

type ClusterSeed = {
  slug: string;
  name: string;
  country: string;
  region: string;
  city?: string;
  description: string;
  sourceUrl: string;
  companyTicker: string;
  companyRole: string;
  factoryNames: string[];
};

const seeds: ClusterSeed[] = [
  {
    slug: "hsinchu-semiconductor-hub",
    name: "Hsinchu Semiconductor Manufacturing Hub",
    country: "TW",
    region: "Hsinchu Science Park",
    city: "Hsinchu",
    description:
      "Regional semiconductor manufacturing hub centered on TSMC facilities in Hsinchu Science Park. This service label does not imply a separate legal industrial-district designation beyond the official science-park location.",
    sourceUrl: "https://www.tsmc.com/english/aboutTSMC/tsmc_fabs",
    companyTicker: "2330",
    companyRole: "Anchor foundry manufacturer in Hsinchu Science Park",
    factoryNames: ["TSMC Fab 12A Hsinchu"],
  },
  {
    slug: "tainan-semiconductor-hub",
    name: "Tainan Semiconductor Manufacturing Hub",
    country: "TW",
    region: "Southern Taiwan Science Park",
    city: "Tainan",
    description:
      "Regional advanced-foundry hub centered on TSMC Fab 18 in Southern Taiwan Science Park. TSMC identifies Fab 18 as a principal advanced-node production site.",
    sourceUrl: "https://www.tsmc.com/english/aboutTSMC/tsmc_fabs",
    companyTicker: "2330",
    companyRole: "Anchor advanced-node foundry manufacturer",
    factoryNames: ["TSMC Fab 18"],
  },
  {
    slug: "arizona-tsmc-gigafab-cluster",
    name: "TSMC Arizona GIGAFAB Cluster",
    country: "US",
    region: "Arizona",
    city: "Phoenix",
    description:
      "TSMC describes its Arizona expansion plan as an independent GIGAFAB cluster supporting leading-edge smartphone, AI and HPC demand.",
    sourceUrl: "https://investor.tsmc.com/static/annualReports/2025/english/index.html",
    companyTicker: "2330",
    companyRole: "Anchor leading-edge foundry manufacturer",
    factoryNames: ["TSMC Arizona First Fab"],
  },
  {
    slug: "kumamoto-jasm-semiconductor-hub",
    name: "Kumamoto JASM Semiconductor Manufacturing Hub",
    country: "JP",
    region: "Kumamoto",
    city: "Kikuyo",
    description:
      "Regional semiconductor manufacturing hub around JASM's Kumamoto site. TSMC officially reports first-fab production and a second fab under expansion at the same Kumamoto manufacturing site.",
    sourceUrl: "https://pr.tsmc.com/english/news/3105",
    companyTicker: "2330",
    companyRole: "Majority-owner and foundry technology provider through JASM",
    factoryNames: ["JASM Kumamoto First Fab"],
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

  const seeded: Array<{ cluster: string; company: string; factoriesLinked: string[] }> = [];

  for (const seed of seeds) {
    const company = await db.company.findUnique({ where: { ticker: seed.companyTicker } });
    if (!company) {
      return NextResponse.json(
        { error: "COMPANY_NOT_FOUND", ticker: seed.companyTicker, action: "Run semiconductor company seed first." },
        { status: 409 },
      );
    }

    const cluster = await db.industryCluster.upsert({
      where: { slug: seed.slug },
      update: {
        ecosystemId: ecosystem.id,
        name: seed.name,
        country: seed.country,
        region: seed.region,
        city: seed.city ?? null,
        locationPrecision: "REGION",
        description: seed.description,
        sourceUrl: seed.sourceUrl,
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
        verifiedAt: new Date(),
      },
      create: {
        ecosystemId: ecosystem.id,
        slug: seed.slug,
        name: seed.name,
        country: seed.country,
        region: seed.region,
        city: seed.city ?? null,
        locationPrecision: "REGION",
        description: seed.description,
        sourceUrl: seed.sourceUrl,
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
        verifiedAt: new Date(),
      },
    });

    await db.clusterCompany.upsert({
      where: { clusterId_companyId: { clusterId: cluster.id, companyId: company.id } },
      update: {
        roleLabel: seed.companyRole,
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
        sourceUrl: seed.sourceUrl,
        verifiedAt: new Date(),
      },
      create: {
        clusterId: cluster.id,
        companyId: company.id,
        roleLabel: seed.companyRole,
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
        sourceUrl: seed.sourceUrl,
        verifiedAt: new Date(),
      },
    });

    const linkedFactories: string[] = [];
    for (const factoryName of seed.factoryNames) {
      const factory = await db.factory.findFirst({ where: { companyId: company.id, name: factoryName } });
      if (!factory) continue;

      await db.clusterFactory.upsert({
        where: { clusterId_factoryId: { clusterId: cluster.id, factoryId: factory.id } },
        update: {
          evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
          sourceUrl: seed.sourceUrl,
          verifiedAt: new Date(),
        },
        create: {
          clusterId: cluster.id,
          factoryId: factory.id,
          evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
          sourceUrl: seed.sourceUrl,
          verifiedAt: new Date(),
        },
      });
      linkedFactories.push(factory.name);
    }

    seeded.push({
      cluster: cluster.slug,
      company: company.nameEn ?? company.nameKo,
      factoriesLinked: linkedFactories,
    });
  }

  return NextResponse.json({
    evidencePolicy:
      "Global regional hubs are service-level groupings built only from official company-confirmed locations. They are not presented as government-designated clusters unless the source explicitly says so.",
    seeded,
  });
}
