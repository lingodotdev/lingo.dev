/**
 * Upstash Redis Client for Translation Memory (TM) Caching
 * Falls back to in-memory cache if Redis not configured
 */

import { Redis } from "@upstash/redis";

// ============================================
// Types
// ============================================

export interface CachedTranslation {
    translation: string;
    provider: string;
    cachedAt: string;
    hitCount: number;
}

export interface CacheStats {
    tmHits: number;
    tmMisses: number;
    totalTranslations: number;
    avgLatencyMs: number;
    inferenceCalls: number;
    flaggedMessages: number;
}

// ============================================
// In-Memory Fallback
// ============================================

const memoryCache = new Map<string, CachedTranslation>();
const memoryStats: CacheStats = {
    tmHits: 0,
    tmMisses: 0,
    totalTranslations: 0,
    avgLatencyMs: 0,
    inferenceCalls: 0,
    flaggedMessages: 0,
};
const latencies: number[] = [];

// ============================================
// Redis Client
// ============================================

let redis: Redis | null = null;
let useMemoryFallback = false;

function getRedis(): Redis | null {
    if (useMemoryFallback) return null;

    if (!redis) {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (!url || !token) {
            console.log("⚠️ Upstash Redis not configured, using in-memory cache");
            useMemoryFallback = true;
            return null;
        }

        try {
            redis = new Redis({ url, token });
        } catch {
            console.log("⚠️ Failed to connect to Redis, using in-memory cache");
            useMemoryFallback = true;
            return null;
        }
    }
    return redis;
}

// ============================================
// Hashing
// ============================================

export async function sha256(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getTMCacheKey(
    text: string,
    targetLang: string,
): Promise<string> {
    const hash = await sha256(`${text}|${targetLang}`);
    return `tm:${hash}`;
}

// ============================================
// Translation Memory Operations
// ============================================

export async function getTMTranslation(
    text: string,
    targetLang: string,
): Promise<CachedTranslation | null> {
    try {
        const key = await getTMCacheKey(text, targetLang);
        const redisClient = getRedis();

        if (redisClient) {
            const cached = await redisClient.get<CachedTranslation>(key);
            if (cached) {
                await incrementStats("tmHits");
                return cached;
            }
        } else {
            // In-memory fallback
            const cached = memoryCache.get(key);
            if (cached) {
                memoryStats.tmHits++;
                cached.hitCount++;
                return cached;
            }
        }

        await incrementStats("tmMisses");
        return null;
    } catch (error) {
        console.error("TM cache get error:", error);
        return null;
    }
}

export async function setTMTranslation(
    text: string,
    targetLang: string,
    translation: string,
    provider: string,
    ttlSeconds: number = 86400,
): Promise<void> {
    try {
        const key = await getTMCacheKey(text, targetLang);
        const cached: CachedTranslation = {
            translation,
            provider,
            cachedAt: new Date().toISOString(),
            hitCount: 0,
        };

        const redisClient = getRedis();
        if (redisClient) {
            await redisClient.set(key, cached, { ex: ttlSeconds });
        } else {
            memoryCache.set(key, cached);
        }

        await incrementStats("totalTranslations");
    } catch (error) {
        console.error("TM cache set error:", error);
    }
}

// ============================================
// Metrics
// ============================================

export async function incrementStats(
    field: keyof CacheStats,
    by: number = 1,
): Promise<void> {
    const redisClient = getRedis();
    if (redisClient) {
        try {
            await redisClient.hincrby("stats:global", field, by);
        } catch {
            // Ignore Redis errors for stats
        }
    } else {
        (memoryStats[field] as number) += by;
    }
}

export async function recordLatency(latencyMs: number): Promise<void> {
    const redisClient = getRedis();
    if (redisClient) {
        try {
            await redisClient.lpush("stats:latencies", latencyMs);
            await redisClient.ltrim("stats:latencies", 0, 999);
        } catch {
            // Ignore
        }
    } else {
        latencies.push(latencyMs);
        if (latencies.length > 1000) latencies.shift();
    }
    await incrementStats("inferenceCalls");
}

export async function getStats(): Promise<CacheStats> {
    const redisClient = getRedis();

    if (redisClient) {
        try {
            const stats = await redisClient.hgetall<CacheStats>("stats:global");
            const storedLatencies = await redisClient.lrange<number>(
                "stats:latencies",
                0,
                -1,
            );

            let avgLatencyMs = 0;
            if (storedLatencies && storedLatencies.length > 0) {
                avgLatencyMs =
                    storedLatencies.reduce((a, b) => a + b, 0) / storedLatencies.length;
            }

            return {
                tmHits: stats?.tmHits || 0,
                tmMisses: stats?.tmMisses || 0,
                totalTranslations: stats?.totalTranslations || 0,
                avgLatencyMs: Math.round(avgLatencyMs),
                inferenceCalls: stats?.inferenceCalls || 0,
                flaggedMessages: stats?.flaggedMessages || 0,
            };
        } catch {
            // Fall through to memory stats
        }
    }

    // In-memory stats
    let avgLatencyMs = 0;
    if (latencies.length > 0) {
        avgLatencyMs = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    }

    return {
        ...memoryStats,
        avgLatencyMs: Math.round(avgLatencyMs),
    };
}

export async function resetStats(): Promise<void> {
    const redisClient = getRedis();
    if (redisClient) {
        try {
            await redisClient.del("stats:global");
            await redisClient.del("stats:latencies");
        } catch {
            // Ignore
        }
    }

    // Reset memory stats too
    memoryStats.tmHits = 0;
    memoryStats.tmMisses = 0;
    memoryStats.totalTranslations = 0;
    memoryStats.avgLatencyMs = 0;
    memoryStats.inferenceCalls = 0;
    memoryStats.flaggedMessages = 0;
    latencies.length = 0;
}

export async function getTMHitRate(): Promise<number> {
    const stats = await getStats();
    const total = stats.tmHits + stats.tmMisses;
    if (total === 0) return 0;
    return Math.round((stats.tmHits / total) * 100);
}
