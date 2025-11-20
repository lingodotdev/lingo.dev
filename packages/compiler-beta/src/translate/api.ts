export type TranslatableEntry = { text: string; context: Record<string, any> };

export interface Translator<Config> {
  config: Config;

  translate: (locale: string, entry: TranslatableEntry) => Promise<string>;
  batchTranslate: (
    locale: string,
    entriesMap: Record<string, TranslatableEntry>,
  ) => Promise<Record<string, string>>;
}
