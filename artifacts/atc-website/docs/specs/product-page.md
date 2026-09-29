# Product page spec

Source of truth for the product page, the catalogue, and brand pages. It replaces [product-page-direction.md](../product-page-direction.md) for layout and behaviour, and it replaces the conflicting rules in [ia-content-requirements.md](../ia-content-requirements.md): a public price or “Price on request” is allowed, and a file with a real URL is a direct download. A cart exists only when `sellOnline` is true. Quote and WhatsApp stay the primary actions.

The visual system is unchanged: cream, dark brown, restrained red, Cormorant Garamond, and DM Sans.

## 1. Goal

A product page that lets two kinds of buyer act quickly:

- **Homeowners** want to know whether it will look right and whether it will fit, then talk to someone.
- **Trade buyers** (architects, kitchen makers, contractors) arrive with a model code. They need specs, installation data and files, then a quote for several items.

Success means more quote and WhatsApp leads per product view, fewer “what size is this?” calls to the showroom, and product pages that rank for model-code searches.

## 2. Stack

This is the Vite + React app in `artifacts/atc-website` (wouter, TanStack Query). The API is `artifacts/api-server`. Catalogue rows live in Postgres via Drizzle (`lib/db/src/schema/products.ts`), described in `lib/api-spec/openapi.yaml` and consumed through `@workspace/api-client-react`.

There is no Next.js, no Odoo, and no Algolia.

| Concern | Where it lives |
|---|---|
| Routes | `artifacts/atc-website/src/App.tsx` |
| Product page | `src/pages/products/detail.tsx` |
| Catalogue | `src/pages/catalog/index.tsx`, filters in `src/lib/catalog-filters.ts` |
| Brand pages | `src/pages/brands/index.tsx`, `src/pages/brands/detail.tsx` |
| Quote list | `src/pages/lists.tsx`, `src/lib/shortlists.ts` (`atc-store` in localStorage) |
| Search | `src/lib/smart-search.ts` and the home search overlay. Partial model codes must match (`1PMD9` finds `1PMD95N`). |
| WhatsApp | `src/lib/whatsapp.ts`. The business number is `company.whatsapp` in `src/lib/content.ts` and is still a placeholder. |
| Quote submit | `POST /inquiries` with `kind: "shortlist"` (`artifacts/api-server/src/routes/inquiries.ts`). The saved inquiry lists each variant and quantity. An external CRM can replace this later; do not invent an Odoo client. |
| Images | `MediaImage`. The main image loads with high priority. There is no `next/image`. |
| Seed data | `artifacts/api-server/src/lib/catalog-seed.ts` until the new fields exist on real rows. |

JSON-LD is injected from the product page. The app has no document-head manager today. Because the site is a client-rendered SPA, a crawler that does not run JavaScript will not see that JSON-LD until a rendering strategy is chosen. Still emit valid `Product` and `BreadcrumbList` markup in the page.

## 3. Routes

Keep the current URLs. Do not add `/p`, `/c`, `/quote`, `/trade`, or `/inspiration`.

| Surface | URL | Notes |
|---|---|---|
| Home + search | `/` | Name or model code, via the existing search overlay. |
| Category listing | `/catalog` | Query filters from `catalog-filters.ts`: `solution`, `brand`, `type`, `finish`, `q`, `sort`. |
| Subcategory | `/catalog?...` | A filter on the catalogue, not a nested path. |
| All brands | `/brands` | |
| Brand hub | `/brands/:brandSlug` | Story, then collections as grouped sections, then the product grid. Collection data is `details.collection` or `family`. |
| Collection | same brand URL | Group models on the brand page. Do not add `/brands/:brand/:collection`. |
| Product | `/products/:slug` | Variant is `?v=<variantCode>`. Canonical URL is the parent, without `?v`. |
| Inspiration | `/projects`, `/projects/:slug` | Each look links to products. |
| Quote list | `/lists` | Multi-product review and submit. Do not add `/quote`. |
| Trade programme and downloads | `/lists`, `/resources`, `/catalogues` | Bulk quote on `/lists`. Guides and catalogues on `/resources` and `/catalogues`. |
| Support | `/resources`, `/contact` | Find-by-code is home search. Warranty, delivery, and FAQ stay on resources and contact. |
| About, contact, showroom | `/about`, `/contact`, `/showroom`, `/showroom/:slug` | |

Every product is reachable from the catalogue and from its brand. The breadcrumb follows the category path. The brand is a link in the product header to `/brands/:brandSlug`.

## 4. Product page

### 4.1 Principles

1. **Answer “what is it, will it fit, what does it cost” above the fold.** Show the model code, key dimension, finish, and price (or “Price on request”) before any story.
2. **One page, two depths.** The story and visuals come first for homeowners. Specifications, Installation, and Downloads serve trade buyers without pushing the story down the page.
3. **Every page ends in a conversation.** Primary actions are “Add to quote” and “WhatsApp us”. “Add to cart” renders only when `sellOnline` is true. There is no checkout or payment in this spec.
4. **The variant is the product.** Choosing a finish or size updates the code, images, specs, price, stock, and `?v=` together, without a full page reload.

### 4.2 Desktop layout (≥1024px)

```
┌───────────────────────────────────────────────────────────────────────┐
│ Home › Kitchen › Hobs › Mood 90 cm hob                                │
├──────────────────────────────────┬────────────────────────────────────┤
│                                  │ [BARAZZA logo]            NEW  🏆  │
│   GALLERY                        │ Mood 90 cm built-in hob            │
│   main image (zoom)              │ 1PMD95N  [copy]                    │
│                                  │ 90 cm · Glass ceramic · Gas        │
│   thumbs: product · lifestyle ·  │                                    │
│   technical drawing · video      │ JOD 1,250  or  "Price on request"  │
│                                  │ ● In stock · ● On display in       │
│                                  │   showroom                         │
│                                  │                                    │
│                                  │ Finish   ◉ Black  ○ Steel  ○ White │
│                                  │ Size     [65] [75] [90] [110]      │
│                                  │                                    │
│                                  │ Will it fit?  Cut-out 83 × 48 cm → │
│                                  │                                    │
│                                  │ [ Add to quote ] [ WhatsApp us ]   │
│                                  │ Add to cart (sellOnline only)      │
│                                  │                                    │
│                                  │ ✓ 2-yr warranty ✓ Delivery+install │
├──────────────────────────────────┴────────────────────────────────────┤
│ KEY FACTS  [90 cm] [4 kW max] [Cast-iron] [Flush mount] [2-yr]        │
├───────────────────────────────────────────────────────────────────────┤
│ Overview | Specifications | Installation | Downloads   ← sticky tabs   │
│ (anchored sections, not hidden panels: all content is in the HTML)    │
├───────────────────────────────────────────────────────────────────────┤
│ Same collection, other sizes  → compare table (size, cut-out, price)  │
│ Completes the look            → matching hood, sink, tap              │
│ See it in person              → showroom map, hours, "Book a visit"   │
│ Recently viewed                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

Breadcrumb categories link into `/catalog` with the matching filter. “Home” is `/`.

### 4.3 Mobile layout (<768px)

```
Breadcrumb (scrolls sideways)
Gallery (swipe, dots, pinch zoom)
Brand · Name · Code [copy]
Price / on request · Stock
Finish swatches · Size chips
"Will it fit?" row
Key facts (scrolls sideways)
Accordions: Overview ▸ Specs ▸ Installation ▸ Downloads
Same collection · Completes the look · Showroom
┌──────────────────────────────────────┐
│ [WhatsApp]  [ Add to quote ]         │  ← sticky bottom bar
└──────────────────────────────────────┘
```

The sticky bar is always visible and does not cover the last content. Pad the page end by at least the bar height.

### 4.4 Interactions

| Feature | Behaviour | Why |
|---|---|---|
| **Quote list** | “Add to quote” writes the product, variant, and quantity into the active list in `atc-store` (`src/lib/shortlists.ts`). The same variant added twice raises the quantity. The header badge counts items. `/lists` reviews the list. Submit calls `POST /inquiries` with `kind: "shortlist"` and one `items` entry per line (`slug`, `name`, `brandName`, `reference`, `variant`, `quantity`). Login is never required to add or submit. | Trade buyers quote whole kitchens, not single items. |
| **WhatsApp prefill** | `wa.me/<number>?text=` via `whatsappUrl`, including product name, variant code, and the page URL (`/products/:slug?v=`). | Sales staff know the exact item straight away. |
| **Will it fit?** | A panel with the cut-out or minimum base-cabinet size, the installation type, and the technical drawing when `install` is present. Optional: the visitor enters a cabinet width and sees fit or no-fit. Fire `fit_check` when they do. | Most common pre-sale question. |
| **Variant in the URL** | `?v=<variantCode>` on `/products/:slug`. Shareable. The canonical URL is the parent, without the query. | Quotes and WhatsApp messages link to the exact finish. |
| **Copy model code** | One tap copies the code and shows a toast. | Trade buyers paste codes into bills of quantities. |
| **Showroom availability** | “On display in showroom” only when `onDisplay` is true. Do not invent availability. | Drives visits for high-value items. |
| **Collection compare** | A table of sibling sizes: size, cut-out, one key spec, and price or “On request”. | Replaces opening several product tabs. |
| **Price on request** | When `price` is null, the price row reads “Price on request” and “Add to quote” is the primary action. | Many brands cannot show a public price. |

### 4.5 Section content

Sections are anchors on desktop (sticky in-page nav, all content in the HTML) and accordions on small screens. Do not unmount inactive sections.

- **Overview.** Two or three feature blocks (image and short copy), a brand-story snippet, and awards. Render only the blocks the product actually has. The existing `editorial` chapters and designer credit may fill this section; they no longer lead the page.
- **Specifications.** A real HTML `<table>`, grouped by Dimensions, Performance, Materials, and Electrical, with units in the labels.
- **Installation.** Cut-out or base size, installation method with an image, an installation video when one exists, and a link to the guide.
- **Downloads.** Data sheet, manual, CAD (DWG/3D), and brand catalogue. Each row shows type and size. A row with `url` downloads directly. A row without `url` stays a request on WhatsApp, so the current revision is what gets sent. Do not invent file URLs.

## 5. Catalogue, brand, and collection

| Page | Top | Body | Filters |
|---|---|---|---|
| Catalogue (`/catalog`) | Title, one-line intro, subcategory chips | Product grid | Brand, size, finish, price, install type, in stock. Existing filters (`brand`, `type`, `finish`, `solution`) stay; add the missing ones as data exists. |
| Brand hub (`/brands/:brandSlug`) | Hero, logo, two-line story, awards | Collections as grouped rows, then the full product grid | Category, collection, finish |
| Collection (section on the brand page) | Hero and story for that collection | Models grouped by size or install type, plus the compare table | Size, finish |

**Product card.** Image (the second image shows on hover), brand, name, model code, one key spec, finish dots, price or “On request”, and a quick “Add to quote” button.

## 6. Data contract

Extend `Product` and `ProductDetails` in `lib/db/src/schema/products.ts`, then the OpenAPI schema and the generated client. Do not add a parallel product type.

Fields that filters, key facts, the compare table, and search depend on must be structured, not buried in free text.

```ts
// Target shape. Map onto Product + ProductDetails; do not replace them.
type ProductPage = {
  id: string;
  slug: string;
  name: string;
  modelCode: string; // parent code: sku, else the manufacturer article number
  brand: { slug: string; name: string; logo: string };
  collection?: { slug: string; name: string }; // details.collection or family
  categoryPath: { slug: string; name: string }[];
  badges: ("new" | "award" | "showroom")[];
  price?: { amount: number; currency: "JOD" } | null; // null => "Price on request"
  sellOnline: boolean;
  keyFacts: { icon: string; label: string; value: string }[]; // 4–6
  variants: {
    code: string;
    finish?: string;
    finishSwatch?: string;
    size?: string;
    installType?: string;
    images: string[];
    stock: "in" | "order" | "out";
    price?: number | null;
  }[];
  specs: { group: string; label: string; value: string; unit?: string }[];
  install?: {
    cutOut?: string;
    minBaseCm?: number;
    method?: string;
    drawing?: string;
    guideUrl?: string;
  };
  downloads: {
    type: "datasheet" | "manual" | "cad" | "catalogue";
    url?: string; // absent => request on WhatsApp
    sizeKb?: number;
    lang: string;
  }[];
  relatedSameCollection: string[]; // product ids
  completesTheLook: string[]; // product ids
  onDisplay: boolean;
};
```

Already on the row today: `slug`, `name`, `sku`, `brandSlug`, `brandName`, `category`, `family`, `specs` (`label`, `value`, optional `group`), `details.collection`, `details.badges`, `details.variants` (`code`, `label`, `kind`, `articleNumber`, `attributes`, `image`), `details.downloads` (`label`, `fileType` only), `details.media`, `details.related` (names, not ids), `details.features`, `editorial`, `installationNotes`, `dimensions`, `finish`, `material`.

Still missing, and required before the page can tell the truth: `price`, `sellOnline`, `keyFacts`, variant `stock` / `price` / `finishSwatch` / image list, spec `unit`, `install`, download `url` / `sizeKb` / `lang`, `onDisplay`, and ids for same-collection and completes-the-look. Until those columns exist, read them from mock objects in the catalogue seed. Never invent a price, a stock state, a showroom flag, or a file URL for a product that does not have one.

Search indexes `name`, `modelCode`, each `variants.code`, `brand.name`, `collection.name`, `categoryPath`, and `keyFacts`, via `smart-search.ts`.

Model codes are never translated. Arabic and RTL are unconfirmed; do not build a second locale until the client confirms it.

## 7. Non-functional requirements

- **SEO.** `Product` JSON-LD (`brand`, `sku` = model code, `offers` when a price exists). `BreadcrumbList` for the category path. Canonical URL is `/products/:slug`. Specs are an HTML table, not an image.
- **Performance.** LCP under 2.5 s on a slow 4G profile. The main image is prioritized and responsive. Lower sections and the gallery hydrate after the hero. Anchored sections are in the first HTML response the client renders; they are not fetched as separate panels.
- **Accessibility.** WCAG 2.1 AA. Swatches are a radio group with labels. The section nav follows the ARIA tabs pattern when it is a tab list, and it does not remove the other sections from the accessibility tree. Touch targets are at least 44 px.
- **Analytics (GA4).** `view_item`, `select_variant`, `add_to_quote`, `whatsapp_click`, `download_file`, `fit_check`, `submit_quote`. Wire these when the analytics snippet exists; name them now so the events do not drift.

## 8. Acceptance criteria

- [ ] Model code, key dimension, finish, and price or “Price on request” are visible without scrolling on a 1366 × 768 screen and a 390 × 844 phone.
- [ ] Changing the variant updates the images, code, price, stock, specs, and `?v=` with no full page reload.
- [ ] Add to quote works for several products. The list survives a refresh. Submitting it creates an inquiry whose `items` are the quoted lines.
- [ ] The WhatsApp link includes the product name, variant code, and URL.
- [ ] Specs render as an HTML table. Downloads show file type and size, and download directly when `url` is set.
- [ ] The mobile sticky bar stays visible and does not cover content.
- [ ] The “On display” badge appears only when `onDisplay` is true.
- [ ] `sellOnline: false` shows no cart control.
- [ ] Product JSON-LD and `BreadcrumbList` validate. A client-rendered SPA will not pass Google’s Rich Results Test until the page is server-rendered or prerendered; that limit is explicit, not a reason to skip the markup.
- [ ] Lighthouse on mobile: Performance ≥ 90, Accessibility ≥ 95.

## 9. Build order

1. Extend `ProductDetails` (and OpenAPI) with the missing fields. Serve mock JSON from the catalogue seed until real values exist.
2. Product header, gallery, variant picker, price, CTAs, and key facts on `/products/:slug`.
3. Anchored sections: Overview, Specifications, Installation, Downloads.
4. Quote list on `/lists` (labels and badge), WhatsApp prefill including the URL, inquiry submit with line items.
5. Collection compare, completes the look, and the showroom block.
6. Catalogue and brand templates: card, filters, collection grouping. Search matches partial codes.
7. JSON-LD, the GA4 event names, and the accessibility pass.

Reference brands for the behaviour, not for a visual copy: DND (designer and awards, used inside Overview), Barazza (code and cut-out first), Blum (sections by task), Hitachi (category, then series, then model cards), Tasca (models grouped by install type, WhatsApp).
