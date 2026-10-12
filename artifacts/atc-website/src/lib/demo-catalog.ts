import { setUnavailableFallback, type BrandDetail, type CatalogResponse, type Product } from "@workspace/api-client-react";

/**
 * Demo fallback for the public catalogue. When /api cannot answer (a frontend-only deployment
 * with no API or database), the three public catalogue requests are served from a snapshot of the
 * seed data, so every brand and product still shows. With a working API this never runs.
 *
 * Regenerate the snapshot after changing the seed:
 *   pnpm --filter @workspace/api-server run demo:catalog
 *
 * Only reads are covered. Enquiries, newsletter sign-ups and trade accounts still need the API.
 */
let snapshot: Promise<CatalogResponse> | undefined;
let announced = false;

const loadSnapshot = () => {
  snapshot ??= import("@/data/demo-catalog.json").then((module) => module.default as unknown as CatalogResponse);
  return snapshot;
};

const CATALOG = /\/api\/catalog\/?$/;
const BRAND = /\/api\/catalog\/brands\/([^/?#]+)\/?$/;
const PRODUCT = /\/api\/catalog\/products\/([^/?#]+)\/?$/;

function pathOf(url: string): string {
  try {
    return new URL(url, window.location.origin).pathname;
  } catch {
    return url;
  }
}

async function answer(path: string): Promise<CatalogResponse | BrandDetail | Product | undefined> {
  if (CATALOG.test(path)) return loadSnapshot();

  const brandMatch = BRAND.exec(path);
  if (brandMatch) {
    const catalog = await loadSnapshot();
    const slug = decodeURIComponent(brandMatch[1]!);
    const brand = catalog.brands.find((item) => item.slug === slug);
    // Unknown slugs fall through to the original failure, which the page shows as not found.
    return brand ? { ...brand, products: catalog.products.filter((product) => product.brandSlug === slug) } : undefined;
  }

  const productMatch = PRODUCT.exec(path);
  if (productMatch) {
    const catalog = await loadSnapshot();
    const slug = decodeURIComponent(productMatch[1]!);
    return catalog.products.find((product) => product.slug === slug);
  }

  return undefined;
}

export function installDemoCatalogFallback(): void {
  setUnavailableFallback(async ({ method, url, reason }) => {
    if (method !== "GET") return undefined;
    const result = await answer(pathOf(url));
    if (result !== undefined && !announced) {
      announced = true;
      console.info(`Catalogue API unavailable (${reason}); showing the bundled demo catalogue.`);
    }
    return result;
  });
}
