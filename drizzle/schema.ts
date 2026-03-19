import { pgTable, foreignKey, unique, uuid, text, timestamp, numeric, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const items = pgTable("items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	sku: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	baseCost: numeric("base_cost", { precision: 12, scale:  2 }).notNull(),
	categoryId: uuid("category_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "items_category_id_categories_id_fk"
		}).onDelete("cascade"),
	unique("items_sku_unique").on(table.sku),
]);

export const sales = pgTable("sales", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	itemId: uuid("item_id").notNull(),
	quantitySold: integer("quantity_sold").notNull(),
	totalProfit: numeric("total_profit", { precision: 12, scale:  2 }),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [items.id],
			name: "sales_item_id_items_id_fk"
		}).onDelete("cascade"),
]);

export const categories = pgTable("categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("categories_name_unique").on(table.name),
]);
