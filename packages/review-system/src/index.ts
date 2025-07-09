// Main exports
export { MultiAgentTranslationReviewSystem } from "./review-system";

// Agent exports
export { BaseAgent } from "./agents/base-agent";
export { TranslatorAgent } from "./agents/translator-agent";
export { BrandSpecialistAgent } from "./agents/brand-specialist-agent";
export { TechnicalReviewerAgent } from "./agents/technical-reviewer-agent";

// Type exports
export type {
  AgentType,
  ReviewStatus,
  ReviewRequest,
  AgentReview,
  AgentConfig,
  WorkflowConfig,
  ReviewSession,
  ReviewMetrics,
  ReviewEvent,
  ReviewEventType,
} from "./types";

export {
  AgentTypeSchema,
  ReviewStatusSchema,
  ReviewRequestSchema,
  AgentReviewSchema,
  AgentConfigSchema,
  WorkflowConfigSchema,
  ReviewSessionSchema,
  ReviewMetricsSchema,
  ReviewEventSchema,
} from "./types";

// Utility functions for creating common configurations
export function createDefaultWorkflow() {
  return {
    id: "default-workflow",
    name: "Default Translation Review Workflow",
    description: "Standard workflow with translator and brand specialist review",
    steps: [
      {
        order: 1,
        agentType: "TRANSLATOR",
        required: true,
        autoApprove: false,
        maxReviewers: 1,
      },
      {
        order: 2,
        agentType: "BRAND_SPECIALIST",
        required: true,
        autoApprove: false,
        maxReviewers: 1,
      },
    ],
    autoAssign: true,
    parallelReviews: false,
    isActive: true,
  };
}

export function createTechnicalWorkflow() {
  return {
    id: "technical-workflow",
    name: "Technical Translation Review Workflow",
    description: "Workflow optimized for technical content with technical reviewer",
    steps: [
      {
        order: 1,
        agentType: "TRANSLATOR",
        required: true,
        autoApprove: false,
        maxReviewers: 1,
      },
      {
        order: 2,
        agentType: "TECHNICAL_REVIEWER",
        required: true,
        autoApprove: false,
        maxReviewers: 1,
      },
      {
        order: 3,
        agentType: "BRAND_SPECIALIST",
        required: false,
        autoApprove: true,
        maxReviewers: 1,
      },
    ],
    autoAssign: true,
    parallelReviews: false,
    isActive: true,
  };
}

export function createFastWorkflow() {
  return {
    id: "fast-workflow",
    name: "Fast Translation Review Workflow",
    description: "Quick review with parallel processing",
    steps: [
      {
        order: 1,
        agentType: "TRANSLATOR",
        required: true,
        autoApprove: true,
        maxReviewers: 2,
      },
    ],
    autoAssign: true,
    parallelReviews: true,
    isActive: true,
  };
}

// Helper function to create agent configurations
export function createAgentConfig(
  type: string,
  name: string,
  options: any = {}
) {
  return {
    id: `agent-${Date.now()}`,
    name,
    type,
    llmProvider: "lingo",
    expertise: [],
    languages: [],
    isActive: true,
    ...options,
  };
} 