import { I18nConfig } from "@lingo.dev/_spec";

export type LocalizerData = {
  sourceLocale: string;
  sourceData: Record<string, any>;
  processableData: Record<string, any>;
  targetLocale: string;
  targetData: Record<string, any>;
  hints: Record<string, string[]>;
};

export type LocalizerProgressFn = (
  progress: number,
  sourceChunk: Record<string, string>,
  processedChunk: Record<string, string>,
) => void;

export interface ILocalizer {
  id: "Lingo.dev" | NonNullable<I18nConfig["provider"]>["id"];
  checkAuth: () => Promise<{ authenticated: boolean; username?: string }>;
  localize: (
    input: LocalizerData,
    onProgress?: LocalizerProgressFn,
  ) => Promise<LocalizerData["processableData"]>;
}
