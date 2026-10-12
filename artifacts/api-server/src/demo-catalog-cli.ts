// Writes the public catalogue as static JSON for the website's demo fallback, built from the same
// seed and response mappers the API uses, without touching a database.
//
//   pnpm --filter @workspace/api-server run demo:catalog
//
// The website serves this file whenever /api/catalog cannot be reached, so a frontend-only
// deployment (no Postgres) still shows every published brand and product. Re-run it after
// changing catalog-seed.ts or catalog-extracted.ts.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// @workspace/db throws at import time without DATABASE_URL but never connects unless queried.
process.env.DATABASE_URL ??= "postgres://demo-snapshot@localhost/unused";

const { GetPublicCatalogResponse } = await import("@workspace/api-zod");
const { toBrandResponse, toProductResponse } = await import("./lib/catalog-content.js");
const { initialBrands, initialProducts } = await import("./lib/catalog-seed.js");
type BrandRecord = import("@workspace/db").BrandRecord;
type ProductRecord = typeof import("@workspace/db").productsTable.$inferSelect;

const stamp = new Date("2026-01-01T00:00:00Z");

// Ids follow the API's ordering (brands by name), so they are stable between runs.
const brandRows: BrandRecord[] = [...initialBrands]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((brand, index) => ({
    id: index + 1,
    legacyId: null,
    name: brand.name,
    slug: brand.slug,
    country: brand.country,
    category: brand.category,
    summary: null,
    description: brand.description,
    coverImage: brand.coverImage,
    websiteUrl: null,
    isFeatured: brand.isFeatured,
    status: brand.status,
    createdAt: stamp,
    updatedAt: stamp,
  }));
const brandsBySlug = new Map(brandRows.map((brand) => [brand.slug, brand]));

const productRows = initialProducts
  .filter((product) => brandsBySlug.has(product.brandSlug))
  .map((product, index): { product: ProductRecord; brand: BrandRecord } => {
    const brand = brandsBySlug.get(product.brandSlug)!;
    return {
      brand,
      product: {
        id: index + 1,
        legacyId: null,
        title: product.title,
        slug: product.slug,
        brandId: brand.id,
        sku: product.sku ?? null,
        category: product.category,
        family: product.family ?? null,
        description: product.description,
        material: null,
        finish: null,
        dimensions: null,
        images: product.images,
        specs: product.specs,
        finishes: [...product.finishes],
        installationNotes: null,
        editorial: product.editorial ?? null,
        details: product.details ?? null,
        isFeatured: product.isFeatured,
        status: product.status,
        createdAt: stamp,
        updatedAt: stamp,
      },
    };
  });

// Same filters and order as GET /api/catalog: published brands, published products of published brands, by title.
const brands = brandRows.filter((brand) => brand.status === "published").map(toBrandResponse);
const products = productRows
  .filter(({ product, brand }) => product.status === "published" && brand.status === "published")
  .sort((a, b) => a.product.title.localeCompare(b.product.title))
  .map(({ product, brand }) => toProductResponse(product, brand));
const categories = [...new Set(products.map((product) => product.category))].sort((a, b) => a.localeCompare(b));

const catalog = GetPublicCatalogResponse.parse({ brands, products, categories });

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(here, "../../atc-website/src/data/demo-catalog.json");
await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, `${JSON.stringify(catalog)}\n`);
console.log(`demo catalogue written: ${catalog.brands.length} brands, ${catalog.products.length} products -> ${path.relative(process.cwd(), target)}`);
