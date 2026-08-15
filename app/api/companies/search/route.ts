import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query || query.length < 1) return NextResponse.json({ items: [] });

  const items = await db.company.findMany({
    where: {
      isActive: true,
      OR: [
        { ticker: { contains: query } },
        { corpCode: { contains: query } },
        { nameKo: { contains: query, mode: "insensitive" } },
        { nameEn: { contains: query, mode: "insensitive" } },
        { aliases: { some: { alias: { contains: query, mode: "insensitive" } } } },
      ],
    },
    select: {
      ticker: true,
      corpCode: true,
      nameKo: true,
      nameEn: true,
      market: true,
    },
    take: 20,
    orderBy: [{ market: "asc" }, { nameKo: "asc" }],
  });

  return NextResponse.json({ items });
}
