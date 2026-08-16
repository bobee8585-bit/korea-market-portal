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
const translationPolicy = read("app/translation-policy/page.tsx");
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
if (`${disclosureCron}\n${disclosureSync}`.includes("preferredRegion")) failures.push("Deprecated route-level preferredRegion must not be used; deployment region is configured in vercel.json.");
for (const slug of ["battery", "automotive-ev", "shipbuilding"]) {
  if (!ecosystemEvidenceCatalog.includes(`${slug.includes("-") ? `"${slug}"` : slug}: [`)) failures.push(`Official ecosystem starting sources are missing for ${slug}.`);
}
if (!ecosystemEvidenceCatalog.includes("OFFICIAL COMPANY SOURCE")) failures.push("Ecosystem source catalog must preserve source attribution.");
for (const source of ["englishdart.fss.or.kr", "global.krx.co.kr", "bok.or.kr", "sec.gov", "fund.nps.or.kr"]) {
  if (!publicSourceHubs.includes(source)) failures.push(`Public source hub is missing ${source}.`);
}
if (!publicSourceHubs.includes("not a substitute for the legally authoritative Korean filing")) failures.push("English DART directory must preserve the legal-authority warning.");
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

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("MVP contract verification passed.");
