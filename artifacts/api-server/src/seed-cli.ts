// Applies the catalogue seed to the database in DATABASE_URL without going through the API.
//
//   pnpm --filter @workspace/api-server run seed:catalog
//     Fills gaps only: rows that already exist, including staff edits made in the content
//     workspace, are left untouched.
//
//   pnpm --filter @workspace/api-server run seed:catalog -- --refresh
//     Additionally overwrites the catalogue fields of every product whose slug appears in the
//     seed. Intended for development after regenerating catalog-extracted.ts; it will discard
//     staff edits to those products, so do not run it against production data.
import "./load-env";

// @workspace/db reads DATABASE_URL at import time, so it is imported after ./load-env has run.
const { eq } = await import("drizzle-orm");
const { db, productsTable } = await import("@workspace/db");
const { ensureCatalogSeeded } = await import("./lib/catalog-content.js");
const { initialProducts } = await import("./lib/catalog-seed.js");

await ensureCatalogSeeded();

if (process.argv.includes("--refresh")) {
  let updated = 0;
  for (const product of initialProducts) {
    const result = await db
      .update(productsTable)
      .set({
        title: product.title,
        category: product.category,
        family: product.family ?? null,
        sku: product.sku ?? null,
        description: product.description,
        images: product.images,
        specs: product.specs,
        finishes: [...product.finishes],
        editorial: product.editorial ?? null,
        details: product.details ?? null,
        isFeatured: product.isFeatured,
        status: product.status,
      })
      .where(eq(productsTable.slug, product.slug))
      .returning({ slug: productsTable.slug });
    updated += result.length;
  }
  console.log(`catalogue seed applied; ${updated} products refreshed from seed data`);
} else {
  console.log("catalogue seed applied (gaps only)");
}

process.exit(0);
