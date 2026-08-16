import { EvidenceStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { InfoPage } from "@/components/info-page";
import { industryCatalog } from "@/lib/industry-catalog";
import { getIndustry, getStageGuide, industryStageSlug } from "@/lib/industry-stage-catalog";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const publicEvidence = [EvidenceStatus.REGULATOR_CONFIRMED, EvidenceStatus.GOVERNMENT_CONFIRMED, EvidenceStatus.COMPANY_CONFIRMED, EvidenceStatus.LICENSED_SOURCE];

export function generateStaticParams() { return industryCatalog.flatMap((industry) => industry.chain.map((stage) => ({ slug: industry.slug, stage: industryStageSlug(stage) }))); }

export default async function IndustryStagePage({ params }: { params: Promise<{ slug: string; stage: string }> }) {
  const { slug, stage: stageSlug } = await params;
  const industry = getIndustry(slug);
  const stages: readonly string[] = industry?.chain ?? [];
  const stageName = stages.find((item) => industryStageSlug(item) === stageSlug);
  if (!industry || !stageName) notFound();
  const guide = getStageGuide(slug, stageName);
  const stageIndex = stages.indexOf(stageName);
  const relatedCompanies = await db.company.findMany({
    where: {
      isActive: true,
      roles: { some: { ecosystem: { slug }, stage: { name: stageName }, evidenceStatus: { in: publicEvidence }, sourceUrl: { not: null } } },
    },
    orderBy: [{ nameEn: "asc" }, { nameKo: "asc" }],
    take: 24,
    select: {
      id: true, ticker: true, slug: true, country: true, nameKo: true, nameEn: true,
      roles: {
        where: { ecosystem: { slug }, stage: { name: stageName }, evidenceStatus: { in: publicEvidence }, sourceUrl: { not: null } },
        select: { roleType: true, sourceUrl: true, verifiedAt: true, product: { select: { name: true } } },
      },
    },
  });
  return <InfoPage eyebrow={`${industry.koreanName} · STAGE ${String(stageIndex + 1).padStart(2, "0")}`} title={stageName} intro={guide.scope}>
    <div className="industryDetailActions"><a href={`/industries/${slug}`}>← {industry.name}</a><a href={`/companies?q=${encodeURIComponent(stageName)}`}>Search related companies →</a></div>
    <div className="stageDetailGrid"><section className="panel"><span className="eyebrow">PRODUCT & SERVICE FAMILIES</span><h2>What this stage covers</h2><ul className="linkedProductFamilies">{guide.productFamilies.map((item) => <li key={item}><a href={`/companies?q=${encodeURIComponent(item)}`}>{item}<small>Find verified companies →</small></a></li>)}</ul></section><section className="panel"><span className="eyebrow">PUBLICATION CHECK</span><h2>What must be verified</h2><ul>{guide.verification.map((item) => <li key={item}>{item}</li>)}</ul></section></div>
    <section className="panel verifiedStageCompanies"><div className="panelHeader"><div><span className="eyebrow">EVIDENCE-GATED COMPANY LINKS</span><h2>Verified companies at this stage</h2></div><span className="countBadge">{relatedCompanies.length} published</span></div>
      {relatedCompanies.length === 0 ? <p>No company is published for this stage yet. A company appears only after a company-specific source confirms its role; absence here does not mean the company is absent from the industry.</p> : <div className="verifiedCompanyGrid">{relatedCompanies.map((company) => {
        const identifier = company.country === "KR" && company.ticker ? company.ticker : company.slug || company.ticker;
        return <article className="verifiedCompanyCard" key={company.id}><small>{company.country} · {company.roles[0]?.roleType.replaceAll("_", " ")}</small><h3>{company.nameEn || company.nameKo}</h3><p>{company.nameKo}{company.roles[0]?.product ? ` · ${company.roles[0].product.name}` : ""}</p><div>{identifier && <a href={`/companies/${identifier}`}>Open profile →</a>}{company.roles[0]?.sourceUrl && <a href={company.roles[0].sourceUrl} target="_blank" rel="noreferrer">Original evidence ↗</a>}</div></article>;
      })}</div>}
    </section>
    <section className="panel stageSourcePanel"><div className="panelHeader"><div><span className="eyebrow">PRIMARY SOURCES</span><h2>Continue with original records</h2></div></div><div className="sourceList">{industry.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><small>{source.type}</small><strong>{source.name}</strong><span>Open original source ↗</span></a>)}</div><p className="sourceMethodNote">These links are research starting points, not evidence that every listed product family is manufactured by every member company. Company-level publication requires a company-specific source.</p></section>
    <nav className="stageSiblingNav" aria-label="Industry stages">{stages.map((item, index) => <a className={item === stageName ? "active" : ""} href={`/industries/${slug}/${industryStageSlug(item)}`} key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</a>)}</nav>
  </InfoPage>;
}
