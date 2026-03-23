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

  try {
    // 1. Record the sale
    const result = await db.insert(sales).values({
      itemId: data.itemId,
      quantitySold: data.quantitySold,
      totalPrice,
      totalProfit,
    }).returning();

    const sale = result[0];

    // 2. Update item stock
    await db.update(items)
      .set({ stockQuantity: item.stockQuantity - data.quantitySold })
      .where(eq(items.id, data.itemId));

    revalidatePath('/');
    return sale;
  } catch (error) {
    throw new Error(`Failed to create sale: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Deletes a sale and restores the item stock.
 */
export async function deleteSale(saleId: string) {
  try {
    // First, fetch the sale details
    const saleResult = await db
      .select({
        id: sales.id,
        itemId: sales.itemId,
        quantitySold: sales.quantitySold,
      })
      .from(sales)
      .where(eq(sales.id, saleId));

    if (saleResult.length === 0) {
      throw new Error('Sale not found');
    }

    const sale = saleResult[0];

    // Fetch the item to get current stock
    const item = await db.query.items.findFirst({
      where: eq(items.id, sale.itemId),
    });

    if (!item) {
      throw new Error('Item not found');
    }

    // 1. Delete the sale record
    await db.delete(sales).where(eq(sales.id, saleId));

    // 2. Restore item stock
    await db.update(items)
      .set({ stockQuantity: item.stockQuantity + sale.quantitySold })
      .where(eq(items.id, sale.itemId));

    revalidatePath('/');
  } catch (error) {
    throw new Error(`Failed to delete sale: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
