# Korea Market Portal

Global market and industrial-ecosystem intelligence focused on Korean public companies and their position inside global value chains.

## Implemented foundation

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

## Internal seed order

Protected seed endpoints require `Authorization: Bearer <INTERNAL_SYNC_SECRET>`.

1. Ecosystem bootstrap
2. Semiconductor company/product seed
3. Semiconductor factory seed
4. Korea semiconductor cluster seed
5. Global semiconductor cluster seed

The seed endpoints are idempotent and do not publish inferred or unverified relations.

## Current deployment boundary

The codebase is implementation-ready, but production data is not considered live until a real PostgreSQL database is provisioned, migrations are applied, OpenDART credentials are configured, protected seeds/syncs are executed, and the resulting pages are verified against the production database.
