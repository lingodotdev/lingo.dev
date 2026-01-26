/**
 * Content type discriminator for rate limiting
 */
type ContentType = 'joke' | 'quote';

/**
 * Rate limit entry tracking request counts and reset timestamps
 */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting (IP -> ContentType -> Entry)
const rateLimitStore = new Map<string, Map<ContentType, RateLimitEntry>>();

/**
 * Maximum number of fresh API requests allowed per IP per content type
 */
const MAX_REQUESTS = 2;

/**
 * Time interval in milliseconds before rate limit counters reset (1 hour)
 */
const RESET_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Checks if the client IP is under the rate limit for the given content type
 * 
 * Returns true if the IP can make fresh API calls (under the 2-request limit),
 * or false if they should be served from cache only.
 * 
 * @param ip - Client IP address
 * @param contentType - Type of content being requested ('joke' or 'quote')
 * @returns true if under limit (can make fresh API calls), false otherwise
 * 
 * @example
 * ```typescript
 * const canCallAPI = checkRateLimit('192.168.1.1', 'joke');
 * if (!canCallAPI) {
 *   // Serve from cache only
 * }
 * ```
 */
export function checkRateLimit(ip: string, contentType: ContentType): boolean {
  const now = Date.now();
  
  let ipLimits = rateLimitStore.get(ip);
  if (!ipLimits) {
    ipLimits = new Map();
    rateLimitStore.set(ip, ipLimits);
  }

  let entry = ipLimits.get(contentType);
  
  // Reset if expired
  if (entry && now >= entry.resetAt) {
    entry = undefined;
  }

  if (!entry) {
    return true; // No entry means under limit
  }

  return entry.count < MAX_REQUESTS;
}

/**
 * Increments the request count for tracking fresh content API calls
 * 
 * Should be called after successfully making a fresh translation API call
 * to track usage against the rate limit threshold.
 * 
 * @param ip - Client IP address
 * @param contentType - Type of content being requested ('joke' or 'quote')
 * 
 * @example
 * ```typescript
 * // After successful API call
 * incrementRequestCount('192.168.1.1', 'joke');
 * ```
 */
export function incrementRequestCount(ip: string, contentType: ContentType): void {
  const now = Date.now();
  
  let ipLimits = rateLimitStore.get(ip);
  if (!ipLimits) {
    ipLimits = new Map();
    rateLimitStore.set(ip, ipLimits);
  }

  let entry = ipLimits.get(contentType);

  if (!entry || now >= entry.resetAt) {
    // Create new entry
    entry = {
      count: 1,
      resetAt: now + RESET_INTERVAL_MS,
    };
  } else {
    entry.count++;
  }

  ipLimits.set(contentType, entry);
}

/**
 * Cleanup old entries periodically (runs every hour)
 * 
 * Automatically removes expired rate limit entries to prevent memory leaks
 * in the in-memory store.
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, ipLimits] of rateLimitStore.entries()) {
    for (const [contentType, entry] of ipLimits.entries()) {
      if (now >= entry.resetAt) {
        ipLimits.delete(contentType);
      }
    }
    if (ipLimits.size === 0) {
      rateLimitStore.delete(ip);
    }
  }
}, RESET_INTERVAL_MS);
