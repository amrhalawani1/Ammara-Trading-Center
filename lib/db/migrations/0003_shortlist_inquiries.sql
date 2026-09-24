ALTER TABLE "catalog_inquiries" ADD COLUMN "reference" text;--> statement-breakpoint
ALTER TABLE "catalog_inquiries" ADD COLUMN "list_name" text;--> statement-breakpoint
ALTER TABLE "catalog_inquiries" ADD COLUMN "timeline" text;--> statement-breakpoint
ALTER TABLE "catalog_inquiries" ADD COLUMN "items" jsonb;--> statement-breakpoint
ALTER TABLE "catalog_inquiries" ADD CONSTRAINT "catalog_inquiries_reference_unique" UNIQUE("reference");
