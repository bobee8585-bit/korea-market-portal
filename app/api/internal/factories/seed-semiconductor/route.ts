import { NextRequest, NextResponse } from "next/server";
import { EvidenceStatus, FactoryStatus, FactoryType } from "@prisma/client";
import { db } from "@/lib/db";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";

type FactorySeed = {
  companyTicker: string;
  name: string;
  country: string;
  region?: string;
  city: string;
  factoryType: FactoryType;
  status: FactoryStatus;
  sourceUrl: string;
  products: Array<{
    name: string;
    productionRole: string;
    sourceUrl?: string;
  }>;
};

const seeds: FactorySeed[] = [
  {
    companyTicker: "005930",
    name: "Samsung Pyeongtaek Campus",
    country: "KR",
    region: "Gyeonggi-do",
    city: "Pyeongtaek",
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://semiconductor.samsung.com/foundry/manufacturing/manufacturing-sites/",
    products: [
      {
        name: "DRAM",
        productionRole: "Advanced memory manufacturing",
        sourceUrl: "https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-operates-the-worlds-largest-pyeongtaek-line-2/",
      },
      {
        name: "NAND Flash",
        productionRole: "Advanced memory manufacturing",
        sourceUrl: "https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-operates-the-worlds-largest-pyeongtaek-line-2/",
      },
      {
        name: "Foundry Services",
        productionRole: "Advanced-node foundry manufacturing",
        sourceUrl: "https://semiconductor.samsung.com/foundry/manufacturing/manufacturing-sites/",
      },
    ],
  },
  {
    companyTicker: "005930",
    name: "Samsung Hwaseong Fab",
    country: "KR",
    region: "Gyeonggi-do",
    city: "Hwaseong",
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://semiconductor.samsung.com/foundry/manufacturing/manufacturing-sites/",
    products: [
      {
        name: "Foundry Services",
        productionRole: "Advanced-node foundry manufacturing",
      },
      {
        name: "EUV Lithography",
        productionRole: "EUV-enabled semiconductor production",
        sourceUrl: "https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-expands-its-foundry-capacity-with-a-new-production-line-in-pyeongtaek-korea/",
      },
    ],
  },
  {
    companyTicker: "005930",
    name: "Samsung Giheung Fab",
    country: "KR",
    region: "Gyeonggi-do",
    city: "Yongin",
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://semiconductor.samsung.com/foundry/manufacturing/manufacturing-sites/",
    products: [
      { name: "Foundry Services", productionRole: "Mature-node semiconductor manufacturing" },
    ],
  },
  {
    companyTicker: "005930",
    name: "Samsung Austin Fab",
    country: "US",
    region: "Texas",
    city: "Austin",
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://semiconductor.samsung.com/foundry/manufacturing/manufacturing-sites/",
    products: [
      { name: "Foundry Services", productionRole: "Semiconductor foundry manufacturing" },
    ],
  },
  {
    companyTicker: "2330",
    name: "TSMC Fab 18",
    country: "TW",
    region: "Southern Taiwan Science Park",
    city: "Tainan",
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://www.tsmc.com/english/aboutTSMC/tsmc_fabs",
    products: [
      { name: "Foundry Services", productionRole: "12-inch GIGAFAB semiconductor manufacturing" },
    ],
  },
  {
    companyTicker: "2330",
    name: "TSMC Arizona First Fab",
    country: "US",
    region: "Arizona",
    city: "Phoenix",
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://investor.tsmc.com/static/annualReports/2025/english/index.html",
    products: [
      { name: "Foundry Services", productionRole: "4nm semiconductor manufacturing" },
    ],
  },
  {
    companyTicker: "2330",
    name: "JASM Kumamoto First Fab",
    country: "JP",
    region: "Kumamoto",
    city: "Kikuyo",
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://investor.tsmc.com/static/annualReports/2025/english/index.html",
    products: [
      { name: "Foundry Services", productionRole: "Specialty-technology semiconductor manufacturing" },
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

  const results: Array<{ factory: string; company: string; products: string[] }> = [];

  for (const seed of seeds) {
    const company = await db.company.findUnique({ where: { ticker: seed.companyTicker } });
    if (!company) {
      return NextResponse.json(
        {
          error: "COMPANY_NOT_FOUND",
          ticker: seed.companyTicker,
          action: "Run the semiconductor company seed before the factory seed.",
        },
        { status: 409 },
      );
    }

    let factory = await db.factory.findFirst({
      where: { companyId: company.id, name: seed.name },
    });

    const factoryData = {
      country: seed.country,
      region: seed.region ?? null,
      city: seed.city,
      factoryType: seed.factoryType,
      status: seed.status,
      sourceUrl: seed.sourceUrl,
      evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
      verifiedAt: new Date(),
    };

    if (factory) {
      factory = await db.factory.update({ where: { id: factory.id }, data: factoryData });
    } else {
      factory = await db.factory.create({
        data: { companyId: company.id, name: seed.name, ...factoryData },
      });
    }

    const productNames: string[] = [];
    for (const productSeed of seed.products) {
      const product = await db.product.findFirst({
        where: { ecosystemId: ecosystem.id, name: productSeed.name },
      });
      if (!product) {
        return NextResponse.json(
          {
            error: "PRODUCT_NOT_FOUND",
            product: productSeed.name,
            action: "Run the semiconductor company/product seed before the factory seed.",
          },
          { status: 409 },
        );
      }

      await db.factoryProduct.upsert({
        where: { factoryId_productId: { factoryId: factory.id, productId: product.id } },
        update: {
          productionRole: productSeed.productionRole,
          evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
          sourceUrl: productSeed.sourceUrl ?? seed.sourceUrl,
          verifiedAt: new Date(),
        },
        create: {
          factoryId: factory.id,
          productId: product.id,
          productionRole: productSeed.productionRole,
          evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
          sourceUrl: productSeed.sourceUrl ?? seed.sourceUrl,
          verifiedAt: new Date(),
        },
      });
      productNames.push(productSeed.name);
    }

    results.push({
      factory: factory.name,
      company: company.nameEn ?? company.nameKo,
      products: productNames,
    });
  }

  return NextResponse.json({
    evidencePolicy: "Only factory/product relationships directly supported by official company sources are seeded.",
    seeded: results,
  });
}
