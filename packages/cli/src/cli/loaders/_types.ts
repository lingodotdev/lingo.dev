export interface ILoaderDefinition<I, O, C> {
  init?(): Promise<C>;
  pull(
    locale: string,
    input: I,
    initCtx: C,
    originalLocale: string,
    originalInput: I,
  ): Promise<O>;
  push(
    locale: string,
    data: O,
    originalInput: I | null,
    originalLocale: string,
    pullInput: I | null,
    pullOutput: O | null,
  ): Promise<I>;
  pullHints?(originalInput: I): Promise<O | undefined>;
}

export interface ILoader<I, O, C = void> extends ILoaderDefinition<I, O, C> {
  setDefaultLocale(locale: string): this;
  init(): Promise<C>;
  pull(locale: string, input: I): Promise<O>;
  push(locale: string, data: O): Promise<I>;
  pullHints(originalInput: I): Promise<O | undefined>;
}
