import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const publicEvidence = [EvidenceStatus.REGULATOR_CONFIRMED, EvidenceStatus.GOVERNMENT_CONFIRMED, EvidenceStatus.COMPANY_CONFIRMED, EvidenceStatus.LICENSED_SOURCE];

export default async function MnaPage() {
  const items = await db.mnaEvent.findMany({ where: { evidenceStatus: { in: publicEvidence } }, orderBy: { announcedAt: "desc" }, take: 100 });
  return <main className="shell">
    <header className="topbar"><a href="/" className="brandBlock"><div className="brand">Korea Market Portal</div><div className="subtitle">Global Industry Intelligence</div></a><nav className="nav"><a href="/global-money">Global Money</a><a href="/ma" className="active">M&A</a><a href="/news">News & Research</a><a href="/market-events">Market Events</a></nav></header>
    <section className="hero"><div><span className="eyebrow">GLOBAL M&A</span><h1>Track announced corporate combinations and ownership changes.</h1><p>Transactions are presented as factual events with source, status and announced value when officially available. No deal is converted into a trading view.</p></div><div className="policyCard"><strong>Deal rule</strong><span>• Official or rights-cleared evidence.</span><span>• Announced, pending and completed are distinct.</span><span>• No investment recommendation.</span></div></section>
    <section className="panel"><div className="panelHeader"><div><span className="eyebrow">VERIFIED DEALS</span><h2>{items.length} records</h2></div></div>{items.length===0?<div className="emptyState"><h3>No M&A events ingested yet.</h3><p>Officially evidenced transactions will appear here.</p></div>:<div className="stackList">{items.map(item=><a className="listRow" key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer"><div><strong>{item.acquirerName} → {item.targetName}</strong><p>{item.ecosystemSlug||"cross-industry"}{item.dealValueUsd?` · disclosed value $${item.dealValueUsd.toString()}`:""}</p></div><div className="listMeta"><span>{item.status.replaceAll("_"," ")}</span><span>{item.announcedAt.toISOString().slice(0,10)} ↗</span></div></a>)}</div>}</section>
  </main>;
}
