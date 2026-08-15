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

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeZone: "Asia/Seoul" }).format(value);
}

function companyHref(company: { ticker: string | null; slug: string | null; country: string }) {
  const identifier = company.country === "KR" && company.ticker ? company.ticker : company.slug || company.ticker;
  return identifier ? `/companies/${identifier}` : "#";
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker: identifier } = await params;

  const company = await db.company.findFirst({
    where: {
      OR: [{ ticker: identifier }, { slug: identifier }],
      isActive: true,
    },
    include: {
      roles: {
        where: { evidenceStatus: { in: publicEvidence } },
        include: { ecosystem: true, stage: true, product: true },
        orderBy: [{ ecosystem: { name: "asc" } }],
      },
      factories: {
        where: { evidenceStatus: { in: publicEvidence } },
        orderBy: [{ country: "asc" }, { name: "asc" }],
      },
      disclosures: {
        take: 12,
        orderBy: { filedAt: "desc" },
        include: { source: true },
      },
    },
  });

  if (!company) notFound();

  const peerGroups = await Promise.all(
    company.roles
      .filter((role) => role.productId)
      .map(async (role) => ({
        role,
        peers: await db.companyEcosystemRole.findMany({
          where: {
            ecosystemId: role.ecosystemId,
            productId: role.productId,
            roleType: role.roleType,
            evidenceStatus: { in: publicEvidence },
            companyId: { not: company.id },
          },
          include: { company: true },
          orderBy: { company: { country: "asc" } },
        }),
      })),
  );

  return (
    <main className="shell companyPage">
      <header className="topbar">
        <a href="/" className="brandBlock">
          <div className="brand">Korea Market Portal</div>
          <div className="subtitle">Global Industry Intelligence</div>
        </a>
        <nav className="nav" aria-label="Company navigation">
          <a href="#position">Ecosystem Position</a>
          <a href="#peers">Global Peers</a>
          <a href="#factories">Factories</a>
          {company.country === "KR" && <a href="#disclosures">Disclosures</a>}
        </nav>
      </header>

      <section className="companyHero">
        <div>
          <span className="eyebrow">COMPANY ECOSYSTEM PROFILE</span>
          <h1 className="companyTitle">{company.nameEn || company.nameKo}</h1>
          <div className="companyMeta">
            {company.nameKo !== company.nameEn && <span>{company.nameKo}</span>}
            {company.ticker && <span>{company.ticker}</span>}
            {company.market && <span>{company.market}</span>}
            {company.country && <span>{company.country}</span>}
          </div>
        </div>
        <div className="policyCard">
          <strong>Evidence-first profile</strong>
          <span>• Only approved ecosystem and factory relationships are shown.</span>
          <span>• External evidence opens at its original source.</span>
          <span>• No investment ranking, recommendation or trading instruction.</span>
        </div>
      </section>

      <section className="panel" id="position">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">ECOSYSTEM POSITION</span>
            <h2>Where this company sits in global industry</h2>
          </div>
          <span className="countBadge">{company.roles.length} verified roles</span>
        </div>
        <div className="roleGrid">
          {company.roles.length === 0 && <p>No verified ecosystem roles are published yet.</p>}
          {company.roles.map((role) => (
            <article className="roleCard" key={role.id}>
              <div className="roleTopline">
                <span>{role.ecosystem.name}</span>
                <span>{role.evidenceStatus.replaceAll("_", " ")}</span>
              </div>
              <h3>{role.product?.name || role.stage?.name || role.roleType}</h3>
              <p>{role.stage?.name || "Unassigned stage"} · {role.roleType.replaceAll("_", " ")}</p>
              {role.product?.technologyGroup && <p>Technology group: {role.product.technologyGroup}</p>}
              <a className="sourceLink" href={`/ecosystems/${role.ecosystem.slug}/compare`}>Compare ecosystem →</a>
              {role.sourceUrl && (
                <a className="sourceLink" href={role.sourceUrl} target="_blank" rel="noreferrer">
                  Official evidence ↗
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="panel" id="peers">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">GLOBAL PEERS</span>
            <h2>Same verified product and ecosystem role</h2>
          </div>
        </div>
        <div className="peerGroups">
          {peerGroups.length === 0 && <p>No verified peer groups are available yet.</p>}
          {peerGroups.map(({ role, peers }) => (
            <div className="peerGroup" key={`${role.id}-peers`}>
              <div className="peerGroupHeader">
                <strong>{role.product?.name || role.roleType}</strong>
                <span>{role.ecosystem.name}</span>
              </div>
              <div className="peerList">
                <div className="peerRow subjectRow">
                  <span>{company.country || "—"}</span>
                  <strong>{company.nameEn || company.nameKo}</strong>
                  <span>{role.roleType.replaceAll("_", " ")}</span>
                </div>
                {peers.map((peer) => (
                  <a className="peerRow" key={peer.id} href={companyHref(peer.company)}>
                    <span>{peer.company.country || "—"}</span>
                    <strong>{peer.company.nameEn || peer.company.nameKo}</strong>
                    <span>{peer.roleType.replaceAll("_", " ")}</span>
                  </a>
                ))}
                {peers.length === 0 && <p className="mutedLine">No other verified companies in this exact peer group.</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid2">
        <article className="panel" id="factories">
          <span className="eyebrow">FACTORIES & SITES</span>
          <h2>Verified production footprint</h2>
          <div className="stackList">
            {company.factories.length === 0 && <p>No verified factory records are published yet.</p>}
            {company.factories.map((factory) => (
              <div className="listRow" key={factory.id}>
                <div>
                  <strong>{factory.name}</strong>
                  <p>{[factory.city, factory.region, factory.country].filter(Boolean).join(", ")}</p>
                </div>
                <div className="listMeta">
                  <span>{factory.factoryType.replaceAll("_", " ")}</span>
                  <span>{factory.status.replaceAll("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel" id="disclosures">
          <span className="eyebrow">{company.country === "KR" ? "OFFICIAL DISCLOSURES" : "OFFICIAL SOURCE"}</span>
          <h2>{company.country === "KR" ? "Latest filings" : "Company information"}</h2>
          <div className="stackList">
            {company.country === "KR" ? (
              company.disclosures.length === 0 ? <p>No synced disclosures are available yet.</p> : company.disclosures.map((item) => (
                <a className="listRow" key={item.receiptNo} href={item.originalUrl} target="_blank" rel="noreferrer">
                  <div>
                    <strong>{item.reportName}</strong>
                    <p>{item.source.name} · {formatDate(item.filedAt)}</p>
                  </div>
                  <div className="listMeta"><span>{item.eventType.replaceAll("_", " ")}</span><span>Original ↗</span></div>
                </a>
              ))
            ) : (
              <>
                <p>Foreign-company profiles use official or rights-cleared ecosystem evidence and do not mirror local filings.</p>
                {company.websiteUrl && <a className="sourceLink" href={company.websiteUrl} target="_blank" rel="noreferrer">Official company site ↗</a>}
              </>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
