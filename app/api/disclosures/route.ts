import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const ticker = request.nextUrl.searchParams.get("ticker")?.trim();
  const limitRaw = Number(request.nextUrl.searchParams.get("limit") ?? 30);
  const limit = Math.min(Math.max(Number.isFinite(limitRaw) ? limitRaw : 30, 1), 100);

  const items = await db.disclosure.findMany({
    where: ticker
      ? {
          company: {
            OR: [{ ticker }, { corpCode: ticker }],
          },
        }
      : undefined,
    orderBy: { filedAt: "desc" },
    take: limit,
    select: {
      receiptNo: true,
      reportName: true,
      filerName: true,
      filedAt: true,
      eventType: true,
      originalUrl: true,
      company: {
        select: {
          ticker: true,
          nameKo: true,
          nameEn: true,
          market: true,
        },
      },
      source: {
        select: {
          name: true,
          official: true,
        },
      },
    },
  });

  return NextResponse.json({ items });
}
