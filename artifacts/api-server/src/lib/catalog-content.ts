import { and, asc, eq } from "drizzle-orm";
import { catalogMetaTable, db, brandsTable, productsTable } from "@workspace/db";
import { initialBrands, initialProducts } from "./catalog-seed";

const SEEDED_KEY = "initial-seed-v1";
let seedPromise: Promise<void> | undefined;

export type ContentStatus = "draft" | "published" | "comingSoon";
export type CatalogSpec = { label: string; value: string };

export type BrandInput = {
  legacyId?: string | null;
  name: string;
  slug: string;
  country?: string | null;
  category?: string | null;
  summary?: string | null;
  description: string;
  coverImage?: string | null;
  websiteUrl?: string | null;
  isFeatured: boolean;
  status: ContentStatus;
};

export type ProductInput = {
  legacyId?: string | null;
  title: string;
  slug: string;
  brandSlug: string;
  category: string;
  sku?: string | null;
  family?: string | null;
  description: string;
  image: string | null;
  images: string[];
  material?: string | null;
  finish?: string | null;
  dimensions?: string | null;
  specs: CatalogSpec[];
  finishes: string[];
  installationNotes?: string | null;
  isFeatured: boolean;
  status: ContentStatus;
};

type BrandRow = typeof brandsTable.$inferSelect;
type ProductRow = typeof productsTable.$inferSelect;

export async function ensureCatalogSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const seeded = await db.query.catalogMetaTable.findFirst({
        where: (meta, { eq: equals }) => equals(meta.key, SEEDED_KEY),
      });
      if (seeded) return;

      await db.transaction(async (tx) => {
        const alreadySeeded = await tx.query.catalogMetaTable.findFirst({
      where: (meta, { eq: equals }) => equals(meta.key, SEEDED_KEY),
        });
        if (alreadySeeded) return;

        const seededBrands = await tx
          .insert(brandsTable)
          .values(initialBrands.map((brand) => ({ ...brand, isFeatured: true, status: "published" })))
          .returning();
        const brandIds = new Map(seededBrands.map((brand) => [brand.slug, brand.id]));

        await tx.insert(productsTable).values(
          initialProducts.map(([title, slug, brandSlug, category, description, specs, finishes]) => ({
            title,
            slug,
            brandId: brandIds.get(brandSlug)!,
            category,
            description,
            images: [brandSlug === "salice" ? "/images/brand-sliding.jpg" : "/images/product-handle.jpg"],
            specs: specs.map(([label, value]) => ({ label, value })),
            finishes: [...finishes],
            isFeatured: true,
            status: "published",
          })),
        );
        await tx.insert(catalogMetaTable).values({ key: SEEDED_KEY, value: "true" });
      });
    })().catch((error) => {
      seedPromise = undefined;
      throw error;
    });
  }
  await seedPromise;
}

export function toBrandResponse(brand: BrandRow) {
  return {
    id: brand.id,
    legacyId: brand.legacyId,
    name: brand.name,
    slug: brand.slug,
    country: brand.country,
    origin: brand.country ?? "Partner brand",
    category: brand.category,
    summary: brand.summary,
    description: brand.description,
    coverImage: brand.coverImage,
    websiteUrl: brand.websiteUrl,
    isFeatured: brand.isFeatured,
    status: brand.status as ContentStatus,
  };
}

export function toProductResponse(product: ProductRow, brand: BrandRow) {
  return {
    id: product.id,
    legacyId: product.legacyId,
    title: product.title,
    name: product.title,
    slug: product.slug,
    brandId: product.brandId,
    brandSlug: brand.slug,
    brandName: brand.name,
    sku: product.sku,
    category: product.category ?? "Uncategorised",
    family: product.family,
    description: product.description,
    image: product.images[0] ?? null,
    images: product.images,
    material: product.material,
    finish: product.finish,
    dimensions: product.dimensions,
    specs: product.specs,
    finishes: product.finishes,
    installationNotes: product.installationNotes,
    isFeatured: product.isFeatured,
    status: product.status as ContentStatus,
  };
}

export async function listBrandRows(publishedOnly = false): Promise<BrandRow[]> {
  await ensureCatalogSeeded();
  return db.select().from(brandsTable).where(publishedOnly ? eq(brandsTable.status, "published") : undefined).orderBy(asc(brandsTable.name));
}

export async function listProductRows(publishedOnly = false) {
  await ensureCatalogSeeded();
  const rows = await db
    .select({ product: productsTable, brand: brandsTable })
    .from(productsTable)
    .innerJoin(brandsTable, eq(productsTable.brandId, brandsTable.id))
    .where(publishedOnly ? and(eq(productsTable.status, "published"), eq(brandsTable.status, "published")) : undefined)
    .orderBy(asc(productsTable.title));
  return rows;
}

export async function getBrandRow(slug: string, publishedOnly = false): Promise<BrandRow | undefined> {
  await ensureCatalogSeeded();
  const [brand] = await db
    .select()
    .from(brandsTable)
    .where(publishedOnly ? and(eq(brandsTable.slug, slug), eq(brandsTable.status, "published")) : eq(brandsTable.slug, slug));
  return brand;
}

export async function getProductRow(slug: string, publishedOnly = false) {
  await ensureCatalogSeeded();
  const [row] = await db
    .select({ product: productsTable, brand: brandsTable })
    .from(productsTable)
    .innerJoin(brandsTable, eq(productsTable.brandId, brandsTable.id))
    .where(
      publishedOnly
        ? and(eq(productsTable.slug, slug), eq(productsTable.status, "published"), eq(brandsTable.status, "published"))
        : eq(productsTable.slug, slug),
    );
  return row;
}

export async function getBrandForProductInput(input: ProductInput): Promise<BrandRow | undefined> {
  return getBrandRow(input.brandSlug);
}

export function productValues(input: ProductInput, brandId: number) {
  const images = Array.from(new Set([input.image, ...input.images].filter((value): value is string => Boolean(value))));
  return {
    legacyId: input.legacyId ?? null,
    title: input.title,
    slug: input.slug,
    brandId,
    sku: input.sku ?? null,
    category: input.category,
    family: input.family ?? null,
    description: input.description,
    images,
    specs: input.specs,
    finishes: input.finishes,
    material: input.material ?? null,
    finish: input.finish ?? null,
    dimensions: input.dimensions ?? null,
    installationNotes: input.installationNotes ?? null,
    isFeatured: input.isFeatured,
    status: input.status,
  };
}