import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";
import { kstDateString, syncDartDisclosures } from "@/lib/dart-sync";

export const preferredRegion = "icn1";

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const date = typeof body.date === "string" && /^\d{8}$/.test(body.date) ? body.date : kstDateString();
  return NextResponse.json(await syncDartDisclosures(date));
}
