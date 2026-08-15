# Korea Market Portal

Global market and industrial-ecosystem intelligence focused on Korean public companies.

## v0.1 Foundation

- Next.js + TypeScript application shell
- PostgreSQL + Prisma core schema
- Company / Source / Rights models
- Ecosystem / Stage / Product / Factory / Relationship graph
- Central Rights Guard
- Investment-advice output guard
- OpenDART environment hook

## Product rules

1. Official or explicitly rights-cleared data is preferred.
2. Unlicensed news and broker research default to link-only handling.
3. Content rights are enforced server-side before storage, translation, AI analysis, caching or display.
4. Direct trading instructions and personalized investment recommendations are outside product scope.
5. Ecosystem links such as supplier, customer and peer relations require traceable evidence before publication.
6. Relevance means informational relationship, not expected price direction.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run dev
```

A PostgreSQL `DATABASE_URL` is required before migrations. `OPENDART_API_KEY` is intentionally not stored in the repository.
