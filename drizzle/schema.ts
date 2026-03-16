import { pgTable, unique, uuid, text, integer, timestamp, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const items = pgTable("items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	quantity: integer().default(0).notNull(),
	sku: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
}, (table) => [
	unique("items_sku_unique").on(table.sku),
]);
