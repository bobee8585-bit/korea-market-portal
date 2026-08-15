import { NextRequest, NextResponse } from "next/server";
import { syncDartCompanies } from "@/lib/dart-company-sync";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    return NextResponse.json(await syncDartCompanies());
  } catch (error) {
    const message = error instanceof Error ? error.message : "DART_COMPANY_SYNC_FAILED";
    console.error("OpenDART company cron sync failed", { message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
