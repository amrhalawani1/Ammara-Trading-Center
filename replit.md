# Amara Trading Center Website

An informative Phase 1 website that translates ATC's showroom credibility into clear contact and showroom-visit journeys.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/atc-website/src/App.tsx` — route map and shared app shell
- `artifacts/atc-website/src/pages/` — Home, Brands, Products, Showroom, Resources, About, and Contact pages
- `artifacts/atc-website/src/components/` — layout and reusable content states
- `artifacts/atc-website/src/index.css` — ATC website design tokens and global typography
- `artifacts/atc-website/content/schemas/` — Sanity-ready Brand and Product content models
- `artifacts/atc-website/docs/ia-content-requirements.md` — Phase 1 information architecture and content boundaries
- `artifacts/atc-website/public/images/` — curated visual assets used by the site

## Architecture decisions

- The site is informative and inquiry-led; commerce, cart, checkout, and payment flows are intentionally excluded from Phase 1.
- The website system is the source of truth for the UI: cream canvas, dark brown ink, restrained red accents, Cormorant Garamond, and DM Sans.
- Confirmed content is sourced from the supplied ATC company profile; open and candidate content is labeled in the UI rather than fabricated.
- Brand and Product schema fields are kept portable and import-friendly for a future Sanity/MySQL catalogue migration.

## Product

- Visitors can explore ATC's partner brands and product template, learn about the company and showroom locations, send an inquiry, and plan a showroom visit.
- The experience is responsive and mobile-first for on-site fabricators and homeowners while remaining presentation-ready for desktop showroom use.

## User preferences

- Keep the tone quiet, credible, and non-promotional; use one clear action per section.

## Gotchas

- The attached social-media guideline uses a different black/Montserrat/#7B1A1A system; do not apply it to the website.
- Project references, formal WhatsApp, curated catalogue selection, and Arabic/RTL are not confirmed scope; retain their visible placeholder or candidate treatment.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
