import { and, asc, eq } from "drizzle-orm";
import { catalogMetaTable, db, brandsTable, productsTable } from "@workspace/db";
import { initialBrands, initialProducts } from "./catalog-seed";

const SEEDED_KEY = "partner-extraction-v3";
let seedPromise: Promise<void> | undefined;

export type ContentStatus = "draft" | "published" | "comingSoon" | "retired";
export type CatalogSpec = { label: string; value: string; group?: string | null };

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
  editorial?: ProductEditorial | null;
  details?: ProductDetails | null;
  isFeatured: boolean;
  status: ContentStatus;
};

type BrandRow = typeof brandsTable.$inferSelect;
type ProductRow = typeof productsTable.$inferSelect;
export type ProductEditorial = NonNullable<ProductRow["editorial"]>;
export type ProductDetails = NonNullable<ProductRow["details"]>;

export async function ensureCatalogSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      await db.transaction(async (tx) => {
        // Seeding fills gaps: rows a previous seed created, or staff have since edited in the
        // content workspace, are left untouched. Only slugs that do not exist are added. It runs
        // on every boot rather than once, so products added to the seed later still arrive; the
        // work is two selects when there is nothing to add.
        await tx.insert(brandsTable).values(initialBrands).onConflictDoNothing({ target: brandsTable.slug });
        const brandRows = await tx.select({ id: brandsTable.id, slug: brandsTable.slug }).from(brandsTable);
        const brandIds = new Map(brandRows.map((brand) => [brand.slug, brand.id]));

        const existing = await tx.select({ slug: productsTable.slug }).from(productsTable);
        const existingSlugs = new Set(existing.map((product) => product.slug));
        const missing = initialProducts.filter(
          (product) => !existingSlugs.has(product.slug) && brandIds.has(product.brandSlug),
        );

        if (missing.length > 0) {
          await tx
            .insert(productsTable)
            .values(
              missing.map((product) => ({
                title: product.title,
                slug: product.slug,
                brandId: brandIds.get(product.brandSlug)!,
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
              })),
            )
            .onConflictDoNothing({ target: productsTable.slug });
        }

        await tx.insert(catalogMetaTable).values({ key: SEEDED_KEY, value: "true" }).onConflictDoNothing({ target: catalogMetaTable.key });
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
    editorial: product.editorial ?? null,
    details: product.details ?? null,
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
    editorial: input.editorial ?? null,
    details: input.details ?? null,
    isFeatured: input.isFeatured,
    status: input.status,
  };
}