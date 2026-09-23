import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { brandsTable } from "./brands";

/** Long-form, DND-style product storytelling. Optional; sections only render when present. */
export type ProductEditorial = {
  statement?: string;
  awards?: string[];
  chapters?: { title: string; body: string; image?: string | null }[];
  designer?: { name: string; bio: string; url?: string | null };
  gallery?: string[];
};

/** Structured product content modelled on partner-brand product pages (DND, Blum, Häfele, Barazza). All optional; sections render only when present. */
export type ProductDetails = {
  sourceUrl?: string | null;
  collection?: string | null;
  brandCategoryPath?: string[];
  badges?: string[];
  summary?: string | null;
  features?: { title: string; body?: string | null; image?: string | null }[];
  variants?: {
    code: string;
    label: string;
    kind: "finish" | "size" | "model" | "colour";
    articleNumber?: string | null;
    attributes?: Record<string, string>;
    image?: string | null;
  }[];
  applications?: string[];
  downloads?: { label: string; fileType: string }[];
  media?: { src: string; role: "cutout" | "finish" | "detail" | "ambient" | "technical"; variantCode?: string | null; alt?: string | null }[];
  related?: string[];
  videos?: number;
};

export const productsTable = pgTable("catalog_products", {
  id: serial("id").primaryKey(),
  legacyId: text("legacy_id").unique(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  brandId: integer("brand_id").notNull().references(() => brandsTable.id, { onDelete: "restrict" }),
  sku: text("sku"),
  category: text("category"),
  family: text("family"),
  description: text("description").notNull().default(""),
  material: text("material"),
  finish: text("finish"),
  dimensions: text("dimensions"),
  images: text("images").array().notNull().default([]),
  specs: jsonb("specs").$type<{ label: string; value: string; group?: string | null }[]>().notNull().default([]),
  finishes: text("finishes").array().notNull().default([]),
  installationNotes: text("installation_notes"),
  editorial: jsonb("editorial").$type<ProductEditorial>(),
  details: jsonb("details").$type<ProductDetails>(),
  isFeatured: boolean("is_featured").notNull().default(false),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ProductRecord = typeof productsTable.$inferSelect;