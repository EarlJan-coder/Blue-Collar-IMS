import { pgTable, uuid, text, integer, timestamp, decimal, pgEnum, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Users Table: Stores user accounts for multi-tenant isolation.
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Categories Table: Stores all part categories, scoped per user.
 */
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  uniqueIndex('categories_name_user_id_idx').on(table.name, table.userId),
  index('categories_user_id_idx').on(table.userId),
]);

/**
 * Items Table: Contains details about available products, scoped per user.
 */
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  baseCost: decimal('base_cost', { precision: 12, scale: 2 }).notNull(),
  sellingPrice: decimal('selling_price', { precision: 12, scale: 2 }).notNull().default('0.00'),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  sku: text('sku').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  uniqueIndex('items_sku_user_id_idx').on(table.sku, table.userId),
  index('items_user_id_idx').on(table.userId),
  index('items_category_id_idx').on(table.categoryId),
]);

/**
 * Sales Table: Records individual sale transactions, scoped per user.
 */
export const sales = pgTable('sales', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  itemId: uuid('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
  quantitySold: integer('quantity_sold').notNull(),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull(),
  totalProfit: decimal('total_profit', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('sales_user_id_idx').on(table.userId),
  index('sales_item_id_idx').on(table.itemId),
  index('sales_created_at_idx').on(table.createdAt),
]);

/**
 * Relations API for fetching related data.
 */
export const usersRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  items: many(items),
  sales: many(sales),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  items: many(items),
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
}));

export const itemsRelations = relations(items, ({ many, one }) => ({
  sales: many(sales),
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [items.userId],
    references: [users.id],
  }),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  item: one(items, {
    fields: [sales.itemId],
    references: [items.id],
  }),
  user: one(users, {
    fields: [sales.userId],
    references: [users.id],
  }),
}));
