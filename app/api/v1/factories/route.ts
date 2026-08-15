import { NextRequest, NextResponse } from "next/server";
import { EvidenceStatus, FactoryStatus } from "@prisma/client";
import { db } from "@/lib/db";

const publicEvidence = [
  EvidenceStatus.REGULATOR_CONFIRMED,
  EvidenceStatus.GOVERNMENT_CONFIRMED,
  EvidenceStatus.COMPANY_CONFIRMED,
  EvidenceStatus.LICENSED_SOURCE,
];

function parseFactoryStatus(value: string | null): FactoryStatus | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toUpperCase();
  return Object.values(FactoryStatus).includes(normalized as FactoryStatus)
    ? (normalized as FactoryStatus)
    : undefined;
}

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country")?.trim().toUpperCase() || undefined;
  const ecosystemSlug = request.nextUrl.searchParams.get("ecosystem")?.trim() || undefined;
  const company = request.nextUrl.searchParams.get("company")?.trim() || undefined;
  const rawStatus = request.nextUrl.searchParams.get("status");
  const status = parseFactoryStatus(rawStatus);

  if (rawStatus && !status) {
    return NextResponse.json(
      { error: "INVALID_FACTORY_STATUS", allowed: Object.values(FactoryStatus) },
      { status: 400 },
    );
  }

  const factories = await db.factory.findMany({
    where: {
      evidenceStatus: { in: publicEvidence },
      ...(country ? { country } : {}),
      ...(status ? { status } : {}),
      ...(company
        ? {
            company: {
              OR: [
                { ticker: company },
                { slug: company },
                { nameEn: { contains: company, mode: "insensitive" } },
                { nameKo: { contains: company, mode: "insensitive" } },
              ],
            },
          }
        : {}),
      ...(ecosystemSlug
        ? {
            products: {
              some: {
                product: { ecosystem: { slug: ecosystemSlug } },
                evidenceStatus: { in: publicEvidence },
              },
            },
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      country: true,
      region: true,
      city: true,
      latitude: true,
      longitude: true,
      locationPrecision: true,
      factoryType: true,
      status: true,
      openedAt: true,
      sourceUrl: true,
      evidenceStatus: true,
      company: {
        select: {
          ticker: true,
          slug: true,
          nameKo: true,
          nameEn: true,
          country: true,
        },
      },
      products: {
        where: { evidenceStatus: { in: publicEvidence } },
        select: {
          productionRole: true,
          capacityValue: true,
          capacityUnit: true,
          capacityYear: true,
          sourceUrl: true,
          evidenceStatus: true,
          product: {
            select: {
              name: true,
              technologyGroup: true,
              ecosystem: { select: { name: true, slug: true } },
              stage: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: [{ country: "asc" }, { city: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({
    methodology:
      "Only regulator, government, company-confirmed or licensed factory records are published. Capacity is shown only when it is explicitly sourced.",
    filters: { country: country ?? null, ecosystem: ecosystemSlug ?? null, company: company ?? null, status: status ?? null },
    factories,
  });
}
