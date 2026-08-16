import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateFlowPressure, parseFundFlowSnapshot } from "@/lib/fund-flow-monitor";

export const dynamic = "force-dynamic";

export async function GET() {
  const records = await db.marketImpactEvent.findMany({ where: { title: { startsWith: "FUND_FLOW_SNAPSHOT|KOSPI" }, evidenceStatus: "REGULATOR_CONFIRMED" }, orderBy: { occurredAt: "desc" }, take: 60 });
  const snapshots = records.map((record) => parseFundFlowSnapshot(record.relevanceNote)).filter((item) => item !== null);
  return NextResponse.json({
    status: snapshots.length ? "connected" : "awaiting_licensed_official_data",
    isLive: false,
    methodology: "Scores are reproducible flow-pressure indicators, not proof of a hedge fund's identity, motive or causal responsibility.",
    latest: snapshots[0] ? { ...snapshots[0], pressure: calculateFlowPressure(snapshots[0]) } : null,
    history: snapshots.map((snapshot) => ({ ...snapshot, pressure: calculateFlowPressure(snapshot) })),
  });
}
