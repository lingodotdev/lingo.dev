import { AgentConfig, AgentType, ReviewRequest, AgentReview, ReviewStatus } from "../types";
import { LingoDotDevEngine } from "@lingo.dev/sdk";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { createId } from "@paralleldrive/cuid2";

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected lingoEngine?: LingoDotDevEngine;
  protected openaiClient?: OpenAI;
  protected anthropicClient?: Anthropic;

  constructor(config: AgentConfig) {
    this.config = config;
    this.initializeClients();
  }

  private initializeClients() {
    // Initialize Lingo.dev engine
    if (this.config.apiKey) {
      this.lingoEngine = new LingoDotDevEngine({
        apiKey: this.config.apiKey,
      });
    }

    // Initialize OpenAI client
    if (this.config.llmProvider === "openai" && this.config.apiKey) {
      this.openaiClient = new OpenAI({
        apiKey: this.config.apiKey,
      });
    }

    // Initialize Anthropic client
    if (this.config.llmProvider === "anthropic" && this.config.apiKey) {
      this.anthropicClient = new Anthropic({
        apiKey: this.config.apiKey,
      });
    }
  }

  // Get the agent's unique identifier
  getId(): string {
    return this.config.id;
  }

  // Get the agent's name
  getName(): string {
    return this.config.name;
  }

  // Get the agent's type
  getType(): AgentType {
    return this.config.type;
  }

  // Check if the agent can handle the given language pair
  
  canHandleLanguage(sourceLocale: string, targetLocale: string): boolean {
    if (this.config.languages.length === 0) return true;
    return this.config.languages.includes(targetLocale);
  }

  // Check if the agent has expertise in the given domain
  
  hasExpertise(domain: string): boolean {
    if (this.config.expertise.length === 0) return true;
    return this.config.expertise.some(exp => 
      exp.toLowerCase().includes(domain.toLowerCase())
    );
  }

  // Abstract method that each agent must implement
  abstract review(
    request: ReviewRequest,
    initialTranslation: Record<string, string>
  ): Promise<AgentReview>;

  //Generate a review using the configured LLM provider
   
  protected async generateReviewWithLLM(
    prompt: string,
    model?: string
  ): Promise<string> {
    const selectedModel = model || this.config.llmModel;

    if (this.openaiClient && this.config.llmProvider === "openai") {
      const response = await this.openaiClient.chat.completions.create({
        model: selectedModel || "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });
      return response.choices[0]?.message?.content || "";
    }

    if (this.anthropicClient && this.config.llmProvider === "anthropic") {
      const response = await this.anthropicClient.messages.create({
        model: selectedModel || "claude-3-sonnet-20240229",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      });
      return response.content[0]?.text || "";
    }

    throw new Error(`No LLM client configured for provider: ${this.config.llmProvider}`);
  }

  // Create a new agent review
  protected createAgentReview(
    requestId: string,
    status: ReviewStatus,
    comments: AgentReview["comments"],
    suggestedChanges?: Record<string, string>
  ): AgentReview {
    return {
      id: createId(),
      requestId,
      agentId: this.config.id,
      agentType: this.config.type,
      status,
      comments,
      suggestedChanges,
      confidence: 0.8, // Default confidence
      reviewTime: 0, // Will be set by the review system
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Parse LLM response to extract comments and suggestions
  
  protected parseLLMResponse(response: string): {
    comments: AgentReview["comments"];
    suggestedChanges?: Record<string, string>;
  } {
    const comments: AgentReview["comments"] = [];
    const suggestedChanges: Record<string, string> = {};

    // Simple parsing logic - in a real implementation, you'd want more sophisticated parsing
    const lines = response.split('\n');
    let currentKey = '';
    let currentSuggestion = '';

    for (const line of lines) {
      if (line.startsWith('KEY:')) {
        currentKey = line.replace('KEY:', '').trim();
      } else if (line.startsWith('COMMENT:')) {
        const comment = line.replace('COMMENT:', '').trim();
        if (currentKey && comment) {
          comments.push({
            key: currentKey,
            message: comment,
            severity: 'INFO',
          });
        }
      } else if (line.startsWith('SUGGESTION:')) {
        currentSuggestion = line.replace('SUGGESTION:', '').trim();
        if (currentKey && currentSuggestion) {
          comments.push({
            key: currentKey,
            message: `Suggested improvement`,
            suggestion: currentSuggestion,
            severity: 'INFO',
          });
          suggestedChanges[currentKey] = currentSuggestion;
        }
      }
    }

    return { comments, suggestedChanges };
  }
} 