import { relations } from "drizzle-orm/relations";
import { categories, items, sales } from "./schema";

export const itemsRelations = relations(items, ({one, many}) => ({
	category: one(categories, {
		fields: [items.categoryId],
		references: [categories.id]
	}),
	sales: many(sales),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	items: many(items),
}));

export const salesRelations = relations(sales, ({one}) => ({
	item: one(items, {
		fields: [sales.itemId],
		references: [items.id]
	}),
}));