import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Required for some edge environments to ensure the driver works correctly.
// neonConfig.fetchConnectionCache = true;

/**
 * Neon database connection using the serverless driver.
 * Optimized for serverless environments using HTTP.
 */
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
