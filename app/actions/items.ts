'use server';

import { db } from '../../db/db';
import { items } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { DbItemWithCategory } from '../types';

/**
 * Creates a new item in the database.
 */
export async function createItem(data: {
  name: string;
  categoryId: string;
  baseCost: string;
  sku: string;
}) {
  const result = await db.insert(items).values(data).returning();
  revalidatePath('/'); // Revalidate the home page to reflect the new item
  return result[0];
}

/**
 * Fetches all items with their category details.
 * Useful for displaying items on the inventory table.
 */
export async function getItems(): Promise<DbItemWithCategory[]> {
  return db.query.items.findMany({
    with: {
      category: true,
    },
  }) as unknown as Promise<DbItemWithCategory[]>;
}

/**
 * Updates an existing item in the database.
 */
export async function updateItem(id: string, data: Partial<{
  name: string;
  categoryId: string;
  baseCost: string;
  sku: string;
}>) {
  const result = await db.update(items).set(data).where(eq(items.id, id)).returning();
  revalidatePath('/');
  return result[0];
}

/**
 * Deletes a specific item from the database.
 */
export async function deleteItem(id: string) {
  const result = await db.delete(items).where(eq(items.id, id)).returning();
  revalidatePath('/');
  return result[0];
}
