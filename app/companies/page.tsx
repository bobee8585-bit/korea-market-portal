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
  return identifier ? `/companies/${identifier}` : null;
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const companies = query
    ? await db.company.findMany({
        where: {
          isActive: true,
          OR: [
            { ticker: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { nameKo: { contains: query, mode: "insensitive" } },
            { nameEn: { contains: query, mode: "insensitive" } },
            { aliases: { some: { alias: { contains: query, mode: "insensitive" } } } },
            { roles: { some: { evidenceStatus: { in: publicEvidence }, sourceUrl: { not: null }, product: { name: { contains: query, mode: "insensitive" } } } } },
            { roles: { some: { evidenceStatus: { in: publicEvidence }, sourceUrl: { not: null }, stage: { name: { contains: query, mode: "insensitive" } } } } },
            { roles: { some: { evidenceStatus: { in: publicEvidence }, sourceUrl: { not: null }, ecosystem: { name: { contains: query, mode: "insensitive" } } } } },
          ],
        },
        orderBy: [{ country: "asc" }, { nameEn: "asc" }, { nameKo: "asc" }],
        take: 50,
        select: {
          id: true,
          ticker: true,
          slug: true,
          nameKo: true,
          nameEn: true,
          country: true,
          market: true,
          roles: {
            where: { evidenceStatus: { in: publicEvidence } },
            take: 3,
            select: {
              roleType: true,
              ecosystem: { select: { name: true, slug: true } },
              product: { select: { name: true } },
            },
          },
        },
      })
    : [];

  return (
    <main className="shell companySearchPage">
      <header className="topbar">
        <a href="/" className="brandBlock">
          <div className="brand">Korea Market Portal</div>
          <div className="subtitle">Global Industry Intelligence</div>
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/companies" className="active">Companies</a>
          <a href="/ecosystems/semiconductor">Ecosystems</a>
          <a href="/ecosystems/semiconductor/compare">Compare</a>
        </nav>
      </header>

      <section className="searchHero">
        <span className="eyebrow">COMPANY SEARCH</span>
        <h1>Find a company by name or ticker.</h1>
        <p>Search Korean listed companies and global ecosystem companies by company name, ticker, verified product, value-chain stage or industry.</p>
        <form action="/companies" method="get" className="companySearchForm">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Company, ticker, product or stage — OLED, cathode, 005930…"
            aria-label="Search companies"
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">RESULTS</span>
            <h2>{query ? `Matches for “${query}”` : "Search the company database"}</h2>
          </div>
          {query && <span className="countBadge">{companies.length} results</span>}
        </div>

        {!query && <p>Enter a company name, Korean name, global company name or stock ticker above.</p>}
        {query && companies.length === 0 && <p>No matching companies were found.</p>}

        <div className="companyResultGrid">
          {companies.map((company) => {
            const href = companyHref(company);
            const content = (
              <>
                <div className="companyResultTopline">
                  <span>{company.country || "—"}</span>
                  <span>{company.market || "GLOBAL"}</span>
                </div>
                <h3>{company.nameEn || company.nameKo}</h3>
                <p>{company.nameKo}{company.ticker ? ` · ${company.ticker}` : ""}</p>
                {company.roles.length > 0 && (
                  <div className="resultTags">
                    {company.roles.map((role, index) => (
                      <span key={`${company.id}-${index}`}>
                        {role.ecosystem.name}{role.product ? ` · ${role.product.name}` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </>
            );

            return href ? (
              <a className="companyResultCard" href={href} key={company.id}>
                {content}
              </a>
            ) : (
              <article className="companyResultCard" key={company.id}>
                {content}
                <span className="mutedLine">Profile unavailable until a stable identifier is verified.</span>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
