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
  latitude?: number;
  longitude?: number;
  locationPrecision?: "CITY" | "SITE";
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
    latitude: 36.9921,
    longitude: 127.1127,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://semiconductor.samsung.com/foundry/manufacturing/manufacturing-sites/",
    products: [
      { name: "DRAM", productionRole: "Advanced memory manufacturing", sourceUrl: "https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-operates-the-worlds-largest-pyeongtaek-line-2/" },
      { name: "NAND Flash", productionRole: "Advanced memory manufacturing", sourceUrl: "https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-operates-the-worlds-largest-pyeongtaek-line-2/" },
      { name: "Foundry Services", productionRole: "Advanced-node foundry manufacturing" },
    ],
  },
  {
    companyTicker: "005930",
    name: "Samsung Hwaseong Fab",
    country: "KR",
    region: "Gyeonggi-do",
    city: "Hwaseong",
    latitude: 37.1995,
    longitude: 126.8312,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://semiconductor.samsung.com/foundry/manufacturing/manufacturing-sites/",
    products: [
      { name: "Foundry Services", productionRole: "Advanced-node foundry manufacturing" },
      { name: "EUV Lithography", productionRole: "EUV-enabled semiconductor production", sourceUrl: "https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-expands-its-foundry-capacity-with-a-new-production-line-in-pyeongtaek-korea/" },
    ],
  },
  {
    companyTicker: "005930",
    name: "Samsung Giheung Fab",
    country: "KR",
    region: "Gyeonggi-do",
    city: "Yongin",
    latitude: 37.2411,
    longitude: 127.1776,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://semiconductor.samsung.com/foundry/manufacturing/manufacturing-sites/",
    products: [{ name: "Foundry Services", productionRole: "Mature-node semiconductor manufacturing" }],
  },
  {
    companyTicker: "005930",
    name: "Samsung Austin Fab",
    country: "US",
    region: "Texas",
    city: "Austin",
    latitude: 30.2672,
    longitude: -97.7431,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://semiconductor.samsung.com/foundry/manufacturing/manufacturing-sites/",
    products: [{ name: "Foundry Services", productionRole: "Semiconductor foundry manufacturing" }],
  },
  {
    companyTicker: "2330",
    name: "TSMC Fab 18",
    country: "TW",
    region: "Southern Taiwan Science Park",
    city: "Tainan",
    latitude: 22.9999,
    longitude: 120.2269,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://www.tsmc.com/english/aboutTSMC/tsmc_fabs",
    products: [{ name: "Foundry Services", productionRole: "12-inch GIGAFAB semiconductor manufacturing" }],
  },
  {
    companyTicker: "2330",
    name: "TSMC Arizona First Fab",
    country: "US",
    region: "Arizona",
    city: "Phoenix",
    latitude: 33.4484,
    longitude: -112.074,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://investor.tsmc.com/static/annualReports/2025/english/index.html",
    products: [{ name: "Foundry Services", productionRole: "4nm semiconductor manufacturing" }],
  },
  {
    companyTicker: "2330",
    name: "JASM Kumamoto First Fab",
    country: "JP",
    region: "Kumamoto",
    city: "Kikuyo",
    latitude: 32.8594,
    longitude: 130.7967,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://investor.tsmc.com/static/annualReports/2025/english/index.html",
    products: [{ name: "Foundry Services", productionRole: "Specialty-technology semiconductor manufacturing" }],
  },
  {
    companyTicker: "000660",
    name: "SK hynix M16 Icheon",
    country: "KR",
    region: "Gyeonggi-do",
    city: "Icheon",
    latitude: 37.2720,
    longitude: 127.4350,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://news.skhynix.com/sk-hynix-announces-the-completion-of-m16-plant-construction/",
    products: [
      { name: "DRAM", productionRole: "Advanced DRAM manufacturing with EUV" },
      { name: "EUV Lithography", productionRole: "EUV-enabled memory manufacturing" },
    ],
  },
  {
    companyTicker: "000660",
    name: "SK hynix M15X Cheongju",
    country: "KR",
    region: "Chungcheongbuk-do",
    city: "Cheongju",
    latitude: 36.6424,
    longitude: 127.4890,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://news.skhynix.com/sk-hynix-to-produce-dram-from-m15x-in-cheongju/",
    products: [
      { name: "DRAM", productionRole: "Next-generation DRAM production base" },
      { name: "HBM", productionRole: "AI memory production ecosystem" },
    ],
  },
  {
    companyTicker: "MU",
    name: "Micron Hiroshima Fab",
    country: "JP",
    region: "Hiroshima",
    city: "Higashihiroshima",
    latitude: 34.4264,
    longitude: 132.7433,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://investors.micron.com/news-releases/news-release-details/micron-bring-euv-technology-japan-advancing-next-generation",
    products: [
      { name: "DRAM", productionRole: "Advanced DRAM manufacturing" },
      { name: "EUV Lithography", productionRole: "1-gamma EUV-enabled DRAM manufacturing" },
    ],
  },
  {
    companyTicker: "MU",
    name: "Micron Taichung Manufacturing Campus",
    country: "TW",
    region: "Taichung",
    city: "Taichung",
    latitude: 24.1477,
    longitude: 120.6736,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.OPERATING,
    sourceUrl: "https://www.micron.com/about/company/corporate-profile",
    products: [
      { name: "DRAM", productionRole: "Advanced DRAM manufacturing" },
      { name: "HBM", productionRole: "HBM packaging and test ecosystem", sourceUrl: "https://investors.micron.com/news-releases/news-release-details/taiwanmeiguanghuanqingtaizhongsichangzhengshiluochengqiyong" },
    ],
  },
  {
    companyTicker: "MU",
    name: "Micron Tongluo P5",
    country: "TW",
    region: "Miaoli",
    city: "Tongluo",
    latitude: 24.4893,
    longitude: 120.7862,
    factoryType: FactoryType.FAB,
    status: FactoryStatus.EXPANDING,
    sourceUrl: "https://investors.micron.com/news-releases/news-release-details/micron-completes-acquisition-psmcs-tongluo-p5-site-taiwan",
    products: [
      { name: "DRAM", productionRole: "Leading-edge DRAM expansion" },
      { name: "HBM", productionRole: "AI-memory supply expansion" },
    ],
  },
];

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const ecosystem = await db.ecosystem.findUnique({ where: { slug: "semiconductor" } });
  if (!ecosystem) {
    return NextResponse.json({ error: "SEMICONDUCTOR_ECOSYSTEM_NOT_FOUND", action: "Run ecosystem bootstrap first." }, { status: 409 });
  }

  const results: Array<{ factory: string; company: string; products: string[] }> = [];

  for (const seed of seeds) {
    const company = await db.company.findUnique({ where: { ticker: seed.companyTicker } });
    if (!company) {
      return NextResponse.json({ error: "COMPANY_NOT_FOUND", ticker: seed.companyTicker, action: "Run the semiconductor company seed before the factory seed." }, { status: 409 });
    }

    let factory = await db.factory.findFirst({ where: { companyId: company.id, name: seed.name } });
    const factoryData = {
      country: seed.country,
      region: seed.region ?? null,
      city: seed.city,
      latitude: seed.latitude ?? null,
      longitude: seed.longitude ?? null,
      locationPrecision: seed.locationPrecision ?? "CITY",
      factoryType: seed.factoryType,
      status: seed.status,
      sourceUrl: seed.sourceUrl,
      evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED,
      verifiedAt: new Date(),
    };

    if (factory) {
      factory = await db.factory.update({ where: { id: factory.id }, data: factoryData });
    } else {
      factory = await db.factory.create({ data: { companyId: company.id, name: seed.name, ...factoryData } });
    }

    const productNames: string[] = [];
    for (const productSeed of seed.products) {
      const product = await db.product.findFirst({ where: { ecosystemId: ecosystem.id, name: productSeed.name } });
      if (!product) {
        return NextResponse.json({ error: "PRODUCT_NOT_FOUND", product: productSeed.name, action: "Run the semiconductor company/product seed before the factory seed." }, { status: 409 });
      }

      await db.factoryProduct.upsert({
        where: { factoryId_productId: { factoryId: factory.id, productId: product.id } },
        update: { productionRole: productSeed.productionRole, evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED, sourceUrl: productSeed.sourceUrl ?? seed.sourceUrl, verifiedAt: new Date() },
        create: { factoryId: factory.id, productId: product.id, productionRole: productSeed.productionRole, evidenceStatus: EvidenceStatus.COMPANY_CONFIRMED, sourceUrl: productSeed.sourceUrl ?? seed.sourceUrl, verifiedAt: new Date() },
      });
      productNames.push(productSeed.name);
    }

    results.push({ factory: factory.name, company: company.nameEn ?? company.nameKo, products: productNames });
  }

  return NextResponse.json({
    evidencePolicy: "Factory/product roles require official company evidence. Coordinates in this seed are city-level map positions and are explicitly marked CITY precision.",
    seeded: results,
  });
}
