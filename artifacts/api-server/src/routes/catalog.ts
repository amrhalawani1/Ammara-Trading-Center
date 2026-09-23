import { Router, type IRouter, type RequestHandler } from "express";
import { eq } from "drizzle-orm";
import { brandsTable, db, productsTable } from "@workspace/db";
import {
  CreateContentBrandBody,
  CreateContentBrandResponse,
  CreateContentProductBody,
  CreateContentProductResponse,
  DeleteContentBrandParams,
  DeleteContentProductParams,
  GetPublicBrandParams,
  GetPublicBrandResponse,
  GetPublicCatalogResponse,
  GetPublicProductParams,
  GetPublicProductResponse,
  ImportCatalogContentBody,
  ImportCatalogContentResponse,
  ListContentBrandsResponse,
  ListContentProductsResponse,
  UpdateContentBrandBody,
  UpdateContentBrandParams,
  UpdateContentBrandResponse,
  UpdateContentProductBody,
  UpdateContentProductParams,
  UpdateContentProductResponse,
} from "@workspace/api-zod";
import {
  type BrandInput,
  type ProductInput,
  ensureCatalogSeeded,
  getBrandForProductInput,
  getBrandRow,
  getProductRow,
  listBrandRows,
  listProductRows,
  productValues,
  toBrandResponse,
  toProductResponse,
} from "../lib/catalog-content";
import { requireStaffAuth } from "../middlewares/requireStaffAuth";
import { sendError } from "../lib/http";

export function createCatalogRouter(staffAuth: RequestHandler = requireStaffAuth): IRouter {
  const router: IRouter = Router();

function brandValues(input: BrandInput) {
  return {
    legacyId: input.legacyId ?? null,
    name: input.name,
    slug: input.slug,
    country: input.country ?? null,
    category: input.category ?? null,
    summary: input.summary ?? null,
    description: input.description,
    coverImage: input.coverImage ?? null,
    websiteUrl: input.websiteUrl ?? null,
    isFeatured: input.isFeatured,
    status: input.status,
  };
}

router.get("/catalog", async (_req, res): Promise<void> => {
  const [brandRows, productRows] = await Promise.all([listBrandRows(true), listProductRows(true)]);
  const products = productRows.map(({ product, brand }) => toProductResponse(product, brand));
  const categories = [...new Set(products.map((product) => product.category))].sort((a, b) => a.localeCompare(b));
  res.json(GetPublicCatalogResponse.parse({ brands: brandRows.map(toBrandResponse), products, categories }));
});

router.get("/catalog/brands/:slug", async (req, res): Promise<void> => {
  const params = GetPublicBrandParams.safeParse(req.params);
  if (!params.success) {
    sendError(res, 400, "Invalid request", params.error.flatten());
    return;
  }
  const brand = await getBrandRow(params.data.slug, true);
  if (!brand) {
    sendError(res, 404, "Brand not found");
    return;
  }
  const products = (await listProductRows(true))
    .filter(({ product }) => product.brandId === brand.id)
    .map(({ product, brand: productBrand }) => toProductResponse(product, productBrand));
  res.json(GetPublicBrandResponse.parse({ ...toBrandResponse(brand), products }));
});

router.get("/catalog/products/:slug", async (req, res): Promise<void> => {
  const params = GetPublicProductParams.safeParse(req.params);
  if (!params.success) {
    sendError(res, 400, "Invalid request", params.error.flatten());
    return;
  }
  const row = await getProductRow(params.data.slug, true);
  if (!row) {
    sendError(res, 404, "Product not found");
    return;
  }
  res.json(GetPublicProductResponse.parse(toProductResponse(row.product, row.brand)));
});

router.use("/content", staffAuth);

router.get("/content/access", (_req, res): void => {
  res.json({ allowed: true });
});

router.get("/content/brands", async (_req, res): Promise<void> => {
  const brands = await listBrandRows();
  res.json(ListContentBrandsResponse.parse(brands.map(toBrandResponse)));
});

router.post("/content/brands", async (req, res): Promise<void> => {
  const parsed = CreateContentBrandBody.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, "Invalid request", parsed.error.flatten());
    return;
  }
  try {
    const [brand] = await db.insert(brandsTable).values(brandValues(parsed.data as BrandInput)).returning();
    res.status(201).json(CreateContentBrandResponse.parse(toBrandResponse(brand)));
  } catch (error) {
    req.log.warn({ error }, "Could not create brand");
    sendError(res, 400, "A brand with this slug already exists.");
  }
});

router.put("/content/brands/:id", async (req, res): Promise<void> => {
  const params = UpdateContentBrandParams.safeParse(req.params);
  const parsed = UpdateContentBrandBody.safeParse(req.body);
  if (!params.success) {
    sendError(res, 400, "Invalid request", params.error.flatten());
    return;
  }
  if (!parsed.success) {
    sendError(res, 400, "Invalid request", parsed.error.flatten());
    return;
  }
  try {
    const [brand] = await db
      .update(brandsTable)
      .set(brandValues(parsed.data as BrandInput))
      .where(eq(brandsTable.id, params.data.id))
      .returning();
    if (!brand) {
      sendError(res, 404, "Brand not found");
      return;
    }
    res.json(UpdateContentBrandResponse.parse(toBrandResponse(brand)));
  } catch (error) {
    req.log.warn({ error }, "Could not update brand");
    sendError(res, 400, "A brand with this slug already exists.");
  }
});

router.delete("/content/brands/:id", async (req, res): Promise<void> => {
  const params = DeleteContentBrandParams.safeParse(req.params);
  if (!params.success) {
    sendError(res, 400, "Invalid request", params.error.flatten());
    return;
  }
  await ensureCatalogSeeded();
  const [product] = await db.select({ id: productsTable.id }).from(productsTable).where(eq(productsTable.brandId, params.data.id)).limit(1);
  if (product) {
    sendError(res, 400, "Retire this brand instead; products are still connected to it.");
    return;
  }
  const [brand] = await db.delete(brandsTable).where(eq(brandsTable.id, params.data.id)).returning();
  if (!brand) {
    sendError(res, 404, "Brand not found");
    return;
  }
  res.sendStatus(204);
});

router.get("/content/products", async (_req, res): Promise<void> => {
  const products = (await listProductRows()).map(({ product, brand }) => toProductResponse(product, brand));
  res.json(ListContentProductsResponse.parse(products));
});

router.post("/content/products", async (req, res): Promise<void> => {
  const parsed = CreateContentProductBody.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, "Invalid request", parsed.error.flatten());
    return;
  }
  const input = parsed.data as ProductInput;
  const brand = await getBrandForProductInput(input);
  if (!brand) {
    sendError(res, 400, "Choose an existing brand before creating a product.");
    return;
  }
  try {
    const [product] = await db.insert(productsTable).values(productValues(input, brand.id)).returning();
    res.status(201).json(CreateContentProductResponse.parse(toProductResponse(product, brand)));
  } catch (error) {
    req.log.warn({ error }, "Could not create product");
    sendError(res, 400, "A product with this slug already exists.");
  }
});

router.put("/content/products/:id", async (req, res): Promise<void> => {
  const params = UpdateContentProductParams.safeParse(req.params);
  const parsed = UpdateContentProductBody.safeParse(req.body);
  if (!params.success) {
    sendError(res, 400, "Invalid request", params.error.flatten());
    return;
  }
  if (!parsed.success) {
    sendError(res, 400, "Invalid request", parsed.error.flatten());
    return;
  }
  const input = parsed.data as ProductInput;
  const brand = await getBrandForProductInput(input);
  if (!brand) {
    sendError(res, 400, "Choose an existing brand before updating a product.");
    return;
  }
  try {
    const [product] = await db
      .update(productsTable)
      .set(productValues(input, brand.id))
      .where(eq(productsTable.id, params.data.id))
      .returning();
    if (!product) {
      sendError(res, 404, "Product not found");
      return;
    }
    res.json(UpdateContentProductResponse.parse(toProductResponse(product, brand)));
  } catch (error) {
    req.log.warn({ error }, "Could not update product");
    sendError(res, 400, "A product with this slug already exists.");
  }
});

router.delete("/content/products/:id", async (req, res): Promise<void> => {
  const params = DeleteContentProductParams.safeParse(req.params);
  if (!params.success) {
    sendError(res, 400, "Invalid request", params.error.flatten());
    return;
  }
  const [product] = await db.delete(productsTable).where(eq(productsTable.id, params.data.id)).returning();
  if (!product) {
    sendError(res, 404, "Product not found");
    return;
  }
  res.sendStatus(204);
});

router.post("/content/import", async (req, res): Promise<void> => {
  const parsed = ImportCatalogContentBody.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 400, "Invalid request", parsed.error.flatten());
    return;
  }
  const brandLegacyIds = parsed.data.brands.map((brand) => brand.legacyId);
  const productLegacyIds = parsed.data.products.map((product) => product.legacyId);
  const hasInvalidLegacyIds = (legacyIds: string[]) =>
    legacyIds.some((legacyId) => !legacyId) || new Set(legacyIds).size !== legacyIds.length;
  if (hasInvalidLegacyIds(brandLegacyIds) || hasInvalidLegacyIds(productLegacyIds)) {
    sendError(res, 400, "Each brand and product needs a unique MySQL legacyId within its own source table.");
    return;
  }
  await ensureCatalogSeeded();
  let preservedSlugs = 0;
  const brandIds = new Map<string, number>();

  try {
    await db.transaction(async (tx) => {
      for (const rawBrand of parsed.data.brands) {
        const brand = rawBrand as BrandInput;
        const [existingBySlug] = await tx.select().from(brandsTable).where(eq(brandsTable.slug, brand.slug));
        const [existingByLegacyId] = brand.legacyId
          ? await tx.select().from(brandsTable).where(eq(brandsTable.legacyId, brand.legacyId))
          : [];
        const existing = existingByLegacyId ?? existingBySlug;
        if (existing) {
          if (existing.slug !== brand.slug) preservedSlugs += 1;
          const [updated] = await tx
            .update(brandsTable)
            .set({ ...brandValues(brand), slug: existing.slug })
            .where(eq(brandsTable.id, existing.id))
            .returning();
          brandIds.set(brand.slug, updated.id);
          brandIds.set(updated.slug, updated.id);
        } else {
          const [created] = await tx.insert(brandsTable).values(brandValues(brand)).returning();
          brandIds.set(brand.slug, created.id);
        }
      }

      for (const rawProduct of parsed.data.products) {
        const product = rawProduct as ProductInput;
        const [existingBrand] = await tx
          .select({ id: brandsTable.id })
          .from(brandsTable)
          .where(eq(brandsTable.slug, product.brandSlug))
          .limit(1);
        const brandId = brandIds.get(product.brandSlug) ?? existingBrand?.id;
        if (!brandId) throw new Error(`Unknown brand slug: ${product.brandSlug}`);
        const [existingBySlug] = await tx.select().from(productsTable).where(eq(productsTable.slug, product.slug));
        const [existingByLegacyId] = product.legacyId
          ? await tx.select().from(productsTable).where(eq(productsTable.legacyId, product.legacyId))
          : [];
        const existing = existingByLegacyId ?? existingBySlug;
        if (existing) {
          if (existing.slug !== product.slug) preservedSlugs += 1;
          await tx
            .update(productsTable)
            .set({ ...productValues(product, brandId), slug: existing.slug })
            .where(eq(productsTable.id, existing.id));
        } else {
          await tx.insert(productsTable).values(productValues(product, brandId));
        }
      }
    });
  } catch (error) {
    req.log.warn({ error }, "Catalogue import rejected");
    sendError(res, 400, error instanceof Error ? error.message : "Import could not be completed.");
    return;
  }

  res.json(
    ImportCatalogContentResponse.parse({
      brandsUpserted: parsed.data.brands.length,
      productsUpserted: parsed.data.products.length,
      preservedSlugs,
    }),
  );
});

return router;
}

export default createCatalogRouter();