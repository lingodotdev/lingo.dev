import { type ReactNode } from "react";
import { type RichTextParams } from "./shared/render-rich-text";
import type { LocaleCode } from "lingo.dev/spec";

export type TranslationHook = (hashes: string[]) => {
  t: TranslationFunction;
  locale: LocaleCode;
};

/**
 * Translation function type
 */
export type TranslationFunction = (
  hash: string,
  source: string,
  params?: RichTextParams,
) => string | ReactNode;
