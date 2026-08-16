import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";
import { sponsorReport } from "@/lib/sponsor-events";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const requestedDays = Number(request.nextUrl.searchParams.get("days") || 30);
  const days = Number.isInteger(requestedDays) ? Math.min(90, Math.max(1, requestedDays)) : 30;
  const since = new Date(Date.now() - days * 86_400_000);

  try {
    const rows = await sponsorReport(since);
    const totals = rows.reduce((result, row) => ({ impressions: result.impressions + row.impressions, clicks: result.clicks + row.clicks }), { impressions: 0, clicks: 0 });
    return NextResponse.json({ status: "ok", rangeDays: days, since: since.toISOString(), totals: { ...totals, clickThroughRate: totals.impressions ? Number((totals.clicks / totals.impressions).toFixed(4)) : 0 }, rows });
  } catch {
    return NextResponse.json({ status: "unavailable", error: "SPONSOR_REPORT_UNAVAILABLE" }, { status: 503 });
  }
}
