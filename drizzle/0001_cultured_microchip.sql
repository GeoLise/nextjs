ALTER TABLE "products" ALTER COLUMN "category_id" SET NOT NULL;-
ALTER TABLE "categories" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;
ALTER TABLE "products" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;