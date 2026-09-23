# Amara Trading Center Website

Phase 1 marketing and catalog site for Amara Trading Center. One Vite SPA in development, one Express process in production.

## Prerequisites

- Node.js 20 or newer
- [pnpm](https://pnpm.io/) 11 (pinned via `packageManager`)
- PostgreSQL

Do not use npm or yarn. The workspace `preinstall` script will reject them.

## First-time setup

```bash
cp .env.example .env
# set DATABASE_URL to your local Postgres database
pnpm install
pnpm db:migrate
```

Optional Clerk keys are only required for `/sign-in` and `/content`. Public pages and the catalog work without them.

## Local development

```bash
pnpm dev
```

- Website: http://localhost:5173
- API: http://localhost:8080 (Vite proxies `/api` to this origin)

Useful splits:

```bash
pnpm dev:web
pnpm dev:api
```

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test          # needs CATALOG_TEST_DATABASE_URL
pnpm build
```

Catalog and inquiry tests create an isolated schema. Point `CATALOG_TEST_DATABASE_URL` at a disposable Postgres database.

## Schema

Use versioned Drizzle migrations. Do not use `drizzle-kit push` except on a throwaway local database.

```bash
pnpm db:migrate
pnpm --filter @workspace/db run generate   # after schema changes
```

Rollback: restore the previous migration snapshot or restore the database from backup, then redeploy the matching app revision.

## Production

Build the website, then start one Node process that serves `/api` and the Vite `dist/public` SPA:

```bash
pnpm --filter @workspace/atc-website run build
pnpm --filter @workspace/api-server run build
NODE_ENV=production SERVE_STATIC=true pnpm start
```

Required secrets:

- `DATABASE_URL`
- `CORS_ORIGIN` (comma-separated production origins)
- `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` if staff CMS is enabled
- `CONTENT_STAFF_USER_IDS` (fail-closed if empty)

Health check: `GET /api/healthz`

## Regenerating the API contract

```bash
pnpm codegen
```

New API surfaces belong in `lib/api-spec/openapi.yaml` first.

## Still placeholder

- Resource downloads are marked Coming Soon
- Phone numbers and `info@amara.jo` are from the company profile and labeled unconfirmed in the UI
- Seed catalog remains until staff publish real content
