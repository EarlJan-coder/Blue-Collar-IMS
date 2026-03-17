'use server';

import { db } from '../../db/db';
import { categories } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createCategory(name: string) {
  const result = await db.insert(categories).values({ name }).returning();
  revalidatePath('/');
  return result[0];
}

export async function updateCategory(id: string, name: string) {
  const result = await db.update(categories).set({ name }).where(eq(categories.id, id)).returning();
  revalidatePath('/');
  return result[0];
}

export async function deleteCategory(id: string) {
  const result = await db.delete(categories).where(eq(categories.id, id)).returning();
  revalidatePath('/');
  return result[0];
}

export async function getCategories() {
  return db.select().from(categories);
}

export async function seedCategories() {
  const initialCategories = [
    'Engine Components',
    'Brake System',
    'Fuel/Emission Systems',
    'Electrical & Lighting',
    'Suspension & Steering',
    'Transmission/Clutch',
    'Body & Exterior',
    'Cooling System',
    'Filters & Fluids',
  ];

  for (const name of initialCategories) {
    await db.insert(categories).values({ name }).onConflictDoNothing();
  }
}
