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

export default async function KoreaInsidePage() {
  const products = await db.product.findMany({
    where: {
      companyRoles: {
        some: {
          evidenceStatus: { in: publicEvidence },
          company: { country: "KR", isActive: true },
        },
      },
    },
    include: {
      ecosystem: true,
      stage: true,
      companyRoles: {
        where: { evidenceStatus: { in: publicEvidence }, company: { isActive: true } },
        include: { company: true },
        orderBy: { company: { country: "asc" } },
      },
    },
    orderBy: [{ ecosystem: { name: "asc" } }, { name: "asc" }],
  });

  return (
    <main className="shell">
      <header className="topbar">
        <a href="/" className="brandBlock">
          <div className="brand">Korea Market Portal</div>
          <div className="subtitle">Global Industry Intelligence</div>
        </a>
        <nav className="nav" aria-label="Korea Inside navigation">
          <a href="/ecosystems/semiconductor">Ecosystems</a>
          <a href="/ecosystems/semiconductor/compare">Compare</a>
          <a href="/korea-inside" className="active">Korea Inside</a>
          <a href="/mega-factories">Factories</a>
          <a href="/clusters">Clusters</a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">KOREA INSIDE</span>
          <h1>Discover where Korean companies participate inside global products and technologies.</h1>
          <p>
            Start from a product or technology, then see the verified Korean participants and comparable global companies in the same value-chain role. This is an industry-discovery view, not an investment ranking.
          </p>
        </div>
        <div className="policyCard">
          <strong>Discovery rule</strong>
          <span>• Korean participation requires approved evidence.</span>
          <span>• Global companies remain visible for context.</span>
          <span>• Role and product matching come before peer comparison.</span>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">VERIFIED PRODUCTS & TECHNOLOGIES</span>
            <h2>{products.length} areas with Korean participation</h2>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="emptyState">
            <h3>No verified Korea Inside relationships are published yet.</h3>
            <p>Products appear only after evidence-backed Korean company roles have been approved.</p>
          </div>
        ) : (
          <div className="grid3">
            {products.map((product) => {
              const koreanRoles = product.companyRoles.filter((role) => role.company.country === "KR");
              const globalRoles = product.companyRoles.filter((role) => role.company.country !== "KR");

              return (
                <article className="stage" key={product.id}>
                  <div className="roleTopline">
                    <span>{product.ecosystem.name}</span>
                    <span>{product.stage?.name || "Unassigned stage"}</span>
                  </div>
                  <h3>{product.name}</h3>
                  {product.technologyGroup && <p>{product.technologyGroup}</p>}

                  <div className="clusterSection">
                    <strong>Korean participants</strong>
                    {koreanRoles.map((role) => (
                      <a className="clusterMember" href={companyHref(role.company)} key={role.id}>
                        <span>{role.company.nameEn || role.company.nameKo}</span>
                        <small>{role.roleType.replaceAll("_", " ")}</small>
                      </a>
                    ))}
                  </div>

                  <div className="clusterSection">
                    <strong>Global context</strong>
                    {globalRoles.length === 0 ? (
                      <p>No other verified companies in this product yet.</p>
                    ) : (
                      globalRoles.map((role) => (
                        <a className="clusterMember" href={companyHref(role.company)} key={role.id}>
                          <span>{role.company.country} · {role.company.nameEn || role.company.nameKo}</span>
                          <small>{role.roleType.replaceAll("_", " ")}</small>
                        </a>
                      ))
                    )}
                  </div>

                  <a className="sourceLink" href={`/ecosystems/${product.ecosystem.slug}/compare`}>
                    Compare ecosystem →
                  </a>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
