import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.NEON_PG_URL;

if (!connectionString) {
  throw new Error('NEON_PG_URL is missing in .env');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
