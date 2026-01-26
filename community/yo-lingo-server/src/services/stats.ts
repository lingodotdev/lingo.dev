import { db } from '../db';
import { stats } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

export const incrementCounter = async () => {
  const result = await db
    .update(stats)
    .set({ count: sql`${stats.count} + 1` })
    .where(eq(stats.id, 1))
    .returning({ count: stats.count });
    
  if (result.length === 0) {
    // If row doesn't exist, create it (fallback)
    const inserted = await db.insert(stats).values({ id: 1, count: 1 }).returning({ count: stats.count });
    return inserted[0]?.count || 1;
  }
  
  return result[0]?.count || 0;
};

export const getCounter = async () => {
  const result = await db.select({ count: stats.count }).from(stats).where(eq(stats.id, 1));
  
  if (result.length === 0) {
     // Ensure initial row exists if not found
     const inserted = await db.insert(stats).values({ id: 1, count: 0 }).returning({ count: stats.count });
     return inserted[0]?.count || 0;
  }

  return result[0]?.count || 0;
};
