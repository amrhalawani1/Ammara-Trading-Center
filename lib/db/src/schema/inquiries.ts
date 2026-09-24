import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/** One line of a project shortlist as the visitor sent it. */
export interface ShortlistInquiryItem {
  slug: string;
  name: string;
  brandName: string;
  reference: string | null;
  variant: string | null;
  quantity: number;
}

export const inquiriesTable = pgTable("catalog_inquiries", {
  id: serial("id").primaryKey(),
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  projectType: text("project_type"),
  message: text("message").notNull(),
  /** Human reference quoted back to the visitor, e.g. ATC-260924-7R36. Null on rows before it existed. */
  reference: text("reference").unique(),
  listName: text("list_name"),
  timeline: text("timeline"),
  items: jsonb("items").$type<ShortlistInquiryItem[]>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertInquirySchema = createInsertSchema(inquiriesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type InquiryRecord = typeof inquiriesTable.$inferSelect;
