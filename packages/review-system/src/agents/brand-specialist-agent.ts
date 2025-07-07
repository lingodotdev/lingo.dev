import { BaseAgent } from "./base-agent";
import { ReviewRequest, AgentReview, ReviewStatus } from "../types";

export class BrandSpecialistAgent extends BaseAgent {
  async review(
    request: ReviewRequest,
    initialTranslation: Record<string, string>
  ): Promise<AgentReview> {
    const startTime = Date.now();

    const prompt = this.buildReviewPrompt(request, initialTranslation);
    const llmResponse = await this.generateReviewWithLLM(prompt);
    const { comments, suggestedChanges } = this.parseLLMResponse(llmResponse);

    const reviewTime = (Date.now() - startTime) / 1000;

    const status = this.determineStatus(comments, suggestedChanges);

    const review = this.createAgentReview(
      request.id,
      status,
      comments,
      suggestedChanges
    );

    review.reviewTime = reviewTime;
    review.confidence = this.calculateConfidence(comments, suggestedChanges);

    return review;
  }

  private buildReviewPrompt(
    request: ReviewRequest,
    initialTranslation: Record<string, string>
  ): string {
    const context = request.context;
    const brandGuidelines = context?.brandGuidelines || this.config.brandGuidelines || "Maintain professional, friendly tone";
    
    return `You are a brand specialist reviewing a translation to ensure it aligns with brand voice and guidelines.

BRAND GUIDELINES:
${brandGuidelines}

CONTEXT:
${context?.domain ? `Domain: ${context.domain}` : ''}
${context?.tone ? `Desired Tone: ${context.tone}` : ''}

ORIGINAL TEXT:
${Object.entries(request.content).map(([key, value]) => `${key}: ${value}`).join('\n')}

TRANSLATION TO REVIEW:
${Object.entries(initialTranslation).map(([key, value]) => `${key}: ${value}`).join('\n')}

Please review the translation for:
1. Brand voice consistency
2. Tone appropriateness
3. Brand terminology usage
4. Cultural sensitivity while maintaining brand identity
5. Marketing message clarity
6. Brand personality alignment

For each issue found, provide:
KEY: [the key of the problematic text]
COMMENT: [detailed explanation of the brand issue]
SUGGESTION: [brand-appropriate alternative if applicable]

If the translation aligns well with brand guidelines, respond with "APPROVED" and no specific comments.`;
  }

  private determineStatus(
    comments: AgentReview["comments"],
    suggestedChanges?: Record<string, string>
  ): ReviewStatus {
    if (comments.length === 0) {
      return "APPROVED";
    }

    const hasErrors = comments.some(comment => comment.severity === "ERROR");
    const hasWarnings = comments.some(comment => comment.severity === "WARNING");

    if (hasErrors) {
      return "REJECTED";
    } else if (hasWarnings || suggestedChanges) {
      return "NEEDS_REVISION";
    } else {
      return "APPROVED";
    }
  }

  private calculateConfidence(
    comments: AgentReview["comments"],
    suggestedChanges?: Record<string, string>
  ): number {
    if (comments.length === 0) {
      return 0.9;
    }

    const errorCount = comments.filter(c => c.severity === "ERROR").length;
    const warningCount = comments.filter(c => c.severity === "WARNING").length;
    const infoCount = comments.filter(c => c.severity === "INFO").length;

    let confidence = 0.75;
    confidence -= errorCount * 0.25;
    confidence -= warningCount * 0.1;
    confidence -= infoCount * 0.05;

    return Math.max(0.1, Math.min(0.9, confidence));
  }
} 