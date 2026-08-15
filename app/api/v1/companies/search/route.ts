import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 1) {
    return NextResponse.json({ query, results: [] });
  }

  const results = await db.company.findMany({
    where: {
      isActive: true,
      OR: [
        { ticker: { contains: query, mode: "insensitive" } },
        { nameKo: { contains: query, mode: "insensitive" } },
        { nameEn: { contains: query, mode: "insensitive" } },
        { aliases: { some: { alias: { contains: query, mode: "insensitive" } } } },
      ],
    },
    select: {
      ticker: true,
      nameKo: true,
      nameEn: true,
      country: true,
      market: true,
    },
    orderBy: [{ country: "asc" }, { nameKo: "asc" }],
    take: 30,
  });

  return NextResponse.json({ query, results });
}
