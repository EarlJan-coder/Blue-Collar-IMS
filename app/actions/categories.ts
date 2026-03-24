'use server';

import { db } from '../../db/db';
import { categories } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getServerSession, type Session } from 'next-auth';
import { authOptions } from '@/auth';

export async function createCategory(name: string) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const result = await db.insert(categories).values({ name, userId }).returning();
  revalidatePath('/');
  return result[0];
}

export async function updateCategory(id: string, name: string) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const result = await db.update(categories).set({ name }).where(eq(categories.id, id)).returning();
  revalidatePath('/');
  return result[0];
}

export async function deleteCategory(id: string) {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const result = await db.delete(categories).where(eq(categories.id, id)).returning();
  revalidatePath('/');
  return result[0];
}

export async function getCategories() {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  return db.select().from(categories).where(eq(categories.userId, userId));
}

export async function seedCategories() {
  const session = (await getServerSession(authOptions)) as Session | null;
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

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
    await db.insert(categories).values({ name, userId }).onConflictDoNothing();
  }
}
