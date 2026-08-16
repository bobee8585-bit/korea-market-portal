import { notFound } from "next/navigation";
import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { ecosystemEvidenceCatalog } from "@/lib/ecosystem-evidence-catalog";

export const dynamic = "force-dynamic";

const publicEvidence = [
  EvidenceStatus.REGULATOR_CONFIRMED,
  EvidenceStatus.GOVERNMENT_CONFIRMED,
  EvidenceStatus.COMPANY_CONFIRMED,
  EvidenceStatus.LICENSED_SOURCE,
];

function companyHref(company: { ticker: string | null; slug: string | null; country: string }) {
  const identifier = company.country === "KR" && company.ticker ? company.ticker : company.slug || company.ticker;
  return identifier ? `/companies/${identifier}` : null;
}

export default async function EcosystemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ecosystem = await db.ecosystem.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      description: true,
      stages: {
        orderBy: { sequence: "asc" },
        select: {
          id: true,
          name: true,
          sequence: true,
          products: { select: { id: true, name: true, technologyGroup: true }, orderBy: { name: "asc" } },
          companyRoles: {
            where: { evidenceStatus: { in: publicEvidence } },
            select: {
              id: true,
              roleType: true,
              evidenceStatus: true,
              sourceUrl: true,
              company: {
                select: { id: true, ticker: true, slug: true, nameKo: true, nameEn: true, country: true },
              },
              product: { select: { id: true, name: true, technologyGroup: true } },
            },
          },
        },
      },
    },
  });

  if (!ecosystem) notFound();
  const sourceStartingPoints = ecosystemEvidenceCatalog[ecosystem.slug] ?? [];

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <a href="/" className="brand">Korea Market Portal</a>
          <div className="subtitle">Global Industry Ecosystem</div>
        </div>
        <nav className="nav" aria-label="Ecosystem navigation">
          <a href="/companies">Companies</a>
          <a href={`/ecosystems/${ecosystem.slug}`} className="active">Explorer</a>
          <a href={`/ecosystems/${ecosystem.slug}/compare`}>Compare</a>
          <a href="/mega-factories">Factories</a>
          <a href="/clusters">Clusters</a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">ECOSYSTEM EXPLORER</span>
          <h1>{ecosystem.name}</h1>
          <p>{ecosystem.description}</p>
        </div>
        <div className="policyCard">
          <strong>Evidence rule</strong>
          <span>Only regulator, government, company-confirmed or licensed relationships are public.</span>
          <span>Inferred and unverified relationships stay hidden.</span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">GLOBAL VALUE CHAIN</span>
            <h2>Stages and verified companies</h2>
          </div>
          <a href={`/ecosystems/${ecosystem.slug}/compare`} className="sourceLink">Compare countries and roles →</a>
        </div>
        <div className="stages">
          {ecosystem.stages.map((stage) => (
            <article className="stage" key={stage.id}>
              <span>{String(stage.sequence).padStart(2, "0")}</span>
              <h3>{stage.name}</h3>
              {stage.products.length > 0 && (
                <p>
                  {stage.products.map((product) =>
                    product.technologyGroup ? `${product.name} (${product.technologyGroup})` : product.name,
                  ).join(" · ")}
                </p>
              )}
              <div className="ecosystemCompanyList">
                {stage.companyRoles.length === 0 ? (
                  <p>Verified company relationships will appear after evidence review.</p>
                ) : (
                  stage.companyRoles.map((role) => {
                    const href = companyHref(role.company);
                    const label = (
                      <>
                        <strong>{role.company.nameEn || role.company.nameKo}</strong>
                        <span>{role.company.country || "—"}</span>
                        {role.product && <span>{role.product.name}</span>}
                        {role.product?.technologyGroup && <span>{role.product.technologyGroup}</span>}
                        <span>{role.roleType.replaceAll("_", " ")}</span>
                      </>
                    );

                    return (
                      <div className="ecosystemCompanyRow" key={role.id}>
                        {href ? (
                          <a className="ecosystemCompanyLink" href={href}>{label}</a>
                        ) : (
                          <div className="ecosystemCompanyLink disabledCompanyLink">{label}</div>
                        )}
                        {role.sourceUrl && (
                          <a className="sourceLink" href={role.sourceUrl} target="_blank" rel="noreferrer">
                            Source ↗
                          </a>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {sourceStartingPoints.length > 0 && <section className="panel ecosystemSources">
        <div className="panelHeader"><div><span className="eyebrow">OFFICIAL SOURCE STARTING POINTS</span><h2>Open the original evidence</h2></div></div>
        <p className="sourceMethodNote">These links identify relevant public source material. They are not counted as verified company roles until the specific relationship is reviewed and published in the database.</p>
        <div className="sourceList">{sourceStartingPoints.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><small>{source.sourceType} · {source.stage}</small><strong>{source.organisation}</strong><span>{source.title} ↗</span></a>)}</div>
      </section>}
    </main>
  );
}
