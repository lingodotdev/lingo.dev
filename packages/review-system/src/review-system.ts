import { 
  ReviewRequest, 
  ReviewSession, 
  WorkflowConfig, 
  AgentConfig, 
  AgentReview, 
  ReviewStatus,
  ReviewMetrics,
  ReviewEvent,
  ReviewEventType
} from "./types";
import { BaseAgent } from "./agents/base-agent";
import { TranslatorAgent } from "./agents/translator-agent";
import { BrandSpecialistAgent } from "./agents/brand-specialist-agent";
import { TechnicalReviewerAgent } from "./agents/technical-reviewer-agent";
import { LingoDotDevEngine } from "@lingo.dev/sdk";
import { createId } from "@paralleldrive/cuid2";

export class MultiAgentTranslationReviewSystem {
  private agents: Map<string, BaseAgent> = new Map();
  private workflows: Map<string, WorkflowConfig> = new Map();
  private sessions: Map<string, ReviewSession> = new Map();
  private events: ReviewEvent[] = [];
  private lingoEngine: LingoDotDevEngine;

  constructor(lingoApiKey: string) {
    this.lingoEngine = new LingoDotDevEngine({
      apiKey: lingoApiKey,
    });
  }

  //Register an agent with the system
  registerAgent(config: AgentConfig): void {
    let agent: BaseAgent;

    switch (config.type) {
      case "TRANSLATOR":
        agent = new TranslatorAgent(config);
        break;
      case "BRAND_SPECIALIST":
        agent = new BrandSpecialistAgent(config);
        break;
      case "TECHNICAL_REVIEWER":
        agent = new TechnicalReviewerAgent(config);
        break;
      default:
        throw new Error(`Unsupported agent type: ${config.type}`);
    }

    this.agents.set(config.id, agent);
  }

  //Register a workflow configuration
  registerWorkflow(workflow: WorkflowConfig): void {
    this.workflows.set(workflow.id, workflow);
  }

  //Create a new review request and start the review process
  async createReviewRequest(
    sourceLocale: string,
    targetLocale: string,
    content: Record<string, string>,
    workflowId: string,
    context?: ReviewRequest["context"],
    priority: ReviewRequest["priority"] = "MEDIUM"
  ): Promise<ReviewSession> {
    // Create the review request
    const request: ReviewRequest = {
      id: createId(),
      sourceLocale,
      targetLocale,
      content,
      context,
      priority,
      assignedAgents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Get initial translation using Lingo.dev
    const initialTranslation = await this.lingoEngine.localizeObject(content, {
      sourceLocale,
      targetLocale,
    });

    // Create review session
    const session: ReviewSession = {
      id: createId(),
      requestId: request.id,
      workflowId,
      status: "PENDING",
      currentStep: 0,
      reviews: [],
      finalTranslation: initialTranslation,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(session.id, session);
    this.addEvent("REVIEW_REQUESTED", session.id, { requestId: request.id });

    // Start the review process
    await this.processReviewSession(session.id, request, initialTranslation);

    return session;
  }

  //Process a review session through the workflow
  private async processReviewSession(
    sessionId: string,
    request: ReviewRequest,
    currentTranslation: Record<string, string>
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    const workflow = this.workflows.get(session.workflowId);
    if (!workflow) throw new Error(`Workflow not found: ${session.workflowId}`);

    session.status = "IN_PROGRESS";
    session.updatedAt = new Date();
    this.addEvent("REVIEW_STARTED", sessionId);

    // Process each step in the workflow
    for (const step of workflow.steps) {
      if (session.currentStep >= step.order) continue;

      const stepAgents = this.findAgentsForStep(step.agentType, request);
      
      if (stepAgents.length === 0) {
        console.warn(`No agents found for step ${step.order} (${step.agentType})`);
        continue;
      }

      // Execute reviews in parallel if configured
      const reviewPromises = stepAgents.slice(0, step.maxReviewers).map(agent =>
        this.executeAgentReview(agent, request, currentTranslation)
      );

      const reviews = await Promise.all(reviewPromises);
      session.reviews.push(...reviews);

      // Update current translation based on suggestions
      currentTranslation = this.applyReviewSuggestions(currentTranslation, reviews);

      // Check if step requires approval
      if (!step.autoApprove) {
        const allApproved = reviews.every(review => review.status === "APPROVED");
        if (!allApproved) {
          session.status = "NEEDS_REVISION";
          session.updatedAt = new Date();
          this.addEvent("REVIEW_REVISED", sessionId, { step: step.order });
          return;
        }
      }

      session.currentStep = step.order;
      session.updatedAt = new Date();
    }

    // Complete the session
    session.status = "APPROVED";
    session.finalTranslation = currentTranslation;
    session.completedAt = new Date();
    session.updatedAt = new Date();
    
    this.addEvent("SESSION_COMPLETED", sessionId, { 
      finalTranslation: currentTranslation 
    });
  }

  //Find suitable agents for a workflow step
  private findAgentsForStep(agentType: string, request: ReviewRequest): BaseAgent[] {
    return Array.from(this.agents.values()).filter(agent => {
      if (agent.getType() !== agentType) return false;
      if (!agent.canHandleLanguage(request.sourceLocale, request.targetLocale)) return false;
      if (request.context?.domain && !agent.hasExpertise(request.context.domain)) return false;
      return true;
    });
  }

  //Execute a review by a specific agent
  private async executeAgentReview(
    agent: BaseAgent,
    request: ReviewRequest,
    translation: Record<string, string>
  ): Promise<AgentReview> {
    const startTime = Date.now();
    
    try {
      const review = await agent.review(request, translation);
      review.reviewTime = (Date.now() - startTime) / 1000;
      
      this.addEvent("REVIEW_COMPLETED", request.id, { 
        agentId: agent.getId(),
        status: review.status 
      });

      return review;
    } catch (error) {
      console.error(`Agent review failed: ${error}`);
      return this.createErrorReview(agent, request, error as Error);
    }
  }

  //Create an error review when agent fails
  private createErrorReview(
    agent: BaseAgent,
    request: ReviewRequest,
    error: Error
  ): AgentReview {
    return {
      id: createId(),
      requestId: request.id,
      agentId: agent.getId(),
      agentType: agent.getType(),
      status: "REJECTED",
      comments: [{
        key: "system",
        message: `Agent review failed: ${error.message}`,
        severity: "ERROR",
      }],
      confidence: 0,
      reviewTime: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  //Apply review suggestions to the current translation
  private applyReviewSuggestions(
    translation: Record<string, string>,
    reviews: AgentReview[]
  ): Record<string, string> {
    const updatedTranslation = { ...translation };

    for (const review of reviews) {
      if (review.suggestedChanges) {
        Object.assign(updatedTranslation, review.suggestedChanges);
      }
    }

    return updatedTranslation;
  }

  //Get review session by ID
  getSession(sessionId: string): ReviewSession | undefined {
    return this.sessions.get(sessionId);
  }

  //Get all sessions
  getAllSessions(): ReviewSession[] {
    return Array.from(this.sessions.values());
  }

  //Get review metrics for a session
  getSessionMetrics(sessionId: string): ReviewMetrics | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const reviews = session.reviews;
    const totalReviewTime = reviews.reduce((sum, review) => sum + (review.reviewTime || 0), 0);
    const averageReviewTime = reviews.length > 0 ? totalReviewTime / reviews.length : 0;
    const numberOfRevisions = reviews.filter(r => r.status === "NEEDS_REVISION").length;

    const agentPerformance: Record<string, any> = {};
    const agentStats = new Map<string, { reviews: number; totalTime: number; approvals: number }>();

    for (const review of reviews) {
      const stats = agentStats.get(review.agentId) || { reviews: 0, totalTime: 0, approvals: 0 };
      stats.reviews++;
      stats.totalTime += review.reviewTime || 0;
      if (review.status === "APPROVED") stats.approvals++;
      agentStats.set(review.agentId, stats);
    }

    for (const [agentId, stats] of agentStats) {
      agentPerformance[agentId] = {
        reviewsCompleted: stats.reviews,
        averageTime: stats.reviews > 0 ? stats.totalTime / stats.reviews : 0,
        approvalRate: stats.reviews > 0 ? stats.approvals / stats.reviews : 0,
      };
    }

    return {
      sessionId,
      totalReviewTime,
      averageReviewTime,
      numberOfReviews: reviews.length,
      numberOfRevisions,
      qualityScore: this.calculateQualityScore(reviews),
      agentPerformance,
    };
  }

  //Calculate quality score based on reviews
  private calculateQualityScore(reviews: AgentReview[]): number {
    if (reviews.length === 0) return 0;

    const totalConfidence = reviews.reduce((sum, review) => sum + (review.confidence || 0), 0);
    const approvalRate = reviews.filter(r => r.status === "APPROVED").length / reviews.length;
    
    return (totalConfidence / reviews.length + approvalRate) / 2;
  }

  //Add an event to the system
  private addEvent(
    type: ReviewEventType,
    sessionId: string,
    data: Record<string, any> = {}
  ): void {
    const event: ReviewEvent = {
      id: createId(),
      type,
      sessionId,
      data,
      timestamp: new Date(),
    };
    this.events.push(event);
  }

  //Get events for a session
  getSessionEvents(sessionId: string): ReviewEvent[] {
    return this.events.filter(event => event.sessionId === sessionId);
  }

  //Get all events
  getAllEvents(): ReviewEvent[] {
    return [...this.events];
  }
} 