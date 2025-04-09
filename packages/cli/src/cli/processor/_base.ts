export type LocalizerInput = {
  sourceLocale: string;
  sourceData: Record<string, any>;
  processableData: Record<string, any>;
  targetLocale: string;
  targetData: Record<string, any>;
};

export type LocalizerProgressFn = (
  progress: number,
  sourceChunk: Record<string, string>,
  processedChunk: Record<string, string>,
) => void;

export type LocalizerFn = (input: LocalizerInput, onProgress: LocalizerProgressFn) => Promise<Record<string, any>>;
