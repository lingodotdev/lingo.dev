#!/usr/bin/env node

/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per IP address
 */

// Store request counts per IP
const requestCounts = new Map();

// Configuration
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute per IP

// ANSI color codes for professional logging
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  cache: (msg) => console.log(`${colors.cyan}[CACHE]${colors.reset} ${msg}`),
  debug: (msg) => console.log(`${colors.dim}[DEBUG]${colors.reset} ${msg}`)
};

/**
 * Rate limiting middleware
 */
export function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Get or create request record for this IP
  let record = requestCounts.get(ip);
  
  if (!record) {
    record = {
      count: 0,
      resetTime: now + WINDOW_MS
    };
    requestCounts.set(ip, record);
  }
  
  // Reset if window has passed
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + WINDOW_MS;
  }
  
  // Increment request count
  record.count++;
  
  // Check if limit exceeded
  if (record.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    
    res.set('Retry-After', retryAfter);
    res.set('X-RateLimit-Limit', MAX_REQUESTS);
    res.set('X-RateLimit-Remaining', 0);
    res.set('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
    
    return res.status(429).json({
      success: false,
      error: 'Too many requests',
      message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      retryAfter
    });
  }
  
  // Add rate limit headers
  res.set('X-RateLimit-Limit', MAX_REQUESTS);
  res.set('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - record.count));
  res.set('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
  
  next();
}

/**
 * Strict rate limiting for translation endpoints
 */
export function strictRateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const key = `strict:${ip}`;
  
  const STRICT_WINDOW = 60 * 1000; // 1 minute
  const STRICT_MAX = 3; // 3 translation requests per minute
  
  let record = requestCounts.get(key);
  
  if (!record) {
    record = {
      count: 0,
      resetTime: now + STRICT_WINDOW
    };
    requestCounts.set(key, record);
  }
  
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + STRICT_WINDOW;
  }
  
  record.count++;
  
  if (record.count > STRICT_MAX) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    
    res.set('Retry-After', retryAfter);
    
    return res.status(429).json({
      success: false,
      error: 'Translation rate limit exceeded',
      message: `You can only make ${STRICT_MAX} translation requests per minute. Please try again in ${retryAfter} seconds.`,
      retryAfter
    });
  }
  
  next();
}

// Cleanup old records every 10 minutes
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime + WINDOW_MS) {
      requestCounts.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    log.info(`Cleaned up ${cleaned} expired rate limit records`);
  }
}, 10 * 60 * 1000);
