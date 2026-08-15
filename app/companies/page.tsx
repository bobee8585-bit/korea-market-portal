import { db } from "@/lib/db";

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
            { nameKo: { contains: query, mode: "insensitive" } },
            { nameEn: { contains: query, mode: "insensitive" } },
            { aliases: { some: { alias: { contains: query, mode: "insensitive" } } } },
          ],
        },
        orderBy: [{ country: "asc" }, { nameEn: "asc" }, { nameKo: "asc" }],
        take: 50,
        select: {
          id: true,
          ticker: true,
          nameKo: true,
          nameEn: true,
          country: true,
          market: true,
          roles: {
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
        </nav>
      </header>

      <section className="searchHero">
        <span className="eyebrow">COMPANY SEARCH</span>
        <h1>Find a company by name or ticker.</h1>
        <p>Search Korean listed companies and global ecosystem companies already in the verified graph.</p>
        <form action="/companies" method="get" className="companySearchForm">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Samsung Electronics, SK hynix, 005930…"
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

        {!query && <p>Enter a company name, Korean name or stock ticker above.</p>}
        {query && companies.length === 0 && <p>No matching companies were found.</p>}

        <div className="companyResultGrid">
          {companies.map((company) => {
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

            return company.ticker ? (
              <a className="companyResultCard" href={`/companies/${company.ticker}`} key={company.id}>
                {content}
              </a>
            ) : (
              <article className="companyResultCard" key={company.id}>
                {content}
                <span className="mutedLine">Global profile route coming next.</span>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
