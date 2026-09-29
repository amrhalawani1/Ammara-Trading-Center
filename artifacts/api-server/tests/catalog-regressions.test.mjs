import assert from "node:assert/strict";
import http from "node:http";
import { after, before, test } from "node:test";
import { Client } from "pg";

const STAFF_ID = "catalog-test-staff";
const NON_STAFF_ID = "catalog-test-non-staff";
const fixtureKey = `catalog-regression-${Date.now()}`;
const originalStaffIds = process.env.CONTENT_STAFF_USER_IDS;
const originalDatabaseUrl = process.env.DATABASE_URL;
const testDatabaseUrl = process.env.CATALOG_TEST_DATABASE_URL;
const testSchema = `atc_catalog_regression_${process.pid}_${Date.now()}`;

let server;
let baseUrl;
let adminClient;
let createApp;

if (!testDatabaseUrl) {
  throw new Error(
    "CATALOG_TEST_DATABASE_URL is required. Point it to a development test database before running this suite.",
  );
}

function authHeaders(userId) {
  return userId ? { "x-atc-test-user": userId } : {};
}

async function request(path, { userId, method = "GET", body } = {}) {
  const headers = {
    ...authHeaders(userId),
    ...(body === undefined ? {} : { "content-type": "application/json" }),
  };
  return fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined || method === "GET" || method === "HEAD" ? undefined : JSON.stringify(body),
  });
}

async function json(response) {
  return response.json();
}

function brandInput(overrides = {}) {
  return {
    legacyId: `${fixtureKey}-brand`,
    name: "Regression Test Brand",
    slug: `${fixtureKey}-brand`,
    country: "Jordan",
    category: "Test Fixtures",
    summary: "Created only by the catalogue regression suite.",
    description: "A controlled brand record for publication and access-control coverage.",
    coverImage: null,
    websiteUrl: null,
    isFeatured: false,
    status: "draft",
    ...overrides,
  };
}

function productInput(overrides = {}) {
  return {
    legacyId: `${fixtureKey}-product`,
    title: "Regression Test System",
    slug: `${fixtureKey}-product`,
    brandSlug: `${fixtureKey}-brand`,
    sku: "ATC-TEST-01",
    category: "Test Systems",
    family: "Regression",
    description: "A controlled product record for publication and access-control coverage.",
    image: null,
    images: [],
    material: null,
    finish: null,
    dimensions: null,
    specs: [{ label: "Test dimension", value: "1 mm" }],
    finishes: ["Test finish"],
    installationNotes: null,
    isFeatured: false,
    status: "draft",
    ...overrides,
  };
}

async function cleanupFixture() {
  const productsResponse = await request("/api/content/products", { userId: STAFF_ID });
  if (productsResponse.ok) {
    const products = await json(productsResponse);
    await Promise.all(
      products
        .filter((product) => product.legacyId?.startsWith(fixtureKey))
        .map((product) => request(`/api/content/products/${product.id}`, { userId: STAFF_ID, method: "DELETE" })),
    );
  }

  const brandsResponse = await request("/api/content/brands", { userId: STAFF_ID });
  if (brandsResponse.ok) {
    const brands = await json(brandsResponse);
    await Promise.all(
      brands
        .filter((brand) => brand.legacyId?.startsWith(fixtureKey))
        .map((brand) => request(`/api/content/brands/${brand.id}`, { userId: STAFF_ID, method: "DELETE" })),
    );
  }
}

before(async () => {
  process.env.CONTENT_STAFF_USER_IDS = STAFF_ID;
  adminClient = new Client({ connectionString: testDatabaseUrl });
  await adminClient.connect();
  await adminClient.query(`
    CREATE SCHEMA ${testSchema};
    CREATE TABLE ${testSchema}.catalog_brands (
      id serial PRIMARY KEY,
      legacy_id text UNIQUE,
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      country text,
      category text,
      summary text,
      description text NOT NULL DEFAULT '',
      cover_image text,
      website_url text,
      is_featured boolean NOT NULL DEFAULT false,
      status text NOT NULL DEFAULT 'draft',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE ${testSchema}.catalog_products (
      id serial PRIMARY KEY,
      legacy_id text UNIQUE,
      title text NOT NULL,
      slug text NOT NULL UNIQUE,
      brand_id integer NOT NULL REFERENCES ${testSchema}.catalog_brands(id) ON DELETE RESTRICT,
      sku text,
      category text,
      family text,
      description text NOT NULL DEFAULT '',
      material text,
      finish text,
      dimensions text,
      images text[] NOT NULL DEFAULT '{}',
      specs jsonb NOT NULL DEFAULT '[]',
      finishes text[] NOT NULL DEFAULT '{}',
      installation_notes text,
      editorial jsonb,
      details jsonb,
      is_featured boolean NOT NULL DEFAULT false,
      status text NOT NULL DEFAULT 'draft',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE ${testSchema}.catalog_meta (
      key text PRIMARY KEY,
      value text NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE ${testSchema}.catalog_inquiries (
      id serial PRIMARY KEY,
      kind text NOT NULL,
      name text NOT NULL,
      email text NOT NULL,
      phone text,
      company text,
      project_type text,
      message text NOT NULL,
      reference text UNIQUE,
      list_name text,
      timeline text,
      items jsonb,
      clerk_user_id text,
      status text NOT NULL DEFAULT 'submitted',
      status_updated_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE ${testSchema}.trade_profiles (
      id serial PRIMARY KEY,
      clerk_user_id text NOT NULL UNIQUE,
      email text NOT NULL,
      name text,
      company text,
      role text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE ${testSchema}.trade_shortlists (
      clerk_user_id text PRIMARY KEY,
      state jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  const isolatedUrl = new URL(testDatabaseUrl);
  isolatedUrl.searchParams.set("options", `-c search_path=${testSchema},public`);
  process.env.DATABASE_URL = isolatedUrl.toString();
  ({ createApp } = await import("../dist/index.mjs"));
  const app = createApp({
    disableClerkMiddleware: true,
    authReader: (req) => {
      const userId = req.header("x-atc-test-user");
      return userId ? { userId } : {};
    },
  });
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await cleanupFixture();
  server.closeAllConnections?.();
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  await adminClient.query(`DROP SCHEMA IF EXISTS ${testSchema} CASCADE`);
  await adminClient.end();
  if (originalStaffIds === undefined) {
    delete process.env.CONTENT_STAFF_USER_IDS;
  } else {
    process.env.CONTENT_STAFF_USER_IDS = originalStaffIds;
  }
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

test("every content endpoint rejects anonymous and signed-in non-staff requests", async () => {
  const protectedRequests = [
    ["GET", "/api/content/access"],
    ["GET", "/api/content/brands"],
    ["POST", "/api/content/brands"],
    ["PUT", "/api/content/brands/999999"],
    ["DELETE", "/api/content/brands/999999"],
    ["GET", "/api/content/products"],
    ["POST", "/api/content/products"],
    ["PUT", "/api/content/products/999999"],
    ["DELETE", "/api/content/products/999999"],
    ["POST", "/api/content/import"],
    ["GET", "/api/content/inquiries"],
    ["PATCH", "/api/content/inquiries/1"],
  ];

  for (const [method, path] of protectedRequests) {
    const anonymous = await request(path, { method, body: {} });
    assert.equal(anonymous.status, 401, `${method} ${path} should reject anonymous visitors`);

    const nonStaff = await request(path, { method, userId: NON_STAFF_ID, body: {} });
    assert.equal(nonStaff.status, 403, `${method} ${path} should reject signed-in non-staff users`);
  }
});

test("staff can create, publish, retire, and import records without leaking non-published content", async () => {
  const draftBrandResponse = await request("/api/content/brands", {
    method: "POST",
    userId: STAFF_ID,
    body: brandInput(),
  });
  assert.equal(draftBrandResponse.status, 201);
  const draftBrand = await json(draftBrandResponse);

  const draftProductResponse = await request("/api/content/products", {
    method: "POST",
    userId: STAFF_ID,
    body: productInput(),
  });
  assert.equal(draftProductResponse.status, 201);
  const draftProduct = await json(draftProductResponse);

  for (const path of [
    `/api/catalog/brands/${draftBrand.slug}`,
    `/api/catalog/products/${draftProduct.slug}`,
  ]) {
    const response = await request(path);
    assert.equal(response.status, 404, `${path} should hide draft content`);
  }
  const draftCatalog = await json(await request("/api/catalog"));
  assert.ok(!draftCatalog.brands.some((brand) => brand.slug === draftBrand.slug));
  assert.ok(!draftCatalog.products.some((product) => product.slug === draftProduct.slug));

  const publishedBrandResponse = await request(`/api/content/brands/${draftBrand.id}`, {
    method: "PUT",
    userId: STAFF_ID,
    body: brandInput({ status: "published" }),
  });
  assert.equal(publishedBrandResponse.status, 200);

  const publishedProductResponse = await request(`/api/content/products/${draftProduct.id}`, {
    method: "PUT",
    userId: STAFF_ID,
    body: productInput({ status: "published" }),
  });
  assert.equal(publishedProductResponse.status, 200);

  const publicBrand = await json(await request(`/api/catalog/brands/${draftBrand.slug}`));
  assert.equal(publicBrand.status, "published");
  assert.ok(publicBrand.products.some((product) => product.slug === draftProduct.slug));

  const publicProduct = await json(await request(`/api/catalog/products/${draftProduct.slug}`));
  assert.equal(publicProduct.status, "published");
  assert.equal(publicProduct.brandSlug, draftBrand.slug);

  const retiredProductResponse = await request(`/api/content/products/${draftProduct.id}`, {
    method: "PUT",
    userId: STAFF_ID,
    body: productInput({ status: "retired" }),
  });
  assert.equal(retiredProductResponse.status, 200);
  assert.equal((await json(retiredProductResponse)).status, "retired");
  assert.equal((await request(`/api/catalog/products/${draftProduct.slug}`)).status, 404);

  const retiredBrandResponse = await request(`/api/content/brands/${draftBrand.id}`, {
    method: "PUT",
    userId: STAFF_ID,
    body: brandInput({ status: "retired" }),
  });
  assert.equal(retiredBrandResponse.status, 200);
  assert.equal((await json(retiredBrandResponse)).status, "retired");
  assert.equal((await request(`/api/catalog/brands/${draftBrand.slug}`)).status, 404);

  const importedBrand = brandInput({
    legacyId: `${fixtureKey}-import-brand`,
    slug: `${fixtureKey}-import-brand`,
    name: "Imported Regression Brand",
    status: "published",
  });
  const importedProduct = productInput({
    legacyId: `${fixtureKey}-import-product`,
    slug: `${fixtureKey}-import-product`,
    brandSlug: importedBrand.slug,
    title: "Imported Regression System",
    status: "published",
  });

  const importResponse = await request("/api/content/import", {
    method: "POST",
    userId: STAFF_ID,
    body: { brands: [importedBrand], products: [importedProduct] },
  });
  assert.equal(importResponse.status, 200);
  assert.equal((await json(importResponse)).preservedSlugs, 0);
  assert.equal((await request(`/api/catalog/products/${importedProduct.slug}`)).status, 200);

  const importedUpdateResponse = await request("/api/content/import", {
    method: "POST",
    userId: STAFF_ID,
    body: {
      brands: [brandInput({ ...importedBrand, slug: `${fixtureKey}-brand-renamed` })],
      products: [
        productInput({
          ...importedProduct,
          slug: `${fixtureKey}-product-renamed`,
          brandSlug: `${fixtureKey}-brand-renamed`,
        }),
      ],
    },
  });
  assert.equal(importedUpdateResponse.status, 200);
  assert.equal((await json(importedUpdateResponse)).preservedSlugs, 2);
  assert.equal((await request(`/api/catalog/products/${importedProduct.slug}`)).status, 200);
  assert.equal((await request(`/api/catalog/products/${fixtureKey}-product-renamed`)).status, 404);

  const failedImportResponse = await request("/api/content/import", {
    method: "POST",
    userId: STAFF_ID,
    body: {
      brands: [],
      products: [
        productInput({
          legacyId: `${fixtureKey}-invalid-product`,
          slug: `${fixtureKey}-invalid-product`,
          brandSlug: `${fixtureKey}-missing-brand`,
          status: "published",
        }),
      ],
    },
  });
  assert.equal(failedImportResponse.status, 400);
  const contentProducts = await json(await request("/api/content/products", { userId: STAFF_ID }));
  assert.ok(!contentProducts.some((product) => product.slug === `${fixtureKey}-invalid-product`));
});

const REFERENCE_PATTERN = /^ATC-\d{6}-[A-HJ-NP-Z2-9]{4}$/;

test("shortlist inquiries are stored with a unique reference and rejected when empty", async () => {
  const items = [
    { slug: "ginkgo", name: "Ginkgo", brandName: "DND", reference: "GK11-F7", variant: "F7 - Satin chrome", quantity: 12 },
    { slug: "arcitech", name: "ArciTech drawer", brandName: "Hettich", reference: null, variant: null, quantity: 3 },
  ];
  const body = {
    kind: "shortlist",
    name: "Nour Haddad",
    email: "nour@example.com",
    company: "Haddad Kitchens",
    projectType: "Kitchen",
    timeline: "1 to 3 months",
    listName: "Villa kitchen, phase two",
    message: "Project shortlist: Villa kitchen, phase two. Two references attached.",
    items,
  };
  const first = await request("/api/inquiries", { method: "POST", body });
  assert.equal(first.status, 201);
  const firstBody = await json(first);
  assert.match(firstBody.reference, REFERENCE_PATTERN);

  const second = await request("/api/inquiries", { method: "POST", body });
  assert.equal(second.status, 201);
  assert.notEqual((await json(second)).reference, firstBody.reference);

  const stored = await adminClient.query(`SELECT reference, list_name, timeline, items FROM ${testSchema}.catalog_inquiries WHERE reference = $1`, [firstBody.reference]);
  assert.equal(stored.rows[0].list_name, body.listName);
  assert.equal(stored.rows[0].timeline, body.timeline);
  assert.equal(stored.rows[0].items.length, 2);
  assert.equal(stored.rows[0].items[0].quantity, 12);

  const empty = await request("/api/inquiries", { method: "POST", body: { ...body, items: [] } });
  assert.equal(empty.status, 400);
  const missing = await request("/api/inquiries", { method: "POST", body: { ...body, items: undefined } });
  assert.equal(missing.status, 400);
  const zero = await request("/api/inquiries", { method: "POST", body: { ...body, items: [{ ...items[0], quantity: 0 }] } });
  assert.equal(zero.status, 400);
});

test("public visitors can submit a valid inquiry and invalid bodies are rejected", async () => {
  const invalid = await request("/api/inquiries", {
    method: "POST",
    body: { kind: "general", name: "A", email: "not-an-email", message: "short" },
  });
  assert.equal(invalid.status, 400);

  const created = await request("/api/inquiries", {
    method: "POST",
    body: {
      kind: "general",
      name: "Amara Visitor",
      email: "visitor@example.com",
      phone: "+962 6 581 0000",
      company: "Studio",
      projectType: "Kitchen",
      message: "I would like a showroom visit and a quotation.",
    },
  });
  assert.equal(created.status, 201);
  const createdBody = await json(created);
  assert.equal(createdBody.accepted, true);
  assert.match(createdBody.reference, REFERENCE_PATTERN);

  const anonymousProtected = await request("/api/content/access");
  assert.equal(anonymousProtected.status, 401);
});

test("guest inquiries stay public and signed-in inquiries attach to the account", async () => {
  const guest = await request("/api/inquiries", {
    method: "POST",
    body: {
      kind: "general",
      name: "Guest Buyer",
      email: "buyer@example.com",
      message: "Please confirm availability for a hotel floor.",
    },
  });
  assert.equal(guest.status, 201);
  const guestRef = (await json(guest)).reference;
  const guestRow = await adminClient.query(
    `SELECT clerk_user_id, status FROM ${testSchema}.catalog_inquiries WHERE reference = $1`,
    [guestRef],
  );
  assert.equal(guestRow.rows[0].clerk_user_id, null);
  assert.equal(guestRow.rows[0].status, "submitted");

  const attached = await request("/api/inquiries", {
    method: "POST",
    userId: NON_STAFF_ID,
    body: {
      kind: "general",
      name: "Signed Buyer",
      email: "signed@example.com",
      message: "Please confirm availability for a hotel floor.",
    },
  });
  assert.equal(attached.status, 201);
  const attachedRef = (await json(attached)).reference;
  const attachedRow = await adminClient.query(
    `SELECT clerk_user_id FROM ${testSchema}.catalog_inquiries WHERE reference = $1`,
    [attachedRef],
  );
  assert.equal(attachedRow.rows[0].clerk_user_id, NON_STAFF_ID);

  assert.equal((await request("/api/account/inquiries")).status, 401);
  const mine = await request("/api/account/inquiries", { userId: NON_STAFF_ID });
  assert.equal(mine.status, 200);
  const mineBody = await json(mine);
  assert.ok(mineBody.some((row) => row.reference === attachedRef));
  assert.ok(!mineBody.some((row) => row.reference === guestRef));
});

test("signing in claims guest inquiries by email and staff can set status", async () => {
  const created = await request("/api/inquiries", {
    method: "POST",
    body: {
      kind: "general",
      name: "Procure Lead",
      email: "procure@example.com",
      message: "Need a vendor file for a government project.",
    },
  });
  const reference = (await json(created)).reference;

  const profile = await request("/api/account/profile", {
    method: "PUT",
    userId: NON_STAFF_ID,
    body: { email: "procure@example.com", name: "Procure Lead", company: "Ministry", role: "procurement" },
  });
  assert.equal(profile.status, 200);

  const claimed = await request("/api/account/inquiries", { userId: NON_STAFF_ID });
  assert.equal(claimed.status, 200);
  assert.ok((await json(claimed)).some((row) => row.reference === reference));

  const inbox = await request("/api/content/inquiries", { userId: STAFF_ID });
  assert.equal(inbox.status, 200);
  const row = (await json(inbox)).find((item) => item.reference === reference);
  assert.ok(row);

  const patched = await request(`/api/content/inquiries/${row.id}`, {
    method: "PATCH",
    userId: STAFF_ID,
    body: { status: "in_progress" },
  });
  assert.equal(patched.status, 200);
  assert.equal((await json(patched)).status, "in_progress");

  const history = await json(await request("/api/account/inquiries", { userId: NON_STAFF_ID }));
  assert.equal(history.find((item) => item.reference === reference).status, "in_progress");
});

test("account shortlists merge on first save and stay private to the user", async () => {
  assert.equal((await request("/api/account/shortlists")).status, 401);
  const first = await request("/api/account/shortlists", {
    method: "PUT",
    userId: NON_STAFF_ID,
    body: {
      merge: true,
      state: {
        version: 1,
        activeListId: "local-1",
        lists: [
          {
            id: "local-1",
            name: "Villa kitchen",
            createdAt: "2026-01-01T00:00:00.000Z",
            items: [
              {
                key: "ginkgo",
                slug: "ginkgo",
                name: "Ginkgo",
                brandName: "DND",
                reference: "GK11",
                variant: null,
                image: null,
                quantity: 2,
                addedAt: "2026-01-01T00:00:00.000Z",
                kind: "product",
              },
            ],
          },
        ],
      },
    },
  });
  assert.equal(first.status, 200);
  const second = await request("/api/account/shortlists", {
    method: "PUT",
    userId: NON_STAFF_ID,
    body: {
      merge: true,
      state: {
        version: 1,
        activeListId: "local-2",
        lists: [
          {
            id: "local-2",
            name: "Villa kitchen",
            createdAt: "2026-02-01T00:00:00.000Z",
            items: [
              {
                key: "ginkgo",
                slug: "ginkgo",
                name: "Ginkgo",
                brandName: "DND",
                reference: "GK11",
                variant: null,
                image: null,
                quantity: 1,
                addedAt: "2026-02-01T00:00:00.000Z",
                kind: "product",
              },
            ],
          },
        ],
      },
    },
  });
  assert.equal(second.status, 200);
  const merged = await json(second);
  assert.equal(merged.lists[0].items[0].quantity, 3);

  const other = await json(await request("/api/account/shortlists", { userId: STAFF_ID }));
  assert.equal(other.lists[0].items.length, 0);
});