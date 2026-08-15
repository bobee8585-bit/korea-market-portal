import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";
import { fetchDartCorpMaster } from "@/lib/opendart-corp-master";

export const preferredRegion = "icn1";

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const master = await fetchDartCorpMaster();
  const listed = master.filter((item) => item.stockCode && /^\d{6}$/.test(item.stockCode));

  let upserted = 0;
  for (const item of listed) {
    await db.company.upsert({
      where: { corpCode: item.corpCode },
      update: {
        ticker: item.stockCode,
        nameKo: item.corpName,
        isActive: true,
      },
      create: {
        corpCode: item.corpCode,
        ticker: item.stockCode,
        nameKo: item.corpName,
        isActive: true,
        aliases: {
          create: [
            { alias: item.corpName, language: "ko" },
            { alias: item.stockCode!, language: null },
          ],
        },
      },
    });
    upserted += 1;
  }

  return NextResponse.json({
    source: "OpenDART corpCode",
    totalReceived: master.length,
    listedCompanies: listed.length,
    upserted,
  });
}
