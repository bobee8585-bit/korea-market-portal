import { NextRequest, NextResponse } from "next/server";
import { syncDartCompanies } from "@/lib/dart-company-sync";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    return NextResponse.json(await syncDartCompanies());
  } catch (error) {
    const message = error instanceof Error ? error.message : "DART_COMPANY_SYNC_FAILED";
    console.error("OpenDART company sync failed", { message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
