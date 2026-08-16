import { db } from "@/lib/db";
import { benchmarkDirectory, parseFundFlowSnapshot, type BenchmarkReturn } from "@/lib/fund-flow-monitor";

const windows = [
  { key: "return1dPct", label: "1D" },
  { key: "return5dPct", label: "5D" },
  { key: "return20dPct", label: "20D" },
] as const;

function ReturnBar({ value, scale }: { value: number | null; scale: number }) {
  if (value == null) return <div className="returnTrack"><span className="returnMissing">—</span></div>;
  const width = Math.min(50, Math.max(2, Math.abs(value) / scale * 50));
  return <div className="returnTrack"><i className="returnZero" /><span className={value >= 0 ? "returnFill positive" : "returnFill negative"} style={{ width: `${width}%` }} /><b className={value >= 0 ? "positiveReturn" : "negativeReturn"}>{value > 0 ? "+" : ""}{value.toFixed(2)}%</b></div>;
}

export async function IndexComparisonChart() {
  const record = await db.marketImpactEvent.findFirst({ where: { title: { startsWith: "FUND_FLOW_SNAPSHOT|KOSPI" }, evidenceStatus: "REGULATOR_CONFIRMED" }, orderBy: { occurredAt: "desc" } });
  const snapshot = parseFundFlowSnapshot(record?.relevanceNote ?? null);
  const benchmarks: BenchmarkReturn[] = snapshot?.benchmarks ?? [];
  const values = benchmarks.flatMap((item) => windows.map(({ key }) => item[key])).filter((value): value is number => value != null);
  const scale = Math.max(1, ...values.map(Math.abs));

  return <section className="indexComparisonHome" aria-labelledby="index-comparison-title">
    <div className="indexComparisonIntro"><div><span className="eyebrow">GLOBAL INDEX COMPARISON</span><h2 id="index-comparison-title">KOSPI vs U.S. equity indices</h2><p>Percentage returns in each index&apos;s local currency. Dates are preserved because market hours and holidays differ.</p></div><a href="/fund-flow">Open full fund-flow analysis →</a></div>
    {benchmarks.length ? <div className="returnChart"><div className="returnChartHead"><strong>INDEX</strong>{windows.map((window) => <strong key={window.key}>{window.label}</strong>)}</div>{benchmarks.map((item) => <div className="returnChartRow" key={item.code}><div><small>{item.region} · {item.asOf.slice(0, 10)}</small><strong>{item.name}</strong></div>{windows.map(({ key }) => <ReturnBar key={key} value={item[key]} scale={scale} />)}</div>)}</div>:<div className="chartAwaiting"><div><span className="connectionBadge awaiting">GRAPH UNAVAILABLE · NOT LIVE</span><strong>Official comparison data is not connected</strong><p>A real graph requires KRX-authorized KOSPI observations aligned with the official U.S. series. Decorative lines and placeholder values are not displayed.</p></div><div className="chartSourceLegend">{benchmarkDirectory.map((item) => <a href={item.sourceUrl} target="_blank" rel="noreferrer" key={item.code}><span>{item.code}</span><small>{item.sourceName} ↗</small></a>)}</div></div>}
    <p className="chartDisclosure">Relative performance is contextual evidence only. It does not identify a fund, prove causation or constitute investment advice.</p>
  </section>;
}
