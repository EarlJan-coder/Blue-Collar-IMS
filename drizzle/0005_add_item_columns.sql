ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "selling_price" numeric(12, 2) NOT NULL DEFAULT 0.00;
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "stock_quantity" integer NOT NULL DEFAULT 0;

UPDATE "items" SET "selling_price" = 0.00 WHERE "selling_price" IS NULL;
UPDATE "items" SET "stock_quantity" = 0 WHERE "stock_quantity" IS NULL;
