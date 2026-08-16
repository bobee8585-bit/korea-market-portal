type Point = { date: string; value: number };

const indicators = [
  { id: "CPIAUCSL", title: "Consumer inflation", short: "CPI", unit: "% YoY", transform: "yoy", source: "U.S. Bureau of Labor Statistics", impact: "Inflation affects rate expectations, discount rates and household purchasing power." },
  { id: "PPIACO", title: "Producer inflation", short: "PPI", unit: "% YoY", transform: "yoy", source: "U.S. Bureau of Labor Statistics", impact: "Producer prices can signal upstream cost pressure before it reaches consumers." },
  { id: "UNRATE", title: "Unemployment rate", short: "UNEMPLOYMENT", unit: "%", transform: "level", source: "U.S. Bureau of Labor Statistics", impact: "Labour-market slack influences growth expectations and monetary policy." },
  { id: "PAYEMS", title: "Nonfarm payroll change", short: "PAYROLLS", unit: "thousand MoM", transform: "change", source: "U.S. Bureau of Labor Statistics", impact: "Employment growth helps distinguish resilient demand from economic slowdown." },
  { id: "FEDFUNDS", title: "Federal funds rate", short: "POLICY RATE", unit: "%", transform: "level", source: "Board of Governors of the Federal Reserve System", impact: "The policy rate affects financing costs and equity valuation." },
  { id: "DGS10", title: "10-year Treasury yield", short: "US 10Y", unit: "%", transform: "level", source: "Board of Governors of the Federal Reserve System", impact: "Long yields reflect growth, inflation and term-premium expectations." },
] as const;

function parseFredCsv(text: string, id: string) {
  const rows = text.trim().split(/\r?\n/).slice(1);
  return rows.flatMap((row) => {
    const [date, raw] = row.split(",");
    const value = Number(raw);
    return date && Number.isFinite(value) ? [{ date, value }] : [];
  });
}

function transform(points: Point[], kind: string) {
  if (kind === "yoy") return points.slice(12).map((point, index) => ({ date: point.date, value: (point.value / points[index].value - 1) * 100 }));
  if (kind === "change") return points.slice(1).map((point, index) => ({ date: point.date, value: point.value - points[index].value }));
  return points;
}

async function loadIndicator(indicator: typeof indicators[number]) {
  const response = await fetch(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${indicator.id}`, { next: { revalidate: 21600 } });
  if (!response.ok) throw new Error(`FRED_${indicator.id}_${response.status}`);
  const raw = parseFredCsv(await response.text(), indicator.id);
  const transformed = transform(raw, indicator.transform).slice(-24);
  if (transformed.length < 2) throw new Error(`FRED_${indicator.id}_EMPTY`);
  return transformed;
}

function MiniLineChart({ points, label }: { points: Point[]; label: string }) {
  const width = 560, height = 180, padX = 12, padY = 18;
  const values = points.map((point) => point.value);
  const min = Math.min(...values), max = Math.max(...values), range = Math.max(max - min, 0.0001);
  const x = (index: number) => padX + index / Math.max(points.length - 1, 1) * (width - padX * 2);
  const y = (value: number) => padY + (max - value) / range * (height - padY * 2);
  const path = points.map((point, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(point.value).toFixed(1)}`).join(" ");
  const zeroY = min < 0 && max > 0 ? y(0) : null;
  return <svg className="macroSvg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
    <defs><linearGradient id={`fill-${label.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8292ff" stopOpacity=".28" /><stop offset="100%" stopColor="#8292ff" stopOpacity="0" /></linearGradient></defs>
    {[0, .25, .5, .75, 1].map((ratio) => <line key={ratio} x1="0" x2={width} y1={padY + ratio * (height - padY * 2)} y2={padY + ratio * (height - padY * 2)} className="macroGridLine" />)}
    {zeroY != null && <line x1="0" x2={width} y1={zeroY} y2={zeroY} className="macroZeroLine" />}
    <path d={`${path} L${x(points.length - 1)},${height - padY} L${x(0)},${height - padY} Z`} className="macroArea" style={{ fill: `url(#fill-${label.replace(/[^a-z0-9]/gi, "")})` }} />
    <path d={path} className="macroLine" />
    <circle cx={x(points.length - 1)} cy={y(points.at(-1)!.value)} r="4" className="macroLastDot" />
  </svg>;
}

export async function MacroIndicatorDashboard() {
  const results = await Promise.all(indicators.map(async (indicator) => {
    try { return { indicator, points: await loadIndicator(indicator), error: false }; }
    catch { return { indicator, points: [] as Point[], error: true }; }
  }));
  const available = results.filter((result) => !result.error);

  return <section className="macroDashboard" aria-labelledby="macro-dashboard-title">
    <div className="macroIntro"><div><span className="eyebrow">MARKET-SENSITIVE ECONOMIC INDICATORS</span><h2 id="macro-dashboard-title">Inflation, employment and interest rates</h2><p>Actual published observations—not forecasts. Each chart retains the official observation date and unit.</p></div><a href="https://fred.stlouisfed.org/" target="_blank" rel="noreferrer">Verify at FRED ↗</a></div>
    <div className="macroStatus"><span className={available.length === indicators.length ? "connected" : "partial"}>{available.length}/{indicators.length} OFFICIAL SERIES AVAILABLE</span><small>Server cache: 6 hours · Publication delays vary by series</small></div>
    <div className="macroGrid">{results.map(({ indicator, points, error }) => {
      const latest = points.at(-1);
      const previous = points.at(-2);
      const change = latest && previous ? latest.value - previous.value : null;
      return <article className="macroCard" key={indicator.id}><div className="macroCardHead"><div><small>{indicator.short} · UNITED STATES</small><h3>{indicator.title}</h3></div>{latest ? <div className="macroLatest"><strong>{latest.value.toFixed(indicator.unit.includes("thousand") ? 0 : 2)}</strong><span>{indicator.unit}</span></div>:<span className="connectionBadge awaiting">UNAVAILABLE</span>}</div>{error ? <div className="macroUnavailable">Official series could not be loaded. No placeholder graph is shown.</div>:<><MiniLineChart points={points} label={indicator.title} /><div className="macroMeta"><span>{points[0].date} — {latest!.date}</span><span className={change == null ? "" : change > 0 ? "positiveReturn" : change < 0 ? "negativeReturn" : ""}>Latest change {change == null ? "—" : `${change > 0 ? "+" : ""}${change.toFixed(2)}`}</span></div></>}<p>{indicator.impact}</p><a href={`https://fred.stlouisfed.org/series/${indicator.id}`} target="_blank" rel="noreferrer">{indicator.source} · FRED series {indicator.id} ↗</a></article>;
    })}</div>
    <div className="koreaMacroPending"><div><span className="eyebrow">KOREA DATA</span><strong>BOK ECOS / KOSIS connection required</strong><p>Korean inflation, employment and policy indicators will not be inferred from secondary sources. They will be added after official API access is configured.</p></div><div><a href="https://ecos.bok.or.kr/" target="_blank" rel="noreferrer">BOK ECOS ↗</a><a href="https://kosis.kr/" target="_blank" rel="noreferrer">KOSIS ↗</a></div></div>
    <p className="chartDisclosure">Economic indicators can affect markets through several channels, but they do not determine stock prices by themselves. This dashboard is informational and not investment advice.</p>
  </section>;
}
