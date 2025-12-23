import type { LocaleCode } from "lingo.dev/spec";

export interface PluralCandidate {
  hash: string;
  sourceText: string;
}

export interface ICUGenerationResult {
  success: boolean;
  icuText?: string;
  error?: string;

  /**
   * LLM explanation of why pluralization was or wasn't applied
   */
  reasoning?: string;
}

export type PluralizationConfig = {
  sourceLocale: LocaleCode;
  enabled: boolean;

  /**
   * LLM provider for pluralization detection
   * Format: "provider:model" (e.g., "groq:llama3-8b-8192")
   * @default "groq:llama3-8b-8192"
   */
  model: string;
};

/**
 * Statistics about pluralization processing
 */
export interface PluralizationStats {
  /**
   * Total entries processed
   */
  total: number;

  /**
   * Candidates detected by pattern matching
   */
  candidates: number;

  /**
   * Successfully pluralized by LLM
   */
  pluralized: number;

  /**
   * Rejected by LLM (not suitable for pluralization)
   */
  rejected: number;

  /**
   * Failed (errors during processing)
   */
  failed: number;

  /**
   * Processing time in milliseconds
   */
  durationMs: number;
}

export interface PluralizationBatch {
  version: number;
  sourceLocale: string;
  candidates: {
    candidate: Array<{
      hash: string;
      text: string;
    }>;
  };
}

export interface PluralizationResponse {
  version: number;
  results: {
    result: Array<{
      hash: string;
      shouldPluralize: boolean;
      icuText?: string;
      reasoning: string;
    }>;
  };
}
