import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";

const publicEvidence = [
  EvidenceStatus.REGULATOR_CONFIRMED,
  EvidenceStatus.GOVERNMENT_CONFIRMED,
  EvidenceStatus.COMPANY_CONFIRMED,
  EvidenceStatus.LICENSED_SOURCE,
];

function companyHref(company: { ticker: string | null; slug: string | null; country: string }) {
  const identifier = company.country === "KR" && company.ticker ? company.ticker : company.slug || company.ticker;
  return identifier ? `/companies/${identifier}` : "#";
}

export default async function IndustryClustersPage() {
  const clusters = await db.industryCluster.findMany({
    where: { evidenceStatus: { in: publicEvidence } },
    include: {
      ecosystem: true,
      companies: {
        where: { evidenceStatus: { in: publicEvidence } },
        include: { company: true },
      },
      factories: {
        where: { evidenceStatus: { in: publicEvidence } },
        include: { factory: { include: { company: true } } },
      },
    },
    orderBy: [{ country: "asc" }, { region: "asc" }, { name: "asc" }],
  });

  const countryComparison = [...new Set(clusters.map((cluster) => cluster.country))]
    .map((country) => {
      const countryClusters = clusters.filter((cluster) => cluster.country === country);
      const companies = new Set(
        countryClusters.flatMap((cluster) => cluster.companies.map((membership) => membership.company.id)),
      );
      const factories = new Set(
        countryClusters.flatMap((cluster) => cluster.factories.map((membership) => membership.factory.id)),
      );
      const ecosystems = new Set(countryClusters.map((cluster) => cluster.ecosystem.id));
      return {
        country,
        clusters: countryClusters.length,
        companies: companies.size,
        factories: factories.size,
        ecosystems: ecosystems.size,
      };
    })
    .sort((a, b) => b.clusters - a.clusters || b.factories - a.factories || a.country.localeCompare(b.country));

  return (
    <main className="shell">
      <header className="topbar">
        <a href="/" className="brandBlock">
          <div className="brand">Korea Market Portal</div>
          <div className="subtitle">Global Industry Intelligence</div>
        </a>
        <nav className="nav" aria-label="Industry cluster navigation">
          <a href="/ecosystems/semiconductor">Ecosystems</a>
          <a href="/mega-factories">Mega Factories</a>
          <a href="/clusters" className="active">Industry Clusters</a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">INDUSTRY CLUSTER EXPLORER</span>
          <h1>Compare how industrial ecosystems concentrate across regions and countries.</h1>
          <p>
            A cluster is not a single factory. It groups verified companies and production sites that belong to the same regional industrial ecosystem, while preserving the difference between official government-designated clusters and service-level regional manufacturing hubs.
          </p>
        </div>
        <div className="policyCard">
          <strong>Cluster evidence rule</strong>
          <span>• Cluster membership needs an approved source.</span>
          <span>• Company and factory membership are verified separately.</span>
          <span>• Service-defined hubs are not presented as government-designated clusters.</span>
        </div>
      </section>

      {countryComparison.length > 0 && (
        <section className="panel">
          <div className="panelHeader">
            <div>
              <span className="eyebrow">COUNTRY ECOSYSTEM COMPARISON</span>
              <h2>Verified regional semiconductor footprint</h2>
            </div>
          </div>
          <div className="grid3">
            {countryComparison.map((item) => (
              <article className="stage" key={item.country}>
                <span>{item.country}</span>
                <h3>{item.clusters} regional hubs</h3>
                <p>{item.companies} verified companies · {item.factories} linked production sites · {item.ecosystems} ecosystems</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">VERIFIED REGIONAL ECOSYSTEMS</span>
            <h2>{clusters.length} published clusters and hubs</h2>
          </div>
        </div>

        {clusters.length === 0 ? (
          <div className="emptyState">
            <h3>No verified industry clusters published yet.</h3>
            <p>Clusters will appear only after official or rights-cleared evidence has been attached.</p>
          </div>
        ) : (
          <div className="clusterGrid">
            {clusters.map((cluster) => (
              <article className="clusterCard" key={cluster.id}>
                <div className="roleTopline">
                  <span>{cluster.country}</span>
                  <span>{cluster.evidenceStatus.replaceAll("_", " ")}</span>
                </div>
                <h3>{cluster.name}</h3>
                <p>{[cluster.city, cluster.region, cluster.country].filter(Boolean).join(", ")}</p>
                {cluster.description && <p>{cluster.description}</p>}

                <div className="clusterStats">
                  <span>{cluster.companies.length} verified companies</span>
                  <span>{cluster.factories.length} linked sites</span>
                  <span>{cluster.ecosystem.name}</span>
                </div>

                <div className="clusterSection">
                  <strong>Companies</strong>
                  {cluster.companies.length === 0 ? (
                    <p>No public company memberships yet.</p>
                  ) : (
                    cluster.companies.map((membership) => (
                      <a key={membership.id} href={companyHref(membership.company)} className="clusterMember">
                        <span>{membership.company.nameEn || membership.company.nameKo}</span>
                        <small>{membership.roleLabel || "Verified cluster member"}</small>
                      </a>
                    ))
                  )}
                </div>

                <div className="clusterSection">
                  <strong>Production sites</strong>
                  {cluster.factories.length === 0 ? (
                    <p>No linked public sites yet.</p>
                  ) : (
                    cluster.factories.map((membership) => (
                      <div key={membership.id} className="clusterMember">
                        <span>{membership.factory.name}</span>
                        <small>{membership.factory.status.replaceAll("_", " ")}</small>
                      </div>
                    ))
                  )}
                </div>

                {cluster.sourceUrl && (
                  <a className="sourceLink" href={cluster.sourceUrl} target="_blank" rel="noreferrer">
                    Official evidence ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
