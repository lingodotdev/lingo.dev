import { createHash } from 'crypto';
import { db } from '../db';
import { cachedContent } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';

/**
 * Content type discriminator for cached translations
 */
export type ContentType = 'joke' | 'quote';

/**
 * Creates an MD5 hash of content text for cache lookup and deduplication
 * 
 * @param text - The content text to hash (will be lowercased and trimmed)
 * @returns MD5 hash string in hexadecimal format
 * 
 * @example
 * ```typescript
 * const hash = hashContent("Why did the chicken cross the road?");
 * // Returns: "a1b2c3d4e5f6..."
 * ```
 */
export function hashContent(text: string): string {
  return createHash('md5').update(text.toLowerCase().trim()).digest('hex');
}

/**
 * Retrieves cached translations from database by content hash
 * 
 * @param hash - MD5 hash of the content text
 * @param type - Content type ('joke' or 'quote')
 * @returns Cached content object with translations, or null if not found
 * 
 * @example
 * ```typescript
 * const cached = await getCachedContent(hash, 'joke');
 * if (cached) {
 *   console.log(cached.translations.es.text); // Spanish translation
 * }
 * ```
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
 * Stores new translated content in the cache database
 * 
 * @param hash - MD5 hash of the original content text
 * @param type - Content type ('joke' or 'quote')
 * @param translations - Object containing translations for all target locales
 * 
 * @example
 * ```typescript
 * await setCachedContent(hash, 'joke', {
 *   en: { text: "...", author: "..." },
 *   es: { text: "...", author: "..." }
 * });
 * ```
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
  }).onConflictDoNothing({ target: cachedContent.contentHash });
}

/**
 * Increments the access count for a cached content entry (analytics tracking)
 * 
 * @param hash - MD5 hash of the cached content
 * 
 * @example
 * ```typescript
 * await incrementCacheHits(hash); // Increments access_count by 1
 * ```
 */
export async function incrementCacheHits(hash: string) {
  await db
    .update(cachedContent)
    .set({ accessCount: sql`${cachedContent.accessCount} + 1` })
    .where(eq(cachedContent.contentHash, hash));
}

/**
 * Fetches a random cached content entry for API fallback scenarios
 * 
 * Used when Lingo.dev API fails or credits are exhausted to provide
 * a graceful degradation experience by serving previously cached translations.
 * 
 * @param type - Content type ('joke' or 'quote')
 * @returns Random cached content object, or null if cache is empty
 * 
 * @example
 * ```typescript
 * const fallback = await getRandomCachedContent('joke');
 * if (fallback) {
 *   return fallback.translations; // Serve cached multilingual content
 * }
 * ```
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
