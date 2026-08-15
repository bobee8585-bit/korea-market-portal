import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const publicEvidence = [EvidenceStatus.REGULATOR_CONFIRMED, EvidenceStatus.GOVERNMENT_CONFIRMED, EvidenceStatus.COMPANY_CONFIRMED, EvidenceStatus.LICENSED_SOURCE];

export default async function NewsPage() {
  const items = await db.externalContentLink.findMany({ where: { evidenceStatus: { in: publicEvidence } }, orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }], take: 150 });
  return <main className="shell">
    <header className="topbar"><a href="/" className="brandBlock"><div className="brand">Korea Market Portal</div><div className="subtitle">Global Industry Intelligence</div></a><nav className="nav"><a href="/companies">Companies</a><a href="/news" className="active">News & Research</a><a href="/market-events">Market Events</a><a href="/ma">M&A</a></nav></header>
    <section className="hero"><div><span className="eyebrow">NEWS & RESEARCH LINKS</span><h1>Translate only what the rights policy allows. Link everything else to the original.</h1><p>Media and broker research default to link-only handling. A translated title appears only when the source record explicitly permits translation.</p></div><div className="policyCard"><strong>Rights rule</strong><span>• LINK_ONLY content is not translated or AI-analyzed.</span><span>• Licensed or official content may enable translation.</span><span>• Original source remains one click away.</span></div></section>
    <section className="panel"><div className="panelHeader"><div><span className="eyebrow">SOURCE FEED</span><h2>{items.length} verified links</h2></div></div>{items.length===0?<div className="emptyState"><h3>No external links ingested yet.</h3><p>Approved news, research, IR and policy links will appear here.</p></div>:<div className="stackList">{items.map(item=><a className="listRow" key={item.id} href={item.originalUrl} target="_blank" rel="noreferrer"><div><strong>{item.translationAllowed&&item.translatedTitle?item.translatedTitle:item.title}</strong><p>{item.sourceName} · {item.contentType.replaceAll("_"," ")}{item.translationAllowed&&item.translatedTitle?` · original: ${item.title}`:""}</p></div><div className="listMeta"><span>{item.rightsType.replaceAll("_"," ")}</span><span>{item.publishedAt?item.publishedAt.toISOString().slice(0,10):"source"} ↗</span></div></a>)}</div>}</section>
  </main>;
}
