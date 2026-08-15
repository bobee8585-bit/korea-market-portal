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

export default async function MegaFactoriesPage() {
  const factories = await db.factory.findMany({
    where: { evidenceStatus: { in: publicEvidence } },
    include: {
      company: true,
      products: {
        where: { evidenceStatus: { in: publicEvidence } },
        include: { product: { include: { ecosystem: true, stage: true } } },
      },
    },
    orderBy: [{ country: "asc" }, { city: "asc" }, { name: "asc" }],
  });

  const countrySummary = [...new Set(factories.map((factory) => factory.country))]
    .map((country) => {
      const sites = factories.filter((factory) => factory.country === country);
      const companies = new Set(sites.map((factory) => factory.company.id));
      const products = new Set(sites.flatMap((factory) => factory.products.map((item) => item.product.name)));
      return { country, sites: sites.length, companies: companies.size, products: products.size };
    })
    .sort((a, b) => b.sites - a.sites || a.country.localeCompare(b.country));

  return (
    <main className="shell">
      <header className="topbar">
        <a href="/" className="brandBlock">
          <div className="brand">Korea Market Portal</div>
          <div className="subtitle">Global Industry Intelligence</div>
        </a>
        <nav className="nav" aria-label="Mega factory navigation">
          <a href="/ecosystems/semiconductor">Ecosystems</a>
          <a href="/companies">Companies</a>
          <a href="/mega-factories" className="active">Mega Factories</a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">MEGA FACTORY EXPLORER</span>
          <h1>See where global industrial capacity is physically built.</h1>
          <p>
            Production sites connect companies, products, industrial ecosystems and evidence.
            Capacity figures appear only when an approved source explicitly publishes them.
          </p>
        </div>
        <div className="policyCard">
          <strong>Factory evidence rule</strong>
          <span>• No estimated or rumored factory capacity.</span>
          <span>• Planned and operating facilities are clearly separated.</span>
          <span>• Every public site requires approved evidence.</span>
        </div>
      </section>

      {countrySummary.length > 0 && (
        <section className="panel">
          <div className="panelHeader">
            <div>
              <span className="eyebrow">COUNTRY COMPARISON</span>
              <h2>Verified semiconductor production footprint</h2>
            </div>
          </div>
          <div className="grid3">
            {countrySummary.map((item) => (
              <article className="stage" key={item.country}>
                <span>{item.country}</span>
                <h3>{item.sites} verified sites</h3>
                <p>{item.companies} companies · {item.products} verified product categories</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">GLOBAL PRODUCTION FOOTPRINT</span>
            <h2>{factories.length} verified sites across {countrySummary.length} countries</h2>
          </div>
        </div>

        {factories.length === 0 ? (
          <div className="emptyState">
            <h3>No verified factory records published yet.</h3>
            <p>Sites will appear only after official evidence is reviewed and approved.</p>
          </div>
        ) : (
          <div className="factoryGrid">
            {factories.map((factory) => (
              <article className="factoryCard" key={factory.id}>
                <div className="roleTopline">
                  <span>{factory.country}</span>
                  <span>{factory.status.replaceAll("_", " ")}</span>
                </div>
                <h3>{factory.name}</h3>
                <p>{[factory.city, factory.region, factory.country].filter(Boolean).join(", ")}</p>
                <p>{factory.factoryType.replaceAll("_", " ")}</p>
                <a className="sourceLink" href={companyHref(factory.company)}>
                  {factory.company.nameEn || factory.company.nameKo} →
                </a>

                <div className="factoryProducts">
                  {factory.products.map((item) => (
                    <div className="factoryProduct" key={item.id}>
                      <strong>{item.product.name}</strong>
                      <span>{item.product.ecosystem.name}</span>
                      {item.productionRole && <span>{item.productionRole}</span>}
                      {item.capacityValue && item.capacityUnit ? (
                        <span>
                          Published capacity: {item.capacityValue.toString()} {item.capacityUnit}
                          {item.capacityYear ? ` (${item.capacityYear})` : ""}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>

                {factory.sourceUrl && (
                  <a className="sourceLink" href={factory.sourceUrl} target="_blank" rel="noreferrer">
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
