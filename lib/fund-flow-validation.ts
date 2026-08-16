import type { FundFlowSnapshot } from "@/lib/fund-flow-monitor";

const officialHosts = new Set(["data.krx.co.kr", "openapi.krx.co.kr", "fsc.go.kr", "www.fsc.go.kr", "ecos.bok.or.kr", "bok.or.kr", "www.bok.or.kr", "fred.stlouisfed.org"]);
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
  if (body.benchmarks != null) {
    if (!Array.isArray(body.benchmarks) || body.benchmarks.length > 4) throw new Error("INVALID_BENCHMARKS");
    const allowedCodes = new Set(["KOSPI", "SP500", "NASDAQCOM", "DJIA"]);
    const seen = new Set<string>();
    snapshot.benchmarks = body.benchmarks.map((raw) => {
      if (!raw || typeof raw !== "object") throw new Error("INVALID_BENCHMARK");
      const item = raw as Record<string, unknown>;
      const code = String(item.code);
      if (!allowedCodes.has(code) || seen.has(code)) throw new Error("INVALID_BENCHMARK_CODE");
      seen.add(code);
      const benchmarkSource = new URL(String(item.sourceUrl));
      if (benchmarkSource.protocol !== "https:" || !officialHosts.has(benchmarkSource.hostname)) throw new Error("OFFICIAL_BENCHMARK_SOURCE_REQUIRED");
      const asOf = new Date(String(item.asOf));
      if (Number.isNaN(asOf.getTime()) || asOf.getTime() > Date.now() + 60_000) throw new Error("INVALID_BENCHMARK_DATE");
      const numberOrNull = (value: unknown) => {
        if (value == null || value === "") return null;
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) throw new Error("INVALID_BENCHMARK_VALUE");
        return numeric;
      };
      return { code, name: String(item.name || code), region: code === "KOSPI" ? "KR" : "US", asOf: asOf.toISOString(), close: numberOrNull(item.close), return1dPct: numberOrNull(item.return1dPct), return5dPct: numberOrNull(item.return5dPct), return20dPct: numberOrNull(item.return20dPct), sourceName: String(item.sourceName || "").trim(), sourceUrl: benchmarkSource.toString() };
    });
  }
  return snapshot as FundFlowSnapshot;
}
