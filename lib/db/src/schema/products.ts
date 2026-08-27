import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { brandsTable } from "./brands";

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
  specs: jsonb("specs").$type<{ label: string; value: string }[]>().notNull().default([]),
  finishes: text("finishes").array().notNull().default([]),
  installationNotes: text("installation_notes"),
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