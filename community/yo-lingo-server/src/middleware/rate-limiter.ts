type ContentType = 'joke' | 'quote';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting (IP -> ContentType -> Entry)
const rateLimitStore = new Map<string, Map<ContentType, RateLimitEntry>>();

const MAX_REQUESTS = 2;
const RESET_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Checks if the IP is under the rate limit for the given content type
 * Returns true if under limit (can make fresh API calls), false otherwise
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
 * Increments the request count for tracking fresh content requests
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
