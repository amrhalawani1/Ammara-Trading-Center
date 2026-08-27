import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const brandsTable = pgTable("catalog_brands", {
  id: serial("id").primaryKey(),
  legacyId: text("legacy_id").unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  country: text("country"),
  category: text("category"),
  summary: text("summary"),
  description: text("description").notNull().default(""),
  coverImage: text("cover_image"),
  websiteUrl: text("website_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBrandSchema = createInsertSchema(brandsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type BrandRecord = typeof brandsTable.$inferSelect;