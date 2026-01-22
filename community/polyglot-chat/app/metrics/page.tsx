"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
    tmHits: number;
    tmMisses: number;
    totalTranslations: number;
    avgLatencyMs: number;
    inferenceCalls: number;
    flaggedMessages: number;
    tmHitRate: string;
}

interface MetricsResponse {
    success: boolean;
    provider: string;
    stats: Stats;
    timestamp: string;
}

export default function MetricsPage() {
    const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchMetrics = async () => {
        try {
            const response = await fetch("/api/metrics");
            const data = await response.json();
            setMetrics(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to fetch metrics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetStats = async () => {
        if (
            !confirm(
                "Are you sure you want to reset all stats? This cannot be undone.",
            )
        )
            return;

        try {
            await fetch("/api/metrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "reset" }),
            });
            fetchMetrics();
        } catch (error) {
            console.error("Failed to reset stats:", error);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, [autoRefresh]);

    const getProviderBadge = (provider: string) => {
        const badges: Record<string, { class: string; label: string }> = {
            lingo: { class: "provider-lingo", label: "✨ Lingo.dev SDK" },
            gemini: { class: "provider-gemini", label: "🚀 Google Gemini" },
            huggingface: { class: "provider-huggingface", label: "🤗 Hugging Face" },
            none: { class: "", label: "⚠️ No Provider" },
        };
        const badge = badges[provider] || badges.none;
        return (
            <span className={`provider-badge ${badge.class}`}>{badge.label}</span>
        );
    };

    return (
        <main style={{ minHeight: "100vh" }}>
            {/* Navigation */}
            <nav className="nav">
                <Link href="/" className="nav-brand">
                    PolyglotChat
                </Link>
                <div className="nav-links">
                    <Link href="/chat" className="nav-link">
                        Chat
                    </Link>
                    <Link href="/metrics" className="nav-link active">
                        Metrics
                    </Link>
                    <Link href="/moderator" className="nav-link">
                        Moderator
                    </Link>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    {metrics && getProviderBadge(metrics.provider)}
                </div>
            </nav>

            <div className="container" style={{ padding: "2rem 1rem" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "2rem",
                    }}
                >
                    <div>
                        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                            📊 Translation Metrics
                        </h1>
                        <p style={{ color: "var(--color-text-secondary)" }}>
                            Real-time statistics for translation performance
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontSize: "0.875rem",
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                style={{ accentColor: "var(--color-accent-primary)" }}
                            />
                            Auto-refresh (5s)
                        </label>
                        <button className="btn btn-secondary" onClick={fetchMetrics}>
                            🔄 Refresh
                        </button>
                        <button className="btn btn-ghost" onClick={resetStats}>
                            🗑️ Reset
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid-stats">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="stat-card">
                                <div
                                    className="skeleton"
                                    style={{ height: "3rem", marginBottom: "0.5rem" }}
                                />
                                <div
                                    className="skeleton"
                                    style={{ height: "1rem", width: "60%" }}
                                />
                            </div>
                        ))}
                    </div>
                ) : metrics ? (
                    <>
                        {/* Main Stats Grid */}
                        <div className="grid-stats" style={{ marginBottom: "2rem" }}>
                            <div className="stat-card">
                                <div className="stat-value">{metrics.stats.tmHitRate}</div>
                                <div className="stat-label">TM Hit Rate</div>
                                <p
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "var(--color-text-muted)",
                                        marginTop: "0.25rem",
                                    }}
                                >
                                    Cached translations served
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-value">{metrics.stats.avgLatencyMs}ms</div>
                                <div className="stat-label">Avg Latency</div>
                                <p
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "var(--color-text-muted)",
                                        marginTop: "0.25rem",
                                    }}
                                >
                                    Translation response time
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-value">
                                    {metrics.stats.totalTranslations}
                                </div>
                                <div className="stat-label">Total Translations</div>
                                <p
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "var(--color-text-muted)",
                                        marginTop: "0.25rem",
                                    }}
                                >
                                    Messages translated
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-value">{metrics.stats.inferenceCalls}</div>
                                <div className="stat-label">API Calls</div>
                                <p
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "var(--color-text-muted)",
                                        marginTop: "0.25rem",
                                    }}
                                >
                                    LLM inference requests
                                </p>
                            </div>

                            <div className="stat-card">
                                <div
                                    className="stat-value"
                                    style={{ color: "var(--color-accent-success)" }}
                                >
                                    {metrics.stats.tmHits}
                                </div>
                                <div className="stat-label">TM Hits</div>
                                <p
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "var(--color-text-muted)",
                                        marginTop: "0.25rem",
                                    }}
                                >
                                    Served from cache
                                </p>
                            </div>

                            <div className="stat-card">
                                <div
                                    className="stat-value"
                                    style={{ color: "var(--color-accent-warning)" }}
                                >
                                    {metrics.stats.flaggedMessages}
                                </div>
                                <div className="stat-label">Flagged</div>
                                <p
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "var(--color-text-muted)",
                                        marginTop: "0.25rem",
                                    }}
                                >
                                    Pending moderation
                                </p>
                            </div>
                        </div>

                        {/* TM Performance Visualization */}
                        <div
                            className="card"
                            style={{ padding: "1.5rem", marginBottom: "2rem" }}
                        >
                            <h3 style={{ marginBottom: "1rem" }}>
                                Translation Memory Performance
                            </h3>
                            <div
                                style={{
                                    display: "flex",
                                    height: "40px",
                                    borderRadius: "var(--radius-lg)",
                                    overflow: "hidden",
                                    background: "var(--color-bg-tertiary)",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${parseInt(metrics.stats.tmHitRate) || 0}%`,
                                        background: "linear-gradient(90deg, #10b981, #34d399)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: "0.875rem",
                                        transition: "width 0.5s ease",
                                    }}
                                >
                                    {parseInt(metrics.stats.tmHitRate) > 10 &&
                                        `${metrics.stats.tmHitRate} Cached`}
                                </div>
                                <div
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "var(--color-text-secondary)",
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    {metrics.stats.tmMisses} Live Translations
                                </div>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "1rem",
                            }}
                        >
                            <div className="card" style={{ padding: "1.5rem" }}>
                                <h4 style={{ marginBottom: "0.75rem" }}>🔌 Active Provider</h4>
                                <p
                                    style={{
                                        color: "var(--color-text-secondary)",
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    {metrics.provider === "lingo" &&
                                        "Using Lingo.dev SDK for best translation quality"}
                                    {metrics.provider === "gemini" &&
                                        "Using Google Gemini for fast, capable translations"}
                                    {metrics.provider === "huggingface" &&
                                        "Using Hugging Face community models (Helsinki-NLP)"}
                                    {metrics.provider === "none" &&
                                        "No provider configured. Set API keys to enable translations."}
                                </p>
                            </div>

                            <div className="card" style={{ padding: "1.5rem" }}>
                                <h4 style={{ marginBottom: "0.75rem" }}>
                                    💡 Tips to Improve TM Hit Rate
                                </h4>
                                <ul
                                    style={{
                                        color: "var(--color-text-secondary)",
                                        fontSize: "0.875rem",
                                        paddingLeft: "1.25rem",
                                    }}
                                >
                                    <li>
                                        Use &quot;Simulate Burst&quot; in chat to create duplicate
                                        messages
                                    </li>
                                    <li>Common phrases get cached and reused automatically</li>
                                    <li>TM cache persists for 24 hours per translation</li>
                                </ul>
                            </div>
                        </div>

                        {/* Last Updated */}
                        {lastUpdated && (
                            <p
                                style={{
                                    textAlign: "center",
                                    color: "var(--color-text-muted)",
                                    fontSize: "0.75rem",
                                    marginTop: "2rem",
                                }}
                            >
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </p>
                        )}
                    </>
                ) : (
                    <div
                        className="card"
                        style={{ padding: "2rem", textAlign: "center" }}
                    >
                        <p style={{ color: "var(--color-text-secondary)" }}>
                            Failed to load metrics. Make sure your Upstash Redis is
                            configured.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
