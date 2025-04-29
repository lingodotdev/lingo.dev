import { I18nConfig } from "@lingo.dev/_spec";

export type LocalizerData = {
  sourceLocale: string;
  sourceData: Record<string, any>;
  processableData: Record<string, any>;
  targetLocale: string;
  targetData: Record<string, any>;
};

export type LocalizerProgressFn = (progress: number) => void;

export interface ILocalizer {
  id: "Lingo.dev" | NonNullable<I18nConfig["provider"]>["id"];
  checkAuth: () => Promise<{ authenticated: boolean; username?: string }>;
  localize: (
    input: LocalizerData,
    onProgress?: LocalizerProgressFn,
  ) => Promise<LocalizerData["processableData"]>;
}
