import type { FundFlowSnapshot } from "@/lib/fund-flow-monitor";

const officialHosts = new Set(["data.krx.co.kr", "openapi.krx.co.kr", "fsc.go.kr", "www.fsc.go.kr", "ecos.bok.or.kr", "bok.or.kr", "www.bok.or.kr"]);
const numericFields = ["foreignCashNetKrwBn", "foreignFuturesNetContracts", "programNetKrwBn", "shortSaleValueKrwBn", "leveragedProductTurnoverKrwBn", "usdKrw", "volatilityIndex", "topTwoIndexContributionPct"] as const;

export function validateFundFlowSnapshot(input: unknown): FundFlowSnapshot {
  if (!input || typeof input !== "object") throw new Error("INVALID_SNAPSHOT");
  const body = input as Record<string, unknown>;
  if (body.market !== "KOSPI") throw new Error("UNSUPPORTED_MARKET");
  const observedAt = new Date(String(body.observedAt));
  if (Number.isNaN(observedAt.getTime())) throw new Error("INVALID_OBSERVED_AT");
  if (observedAt.getTime() > Date.now() + 60_000) throw new Error("FUTURE_OBSERVATION_REJECTED");
  const sourceUrl = new URL(String(body.sourceUrl));
  if (sourceUrl.protocol !== "https:" || !officialHosts.has(sourceUrl.hostname)) throw new Error("OFFICIAL_SOURCE_REQUIRED");
  const snapshot: Record<string, unknown> = { market: "KOSPI", observedAt: observedAt.toISOString(), sourceName: String(body.sourceName || "").trim(), sourceUrl: sourceUrl.toString(), retrievedAt: new Date().toISOString() };
  if (!snapshot.sourceName) throw new Error("SOURCE_NAME_REQUIRED");
  for (const field of numericFields) {
    const value = body[field];
    if (value == null || value === "") snapshot[field] = null;
    else {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) throw new Error(`INVALID_${field.toUpperCase()}`);
      snapshot[field] = numeric;
    }
  }
  if (snapshot.topTwoIndexContributionPct != null && (Number(snapshot.topTwoIndexContributionPct) < -200 || Number(snapshot.topTwoIndexContributionPct) > 200)) throw new Error("INVALID_CONTRIBUTION_RANGE");
  return snapshot as FundFlowSnapshot;
}
