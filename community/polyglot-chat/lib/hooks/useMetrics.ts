"use client";

import { useState, useEffect, useCallback } from "react";

interface CacheStats {
    tmHits: number;
    tmMisses: number;
    totalTranslations: number;
    avgLatencyMs: number;
    inferenceCalls: number;
    flaggedMessages: number;
    tmHitRate: string;
}

interface MetricsData {
    provider: string;
    stats: CacheStats;
    timestamp: string;
}

export function useMetrics(
    autoRefresh: boolean = true,
    intervalMs: number = 5000,
) {
    const [metrics, setMetrics] = useState<MetricsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchMetrics = useCallback(async () => {
        try {
            const response = await fetch("/api/metrics");
            if (!response.ok) throw new Error("Failed to fetch metrics");
            const data = await response.json();
            if (data.success) {
                setMetrics(data);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetStats = useCallback(async () => {
        try {
            await fetch("/api/metrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "reset" }),
            });
            fetchMetrics();
        } catch (err) {
            console.error("Failed to reset stats:", err);
        }
    }, [fetchMetrics]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(fetchMetrics, intervalMs);
        return () => clearInterval(interval);
    }, [autoRefresh, intervalMs, fetchMetrics]);

    return { metrics, isLoading, error, refresh: fetchMetrics, resetStats };
}
