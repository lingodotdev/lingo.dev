declare module "lingo.dev" {
  export class LingoDotDevEngine {
    constructor(config: {
      apiKey: string | undefined;
      batchSize?: number;
      idealBatchItemSize?: number;
    });

    localizeText(
      text: string,
      options: {
        sourceLocale: string | null;
        targetLocale: string;
        fast?: boolean;
      }
    ): Promise<string>;

    localizeObject<T extends Record<string, any>>(
      obj: T,
      options: {
        sourceLocale: string | null;
        targetLocale: string;
      },
      onProgress?: (progress: number) => void
    ): Promise<T>;

    batchLocalizeText(
      text: string,
      options: {
        sourceLocale: string | null;
        targetLocales: string[];
      }
    ): Promise<string[]>;

    localizeChat(
      conversation: Array<{ name: string; text: string }>,
      options: {
        sourceLocale: string | null;
        targetLocale: string;
      }
    ): Promise<Array<{ name: string; text: string }>>;

    localizeHtml(
      html: string,
      options: {
        sourceLocale: string | null;
        targetLocale: string;
      }
    ): Promise<string>;

    recognizeLocale(text: string): Promise<string>;
  }
}
