"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface QueueItem {
    id: string;
    message_id: string;
    reason: string;
    categories: string[];
    confidence: number;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    messages?: {
        content: string;
        user_id: string;
        room_id: string;
    };
}

export default function ModeratorPage() {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"pending" | "approved" | "rejected">(
        "pending",
    );
    const [processing, setProcessing] = useState<Set<string>>(new Set());

    const fetchQueue = async () => {
        try {
            const response = await fetch(`/api/moderate?status=${filter}`);
            const data = await response.json();
            if (data.success) {
                setQueue(data.queue);
            }
        } catch (error) {
            console.error("Failed to fetch moderation queue:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchQueue();
    }, [filter]);

    const handleReview = async (
        queueItemId: string,
        action: "approve" | "reject",
    ) => {
        setProcessing((prev) => new Set(prev).add(queueItemId));

        try {
            const response = await fetch("/api/moderate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    queueItemId,
                    action,
                    reviewerId: "moderator-1", // In a real app, this would be the logged-in user
                }),
            });

            if (response.ok) {
                // Remove from current view
                setQueue((prev) => prev.filter((item) => item.id !== queueItemId));
            }
        } catch (error) {
            console.error("Failed to review item:", error);
        } finally {
            setProcessing((prev) => {
                const next = new Set(prev);
                next.delete(queueItemId);
                return next;
            });
        }
    };

    const getCategoryBadge = (category: string) => {
        const colors: Record<string, string> = {
            violence: "var(--color-accent-error)",
            hate_speech: "var(--color-accent-error)",
            harassment: "var(--color-accent-warning)",
            spam: "var(--color-accent-warning)",
            sexual_content: "var(--color-accent-error)",
            misinformation: "var(--color-accent-warning)",
        };

        return (
            <span
                key={category}
                style={{
                    display: "inline-block",
                    padding: "0.125rem 0.5rem",
                    background: `${colors[category] || "var(--color-text-muted)"}20`,
                    color: colors[category] || "var(--color-text-muted)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.75rem",
                    marginRight: "0.25rem",
                }}
            >
                {category.replace("_", " ")}
            </span>
        );
    };

    // Demo data for when there's no real queue
    const demoQueue: QueueItem[] = [
        {
            id: "demo-1",
            message_id: "msg-1",
            reason: "Potential spam detected",
            categories: ["spam"],
            confidence: 0.85,
            status: "pending",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            messages: {
                content: "Buy now! Click here for amazing deals! 🎁🎁🎁",
                user_id: "user-spam-1",
                room_id: "room-1",
            },
        },
        {
            id: "demo-2",
            message_id: "msg-2",
            reason: "Content flagged for review",
            categories: ["harassment"],
            confidence: 0.72,
            status: "pending",
            created_at: new Date(Date.now() - 7200000).toISOString(),
            messages: {
                content: "This discussion is getting heated but staying civil.",
                user_id: "user-2",
                room_id: "room-1",
            },
        },
    ];

    const displayQueue =
        queue.length > 0 ? queue : filter === "pending" ? demoQueue : [];

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
                    <Link href="/metrics" className="nav-link">
                        Metrics
                    </Link>
                    <Link href="/moderator" className="nav-link active">
                        Moderator
                    </Link>
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
                            🛡️ Moderation Queue
                        </h1>
                        <p style={{ color: "var(--color-text-secondary)" }}>
                            Review flagged messages before they are shown to users
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                            className={`btn ${filter === "pending" ? "btn-primary" : "btn-secondary"}`}
                            onClick={() => setFilter("pending")}
                        >
                            ⏳ Pending
                        </button>
                        <button
                            className={`btn ${filter === "approved" ? "btn-primary" : "btn-secondary"}`}
                            onClick={() => setFilter("approved")}
                        >
                            ✅ Approved
                        </button>
                        <button
                            className={`btn ${filter === "rejected" ? "btn-primary" : "btn-secondary"}`}
                            onClick={() => setFilter("rejected")}
                        >
                            ❌ Rejected
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div
                        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                    >
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="card" style={{ padding: "1.5rem" }}>
                                <div
                                    className="skeleton"
                                    style={{
                                        height: "1.5rem",
                                        width: "40%",
                                        marginBottom: "0.75rem",
                                    }}
                                />
                                <div
                                    className="skeleton"
                                    style={{
                                        height: "1rem",
                                        width: "80%",
                                        marginBottom: "0.5rem",
                                    }}
                                />
                                <div
                                    className="skeleton"
                                    style={{ height: "1rem", width: "60%" }}
                                />
                            </div>
                        ))}
                    </div>
                ) : displayQueue.length === 0 ? (
                    <div
                        className="card"
                        style={{ padding: "3rem", textAlign: "center" }}
                    >
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                            {filter === "pending" && "🎉"}
                            {filter === "approved" && "✅"}
                            {filter === "rejected" && "🗑️"}
                        </div>
                        <h3 style={{ marginBottom: "0.5rem" }}>
                            {filter === "pending" && "All Clear!"}
                            {filter === "approved" && "No Approved Items"}
                            {filter === "rejected" && "No Rejected Items"}
                        </h3>
                        <p style={{ color: "var(--color-text-secondary)" }}>
                            {filter === "pending" && "No messages pending moderation."}
                            {filter === "approved" && "Approved messages will appear here."}
                            {filter === "rejected" && "Rejected messages will appear here."}
                        </p>
                    </div>
                ) : (
                    <div
                        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                    >
                        {displayQueue.map((item) => (
                            <div
                                key={item.id}
                                className="card animate-fadeIn"
                                style={{ padding: "1.5rem" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "0.5rem",
                                                alignItems: "center",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            <span className="badge badge-flagged">🚩 Flagged</span>
                                            {item.categories.map(getCategoryBadge)}
                                        </div>
                                        <p
                                            style={{
                                                color: "var(--color-text-secondary)",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            {item.reason}
                                        </p>
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "right",
                                            fontSize: "0.75rem",
                                            color: "var(--color-text-muted)",
                                        }}
                                    >
                                        <div>Confidence: {Math.round(item.confidence * 100)}%</div>
                                        <div>{new Date(item.created_at).toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div
                                    style={{
                                        padding: "1rem",
                                        background: "var(--color-bg-tertiary)",
                                        borderRadius: "var(--radius-md)",
                                        borderLeft: "3px solid var(--color-accent-warning)",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    <p
                                        style={{ fontFamily: "monospace", wordBreak: "break-word" }}
                                    >
                                        &quot;
                                        {item.messages?.content || "Message content unavailable"}
                                        &quot;
                                    </p>
                                </div>

                                {/* Actions */}
                                {filter === "pending" && (
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleReview(item.id, "approve")}
                                            disabled={processing.has(item.id)}
                                            style={{
                                                borderColor: "var(--color-accent-success)",
                                                color: "var(--color-accent-success)",
                                            }}
                                        >
                                            {processing.has(item.id) ? "..." : "✅ Approve"}
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleReview(item.id, "reject")}
                                            disabled={processing.has(item.id)}
                                            style={{
                                                borderColor: "var(--color-accent-error)",
                                                color: "var(--color-accent-error)",
                                            }}
                                        >
                                            {processing.has(item.id) ? "..." : "❌ Reject"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Box */}
                <div className="card" style={{ padding: "1.5rem", marginTop: "2rem" }}>
                    <h4 style={{ marginBottom: "0.75rem" }}>ℹ️ How Moderation Works</h4>
                    <ul
                        style={{
                            color: "var(--color-text-secondary)",
                            fontSize: "0.875rem",
                            paddingLeft: "1.25rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                        }}
                    >
                        <li>
                            Messages are automatically scanned using AI moderation (Gemini) or
                            regex patterns
                        </li>
                        <li>
                            Flagged content is held for review before being shown to users
                        </li>
                        <li>Approved messages are released to recipients</li>
                        <li>Rejected messages are hidden and logged for analysis</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
