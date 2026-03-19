import { pgTable, uuid, text, integer, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Categories Table: Stores all part categories.
 */
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Items Table: Contains details about available products.
 */
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  baseCost: decimal('base_cost', { precision: 12, scale: 2 }).notNull(),
  sellingPrice: decimal('selling_price', { precision: 12, scale: 2 }).notNull().default('0.00'),
  stockQuantity: integer('stock_quantity').notNull().default(0),
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
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull(),
  totalProfit: decimal('total_profit', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Relations API for fetching related data.
 */
export const categoriesRelations = relations(categories, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ many, one }) => ({
  sales: many(sales),
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
  }),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  item: one(items, {
    fields: [sales.itemId],
    references: [items.id],
  }),
}));
