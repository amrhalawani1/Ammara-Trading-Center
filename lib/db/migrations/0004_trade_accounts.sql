ALTER TABLE "catalog_inquiries" ADD COLUMN "clerk_user_id" text;--> statement-breakpoint
ALTER TABLE "catalog_inquiries" ADD COLUMN "status" text DEFAULT 'submitted' NOT NULL;--> statement-breakpoint
ALTER TABLE "catalog_inquiries" ADD COLUMN "status_updated_at" timestamptz;--> statement-breakpoint
CREATE TABLE "trade_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"company" text,
	"role" text,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"updated_at" timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT "trade_profiles_clerk_user_id_unique" UNIQUE("clerk_user_id")
);--> statement-breakpoint
CREATE TABLE "trade_shortlists" (
	"clerk_user_id" text PRIMARY KEY NOT NULL,
	"state" jsonb NOT NULL,
	"updated_at" timestamptz DEFAULT now() NOT NULL
);
