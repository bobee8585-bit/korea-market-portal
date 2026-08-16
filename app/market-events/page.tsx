import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { OfficialSourceHub } from "@/components/official-source-hub";

export const dynamic = "force-dynamic";

const publicEvidence = [EvidenceStatus.REGULATOR_CONFIRMED, EvidenceStatus.GOVERNMENT_CONFIRMED, EvidenceStatus.COMPANY_CONFIRMED, EvidenceStatus.LICENSED_SOURCE];

export default async function MarketEventsPage() {
  const items = await db.marketImpactEvent.findMany({ where: { evidenceStatus: { in: publicEvidence } }, orderBy: { occurredAt: "desc" }, take: 150 });
  return <main className="shell">
    <header className="topbar"><a href="/" className="brandBlock"><div className="brand">Korea Market Portal</div><div className="subtitle">Global Industry Intelligence</div></a><nav className="nav"><a href="/ecosystems/semiconductor">Ecosystems</a><a href="/news">News & Research</a><a href="/market-events" className="active">Market Events</a><a href="/ma">M&A</a></nav></header>
    <section className="hero"><div><span className="eyebrow">MARKET-RELEVANT EVENTS</span><h1>Explain why a verified global event is connected to a Korean company or industry.</h1><p>Relevance notes describe the factual transmission path—policy, supply chain, factory, technology or ownership. They never predict price direction or tell a user to trade.</p></div><div className="policyCard"><strong>Analysis boundary</strong><span>• Evidence-backed event first.</span><span>• Relevance, not price prediction.</span><span>• No target price or buy/sell language.</span></div></section>
    <section className="panel"><div className="panelHeader"><div><span className="eyebrow">EVENT TIMELINE</span><h2>{items.length} verified events</h2></div></div>{items.length===0?<div className="emptyState"><h3>No market-impact events ingested yet.</h3><p>Verified global events and neutral relevance notes will appear here.</p></div>:<div className="stackList">{items.map(item=><a className="listRow" key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer"><div><strong>{item.title}</strong><p>{item.relevanceNote||"Verified event; relevance note pending."}</p></div><div className="listMeta"><span>{item.eventType.replaceAll("_"," ")}{item.country?` · ${item.country}`:""}</span><span>{item.occurredAt.toISOString().slice(0,10)} ↗</span></div></a>)}</div>}</section>
    {items.length === 0 && <OfficialSourceHub section="marketEvents" />}
  </main>;
}
