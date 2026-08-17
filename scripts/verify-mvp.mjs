import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const failures = [];

const layout = read("app/layout.tsx");
const localeContract = read("lib/i18n.ts");
const envExample = read(".env.example");
const ingestion = read("app/api/internal/intelligence/ingest/route.ts");
const advertisingInquiry = read("components/advertising-inquiry-form.tsx");
const sponsorMeasurement = read("app/api/ads/event/route.ts");
const sponsorReport = read("app/api/internal/ads/report/route.ts");
const industryCatalog = read("lib/industry-catalog.ts");
const industryStageCatalog = read("lib/industry-stage-catalog.ts");
const industryCompanyEvidence = read("lib/industry-company-evidence.ts");
const industriesPage = read("app/industries/page.tsx");
const industryDetailPage = read("app/industries/[slug]/page.tsx");
const industryStagePage = read("app/industries/[slug]/[stage]/page.tsx");
const translationPolicy = read("app/translation-policy/page.tsx");
const correctionsPolicy = read("app/corrections/page.tsx");
const home = read("app/page.tsx");
const disclosureCron = read("app/api/cron/dart-disclosures/route.ts");
const disclosureSync = read("app/api/internal/dart/sync-disclosures/route.ts");
const ecosystemEvidenceCatalog = read("lib/ecosystem-evidence-catalog.ts");
const publicSourceHubs = read("lib/public-source-hubs.ts");
const fundFlowMonitor = read("lib/fund-flow-monitor.ts");
const fundFlowPage = read("app/fund-flow/page.tsx");
const fundFlowValidation = read("lib/fund-flow-validation.ts");
const fundFlowIngest = read("app/api/internal/fund-flow/ingest/route.ts");
const fundFlowApi = read("app/api/v1/fund-flow/route.ts");

if (!layout.includes("lang={defaultLocale}")) failures.push("Root document must use the locale contract.");
if (!localeContract.includes('defaultLocale = "en"')) failures.push("English must remain the published default locale.");
if (!localeContract.includes('ko: { published: false')) failures.push("Korean must remain design-only for the MVP.");
if (!envExample.includes("NEXT_PUBLIC_SITE_URL")) failures.push("The public site URL must be documented.");
if (!ingestion.includes("isAuthorizedInternalRequest(request)")) failures.push("Protected intelligence ingestion must require internal authorization.");
if (!advertisingInquiry.includes("Nothing entered here is stored")) failures.push("Advertising enquiry must disclose its no-storage behaviour.");
if (!advertisingInquiry.includes("mailto:")) failures.push("Advertising enquiry must remain operational without a new data processor.");
if (/cookie|user-agent|x-forwarded-for/i.test(sponsorMeasurement)) failures.push("Direct sponsor measurement must not collect persistent or request-level identifiers.");
if (!sponsorMeasurement.includes("recordSponsorEvent")) failures.push("Direct sponsor events must be persisted for reporting.");
if (!sponsorReport.includes("isAuthorizedInternalRequest(request)")) failures.push("Sponsor reporting must require internal authorization.");
if (!industryCatalog.includes("not a claim about market rank")) failures.push("Industry expansion must avoid unsupported ranking claims.");
for (const sector of ["machinery", "defense-aerospace", "cosmetics", "display", "battery-materials"]) {
  if (!industryCatalog.includes(`slug: "${sector}"`)) failures.push(`Industry expansion is missing ${sector}.`);
}
if (!industryCatalog.includes("Security-sensitive details")) failures.push("Defense coverage must exclude sensitive and speculative material.");
if (!home.includes("industryCatalog.map")) failures.push("Home must expose every industry catalog entry.");
if (!home.includes("`/industries/${industry.slug}`")) failures.push("Home industry cards must open industry explorers.");
if (!industriesPage.includes("industryStageSlug(stage)")) failures.push("Industry stages must link to stage detail pages.");
for (const detail of ["Starches, sugars and sweeteners", "Fermentation cultures and enzymes", "MFDS permitted use and scope"]) {
  if (!industryStageCatalog.includes(detail)) failures.push(`Ingredient explorer is missing ${detail}.`);
}
if (!industryDetailPage.includes("await params") || !industryStagePage.includes("await params")) failures.push("Next.js dynamic industry pages must await params.");
if (!industryStagePage.includes("not evidence that every listed product family is manufactured by every member company")) failures.push("Stage pages must preserve the company-product evidence boundary.");
if (!industryStagePage.includes("evidenceStatus: { in: publicEvidence }") || !industryStagePage.includes("sourceUrl: { not: null }")) failures.push("Stage company links must require public evidence and an original source.");
if (!industryStagePage.includes("absence here does not mean the company is absent from the industry")) failures.push("Empty stage-company results must not imply industry absence.");
if (!industryStagePage.includes("/companies?q=${encodeURIComponent(item)}")) failures.push("Product families must link to verified company search.");
for (const company of ["CJ CheilJedang", "Samyang Corporation", "Daesang Corporation", "LG Chem", "LOTTE Chemical", "GS Caltex", "S-OIL", "Hyundai Steel", "Celltrion", "SK bioscience", "HYUNDAI WIA", "Doosan Robotics", "LS ELECTRIC", "Hanwha Semitech", "Korea Aerospace Industries (KAI)", "Hanwha Aerospace", "Doosan Mobility Innovation"]) if (!industryCompanyEvidence.includes(company)) failures.push(`Official ingredient evidence is missing ${company}.`);
if (!industryCompanyEvidence.includes('stageSlug: "basic-chemicals"') || !industryCompanyEvidence.includes('stageSlug: "polymers"')) failures.push("Chemical company evidence must be scoped to verified stages.");
if (!industryCompanyEvidence.includes("Comparative quality and market-rank language is not republished as fact")) failures.push("Chemical company evidence must exclude promotional rankings.");
if (!industryCompanyEvidence.includes('industrySlug: "refining"') || !industryCompanyEvidence.includes("Station counts, export ratios and destination counts are excluded")) failures.push("Refining evidence must preserve date-sensitive claim limits.");
if (!industryCompanyEvidence.includes('industrySlug: "steel"') || !industryCompanyEvidence.includes("Global ranking, annual capacity and performance-superiority language are not republished")) failures.push("Steel evidence must exclude promotional capacity and ranking claims.");
if (!industryCompanyEvidence.includes('industrySlug: "biohealth"') || !industryCompanyEvidence.includes("does not confirm a product approval, inspection result, efficacy, safety or current GMP status")) failures.push("Biohealth evidence must separate company operations from regulatory and clinical status.");
if (!industryCompanyEvidence.includes('industrySlug: "machinery"') || !industryCompanyEvidence.includes("World\'s-first, domestic-rank, yield, defect-rate and productivity claims are excluded")) failures.push("Machinery evidence must exclude promotional performance and rank claims.");
if (!industryCompanyEvidence.includes('industrySlug: "defense-aerospace"') || !industryCompanyEvidence.includes("Performance, armament, operational use, vulnerabilities, deployment and security-sensitive specifications are excluded")) failures.push("Defense evidence must exclude operational and security-sensitive detail.");
if (!industryCompanyEvidence.includes("Operational missions, surveillance payloads, technical specifications, deployment, customers and procurement relationships are excluded")) failures.push("Doosan aerospace evidence must exclude operational, customer and procurement claims.");
if (!industryCompanyEvidence.includes("COMPANY_CONFIRMED") || !industryCompanyEvidence.includes("publicationNote")) failures.push("Company evidence must stay attributed and carry a publication limitation.");
const companiesPage = read("app/companies/page.tsx");
if (!companiesPage.includes("product: { name: { contains: query") || !companiesPage.includes("stage: { name: { contains: query") || !companiesPage.includes("ecosystem: { name: { contains: query")) failures.push("Company search must support verified product, stage and industry queries.");
if ((companiesPage.match(/sourceUrl: \{ not: null \}/g) || []).length < 3) failures.push("Role-based company search must require original evidence URLs.");
for (const detail of ["Atmospheric and vacuum distillation", "Electrical steel", "Clinical trial phases", "Industrial robots", "No classified, tactical or inferred operational detail", "Responsible cosmetic distributor", "Organic emitting materials", "Black mass processing"]) {
  if (!industryStageCatalog.includes(detail)) failures.push(`Expanded industry explorer is missing ${detail}.`);
}
if (`${disclosureCron}\n${disclosureSync}`.includes("preferredRegion")) failures.push("Deprecated route-level preferredRegion must not be used; deployment region is configured in vercel.json.");
for (const slug of ["battery", "automotive-ev", "shipbuilding"]) {
  if (!ecosystemEvidenceCatalog.includes(`${slug.includes("-") ? `"${slug}"` : slug}: [`)) failures.push(`Official ecosystem starting sources are missing for ${slug}.`);
}
if (!ecosystemEvidenceCatalog.includes("OFFICIAL COMPANY SOURCE")) failures.push("Ecosystem source catalog must preserve source attribution.");
for (const source of ["englishdart.fss.or.kr", "global.krx.co.kr", "bok.or.kr", "sec.gov", "fund.nps.or.kr"]) {
  if (!publicSourceHubs.includes(source)) failures.push(`Public source hub is missing ${source}.`);
}
if (!publicSourceHubs.includes("not a substitute for the legally authoritative Korean filing")) failures.push("English DART directory must preserve the legal-authority warning.");
if (!correctionsPolicy.includes("Temporary restriction is not an admission") || !correctionsPolicy.includes("Unfavourable but accurately attributed public information")) failures.push("Corrections policy must preserve urgent review and evidence-based publication boundaries.");
if (!translationPolicy.includes("Investigation, allegation, charge, judgment and final conviction are not interchangeable")) failures.push("Translation policy must preserve legal status distinctions.");
for (const label of ["CONFIRMED", "STRONG INDICATION", "ESTIMATE", "MEDIA REPORT", "NOT VERIFIABLE"]) {
  if (!fundFlowMonitor.includes(`level: "${label}"`)) failures.push(`Fund-flow evidence model is missing ${label}.`);
}
if (!fundFlowMonitor.includes("does not prove that a particular hedge fund caused")) failures.push("Fund-flow assessment must not assert an unverified hedge-fund cause.");
if (!fundFlowPage.includes("Every conclusion carries an evidence label") && !home.includes("Every conclusion carries an evidence label")) failures.push("Home must expose the fund-flow evidence model.");
if (!fundFlowIngest.includes("isAuthorizedInternalRequest(request)")) failures.push("Fund-flow ingestion must require internal authorization.");
if (!fundFlowValidation.includes("officialHosts") || !fundFlowValidation.includes("OFFICIAL_SOURCE_REQUIRED")) failures.push("Fund-flow ingestion must restrict confirmed records to official source hosts.");
if (!fundFlowPage.includes("Awaiting licensed KRX data connection") || !fundFlowApi.includes('isLive: false')) failures.push("Fund-flow UI and API must not imply an unlicensed live feed.");
if (!fundFlowApi.includes("not proof of a hedge fund's identity")) failures.push("Fund-flow API must preserve the causality limitation.");
for (const benchmark of ["KOSPI", "SP500", "NASDAQCOM", "DJIA"]) {
  if (!fundFlowMonitor.includes(`code: "${benchmark}"`)) failures.push(`Global index comparison is missing ${benchmark}.`);
}
if (!fundFlowValidation.includes("OFFICIAL_BENCHMARK_SOURCE_REQUIRED")) failures.push("Benchmark ingestion must require an approved official source.");
if (!fundFlowPage.includes("Index levels are not directly comparable") || !fundFlowPage.includes("This comparison does not identify a fund or prove causation")) failures.push("Global index comparison must preserve normalization and causality warnings.");
const indexComparisonChart = read("components/index-comparison-chart.tsx");
if (!home.includes("<IndexComparisonChart />")) failures.push("Home must render the global index comparison chart.");
if (!indexComparisonChart.includes("GRAPH UNAVAILABLE · NOT LIVE") || !indexComparisonChart.includes("Decorative lines and placeholder values are not displayed")) failures.push("Empty comparison state must not imitate a graph.");
const macroDashboard = read("components/macro-indicator-dashboard.tsx");
if (!home.includes("<MacroIndicatorDashboard />")) failures.push("Home must render the macro indicator dashboard.");
for (const series of ["CPIAUCSL", "PPIACO", "UNRATE", "PAYEMS", "FEDFUNDS", "DGS10"]) {
  if (!macroDashboard.includes(`id: "${series}"`)) failures.push(`Macro dashboard is missing official series ${series}.`);
}
if (!macroDashboard.includes("No placeholder graph is shown")) failures.push("Macro data failure state must not imitate a graph.");
if (!macroDashboard.includes("not investment advice")) failures.push("Macro dashboard must preserve the investment-advice boundary.");
if (!indexComparisonChart.includes("return1dPct") || !indexComparisonChart.includes("return5dPct") || !indexComparisonChart.includes("return20dPct")) failures.push("Comparison chart must preserve all three return windows.");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("MVP contract verification passed.");
