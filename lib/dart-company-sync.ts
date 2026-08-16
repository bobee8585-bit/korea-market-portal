import { db } from "@/lib/db";
import { fetchDartCorpMaster } from "@/lib/opendart-corp-master";

export async function syncDartCompanies() {
  const master = await fetchDartCorpMaster();
  const listed = master.filter(
    (item): item is typeof item & { stockCode: string } =>
      Boolean(item.stockCode && /^\d{6}$/.test(item.stockCode)),
  );

  const existing = await db.company.findMany({
    where: { ticker: { in: listed.map((item) => item.stockCode) } },
    select: { id: true, ticker: true },
  });
  const existingByTicker = new Map(
    existing.flatMap((company) =>
      company.ticker ? [[company.ticker, company] as const] : [],
    ),
  );

  const payload = JSON.stringify(listed);

  await db.$transaction([
    db.$executeRaw`
      WITH input AS (
        SELECT *
        FROM jsonb_to_recordset(${payload}::jsonb)
          AS item("corpCode" text, "corpName" text, "stockCode" text)
      ),
      updated AS (
        UPDATE "Company" AS company
        SET
          "corpCode" = input."corpCode",
          "nameKo" = input."corpName",
          "isActive" = true,
          "updatedAt" = now()
        FROM input
        WHERE company."ticker" = input."stockCode"
        RETURNING company.id
      )
      INSERT INTO "Company" (
        id, "corpCode", ticker, "nameKo", country, "isActive", "createdAt", "updatedAt"
      )
      SELECT
        'dart_' || input."corpCode",
        input."corpCode",
        input."stockCode",
        input."corpName",
        'KR',
        true,
        now(),
        now()
      FROM input
      WHERE NOT EXISTS (
        SELECT 1 FROM "Company" AS company WHERE company.ticker = input."stockCode"
      )
      ON CONFLICT ("corpCode") DO UPDATE SET
        ticker = EXCLUDED.ticker,
        "nameKo" = EXCLUDED."nameKo",
        "isActive" = true,
        "updatedAt" = now()
    `,
    db.$executeRaw`
      WITH input AS (
        SELECT *
        FROM jsonb_to_recordset(${payload}::jsonb)
          AS item("corpCode" text, "corpName" text, "stockCode" text)
      ), aliases AS (
        SELECT
          'dart_alias_name_' || input."corpCode" AS id,
          company.id AS "companyId",
          input."corpName" AS alias,
          'ko'::text AS language
        FROM input
        JOIN "Company" AS company ON company.ticker = input."stockCode"
        UNION ALL
        SELECT
          'dart_alias_ticker_' || input."corpCode" AS id,
          company.id AS "companyId",
          input."stockCode" AS alias,
          NULL::text AS language
        FROM input
        JOIN "Company" AS company ON company.ticker = input."stockCode"
      )
      INSERT INTO "CompanyAlias" (id, "companyId", alias, language)
      SELECT aliases.id, aliases."companyId", aliases.alias, aliases.language
      FROM aliases
      WHERE NOT EXISTS (
        SELECT 1 FROM "CompanyAlias" AS existing
        WHERE existing."companyId" = aliases."companyId"
          AND existing.alias = aliases.alias
      )
      ON CONFLICT (id) DO NOTHING
    `,
  ]);

  const linkedExisting = existingByTicker.size;
  const upserted = listed.length - linkedExisting;

  return {
    source: "OpenDART corpCode",
    totalReceived: master.length,
    listedCompanies: listed.length,
    linkedExisting,
    upserted,
  };
}
