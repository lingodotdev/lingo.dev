import * as z from "zod";

export const newMessageInput = z.object({
    message: z.string().max(250),
    sessionId: z.optional(z.string().min(3)),
    userId: z.string().optional()
});

export const fetchConversationInput = z.object({
    userId: z.string(),
    conversationId: z.string()
});

export const userIdSchema = z.object({
    userId: z.string()
})