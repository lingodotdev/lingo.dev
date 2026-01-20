import type { LingoConfig } from "../types";

export const TRACKING_EVENTS = {
  BUILD_START: "compiler.build.start",
  BUILD_SUCCESS: "compiler.build.success",
  BUILD_ERROR: "compiler.build.error",
} as const;

export const TRACKING_VERSION = "3.0";

export const COMPILER_PACKAGE = "@lingo.dev/compiler";

export function sanitizeConfigForTracking(config: LingoConfig) {
  return {
    sourceLocale: config.sourceLocale,
    targetLocalesCount: config.targetLocales.length,
    hasCustomModels: config.models !== "lingo.dev",
    isByokMode: config.models !== "lingo.dev",
    useDirective: config.useDirective,
    buildMode: config.buildMode,
    hasPluralisation: config.pluralization.enabled,
    hasCustomPrompt: !!config.prompt,
    hasCustomLocaleResolver: false,
  };
}
