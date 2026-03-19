ALTER TABLE "sales" ADD COLUMN IF NOT EXISTS "total_price" numeric(12, 2) NOT NULL DEFAULT 0.00;

-- Backfill existing sales rows if total_price is missing.
-- Adjust calculation formula to match your business rules: quantity * item selling price.
UPDATE "sales" SET "total_price" = 0.00
WHERE "total_price" IS NULL;
