/**
 * Metrics API Endpoint
 *
 * Returns translation metrics and statistics
 *
 * @route GET /api/metrics
 * @route POST /api/metrics/reset
 */

import { NextRequest, NextResponse } from "next/server";
import { getStats, getTMHitRate, resetStats } from "@/lib/upstash";
import { getProviderName } from "@/lib/llm-adapter";

export const runtime = "edge";

export async function GET() {
    try {
        const stats = await getStats();
        const tmHitRate = await getTMHitRate();
        const provider = getProviderName();

        return NextResponse.json({
            success: true,
            provider,
            stats: {
                ...stats,
                tmHitRate: `${tmHitRate}%`,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Metrics fetch error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch metrics" },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { action } = await request.json();

        if (action === "reset") {
            await resetStats();
            return NextResponse.json({
                success: true,
                message: "Stats reset successfully",
            });
        }

        return NextResponse.json(
            { success: false, error: "Unknown action" },
            { status: 400 },
        );
    } catch (error) {
        console.error("Metrics action error:", error);
        return NextResponse.json(
            { success: false, error: "Action failed" },
            { status: 500 },
        );
    }
}
