/**
 * Rate Limiter
 *
 * Simple in-memory rate limiter to prevent abuse.
 * For production with multiple instances, consider using Redis.
 */

import { RATE_LIMIT_CONFIG } from "../config/constants.js";

/**
 * RateLimiter class tracks and enforces request limits per IP
 */
export class RateLimiter {
  constructor(
    windowMs = RATE_LIMIT_CONFIG.WINDOW_MS,
    maxRequests = RATE_LIMIT_CONFIG.MAX_REQUESTS,
  ) {
    this.requestCounts = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Checks if a request from an IP should be allowed
   *
   * @param {string} ip - Client IP address
   * @returns {boolean} - True if request is allowed, false if rate limit exceeded
   */
  checkLimit(ip) {
    const now = Date.now();
    const userRequests = this.requestCounts.get(ip) || [];

    // Filter out old requests outside the time window
    const recentRequests = userRequests.filter(
      (time) => now - time < this.windowMs,
    );

    // Check if limit exceeded
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request and update tracking
    recentRequests.push(now);
    this.requestCounts.set(ip, recentRequests);
    return true;
  }

  /**
   * Gets current request count for an IP
   *
   * @param {string} ip - Client IP address
   * @returns {number} - Number of recent requests
   */
  getCount(ip) {
    const now = Date.now();
    const userRequests = this.requestCounts.get(ip) || [];
    return userRequests.filter((time) => now - time < this.windowMs).length;
  }

  /**
   * Clears all rate limit tracking
   */
  clear() {
    this.requestCounts.clear();
  }
}
