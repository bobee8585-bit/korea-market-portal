const ecosystemStages = [
  "Materials",
  "Equipment",
  "Design",
  "Wafer / Fab",
  "Memory / Foundry",
  "Packaging",
  "Testing",
  "End Market",
];

const principles = [
  "Official or rights-cleared data first",
  "News and broker research default to LINK_ONLY",
  "No direct investment recommendations or trading instructions",
  "Every ecosystem relation requires evidence",
];

const ecosystems = [
  ["Semiconductor", "semiconductor"],
  ["Battery", "battery"],
  ["Automotive / EV", "automotive-ev"],
  ["Shipbuilding", "shipbuilding"],
] as const;

export default function HomePage() {
  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <div className="brand">Korea Market Portal</div>
          <div className="subtitle">Global Industry Intelligence</div>
        </div>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#markets">Markets</a>
          <a href="/companies">Companies</a>
          <a href="#disclosures">Disclosures</a>
          <a href="#ecosystems" className="active">Ecosystems</a>
          <a href="#global-money">Global Money</a>
          <a href="#ma">M&A</a>
        </nav>
      </header>

      <section className="hero" id="ecosystems">
        <div>
          <span className="eyebrow">FOUNDATION v0.1</span>
          <h1>See where Korean companies sit inside global industrial ecosystems.</h1>
          <p>
            The portal connects industries, products, companies, factories, official events,
            disclosures and evidence without turning those facts into trading advice.
          </p>
          <form action="/companies" method="get" className="companySearchForm homeSearch">
            <input
              type="search"
              name="q"
              placeholder="Search company or ticker — Samsung Electronics, 005930…"
              aria-label="Search companies"
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="policyCard">
          <strong>Safety by design</strong>
          {principles.map((item) => <span key={item}>• {item}</span>)}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">GLOBAL INDUSTRY ECOSYSTEMS</span>
            <h2>Explore the first four value chains</h2>
          </div>
        </div>
        <div className="grid3">
          {ecosystems.map(([name, slug]) => (
            <article className="stage" key={slug}>
              <span>ECOSYSTEM</span>
              <h3>{name}</h3>
              <p>Open the live database-backed ecosystem explorer.</p>
              <a href={`/ecosystems/${slug}`}>Explore →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">SEMICONDUCTOR ECOSYSTEM</span>
            <h2>Global value chain</h2>
          </div>
          <a href="/ecosystems/semiconductor">Open Explorer</a>
        </div>
        <div className="stages">
          {ecosystemStages.map((stage, index) => (
            <article className="stage" key={stage}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{stage}</h3>
              <p>Companies, products, factories and verified relations will appear here.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid3">
        <article className="panel compact">
          <span className="eyebrow">OFFICIAL DISCLOSURES</span>
          <h2>OpenDART pipeline</h2>
          <p>Company master sync, receipt-number deduplication and official filing links.</p>
        </article>
        <article className="panel compact">
          <span className="eyebrow">RIGHTS CONTROL</span>
          <h2>Link-first external content</h2>
          <p>Unlicensed media and broker research cannot be stored, translated or summarized.</p>
        </article>
        <article className="panel compact">
          <span className="eyebrow">EVIDENCE ENGINE</span>
          <h2>No unsupported relationships</h2>
          <p>Supply, peer and factory connections require a traceable approved source.</p>
        </article>
      </section>
    </main>
  );
}
