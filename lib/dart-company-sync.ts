import { db } from "@/lib/db";
import { fetchDartCorpMaster } from "@/lib/opendart-corp-master";

// Supabase's transaction pool currently exposes five connections to this app.
// Keep one connection available for normal traffic while the bulk sync runs.
const BATCH_SIZE = 4;

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

  let linkedExisting = 0;
  let upserted = 0;

  for (let offset = 0; offset < listed.length; offset += BATCH_SIZE) {
    const batch = listed.slice(offset, offset + BATCH_SIZE);
    await Promise.all(
      batch.map(async (item) => {
        const matched = existingByTicker.get(item.stockCode);
        if (matched) {
          await db.company.update({
            where: { id: matched.id },
            data: {
              corpCode: item.corpCode,
              nameKo: item.corpName,
              isActive: true,
            },
          });
          linkedExisting += 1;
          return;
        }

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
                { alias: item.stockCode, language: null },
              ],
            },
          },
        });
        upserted += 1;
      }),
    );
  }

  return {
    source: "OpenDART corpCode",
    totalReceived: master.length,
    listedCompanies: listed.length,
    linkedExisting,
    upserted,
  };
}
