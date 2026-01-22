/**
 * Moderation API Endpoint
 *
 * @route GET /api/moderate/queue - Get pending moderation items
 * @route POST /api/moderate - Check content for moderation
 * @route POST /api/moderate/review - Approve or reject flagged content
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { moderateContent } from "@/lib/llm-adapter";
import { z } from "zod";

// ============================================
// Request Validation
// ============================================

const ModerateRequestSchema = z.object({
    text: z.string().min(1),
    messageId: z.string().uuid().optional(),
});

const ReviewRequestSchema = z.object({
    queueItemId: z.string().uuid(),
    action: z.enum(["approve", "reject"]),
    reviewerId: z.string().uuid(),
});

// ============================================
// Handlers
// ============================================

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "pending";
        const limit = parseInt(searchParams.get("limit") || "50", 10);

        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("moderation_queue")
            .select("*, messages:message_id(content, user_id, room_id)")
            .eq("status", status)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            queue: data || [],
        });
    } catch (error) {
        console.error("Moderation queue fetch error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch moderation queue" },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Check if this is a review action
        if (body.action && body.queueItemId) {
            return handleReview(body);
        }

        // Otherwise, it's a moderation check
        const { text, messageId } = ModerateRequestSchema.parse(body);

        const result = await moderateContent(text);

        // If flagged and has a messageId, add to queue
        if (result.flagged && messageId) {
            const supabase = getSupabaseAdmin();
            await supabase.from("moderation_queue").insert({
                message_id: messageId,
                reason: result.reason || "Content flagged",
                categories: result.categories || [],
                confidence: result.confidence,
                status: "pending",
            });
        }

        return NextResponse.json({
            success: true,
            moderation: result,
        });
    } catch (error) {
        console.error("Moderation error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Invalid request", details: error.errors },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { success: false, error: "Moderation failed" },
            { status: 500 },
        );
    }
}

async function handleReview(body: unknown) {
    try {
        const { queueItemId, action, reviewerId } = ReviewRequestSchema.parse(body);

        const supabase = getSupabaseAdmin();

        // Update the queue item
        const { error: queueError } = await supabase
            .from("moderation_queue")
            .update({
                status: action === "approve" ? "approved" : "rejected",
                reviewed_by: reviewerId,
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", queueItemId);

        if (queueError) {
            throw queueError;
        }

        // Get the message ID
        const { data: queueItem } = await supabase
            .from("moderation_queue")
            .select("message_id")
            .eq("id", queueItemId)
            .single();

        // Update message moderation status
        if (queueItem?.message_id) {
            await supabase
                .from("messages")
                .update({
                    moderation_status: action === "approve" ? "approved" : "rejected",
                })
                .eq("id", queueItem.message_id);
        }

        return NextResponse.json({
            success: true,
            message: `Message ${action}d successfully`,
        });
    } catch (error) {
        console.error("Review error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Invalid request", details: error.errors },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { success: false, error: "Review failed" },
            { status: 500 },
        );
    }
}
