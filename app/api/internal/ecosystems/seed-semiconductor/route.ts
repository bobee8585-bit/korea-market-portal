import { NextRequest, NextResponse } from "next/server";
import {
  EcosystemRoleType,
  EvidenceStatus,
  RightsType,
  SourceType,
} from "@prisma/client";
import { db } from "@/lib/db";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";

type SeedCompany = {
  ticker: string;
  nameEn: string;
  nameKo?: string;
  country: string;
  websiteUrl: string;
  sourceUrl: string;
  sourceName: string;
  products: Array<{
    name: string;
    stage: string;
    roleType: EcosystemRoleType;
  }>;
};

const companies: SeedCompany[] = [
  {
    ticker: "005930",
    nameEn: "Samsung Electronics",
    nameKo: "삼성전자",
    country: "KR",
    websiteUrl: "https://semiconductor.samsung.com/",
    sourceName: "Samsung Semiconductor",
    sourceUrl: "https://semiconductor.samsung.com/dram/hbm/",
    products: [
      { name: "HBM", stage: "Memory / Foundry", roleType: EcosystemRoleType.MANUFACTURER },
    ],
  },
  {
    ticker: "000660",
    nameEn: "SK hynix",
    nameKo: "SK하이닉스",
    country: "KR",
    websiteUrl: "https://www.skhynix.com/",
    sourceName: "SK hynix Newsroom",
    sourceUrl: "https://news.skhynix.com/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/",
    products: [
      { name: "HBM", stage: "Memory / Foundry", roleType: EcosystemRoleType.MANUFACTURER },
    ],
  },
  {
    ticker: "MU",
    nameEn: "Micron Technology",
    country: "US",
    websiteUrl: "https://www.micron.com/",
    sourceName: "Micron Technology",
    sourceUrl: "https://www.micron.com/products/memory/hbm",
    products: [
      { name: "HBM", stage: "Memory / Foundry", roleType: EcosystemRoleType.MANUFACTURER },
    ],
  },
  {
    ticker: "2330",
    nameEn: "Taiwan Semiconductor Manufacturing Company",
    country: "TW",
    websiteUrl: "https://www.tsmc.com/",
    sourceName: "TSMC",
    sourceUrl: "https://www.tsmc.com/english/aboutTSMC/company_profile",
    products: [
      { name: "Foundry Services", stage: "Wafer / Fab", roleType: EcosystemRoleType.MANUFACTURER },
    ],
  },
  {
    ticker: "ASML",
    nameEn: "ASML",
    country: "NL",
    websiteUrl: "https://www.asml.com/",
    sourceName: "ASML",
    sourceUrl: "https://www.asml.com/en/products/euv-lithography-systems",
    products: [
      { name: "EUV Lithography", stage: "Equipment", roleType: EcosystemRoleType.EQUIPMENT_PROVIDER },
    ],
  },
  {
    ticker: "AMAT",
    nameEn: "Applied Materials",
    country: "US",
    websiteUrl: "https://www.appliedmaterials.com/",
    sourceName: "Applied Materials",
    sourceUrl: "https://www.appliedmaterials.com/us/en/about.html",
    products: [
      { name: "Semiconductor Materials Engineering Equipment", stage: "Equipment", roleType: EcosystemRoleType.EQUIPMENT_PROVIDER },
    ],
  },
  {
    ticker: "8035",
    nameEn: "Tokyo Electron",
    country: "JP",
    websiteUrl: "https://www.tel.com/",
    sourceName: "Tokyo Electron",
    sourceUrl: "https://www.tel.com/corporatesummary/",
    products: [
      { name: "Etch Equipment", stage: "Equipment", roleType: EcosystemRoleType.EQUIPMENT_PROVIDER },
      { name: "Deposition Equipment", stage: "Equipment", roleType: EcosystemRoleType.EQUIPMENT_PROVIDER },
    ],
  },
];

async function getOrCreateSource(company: SeedCompany) {
  const existing = await db.source.findFirst({
    where: { name: company.sourceName, sourceType: SourceType.COMPANY_IR },
  });
  if (existing) return existing;

  return db.source.create({
    data: {
      name: company.sourceName,
      country: company.country,
      sourceType: SourceType.COMPANY_IR,
      homepageUrl: company.websiteUrl,
      official: true,
      rightsType: RightsType.LINK_ONLY,
      canStore: false,
      canTranslate: false,
      canAnalyze: false,
      canCache: false,
      canShowTitle: false,
      canShowExcerpt: false,
      canShowImage: false,
      active: true,
      verifiedAt: new Date(),
    },
  });
}

async function getOrCreateCompany(seed: SeedCompany) {
  const existing = await db.company.findUnique({ where: { ticker: seed.ticker } });
  if (existing) {
    return db.company.update({
      where: { id: existing.id },
      data: {
        nameEn: seed.nameEn,
        nameKo: seed.nameKo ?? existing.nameKo,
        country: seed.country,
        websiteUrl: seed.websiteUrl,
        isActive: true,
      },
    });
  }

  return db.company.create({
    data: {
      ticker: seed.ticker,
      nameEn: seed.nameEn,
      nameKo: seed.nameKo ?? seed.nameEn,
      country: seed.country,
      websiteUrl: seed.websiteUrl,
      isActive: true,
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const ecosystem = await db.ecosystem.findUnique({ where: { slug: "semiconductor" } });
  if (!ecosystem) {
    return NextResponse.json(
      { error: "SEMICONDUCTOR_ECOSYSTEM_NOT_FOUND", action: "Run /api/internal/ecosystems/bootstrap first." },
      { status: 409 },
    );
  }

  const stages = await db.ecosystemStage.findMany({ where: { ecosystemId: ecosystem.id } });
  const stageByName = new Map(stages.map((stage) => [stage.name, stage]));
  const seeded: Array<{ company: string; products: string[] }> = [];

  for (const seed of companies) {
    const company = await getOrCreateCompany(seed);
    const source = await getOrCreateSource(seed);
    const productNames: string[] = [];

    for (const item of seed.products) {
      const stage = stageByName.get(item.stage);
      if (!stage) throw new Error(`Missing ecosystem stage: ${item.stage}`);

      let product = await db.product.findFirst({
        where: { ecosystemId: ecosystem.id, stageId: stage.id, name: item.name },
      });
      if (!product) {
        product = await db.product.create({
          data: {
            ecosystemId: ecosystem.id,
            stageId: stage.id,
            name: item.name,
          },
        });
      }

      const existingRole = await db.companyEcosystemRole.findFirst({
        where: {
          companyId: company.id,
          ecosystemId: ecosystem.id,
          stageId: stage.id,
          productId: product.id,
          roleType: item.roleType,
        },
      });

      const roleData = {
        evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
        sourceId: source.id,
        sourceUrl: seed.sourceUrl,
        verifiedAt: new Date(),
      };

      if (existingRole) {
        await db.companyEcosystemRole.update({ where: { id: existingRole.id }, data: roleData });
      } else {
        await db.companyEcosystemRole.create({
          data: {
            companyId: company.id,
            ecosystemId: ecosystem.id,
            stageId: stage.id,
            productId: product.id,
            roleType: item.roleType,
            ...roleData,
          },
        });
      }

      productNames.push(item.name);
    }

    seeded.push({ company: company.nameEn ?? company.nameKo, products: productNames });
  }

  return NextResponse.json({
    ecosystem: ecosystem.slug,
    evidencePolicy: "Only company-confirmed roles from official company sources are seeded.",
    seeded,
  });
}
