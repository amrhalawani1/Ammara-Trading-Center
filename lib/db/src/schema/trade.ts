import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type TradeRole = "specifier" | "procurement" | "fabricator" | "other";

export type TradeShortlistItem = {
  key: string;
  slug: string;
  name: string;
  brandName: string;
  reference: string;
  variant: string | null;
  image: string | null;
  quantity: number;
  addedAt: string;
  kind?: "product" | "brand";
};

export type TradeShortlist = {
  id: string;
  name: string;
  createdAt: string;
  items: TradeShortlistItem[];
};

export type TradeShortlistState = {
  version: 1;
  lists: TradeShortlist[];
  activeListId: string;
};

/** One row per signed-in trade visitor. Company and role keep the account formal. */
export const tradeProfilesTable = pgTable("trade_profiles", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  company: text("company"),
  role: text("role").$type<TradeRole>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Device-local shortlist state, stored as one JSON document per account. */
export const tradeShortlistsTable = pgTable("trade_shortlists", {
  clerkUserId: text("clerk_user_id").primaryKey(),
  state: jsonb("state").$type<TradeShortlistState>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TradeProfile = typeof tradeProfilesTable.$inferSelect;
export type TradeShortlistRow = typeof tradeShortlistsTable.$inferSelect;
