import { BaseAgent } from "./base-agent";
import { ReviewRequest, AgentReview, ReviewStatus } from "../types";

export class TranslatorAgent extends BaseAgent {
  async review(
    request: ReviewRequest,
    initialTranslation: Record<string, string>
  ): Promise<AgentReview> {
    const startTime = Date.now();

    const prompt = this.buildReviewPrompt(request, initialTranslation);
    const llmResponse = await this.generateReviewWithLLM(prompt);
    const { comments, suggestedChanges } = this.parseLLMResponse(llmResponse);

    const reviewTime = (Date.now() - startTime) / 1000; // Convert to seconds

    // Determine status based on comments and suggestions
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
    
    return `You are a professional translator reviewing a translation from ${request.sourceLocale} to ${request.targetLocale}.

CONTEXT:
${context?.domain ? `Domain: ${context.domain}` : ''}
${context?.tone ? `Tone: ${context.tone}` : ''}
${context?.brandGuidelines ? `Brand Guidelines: ${context.brandGuidelines}` : ''}
${context?.technicalContext ? `Technical Context: ${context.technicalContext}` : ''}

ORIGINAL TEXT:
${Object.entries(request.content).map(([key, value]) => `${key}: ${value}`).join('\n')}

TRANSLATION TO REVIEW:
${Object.entries(initialTranslation).map(([key, value]) => `${key}: ${value}`).join('\n')}

Please review the translation for:
1. Accuracy and faithfulness to the original
2. Natural flow and readability in the target language
3. Consistency with terminology
4. Cultural appropriateness
5. Technical accuracy (if applicable)

For each issue found, provide:
KEY: [the key of the problematic text]
COMMENT: [detailed explanation of the issue]
SUGGESTION: [improved translation if applicable]

If the translation is good, respond with "APPROVED" and no specific comments.`;
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
      return 0.95; // High confidence for approved translations
    }

    const errorCount = comments.filter(c => c.severity === "ERROR").length;
    const warningCount = comments.filter(c => c.severity === "WARNING").length;
    const infoCount = comments.filter(c => c.severity === "INFO").length;

    // Calculate confidence based on severity and number of issues
    let confidence = 0.8;
    confidence -= errorCount * 0.3;
    confidence -= warningCount * 0.1;
    confidence -= infoCount * 0.05;

    return Math.max(0.1, Math.min(0.95, confidence));
  }
} 