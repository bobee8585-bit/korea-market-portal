import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    const fundFlowSnapshotCount = await db.marketImpactEvent.count({ where: { title: { startsWith: "FUND_FLOW_SNAPSHOT|KOSPI" }, evidenceStatus: "REGULATOR_CONFIRMED" } });
    return NextResponse.json({
      status: "ready",
      database: "ok",
      fundFlow: fundFlowSnapshotCount > 0 ? "connected_dated_snapshots" : "awaiting_licensed_official_data",
      fundFlowSnapshotCount,
      time: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "not_ready",
        database: "unavailable",
        time: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
