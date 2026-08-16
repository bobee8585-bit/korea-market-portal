import { notFound } from "next/navigation";
import { InfoPage } from "@/components/info-page";
import { industryCatalog } from "@/lib/industry-catalog";
import { getIndustry, getStageGuide, industryStageSlug } from "@/lib/industry-stage-catalog";

export function generateStaticParams() { return industryCatalog.map((industry) => ({ slug: industry.slug })); }

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();
  return <InfoPage eyebrow={industry.koreanName} title={industry.name} intro={industry.summary}>
    <div className="industryDetailActions"><a href="/industries">← All industries</a><a href={`/companies?q=${encodeURIComponent(industry.name)}`}>Search connected companies →</a></div>
    <section className="evidenceNotice"><strong>Evidence boundary</strong><p>This explorer maps the value chain. It does not rank companies or claim production capacity unless a dated, comparable primary source supports that statement.</p></section>
    <div className="industryStageExplorer">{industry.chain.map((stage, index) => { const guide = getStageGuide(slug, stage); return <a href={`/industries/${slug}/${industryStageSlug(stage)}`} key={stage}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{stage}</h2><p>{guide.scope}</p><small>{guide.productFamilies.slice(0, 3).join(" · ")}</small></div><strong>Open stage →</strong></a>; })}</div>
    <section className="panel industryOfficialPanel"><span className="eyebrow">OFFICIAL STARTING SOURCES</span><div className="sourceList">{industry.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><small>{source.type}</small><strong>{source.name}</strong><span>Open original source ↗</span></a>)}</div></section>
  </InfoPage>;
}
