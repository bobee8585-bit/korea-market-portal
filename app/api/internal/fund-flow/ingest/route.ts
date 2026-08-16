import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";
import { validateFundFlowSnapshot } from "@/lib/fund-flow-validation";

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const snapshot = validateFundFlowSnapshot(await request.json());
    const occurredAt = new Date(snapshot.observedAt);
    const title = `FUND_FLOW_SNAPSHOT|KOSPI|${snapshot.observedAt.slice(0, 10)}`;
    const existing = await db.marketImpactEvent.findFirst({ where: { title } });
    const data = { eventType: "OTHER" as const, title, country: "KR", occurredAt, relevanceNote: JSON.stringify(snapshot), sourceUrl: snapshot.sourceUrl, evidenceStatus: "REGULATOR_CONFIRMED" as const };
    const record = existing ? await db.marketImpactEvent.update({ where: { id: existing.id }, data }) : await db.marketImpactEvent.create({ data });
    return NextResponse.json({ ok: true, id: record.id, observedAt: snapshot.observedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "INVALID_REQUEST";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
