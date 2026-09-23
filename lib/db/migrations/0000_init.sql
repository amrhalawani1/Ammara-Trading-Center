CREATE TABLE IF NOT EXISTS "catalog_brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"legacy_id" text,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"country" text,
	"category" text,
	"summary" text,
	"description" text DEFAULT '' NOT NULL,
	"cover_image" text,
	"website_url" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "catalog_brands_legacy_id_unique" UNIQUE("legacy_id"),
	CONSTRAINT "catalog_brands_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "catalog_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"legacy_id" text,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"brand_id" integer NOT NULL,
	"sku" text,
	"category" text,
	"family" text,
	"description" text DEFAULT '' NOT NULL,
	"material" text,
	"finish" text,
	"dimensions" text,
	"images" text[] DEFAULT '{}' NOT NULL,
	"specs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"finishes" text[] DEFAULT '{}' NOT NULL,
	"installation_notes" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "catalog_products_legacy_id_unique" UNIQUE("legacy_id"),
	CONSTRAINT "catalog_products_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "catalog_meta" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "catalog_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"project_type" text,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "catalog_products" ADD CONSTRAINT "catalog_products_brand_id_catalog_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "catalog_brands"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
