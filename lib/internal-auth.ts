import { NextRequest } from "next/server";

export function isAuthorizedInternalRequest(request: NextRequest) {
  const secret = process.env.INTERNAL_SYNC_SECRET;
  if (!secret) return false;
  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${secret}`;
}
