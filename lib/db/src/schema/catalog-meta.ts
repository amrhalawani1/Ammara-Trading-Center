import { pgTable, text } from "drizzle-orm/pg-core";

export const catalogMetaTable = pgTable("catalog_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});