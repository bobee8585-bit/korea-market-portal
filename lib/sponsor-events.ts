import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import type { SponsorPlacement } from "@/lib/monetization";

export type SponsorEventType = "impression" | "click";

let tableReady: Promise<void> | null = null;

function ensureSponsorEventTable() {
  tableReady ??= (async () => {
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "SponsorEvent" (
        "id" TEXT PRIMARY KEY,
        "campaignId" TEXT NOT NULL,
        "placement" TEXT NOT NULL,
        "event" TEXT NOT NULL,
        "page" TEXT NOT NULL,
        "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "SponsorEvent_recordedAt_idx" ON "SponsorEvent" ("recordedAt")`;
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "SponsorEvent_campaignId_recordedAt_idx" ON "SponsorEvent" ("campaignId", "recordedAt")`;
  })();
  return tableReady;
}

export async function recordSponsorEvent(input: { campaignId: string; placement: SponsorPlacement; event: SponsorEventType; page: string }) {
  await ensureSponsorEventTable();
  await db.$executeRaw`
    INSERT INTO "SponsorEvent" ("id", "campaignId", "placement", "event", "page", "recordedAt")
    VALUES (${randomUUID()}, ${input.campaignId}, ${input.placement}, ${input.event}, ${input.page}, NOW())
  `;
}

export type SponsorReportRow = {
  day: Date;
  campaignId: string;
  placement: string;
  impressions: number;
  clicks: number;
};

export async function sponsorReport(since: Date) {
  await ensureSponsorEventTable();
  return db.$queryRaw<SponsorReportRow[]>`
    SELECT
      DATE_TRUNC('day', "recordedAt") AS "day",
      "campaignId",
      "placement",
      COUNT(*) FILTER (WHERE "event" = 'impression')::int AS "impressions",
      COUNT(*) FILTER (WHERE "event" = 'click')::int AS "clicks"
    FROM "SponsorEvent"
    WHERE "recordedAt" >= ${since}
    GROUP BY DATE_TRUNC('day', "recordedAt"), "campaignId", "placement"
    ORDER BY "day" DESC, "campaignId", "placement"
  `;
}
