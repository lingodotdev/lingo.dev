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
    pullHints: async (originalInput) => {
      let result: any = originalInput;
      for (let i = 0; i < loaders.length; i++) {
        if (!loaders[i].pullHints) {
          continue;
        }

        result = await loaders[i].pullHints?.(result);
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
    pullInput: undefined as I | undefined | null,
    pullOutput: undefined as O | undefined | null,
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
    async pullHints(originalInput) {
      return lDefinition.pullHints?.(originalInput);
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

      state.pullInput = input;
      const result = await lDefinition.pull(
        locale,
        input,
        state.initCtx!,
        state.defaultLocale,
        state.originalInput!,
      );
      state.pullOutput = result;

      return result;
    },
    async push(locale, data) {
      if (!state.defaultLocale) {
        throw new Error("Default locale not set");
      }
      if (state.originalInput === undefined) {
        throw new Error("Cannot push data without pulling first");
      }

      const pushResult = await lDefinition.push(
        locale,
        data,
        state.originalInput,
        state.defaultLocale,
        state.pullInput!,
        state.pullOutput!,
      );
      return pushResult;
    },
  };
}
