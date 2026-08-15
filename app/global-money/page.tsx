import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const publicEvidence = [EvidenceStatus.REGULATOR_CONFIRMED, EvidenceStatus.GOVERNMENT_CONFIRMED, EvidenceStatus.COMPANY_CONFIRMED, EvidenceStatus.LICENSED_SOURCE];

export default async function GlobalMoneyPage() {
  const items = await db.institutionalDisclosure.findMany({
    where: { evidenceStatus: { in: publicEvidence } },
    orderBy: [{ reportedAt: "desc" }, { periodEnd: "desc" }],
    take: 100,
  });

  return <main className="shell">
    <header className="topbar"><a href="/" className="brandBlock"><div className="brand">Korea Market Portal</div><div className="subtitle">Global Industry Intelligence</div></a><nav className="nav"><a href="/companies">Companies</a><a href="/global-money" className="active">Global Money</a><a href="/ma">M&A</a><a href="/market-events">Market Events</a></nav></header>
    <section className="hero"><div><span className="eyebrow">GLOBAL MONEY</span><h1>Public institutional position disclosures, without investment signals.</h1><p>Track disclosed positions from pensions, funds and large institutions. Reporting periods and filing dates are kept separate so stale filings are not presented as real-time holdings.</p></div><div className="policyCard"><strong>Interpretation rule</strong><span>• Public disclosures only.</span><span>• Historical filing, not live portfolio.</span><span>• No buy/sell interpretation.</span></div></section>
    <section className="panel"><div className="panelHeader"><div><span className="eyebrow">DISCLOSURES</span><h2>{items.length} verified records</h2></div></div>{items.length===0?<div className="emptyState"><h3>No institutional disclosures ingested yet.</h3><p>Verified filings will appear after protected ingestion.</p></div>:<div className="stackList">{items.map(item=><a className="listRow" key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer"><div><strong>{item.managerName} → {item.targetCompanyName}</strong><p>{item.positionType} · period {item.periodEnd.toISOString().slice(0,10)}</p></div><div className="listMeta"><span>{item.managerCountry||"GLOBAL"}</span><span>reported {item.reportedAt.toISOString().slice(0,10)} ↗</span></div></a>)}</div>}</section>
  </main>;
}
