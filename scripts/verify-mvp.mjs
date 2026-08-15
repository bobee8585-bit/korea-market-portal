import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const failures = [];

const layout = read("app/layout.tsx");
const localeContract = read("lib/i18n.ts");
const envExample = read(".env.example");
const ingestion = read("app/api/internal/intelligence/ingest/route.ts");

if (!layout.includes("lang={defaultLocale}")) failures.push("Root document must use the locale contract.");
if (!localeContract.includes('defaultLocale = "en"')) failures.push("English must remain the published default locale.");
if (!localeContract.includes('ko: { published: false')) failures.push("Korean must remain design-only for the MVP.");
if (!envExample.includes("NEXT_PUBLIC_SITE_URL")) failures.push("The public site URL must be documented.");
if (!ingestion.includes("isAuthorizedInternalRequest(request)")) failures.push("Protected intelligence ingestion must require internal authorization.");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("MVP contract verification passed.");
