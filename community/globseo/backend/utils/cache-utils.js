#!/usr/bin/env node

/**
 * Production Cache Utilities for Translation Optimization
 * Uses Redis for high-performance, scalable caching
 */

import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import { Redis } from '@upstash/redis';

import { log, colors } from './logger.js';

// Redis configuration
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const CACHE_EXPIRY_SECONDS = parseInt(process.env.CACHE_EXPIRY_SECONDS) || (24 * 60 * 60); // 24 hours default
const CACHE_KEY_PREFIX = 'globseo:translation:';

// Redis client
let redisClient = null;
let useInMemoryFallback = false;
const memoryCache = new Map(); // Fallback in-memory cache

/**
 * Initialize Redis connection
 */
async function initializeRedis() {
  if (redisClient) return redisClient;

  // Check if Upstash credentials are provided
  if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
    try {
      redisClient = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
      });
      // Don't ping here, let operations handle connection
      log.success('Upstash Redis client initialized');
      return redisClient;
    } catch (error) {
      log.error(`Upstash Redis client creation failed: ${error.message}`);
      useInMemoryFallback = true;
      return null;
    }
  }

  // Fallback to local Redis if Upstash not configured
  log.warning('Redis not configured, using in-memory cache fallback');
  useInMemoryFallback = true;
  return null;
}

/**
 * Generate cache key from content and target languages
 * @param {Object} content - Content to translate
 * @param {string} sourceLang - Source language code
 * @param {Array<string>} targetLangs - Target language codes
 * @returns {string} - Redis cache key
 */
export function getCacheKey(content, sourceLang, targetLangs) {
  // Create a copy of content without timestamp for consistent caching
  const contentForKey = { ...content };
  delete contentForKey.timestamp;

  const normalizedContent = JSON.stringify(contentForKey);
  const sortedTargets = [...targetLangs].sort().join(',');
  const cacheString = `${sourceLang}:${sortedTargets}:${normalizedContent}`;

  const hash = crypto.createHash('md5').update(cacheString).digest('hex');
  log.debug(`Cache key generated: ${hash.substring(0, 12)}... for host: ${content._sourceHost || 'unknown'}`);
  return hash;
}

/**
 * Get full Redis key with prefix
 * @param {string} cacheKey - MD5 cache key
 * @returns {string} - Full Redis key
 */
function getRedisKey(cacheKey) {
  return `${CACHE_KEY_PREFIX}${cacheKey}`;
}

/**
 * Check if cache entry is still valid (for in-memory fallback)
 * @param {Object} entry - Cache entry
 * @returns {boolean}
 */
function isCacheValid(entry) {
  if (!entry || !entry.timestamp) return false;

  const now = Date.now();
  const age = now - entry.timestamp;
  const maxAge = CACHE_EXPIRY_SECONDS * 1000;

  return age < maxAge;
}

/**
 * Get translation from cache
 * @param {string} cacheKey - Cache key
 * @returns {Object|null} - Cached translations or null
 */
export async function getCachedTranslation(cacheKey) {
  const client = await initializeRedis();

  if (!client || useInMemoryFallback) {
    // Use in-memory fallback
    const entry = memoryCache.get(cacheKey);
    if (!entry) return null;

    if (!isCacheValid(entry)) {
      memoryCache.delete(cacheKey);
      return null;
    }

    log.cache(`HIT (memory) for key: ${cacheKey.substring(0, 8)}...`);
    return entry.translations;
  }

  try {
    const redisKey = getRedisKey(cacheKey);
    const cachedData = await client.get(redisKey);

    if (!cachedData) {
      return null;
    }

    const entry = cachedData;

    // Check if entry has expired (double-check in case Redis TTL failed)
    if (entry.timestamp && (Date.now() - entry.timestamp) > (CACHE_EXPIRY_SECONDS * 1000)) {
      await client.del(redisKey);
      return null;
    }

    log.cache(`HIT (redis) for key: ${cacheKey.substring(0, 8)}...`);
    return entry.translations;
  } catch (error) {
    console.error('Error getting cached translation:', error.message);
    return null;
  }
}

/**
 * Store translation in cache
 * @param {string} cacheKey - Cache key
 * @param {Object} translations - Translations to cache
 * @param {Array<string>} targetLanguages - Target languages
 */
export async function setCachedTranslation(cacheKey, translations, targetLanguages) {
  const client = await initializeRedis();

  if (!client || useInMemoryFallback) {
    // Use in-memory fallback
    const entry = {
      translations,
      targetLanguages,
      timestamp: Date.now(),
      created: new Date().toISOString()
    };
    memoryCache.set(cacheKey, entry);
    log.cache(`SET (memory) for key: ${cacheKey.substring(0, 8)}...`);
    return;
  }

  try {
    const entry = {
      translations,
      targetLanguages,
      timestamp: Date.now(),
      created: new Date().toISOString()
    };

    const redisKey = getRedisKey(cacheKey);
    await client.set(redisKey, entry);
    await client.expire(redisKey, CACHE_EXPIRY_SECONDS);

    log.cache(`SET (redis) for key: ${cacheKey.substring(0, 8)}...`);
  } catch (error) {
    console.error('Error setting cached translation:', error.message);
  }
}

/**
 * Get missing languages that need translation
 * @param {Object} existingTranslations - Already translated languages
 * @param {Array<string>} requestedLanguages - Requested target languages
 * @returns {Array<string>} - Languages that need translation
 */
export function getMissingLanguages(existingTranslations, requestedLanguages) {
  if (!existingTranslations || Object.keys(existingTranslations).length === 0) {
    return requestedLanguages;
  }

  const missing = requestedLanguages.filter(lang => !existingTranslations[lang]);
  
  if (missing.length > 0) {
    log.info(`Missing languages: ${missing.join(', ')}`);
  } else {
    log.success(`All languages already translated`);
  }

  return missing;
}

/**
 * Merge existing translations with new ones
 * @param {Object} existing - Existing translations
 * @param {Object} newTranslations - New translations to merge
 * @returns {Object} - Merged translations
 */
export function mergeTranslations(existing, newTranslations) {
  return {
    ...existing,
    ...newTranslations
  };
}

/**
 * Clear expired cache entries (Redis handles TTL automatically, but this can be used for manual cleanup)
 */
export async function cleanupCache() {
  try {
    const client = await initializeRedis();
    if (!client) return;

    // Redis handles TTL automatically, but we can scan for expired entries if needed
    // For now, just log that cleanup is handled by Redis TTL
    log.info('Cache cleanup handled automatically by Redis TTL');
  } catch (error) {
    console.error('Error during cache cleanup:', error.message);
  }
}

/**
 * Get cache statistics
 * @returns {Object} - Cache stats
 */
export async function getCacheStats() {
  try {
    const client = await initializeRedis();

    if (!client || useInMemoryFallback) {
      // In-memory stats
      return {
        totalEntries: memoryCache.size,
        validEntries: [...memoryCache.values()].filter(entry => isCacheValid(entry)).length,
        expiredEntries: [...memoryCache.values()].filter(entry => !isCacheValid(entry)).length,
        cacheSize: 'N/A (in-memory)',
        redisConnected: false,
        cacheType: 'in-memory'
      };
    }

    // Redis stats - use SCAN instead of KEYS to avoid loading all keys into memory
    let totalEntries = 0;
    try {
      let cursor = 0;
      do {
        const scanResult = await client.scan(cursor, { match: `${CACHE_KEY_PREFIX}*`, count: 100 });
        cursor = scanResult.cursor;
        totalEntries += scanResult.keys.length;
      } while (cursor !== 0);
    } catch (scanError) {
      // Fallback to KEYS if SCAN not available
      try {
        const keys = await client.keys(`${CACHE_KEY_PREFIX}*`);
        totalEntries = keys.length;
      } catch (keysError) {
        totalEntries = 0;
      }
    }

    // Try to get memory info, but handle if not available (Upstash doesn't support INFO)
    let memoryUsage = 'N/A (Upstash)';
    try {
      const info = await client.info('memory');
      const memBytes = parseInt(info.match(/used_memory:(\d+)/)?.[1] || 0);
      memoryUsage = `${(memBytes / 1024 / 1024).toFixed(2)} MB`;
    } catch (infoError) {
      // INFO command not available in Upstash Redis
      // Expected behavior - no need to log
    }

    return {
      totalEntries,
      validEntries: totalEntries, // Redis handles expiry
      expiredEntries: 0, // Redis handles expiry
      cacheSize: memoryUsage,
      redisConnected: true,
      cacheType: 'upstash-redis',
      redisUrl: UPSTASH_REDIS_REST_URL
    };
  } catch (error) {
    console.error('Error getting cache stats:', error.message);
    return {
      totalEntries: 0,
      validEntries: 0,
      expiredEntries: 0,
      cacheSize: 0,
      redisConnected: false,
      cacheType: 'error',
      error: error.message
    };
  }
}

/**
 * Clear all cache
 */
export async function clearCache() {
  // Clear in-memory cache always
  const memorySize = memoryCache.size;
  memoryCache.clear();
  if (memorySize > 0) {
    log.success(`Cleared ${memorySize} entries from in-memory cache`);
  }

  // Try to clear Redis cache if client is available
  try {
    const client = await initializeRedis();
    if (client) {
      const keys = await client.keys(`${CACHE_KEY_PREFIX}*`);
      console.log(`Found ${keys.length} Redis keys to clear:`, keys);
      if (keys.length > 0) {
        // Delete keys one by one to ensure compatibility
        for (const key of keys) {
          await client.del(key);
        }
        log.success(`Cleared ${keys.length} entries from Redis cache`);
      } else {
        log.info('Redis cache already empty');
      }
    } else {
      log.info('Redis client not available');
    }
  } catch (error) {
    console.error('Error clearing Redis cache:', error.message);
  }
}

/**
 * Health check for Redis connection
 * @returns {boolean} - True if Redis is connected and healthy
 */
export async function isRedisHealthy() {
  try {
    const client = await initializeRedis();
    if (!client) return false;

    await client.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error.message);
    return false;
  }
}

// Initialize Redis connection on module load (async)
initializeRedis().catch(error => {
  console.error('Failed to initialize Redis on module load:', error.message);
});
