import { notFound } from "next/navigation";
import { EvidenceStatus } from "@prisma/client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

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

export default async function EcosystemComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const ecosystem = await db.ecosystem.findUnique({
    where: { slug },
    include: {
      stages: {
        orderBy: { sequence: "asc" },
        include: {
          companyRoles: {
            where: { evidenceStatus: { in: publicEvidence } },
            include: { company: true, product: true },
          },
        },
      },
      clusters: {
        where: { evidenceStatus: { in: publicEvidence } },
        include: {
          companies: { where: { evidenceStatus: { in: publicEvidence } } },
          factories: { where: { evidenceStatus: { in: publicEvidence } } },
        },
      },
    },
  });

  if (!ecosystem) notFound();

  const countries = Array.from(
    new Set(
      ecosystem.stages.flatMap((stage) => stage.companyRoles.map((role) => role.company.country)),
    ),
  ).sort((a, b) => (a === "KR" ? -1 : b === "KR" ? 1 : a.localeCompare(b)));

  const countryStats = countries.map((country) => {
    const roles = ecosystem.stages.flatMap((stage) =>
      stage.companyRoles.filter((role) => role.company.country === country),
    );
    const companies = new Set(roles.map((role) => role.company.id));
    const products = new Set(roles.flatMap((role) => (role.product ? [role.product.name] : [])));
    const clusters = ecosystem.clusters.filter((cluster) => cluster.country === country);
    const factories = new Set(clusters.flatMap((cluster) => cluster.factories.map((item) => item.factoryId)));
    return {
      country,
      companies: companies.size,
      products: products.size,
      clusters: clusters.length,
      factories: factories.size,
    };
  });

  return (
    <main className="shell comparePage">
      <header className="topbar">
        <a href="/" className="brandBlock">
          <div className="brand">Korea Market Portal</div>
          <div className="subtitle">Global Industry Intelligence</div>
        </a>
        <nav className="nav" aria-label="Ecosystem compare navigation">
          <a href={`/ecosystems/${ecosystem.slug}`}>Explorer</a>
          <a href={`/ecosystems/${ecosystem.slug}/compare`} className="active">Compare</a>
          <a href="/mega-factories">Mega Factories</a>
          <a href="/clusters">Clusters</a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">ECOSYSTEM COMPARE</span>
          <h1>{ecosystem.name}: compare roles, not investment appeal.</h1>
          <p>
            This view compares verified industrial participation by value-chain stage. It does not rank countries or companies and does not convert industrial data into buy, sell or investment-attractiveness signals.
          </p>
        </div>
        <div className="policyCard">
          <strong>Comparison rule</strong>
          <span>• Same value-chain stage before company comparison.</span>
          <span>• Supplier and competitor roles remain distinct.</span>
          <span>• Only approved evidence is counted.</span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">COUNTRY FOOTPRINT</span>
            <h2>Verified ecosystem coverage</h2>
          </div>
        </div>
        <div className="compareSummaryGrid">
          {countryStats.map((item) => (
            <article className="compareSummaryCard" key={item.country}>
              <span>{item.country}</span>
              <strong>{item.companies} companies</strong>
              <small>{item.products} products · {item.clusters} hubs · {item.factories} linked sites</small>
            </article>
          ))}
        </div>
      </section>

      <section className="panel compareMatrixPanel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">VALUE-CHAIN MATRIX</span>
            <h2>Where verified companies sit</h2>
          </div>
        </div>

        {countries.length === 0 ? (
          <div className="emptyState">
            <h3>No verified roles are published yet.</h3>
            <p>The matrix will populate only after evidence-backed company roles are available.</p>
          </div>
        ) : (
          <div className="compareTableWrap">
            <table className="compareTable">
              <thead>
                <tr>
                  <th>Value-chain stage</th>
                  {countries.map((country) => <th key={country}>{country}</th>)}
                </tr>
              </thead>
              <tbody>
                {ecosystem.stages.map((stage) => (
                  <tr key={stage.id}>
                    <th>
                      <span>{String(stage.sequence).padStart(2, "0")}</span>
                      <strong>{stage.name}</strong>
                    </th>
                    {countries.map((country) => {
                      const roles = stage.companyRoles.filter((role) => role.company.country === country);
                      return (
                        <td key={`${stage.id}-${country}`}>
                          {roles.length === 0 ? (
                            <span className="matrixEmpty">—</span>
                          ) : (
                            <div className="matrixCompanies">
                              {roles.map((role) => (
                                <a key={role.id} href={companyHref(role.company)} className="matrixCompany">
                                  <strong>{role.company.nameEn || role.company.nameKo}</strong>
                                  <small>{role.product?.name || role.roleType.replaceAll("_", " ")}</small>
                                  <small>{role.roleType.replaceAll("_", " ")}</small>
                                </a>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
