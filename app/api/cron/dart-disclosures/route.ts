import { NextRequest, NextResponse } from "next/server";
import { syncRecentDartDisclosures } from "@/lib/dart-sync";

export const maxDuration = 60;
export const preferredRegion = "icn1";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  try {
    return NextResponse.json(await syncRecentDartDisclosures(7));
  } catch (error) {
    const message = error instanceof Error ? error.message : "DART_SYNC_FAILED";
    console.error("OpenDART cron sync failed", { message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
