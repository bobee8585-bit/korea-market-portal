import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await context.params;

  const company = await db.company.findFirst({
    where: {
      OR: [{ ticker }, { corpCode: ticker }],
      isActive: true,
    },
    include: {
      aliases: true,
      disclosures: {
        orderBy: { filedAt: "desc" },
        take: 20,
        select: {
          receiptNo: true,
          reportName: true,
          filedAt: true,
          eventType: true,
          originalUrl: true,
          source: { select: { name: true, official: true } },
        },
      },
      roles: {
        include: {
          ecosystem: { select: { name: true, slug: true } },
          stage: { select: { name: true } },
          product: { select: { name: true } },
        },
      },
      factories: true,
    },
  });

  if (!company) {
    return NextResponse.json({ error: "COMPANY_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ company });
}
