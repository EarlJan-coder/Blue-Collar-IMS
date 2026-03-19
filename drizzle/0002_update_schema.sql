CREATE TYPE IF NOT EXISTS "public"."category" AS ENUM('electronics', 'clothing', 'home', 'other');
CREATE TABLE IF NOT EXISTS "sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"quantity_sold" integer NOT NULL,
	"total_price" numeric(12, 2) NOT NULL,
	"total_profit" numeric(12, 2)
);
ALTER TABLE "items" ADD COLUMN IF NOT EXISTS "category" "category" NOT NULL;
ALTER TABLE "items" ADD COLUMN "base_cost" numeric(12, 2) NOT NULL;
ALTER TABLE "items" DROP COLUMN "description";
ALTER TABLE "items" DROP COLUMN "quantity";
ALTER TABLE "items" DROP COLUMN "price";
ALTER TABLE "items" DROP COLUMN "updated_at";
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'sales_item_id_items_id_fk'
    ) THEN
        ALTER TABLE "sales" ADD CONSTRAINT "sales_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;