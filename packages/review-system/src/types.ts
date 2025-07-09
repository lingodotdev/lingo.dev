import { z } from "zod";
import { LocaleCode } from "@lingo.dev/_spec";

// Agent types for different review roles
export const AgentTypeSchema = z.enum([
  "TRANSLATOR",
  "REVIEWER", 
  "BRAND_SPECIALIST",
  "TECHNICAL_REVIEWER",
  "QUALITY_ASSURANCE"
]);

export type AgentType = z.infer<typeof AgentTypeSchema>;

// Review status
export const ReviewStatusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS", 
  "APPROVED",
  "REJECTED",
  "NEEDS_REVISION"
]);

export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;

// Translation review request
export const ReviewRequestSchema = z.object({
  id: z.string(),
  sourceLocale: z.string(),
  targetLocale: z.string(),
  content: z.record(z.string(), z.string()),
  context: z.object({
    domain: z.string().optional(),
    tone: z.string().optional(),
    brandGuidelines: z.string().optional(),
    technicalContext: z.string().optional(),
  }).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  deadline: z.date().optional(),
  assignedAgents: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ReviewRequest = z.infer<typeof ReviewRequestSchema>;

// Agent review
export const AgentReviewSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  agentId: z.string(),
  agentType: AgentTypeSchema,
  status: ReviewStatusSchema,
  comments: z.array(z.object({
    key: z.string(),
    message: z.string(),
    suggestion: z.string().optional(),
    severity: z.enum(["INFO", "WARNING", "ERROR"]).default("INFO"),
  })),
  suggestedChanges: z.record(z.string(), z.string()).optional(),
  confidence: z.number().min(0).max(1).optional(),
  reviewTime: z.number().optional(), // in seconds
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AgentReview = z.infer<typeof AgentReviewSchema>;

// Agent configuration
export const AgentConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: AgentTypeSchema,
  llmProvider: z.enum(["openai", "anthropic", "lingo"]).default("lingo"),
  llmModel: z.string().optional(),
  apiKey: z.string().optional(),
  expertise: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  brandGuidelines: z.string().optional(),
  reviewPrompt: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

// Review workflow configuration
export const WorkflowConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  steps: z.array(z.object({
    order: z.number(),
    agentType: AgentTypeSchema,
    required: z.boolean().default(true),
    autoApprove: z.boolean().default(false),
    maxReviewers: z.number().min(1).default(1),
  })),
  autoAssign: z.boolean().default(true),
  parallelReviews: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type WorkflowConfig = z.infer<typeof WorkflowConfigSchema>;

// Review session
export const ReviewSessionSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  workflowId: z.string(),
  status: ReviewStatusSchema,
  currentStep: z.number().default(0),
  reviews: z.array(AgentReviewSchema),
  finalTranslation: z.record(z.string(), z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional(),
});

export type ReviewSession = z.infer<typeof ReviewSessionSchema>;

// Review metrics
export const ReviewMetricsSchema = z.object({
  sessionId: z.string(),
  totalReviewTime: z.number(), // in seconds
  averageReviewTime: z.number(), // in seconds
  numberOfReviews: z.number(),
  numberOfRevisions: z.number(),
  qualityScore: z.number().min(0).max(1).optional(),
  agentPerformance: z.record(z.string(), z.object({
    reviewsCompleted: z.number(),
    averageTime: z.number(),
    approvalRate: z.number(),
  })),
});

export type ReviewMetrics = z.infer<typeof ReviewMetricsSchema>;

// Event types for the review system
export const ReviewEventTypeSchema = z.enum([
  "REVIEW_REQUESTED",
  "REVIEW_STARTED", 
  "REVIEW_COMPLETED",
  "REVIEW_APPROVED",
  "REVIEW_REJECTED",
  "REVIEW_REVISED",
  "SESSION_COMPLETED"
]);

export type ReviewEventType = z.infer<typeof ReviewEventTypeSchema>;

// Review event
export const ReviewEventSchema = z.object({
  id: z.string(),
  type: ReviewEventTypeSchema,
  sessionId: z.string(),
  agentId: z.string().optional(),
  data: z.record(z.string(), z.any()),
  timestamp: z.date(),
});

export type ReviewEvent = z.infer<typeof ReviewEventSchema>; 