ALTER TABLE "categories" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;