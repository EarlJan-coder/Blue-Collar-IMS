'use server';

import { db } from '../../db/db';
import { items, categories } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { DbItemWithCategory } from '../types';
import { getServerSession, type Session } from 'next-auth';
import { authOptions } from '@/auth';

/**
 * Creates a new item in the database.
 */
export async function createItem(data: {
  name: string;
  categoryId: string;
  baseCost: string;
  sellingPrice: string;
  stockQuantity: number;
  sku: string;
}) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const result = await db.insert(items).values({
    ...data,
    userId,
  }).returning();
  revalidatePath('/'); // Revalidate the home page to reflect the new item
  return result[0];
}

/**
 * Fetches all items with their category details for the authenticated user.
 * Useful for displaying items on the inventory table.
 */
export async function getItems(): Promise<DbItemWithCategory[]> {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    // If there is no active session, return empty list so client can handle signin state.
    return [];
  }

  const result = await db
    .select({
      id: items.id,
      name: items.name,
      categoryId: items.categoryId,
      baseCost: items.baseCost,
      sellingPrice: items.sellingPrice,
      stockQuantity: items.stockQuantity,
      sku: items.sku,
      createdAt: items.createdAt,
      category_id: categories.id,
      category_name: categories.name,
    })
    .from(items)
    .leftJoin(categories, and(eq(items.categoryId, categories.id), eq(items.userId, categories.userId)))
    .where(eq(items.userId, userId));

  return result.map(row => ({
    id: row.id,
    name: row.name,
    categoryId: row.categoryId,
    baseCost: row.baseCost,
    sellingPrice: row.sellingPrice,
    stockQuantity: row.stockQuantity,
    sku: row.sku,
    createdAt: row.createdAt,
    category: {
      id: row.category_id as string,
      name: row.category_name as string,
    },
  })) as DbItemWithCategory[];
}

/**
 * Updates an existing item in the database.
 */
export async function updateItem(id: string, data: Partial<{
  name: string;
  categoryId: string;
  baseCost: string;
  sellingPrice: string;
  stockQuantity: number;
  sku: string;
}>) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const result = await db.update(items).set(data).where(and(eq(items.id, id), eq(items.userId, userId))).returning();
  revalidatePath('/');
  return result[0];
}

/**
 * Deletes a specific item from the database.
 */
export async function deleteItem(id: string) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const result = await db.delete(items).where(and(eq(items.id, id), eq(items.userId, userId))).returning();
  revalidatePath('/');
  return result[0];
}
