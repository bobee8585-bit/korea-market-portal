import { Market, RightsType, SourceType } from "@prisma/client";
import { db } from "@/lib/db";
import { classifyDisclosure, parseDartDate } from "@/lib/disclosure";
import { dartDisclosureUrl, fetchDartDisclosures } from "@/lib/opendart";

export function kstDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}${get("month")}${get("day")}`;
}

export function latestKstBusinessDate(date = new Date()) {
  let candidate = date;
  while (true) {
    const weekday = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      weekday: "short",
    }).format(candidate);
    if (weekday !== "Sat" && weekday !== "Sun") return kstDateString(candidate);
    candidate = new Date(candidate.getTime() - 86_400_000);
  }
}

function marketFromCorpClass(corpClass?: string): Market | undefined {
  if (corpClass === "Y") return Market.KOSPI;
  if (corpClass === "K") return Market.KOSDAQ;
  if (corpClass === "N") return Market.KONEX;
  if (corpClass === "E") return Market.OTHER;
  return undefined;
}

async function getDartSource() {
  const existing = await db.source.findFirst({ where: { name: "OpenDART", sourceType: SourceType.REGULATOR } });
  if (existing) return existing;
  return db.source.create({ data: {
    name: "OpenDART", country: "KR", sourceType: SourceType.REGULATOR,
    homepageUrl: "https://opendart.fss.or.kr/", apiUrl: "https://opendart.fss.or.kr/api/",
    official: true, rightsType: RightsType.OFFICIAL_OPEN_DATA, canStore: true,
    canTranslate: true, canAnalyze: true, canCache: true, canShowTitle: true,
    canShowExcerpt: true, active: true, verifiedAt: new Date(),
  }});
}

export async function syncDartDisclosures(date = kstDateString()) {
  if (!/^\d{8}$/.test(date)) throw new Error("INVALID_DATE");
  return syncDartDisclosureRange(date, date);
}

async function syncDartDisclosureRange(beginDate: string, endDate: string) {
  const source = await getDartSource();
  let pageNo = 1, totalPages = 1, received = 0, inserted = 0, skippedUnknownCompany = 0;
  do {
    const response = await fetchDartDisclosures({ beginDate, endDate, pageNo, pageCount: 100 });
    totalPages = response.total_page ?? 1;
    const items = response.list ?? [];
    received += items.length;
    if (items.length === 0) break;

    const corpCodes = [...new Set(items.map((item) => item.corp_code))];
    const knownCompanies = await db.company.findMany({
      where: { corpCode: { in: corpCodes } },
      select: { corpCode: true },
    });
    const knownCorpCodes = new Set(knownCompanies.flatMap((company) => company.corpCode ?? []));
    skippedUnknownCompany += items.filter((item) => !knownCorpCodes.has(item.corp_code)).length;

    const payload = JSON.stringify(items.map((item) => ({
      corpCode: item.corp_code,
      receiptNo: item.rcept_no,
      reportName: item.report_nm,
      filerName: item.flr_nm || null,
      corpClass: item.corp_cls || null,
      filedAt: parseDartDate(item.rcept_dt).toISOString(),
      remarks: item.rm || null,
      originalUrl: dartDisclosureUrl(item.rcept_no),
      eventType: classifyDisclosure(item.report_nm),
      market: marketFromCorpClass(item.corp_cls) ?? null,
    })));

    const [, insertedOnPage] = await db.$transaction([
      db.$executeRaw`
        WITH input AS (
          SELECT * FROM jsonb_to_recordset(${payload}::jsonb)
            AS item("corpCode" text, market text)
        )
        UPDATE "Company" AS company
        SET market = input.market::"Market", "updatedAt" = now()
        FROM input
        WHERE company."corpCode" = input."corpCode"
          AND input.market IS NOT NULL
          AND company.market IS DISTINCT FROM input.market::"Market"
      `,
      db.$executeRaw`
        WITH input AS (
          SELECT * FROM jsonb_to_recordset(${payload}::jsonb)
            AS item(
              "corpCode" text, "receiptNo" text, "reportName" text,
              "filerName" text, "corpClass" text, "filedAt" timestamptz,
              remarks text, "originalUrl" text, "eventType" text
            )
        )
        INSERT INTO "Disclosure" (
          id, "companyId", "sourceId", "receiptNo", "reportName", "filerName",
          "corpClass", "filedAt", remarks, "originalUrl", "eventType", language,
          "createdAt", "updatedAt"
        )
        SELECT
          'dart_disclosure_' || input."receiptNo",
          company.id,
          ${source.id},
          input."receiptNo",
          input."reportName",
          input."filerName",
          input."corpClass",
          input."filedAt",
          input.remarks,
          input."originalUrl",
          input."eventType"::"DisclosureEventType",
          'en',
          now(),
          now()
        FROM input
        JOIN "Company" AS company ON company."corpCode" = input."corpCode"
        ON CONFLICT ("receiptNo") DO UPDATE SET
          "reportName" = EXCLUDED."reportName",
          "filerName" = EXCLUDED."filerName",
          "corpClass" = EXCLUDED."corpClass",
          "filedAt" = EXCLUDED."filedAt",
          remarks = EXCLUDED.remarks,
          "originalUrl" = EXCLUDED."originalUrl",
          "eventType" = EXCLUDED."eventType",
          language = EXCLUDED.language,
          "updatedAt" = now()
      `,
    ]);
    inserted += insertedOnPage;
    pageNo += 1;
  } while (pageNo <= totalPages);
  return { beginDate, endDate, pages: totalPages, received, inserted, skippedUnknownCompany };
}
