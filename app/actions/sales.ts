'use server';

import { db } from '../../db/db';
import { sales, items, categories } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { DbSaleWithItem } from '../types';

/**
 * Fetches all sales with item and category details.
 */
export async function getSales(): Promise<DbSaleWithItem[]> {
  const result = await db
    .select({
      id: sales.id,
      itemId: sales.itemId,
      quantitySold: sales.quantitySold,
      totalPrice: sales.totalPrice,
      totalProfit: sales.totalProfit,
      createdAt: sales.createdAt,
      // Flattened item and category data
      itemName: items.name,
      itemCategoryId: items.categoryId,
      itemBaseCost: items.baseCost,
      itemSellingPrice: items.sellingPrice,
      itemStockQuantity: items.stockQuantity,
      itemSku: items.sku,
      itemCreatedAt: items.createdAt,
      categoryName: categories.name,
    })
    .from(sales)
    .innerJoin(items, eq(sales.itemId, items.id))
    .leftJoin(categories, eq(items.categoryId, categories.id))
    .orderBy(desc(sales.createdAt));

  return result.map(row => ({
    id: row.id,
    itemId: row.itemId,
    quantitySold: row.quantitySold,
    totalPrice: row.totalPrice,
    totalProfit: row.totalProfit,
    createdAt: row.createdAt,
    item: {
      id: row.itemId,
      name: row.itemName,
      categoryId: row.itemCategoryId,
      baseCost: row.itemBaseCost,
      sellingPrice: row.itemSellingPrice,
      stockQuantity: row.itemStockQuantity,
      sku: row.itemSku,
      createdAt: row.itemCreatedAt,
      category: {
        id: row.itemCategoryId,
        name: row.categoryName as string,
      },
    },
  })) as DbSaleWithItem[];
}

/**
 * Records a new sale and updates inventory.
 */
export async function createSale(data: {
  itemId: string;
  quantitySold: number;
}) {
  const item = await db.query.items.findFirst({
    where: eq(items.id, data.itemId),
  });

  if (!item) {
    throw new Error('Item not found');
  }

  if (item.stockQuantity < data.quantitySold) {
    throw new Error('Insufficient stock');
  }

  const totalPrice = (parseFloat(item.sellingPrice) * data.quantitySold).toFixed(2);
  const totalProfit = ((parseFloat(item.sellingPrice) - parseFloat(item.baseCost)) * data.quantitySold).toFixed(2);

  return await db.transaction(async (tx) => {
    // 1. Record the sale
    const [sale] = await tx.insert(sales).values({
      itemId: data.itemId,
      quantitySold: data.quantitySold,
      totalPrice,
      totalProfit,
    }).returning();

    // 2. Update item stock
    await tx.update(items)
      .set({ stockQuantity: item.stockQuantity - data.quantitySold })
      .where(eq(items.id, data.itemId));

    revalidatePath('/');
    return sale;
  });
}
