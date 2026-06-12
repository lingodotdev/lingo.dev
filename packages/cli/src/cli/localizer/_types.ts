import { I18nConfig } from "@lingo.dev/_spec";
import type { CostEstimate } from "@lingo.dev/_sdk";

export type LocalizerData = {
  sourceLocale: string;
  sourceData: Record<string, any>;
  processableData: Record<string, any>;
  targetLocale: string;
  targetData: Record<string, any>;
  hints: Record<string, string[]>;
  filePath?: string;
};

export type LocalizerProgressFn = (
  progress: number,
  sourceChunk: Record<string, string>,
  processedChunk: Record<string, string>,
) => void;

export interface ILocalizer {
  id: "Lingo.dev" | "pseudo" | NonNullable<I18nConfig["provider"]>["id"];
  checkAuth: () => Promise<{
    authenticated: boolean;
    username?: string;
    userId?: string;
    error?: string;
  }>;
  validateSettings?: () => Promise<{ valid: boolean; error?: string }>;
  localize: (
    input: LocalizerData,
    onProgress?: LocalizerProgressFn,
  ) => Promise<LocalizerData["processableData"]>;
  /**
   * Estimate the cost of pending translations without translating anything.
   * Only providers with server-side pricing implement this (Lingo.dev).
   */
  estimate?: (
    items: { targetLocale: string; sourceChars: number }[],
  ) => Promise<CostEstimate>;
}
