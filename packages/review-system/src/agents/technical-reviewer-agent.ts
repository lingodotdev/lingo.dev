import { BaseAgent } from "./base-agent";
import { ReviewRequest, AgentReview, ReviewStatus } from "../types";

export class TechnicalReviewerAgent extends BaseAgent {
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
    
    return `You are a technical reviewer specializing in technical terminology and accuracy.

TECHNICAL CONTEXT:
${context?.technicalContext || 'General technical content'}
${context?.domain ? `Domain: ${context.domain}` : ''}

ORIGINAL TEXT:
${Object.entries(request.content).map(([key, value]) => `${key}: ${value}`).join('\n')}

TRANSLATION TO REVIEW:
${Object.entries(initialTranslation).map(([key, value]) => `${key}: ${value}`).join('\n')}

Please review the translation for:
1. Technical terminology accuracy
2. Consistency in technical terms
3. Proper handling of technical concepts
4. Accuracy of technical specifications
5. Proper translation of technical jargon
6. Maintainability of technical meaning

For each issue found, provide:
KEY: [the key of the problematic text]
COMMENT: [detailed explanation of the technical issue]
SUGGESTION: [technically accurate alternative if applicable]

If the translation is technically accurate, respond with "APPROVED" and no specific comments.`;
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
      return 0.85;
    }

    const errorCount = comments.filter(c => c.severity === "ERROR").length;
    const warningCount = comments.filter(c => c.severity === "WARNING").length;
    const infoCount = comments.filter(c => c.severity === "INFO").length;

    let confidence = 0.7;
    confidence -= errorCount * 0.3;
    confidence -= warningCount * 0.15;
    confidence -= infoCount * 0.05;

    return Math.max(0.1, Math.min(0.85, confidence));
  }
} 