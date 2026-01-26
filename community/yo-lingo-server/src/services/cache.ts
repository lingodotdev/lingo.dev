import { createHash } from 'crypto';
import { db } from '../db';
import { cachedContent } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';

export type ContentType = 'joke' | 'quote';

/**
 * Creates MD5 hash of content text for cache lookup
 */
export function hashContent(text: string): string {
  return createHash('md5').update(text.toLowerCase().trim()).digest('hex');
}

/**
 * Retrieves cached translations from database by hash
 */
export async function getCachedContent(hash: string, type: ContentType) {
  const result = await db
    .select()
    .from(cachedContent)
    .where(and(eq(cachedContent.contentHash, hash), eq(cachedContent.contentType, type)))
    .limit(1);

  return result[0] || null;
}

/**
 * Stores new translated content in cache
 */
export async function setCachedContent(
  hash: string,
  type: ContentType,
  translations: Record<string, any>
) {
  await db.insert(cachedContent).values({
    contentHash: hash,
    contentType: type,
    translations,
    accessCount: 0,
  });
}

/**
 * Increments access count for analytics
 */
export async function incrementCacheHits(hash: string) {
  await db
    .update(cachedContent)
    .set({ accessCount: sql`${cachedContent.accessCount} + 1` })
    .where(eq(cachedContent.contentHash, hash));
}

/**
 * Fetches random cached content for API fallback scenarios
 */
export async function getRandomCachedContent(type: ContentType) {
  const result = await db
    .select()
    .from(cachedContent)
    .where(eq(cachedContent.contentType, type))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  return result[0] || null;
}
