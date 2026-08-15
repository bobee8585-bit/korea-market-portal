# Korea Market Portal

Global market and industrial-ecosystem intelligence focused on Korean public companies and their position inside global value chains.

## MVP implemented

- Next.js + TypeScript application shell
- PostgreSQL + Prisma core schema
- Company / Source / Rights models
- Ecosystem / Stage / Product / Factory / Relationship graph
- Industry Cluster / Cluster Company / Cluster Factory graph
- Korean and global company profile routing with stable slugs
- Ecosystem Explorer and evidence-filtered company roles
- Ecosystem Compare matrix by country and value-chain stage
- Korea Inside product/technology discovery
- Mega Factory explorer with explicit location precision
- Industry Cluster explorer with government-designated vs service-level hub distinction
- OpenDART company/disclosure ingestion foundation
- Global Money institutional-disclosure model, API and page
- Global M&A model, API and page
- Rights-aware News & Research link model, API and page
- Market Event relevance model, API and page
- Protected intelligence ingestion endpoint for institutional disclosures, M&A, external links and market events
- Central Rights Guard and investment-advice output guard
- Health and database-readiness endpoints
- GitHub Actions validation for Prisma, TypeScript and Next.js build

## Product rules

1. Official or explicitly rights-cleared data is preferred.
2. Unlicensed news and broker research default to link-only handling.
3. Content rights are enforced server-side before storage, translation, AI analysis, caching or display.
4. Direct trading instructions, personalized investment recommendations and buy/sell language are outside product scope.
5. Ecosystem links such as supplier, customer, peer, factory and cluster relations require traceable evidence before publication.
6. Relevance means informational relationship, not expected price direction.
7. Global-peer comparison requires the same verified product and ecosystem role; equipment suppliers are not treated as manufacturing peers.
8. Factory capacity is never estimated. It is shown only when an approved source explicitly publishes a figure.
9. Map coordinates expose precision such as CITY or SITE so city-level points are not misrepresented as exact factory coordinates.
10. Service-defined regional hubs are not presented as government-designated industrial clusters.
11. Institutional positions preserve both period end and report date and are never presented as real-time holdings.
12. M&A status and disclosed deal value are factual fields only and are not converted into investment conclusions.
13. LINK_ONLY external content cannot enable translation or AI analysis in the protected ingestion API.
14. Market-event relevance notes must pass the publication safety guard and may not contain trading instructions.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run check
npm run dev
```

A PostgreSQL `DATABASE_URL` is required before migrations or runtime database access. `OPENDART_API_KEY` and `INTERNAL_SYNC_SECRET` are intentionally not stored in the repository.

## Runtime checks

- `GET /api/health` — process liveness; no database dependency.
- `GET /api/readiness` — checks database connectivity and returns HTTP 503 when unavailable.

## Public MVP routes

- `/companies` — company search
- `/ecosystems/semiconductor` — ecosystem explorer
- `/ecosystems/semiconductor/compare` — country/value-chain comparison
- `/korea-inside` — Korean participation inside global products and technologies
- `/mega-factories` — production-site explorer
- `/clusters` — regional industry-cluster explorer
- `/news` — rights-aware news/research source links
- `/market-events` — neutral market-relevance timeline
- `/global-money` — public institutional disclosures
- `/ma` — global M&A timeline

## Public APIs

- `GET /api/v1/companies/search`
- `GET /api/v1/ecosystems/[slug]`
- `GET /api/v1/factories`
- `GET /api/v1/clusters`
- `GET /api/v1/content-links`
- `GET /api/v1/market-events`
- `GET /api/v1/global-money`
- `GET /api/v1/mna`

## Protected ingestion

`POST /api/internal/intelligence/ingest` requires `Authorization: Bearer <INTERNAL_SYNC_SECRET>` and accepts these kinds:

- `external-link`
- `institutional-disclosure`
- `mna`
- `market-event`

External links default to `LINK_ONLY`. If a LINK_ONLY request attempts to enable translation or analysis, ingestion is rejected.

## Internal seed order

Protected seed endpoints require `Authorization: Bearer <INTERNAL_SYNC_SECRET>`.

1. Ecosystem bootstrap
2. Semiconductor company/product seed
3. Semiconductor factory seed
4. Korea semiconductor cluster seed
5. Global semiconductor cluster seed

The seed endpoints are idempotent and do not publish inferred or unverified relations.

## Deployment boundary

The MVP code path is complete and CI-validatable. Production activation still requires infrastructure values that must not be committed to GitHub: provision a real PostgreSQL database, create/apply the production migration, set `DATABASE_URL`, configure `OPENDART_API_KEY` and `INTERNAL_SYNC_SECRET`, execute the protected seeds/syncs, ingest approved source records, and run browser E2E verification against the deployed database.
