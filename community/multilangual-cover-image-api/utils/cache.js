/**
 * Cache Manager
 *
 * Simple in-memory cache with automatic size management.
 * For production with multiple instances, consider using Redis.
 */

import { CACHE_CONFIG } from "../config/constants.js";

/**
 * CacheManager class handles caching of generated SVG images
 */
export class CacheManager {
  constructor(maxSize = CACHE_CONFIG.MAX_SIZE) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Generates a unique cache key from parameters
   *
   * @param {Object} params - Parameters to generate key from
   * @returns {string} - Unique cache key
   */
  generateKey(params) {
    return JSON.stringify(params);
  }

  /**
   * Checks if a key exists in cache
   *
   * @param {string} key - Cache key to check
   * @returns {boolean} - True if key exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Gets a value from cache
   *
   * @param {string} key - Cache key
   * @returns {*} - Cached value or undefined
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Sets a value in cache with automatic size management
   * Removes oldest entry if cache is full
   *
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   */
  set(key, value) {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  /**
   * Gets current cache size
   *
   * @returns {number} - Number of items in cache
   */
  size() {
    return this.cache.size;
  }

  /**
   * Clears all cached items
   */
  clear() {
    this.cache.clear();
  }
}
