import { ILoader, ILoaderDefinition } from "./_types";

export function composeLoaders(
  ...loaders: ILoader<any, any, any>[]
): ILoader<any, any> {
  return {
    init: async () => {
      for (const loader of loaders) {
        await loader.init?.();
      }
    },
    setDefaultLocale(locale: string) {
      for (const loader of loaders) {
        loader.setDefaultLocale?.(locale);
      }
      return this;
    },
    pull: async (locale, input) => {
      let result: any = input;
      for (let i = 0; i < loaders.length; i++) {
        result = await loaders[i].pull(locale, result);
      }
      return result;
    },
    push: async (locale, data) => {
      let result: any = data;
      for (let i = loaders.length - 1; i >= 0; i--) {
        result = await loaders[i].push(locale, result);
      }
      return result;
    },
    pullHints: async (originalInput?) => {
      let result: any = originalInput;
      for (let i = 0; i < loaders.length; i++) {
        const subResult = await loaders[i].pullHints?.(result);
        if (subResult) {
          result = subResult;
        }
      }
      return result;
    },
  };
}

export function createLoader<I, O, C>(
  lDefinition: ILoaderDefinition<I, O, C>,
): ILoader<I, O, C> {
  const state = {
    defaultLocale: undefined as string | undefined,
    originalInput: undefined as I | undefined | null,
    // Store pullInput and pullOutput per-locale to avoid race conditions
    // when multiple locales are processed concurrently
    pullInputByLocale: new Map<string, I | null>(),
    pullOutputByLocale: new Map<string, O | null>(),
    initCtx: undefined as C | undefined,
  };
  return {
    async init() {
      if (state.initCtx) {
        return state.initCtx;
      }
      state.initCtx = await lDefinition.init?.();
      return state.initCtx as C;
    },
    setDefaultLocale(locale) {
      if (state.defaultLocale) {
        throw new Error("Default locale already set");
      }
      state.defaultLocale = locale;
      return this;
    },
    async pullHints(originalInput?: I) {
      return lDefinition.pullHints?.(originalInput || state.originalInput!);
    },
    async pull(locale, input) {
      if (!state.defaultLocale) {
        throw new Error("Default locale not set");
      }
      if (state.originalInput === undefined && locale !== state.defaultLocale) {
        throw new Error("The first pull must be for the default locale");
      }
      if (locale === state.defaultLocale) {
        state.originalInput = input || null;
      }

      state.pullInputByLocale.set(locale, input || null);
      const result = await lDefinition.pull(
        locale,
        input,
        state.initCtx!,
        state.defaultLocale,
        state.originalInput!,
      );
      state.pullOutputByLocale.set(locale, result);

      return result;
    },
    async push(locale, data) {
      if (!state.defaultLocale) {
        throw new Error("Default locale not set");
      }
      if (state.originalInput === undefined) {
        throw new Error("Cannot push data without pulling first");
      }

      // Use locale-specific pullInput/pullOutput if available,
      // otherwise fall back to the default locale's values for backward compatibility
      // (some loaders push for locales that were never explicitly pulled)
      const pullInput =
        state.pullInputByLocale.get(locale) ??
        state.pullInputByLocale.get(state.defaultLocale) ??
        null;
      const pullOutput =
        state.pullOutputByLocale.get(locale) ??
        state.pullOutputByLocale.get(state.defaultLocale) ??
        null;

      const pushResult = await lDefinition.push(
        locale,
        data,
        state.originalInput,
        state.defaultLocale,
        pullInput!,
        pullOutput!,
      );
      return pushResult;
    },
  };
}
