import { pgTable, uuid, text, integer, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Define a Category Enum for the items table.
 */
export const categoryEnum = pgEnum('category', ['electronics', 'clothing', 'home', 'other']);

/**
 * Items Table: Contains details about available products.
 */
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  category: categoryEnum('category').notNull(),
  baseCost: decimal('base_cost', { precision: 12, scale: 2 }).notNull(),
  sku: text('sku').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Sales Table: Records individual sale transactions.
 */
export const sales = pgTable('sales', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
  quantitySold: integer('quantity_sold').notNull(),
  totalProfit: decimal('total_profit', { precision: 12, scale: 2 }),
});

/**
 * Relations API for fetching related data.
 */
export const itemsRelations = relations(items, ({ many }) => ({
  sales: many(sales),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  item: one(items, {
    fields: [sales.itemId],
    references: [items.id],
  }),
}));
