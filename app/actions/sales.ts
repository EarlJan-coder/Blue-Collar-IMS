'use server';

import { db } from '../../db/db';
import { sales, items, categories } from '../../db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { DbSaleWithItem } from '../types';
import { getServerSession, type Session } from 'next-auth';
import { authOptions } from '@/auth';

/**
 * Fetches all sales with item and category details for the authenticated user.
 */
export async function getSales(): Promise<DbSaleWithItem[]> {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

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
    .innerJoin(items, and(eq(sales.itemId, items.id), eq(sales.userId, items.userId)))
    .leftJoin(categories, and(eq(items.categoryId, categories.id), eq(items.userId, categories.userId)))
    .where(eq(sales.userId, userId))
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
 * Records a new sale and updates inventory for the authenticated user.
 */
export async function createSale(data: {
  itemId: string;
  quantitySold: number;
}) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const item = await db.query.items.findFirst({
    where: and(eq(items.id, data.itemId), eq(items.userId, userId)),
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
      userId,
    }).returning();

    const sale = result[0];

    // 2. Update item stock
    await db.update(items)
      .set({ stockQuantity: item.stockQuantity - data.quantitySold })
      .where(and(eq(items.id, data.itemId), eq(items.userId, userId)));

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
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    // First, fetch the sale details scoped to the signed-in user
    const saleResult = await db
      .select({
        id: sales.id,
        itemId: sales.itemId,
        quantitySold: sales.quantitySold,
      })
      .from(sales)
      .where(and(eq(sales.id, saleId), eq(sales.userId, userId)));

    if (saleResult.length === 0) {
      throw new Error('Sale not found');
    }

    const sale = saleResult[0];

    // Fetch the item to get current stock
    const item = await db.query.items.findFirst({
      where: and(eq(items.id, sale.itemId), eq(items.userId, userId)),
    });

    if (!item) {
      throw new Error('Item not found');
    }

    // 1. Delete the sale record
    await db.delete(sales).where(and(eq(sales.id, saleId), eq(sales.userId, userId)));

    // 2. Restore item stock
    await db.update(items)
      .set({ stockQuantity: item.stockQuantity + sale.quantitySold })
      .where(and(eq(items.id, sale.itemId), eq(items.userId, userId)));

    revalidatePath('/');
  } catch (error) {
    throw new Error(`Failed to delete sale: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Updates a sale quantity and adjusts stock accordingly.
 */
export async function updateSale(saleId: string, data: { quantitySold: number }) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const sale = await db.query.sales.findFirst({
      where: and(eq(sales.id, saleId), eq(sales.userId, userId)),
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    const item = await db.query.items.findFirst({
      where: and(eq(items.id, sale.itemId), eq(items.userId, userId)),
    });

    if (!item) {
      throw new Error('Item not found');
    }

    const newQuantity = data.quantitySold;
    const quantityDiff = newQuantity - sale.quantitySold;

    if (quantityDiff > 0 && item.stockQuantity < quantityDiff) {
      throw new Error('Insufficient stock to increase sale quantity');
    }

    const totalPrice = (parseFloat(item.sellingPrice) * newQuantity).toFixed(2);
    const totalProfit = ((parseFloat(item.sellingPrice) - parseFloat(item.baseCost)) * newQuantity).toFixed(2);

    await db.update(sales)
      .set({
        quantitySold: newQuantity,
        totalPrice,
        totalProfit,
      })
      .where(and(eq(sales.id, saleId), eq(sales.userId, userId)));

    await db.update(items)
      .set({ stockQuantity: item.stockQuantity - quantityDiff })
      .where(and(eq(items.id, item.id), eq(items.userId, userId)));

    revalidatePath('/');
  } catch (error) {
    throw new Error(`Failed to update sale: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
