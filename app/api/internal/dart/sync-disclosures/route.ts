import { NextRequest, NextResponse } from "next/server";
import { Market, RightsType, SourceType } from "@prisma/client";
import { db } from "@/lib/db";
import { classifyDisclosure, parseDartDate } from "@/lib/disclosure";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";
import { dartDisclosureUrl, fetchDartDisclosures } from "@/lib/opendart";

function kstDateString() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}${get("month")}${get("day")}`;
}

function marketFromCorpClass(corpClass?: string): Market | undefined {
  if (corpClass === "Y") return Market.KOSPI;
  if (corpClass === "K") return Market.KOSDAQ;
  if (corpClass === "N") return Market.KONEX;
  if (corpClass === "E") return Market.OTHER;
  return undefined;
}

async function getDartSource() {
  const existing = await db.source.findFirst({
    where: { name: "OpenDART", sourceType: SourceType.REGULATOR },
  });
  if (existing) return existing;

  return db.source.create({
    data: {
      name: "OpenDART",
      country: "KR",
      sourceType: SourceType.REGULATOR,
      homepageUrl: "https://opendart.fss.or.kr/",
      apiUrl: "https://opendart.fss.or.kr/api/",
      official: true,
      rightsType: RightsType.OFFICIAL_OPEN_DATA,
      canStore: true,
      canTranslate: true,
      canAnalyze: true,
      canCache: true,
      canShowTitle: true,
      canShowExcerpt: true,
      active: true,
      verifiedAt: new Date(),
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const date = typeof body.date === "string" && /^\d{8}$/.test(body.date) ? body.date : kstDateString();
  const source = await getDartSource();

  let pageNo = 1;
  let totalPages = 1;
  let received = 0;
  let inserted = 0;
  let skippedUnknownCompany = 0;

  do {
    const response = await fetchDartDisclosures({
      beginDate: date,
      endDate: date,
      pageNo,
      pageCount: 100,
    });

    totalPages = response.total_page ?? 1;
    const items = response.list ?? [];
    received += items.length;

    for (const item of items) {
      const company = await db.company.findUnique({ where: { corpCode: item.corp_code } });
      if (!company) {
        skippedUnknownCompany += 1;
        continue;
      }

      const inferredMarket = marketFromCorpClass(item.corp_cls);
      if (inferredMarket && company.market !== inferredMarket) {
        await db.company.update({
          where: { id: company.id },
          data: { market: inferredMarket },
        });
      }

      const exists = await db.disclosure.findUnique({ where: { receiptNo: item.rcept_no } });
      if (exists) continue;

      await db.disclosure.create({
        data: {
          companyId: company.id,
          sourceId: source.id,
          receiptNo: item.rcept_no,
          reportName: item.report_nm,
          filerName: item.flr_nm || null,
          corpClass: item.corp_cls || null,
          filedAt: parseDartDate(item.rcept_dt),
          remarks: item.rm || null,
          originalUrl: dartDisclosureUrl(item.rcept_no),
          eventType: classifyDisclosure(item.report_nm),
        },
      });
      inserted += 1;
    }

    pageNo += 1;
  } while (pageNo <= totalPages);

  return NextResponse.json({
    date,
    pages: totalPages,
    received,
    inserted,
    skippedUnknownCompany,
  });
}
