import { DirectSponsorSlot } from "@/components/monetization";

const ecosystemStages = ["Materials", "Equipment", "Design", "Wafer / Fab", "Memory / Foundry", "Packaging", "Testing", "End Market"];
const principles = ["Official or rights-cleared data first", "News and broker research default to LINK_ONLY", "No direct investment recommendations or trading instructions", "Every ecosystem relation requires evidence"];
const ecosystems = [["Semiconductor", "semiconductor"], ["Battery", "battery"], ["Automotive / EV", "automotive-ev"], ["Shipbuilding", "shipbuilding"]] as const;

export default function HomePage() {
  return (
    <main className="shell">
      <header className="topbar">
        <div><div className="brand">KorPulse</div><div className="subtitle">Korea Industry Intelligence</div></div>
        <nav className="nav" aria-label="Primary navigation">
          <a href="/companies">Companies</a><a href="/industries">Industries</a><a href="#ecosystems" className="active">Ecosystems</a><a href="/people-who-built-korea">Industrial Journey</a><a href="/korea-inside">Korea Inside</a><a href="/news">News & Research</a><a href="/market-events">Market Events</a><a href="/global-money">Global Money</a><a href="/ma">M&A</a>
        </nav>
      </header>
      <section className="hero" id="ecosystems">
        <div><span className="eyebrow">MVP</span><h1>See where Korean companies sit inside global industrial ecosystems.</h1><p>The portal connects industries, products, companies, factories, institutional disclosures, global events, M&A, official filings and source links without turning those facts into trading advice.</p><form action="/companies" method="get" className="companySearchForm homeSearch"><input type="search" name="q" placeholder="Search company or ticker — Samsung Electronics, TSMC, 005930…" aria-label="Search companies" /><button type="submit">Search</button></form></div>
        <div className="policyCard"><strong>Safety by design</strong>{principles.map((item) => <span key={item}>• {item}</span>)}</div>
      </section>
      <DirectSponsorSlot />
      <a className="industryHomeFeature" href="/industries"><div><span className="eyebrow">BEYOND THE HEADLINES</span><h2>Food, chemicals, refining, steel and biohealth.</h2><p>Follow Korea's manufacturing systems from inputs and materials to production, logistics and global markets—with every major claim tied to evidence.</p></div><strong>Open the industry map →</strong></a>
      <a className="historyHomeFeature" href="/people-who-built-korea"><div><span className="eyebrow">THE PEOPLE WHO BUILT KOREA</span><h2>Built by people. Proven by industry.</h2><p>Explore Korea&apos;s industrial journey through official records—and remember the workers whose skill, sacrifice and courage made it possible.</p></div><strong>Enter the industrial history →</strong></a>
      <section className="panel"><div className="panelHeader"><div><span className="eyebrow">GLOBAL INDUSTRY ECOSYSTEMS</span><h2>Explore the first four value chains</h2></div><div className="nav"><a href="/ecosystems/semiconductor/compare">Compare roles →</a><a href="/mega-factories">Production sites →</a><a href="/clusters">Industry clusters →</a></div></div><div className="grid3">{ecosystems.map(([name, slug]) => <article className="stage" key={slug}><span>ECOSYSTEM</span><h3>{name}</h3><p>Open the live database-backed ecosystem explorer.</p><a href={`/ecosystems/${slug}`}>Explore →</a></article>)}</div></section>
      <section className="panel"><div className="panelHeader"><div><span className="eyebrow">SEMICONDUCTOR ECOSYSTEM</span><h2>Global value chain</h2></div><div className="nav"><a href="/ecosystems/semiconductor">Open Explorer</a><a href="/ecosystems/semiconductor/compare">Compare countries</a></div></div><div className="stages">{ecosystemStages.map((stage, index) => <article className="stage" key={stage}><span>{String(index + 1).padStart(2, "0")}</span><h3>{stage}</h3><p>Companies, products, factories and verified relations appear only with approved evidence.</p></article>)}</div></section>
      <section className="grid3"><a className="panel compact" href="/news"><span className="eyebrow">NEWS & RESEARCH</span><h2>Rights-aware source links</h2><p>Link-first handling with translation only when rights explicitly permit it.</p></a><a className="panel compact" href="/market-events"><span className="eyebrow">MARKET EVENTS</span><h2>Neutral relevance analysis</h2><p>Explain factual transmission paths without price predictions or trade instructions.</p></a><a className="panel compact" href="/global-money"><span className="eyebrow">GLOBAL MONEY</span><h2>Institutional disclosures</h2><p>Track reported large-investor positions while preserving filing and period dates.</p></a><a className="panel compact" href="/ma"><span className="eyebrow">GLOBAL M&A</span><h2>Verified deal timeline</h2><p>Announced, pending, completed or withdrawn corporate transactions from approved sources.</p></a><article className="panel compact"><span className="eyebrow">OFFICIAL DISCLOSURES</span><h2>OpenDART pipeline</h2><p>Company master sync, receipt-number deduplication and official filing links.</p></article><article className="panel compact"><span className="eyebrow">EVIDENCE & RIGHTS</span><h2>No unsupported publication</h2><p>Relationships, translations and analysis require the appropriate evidence and rights state.</p></article></section>
    </main>
  );
}
