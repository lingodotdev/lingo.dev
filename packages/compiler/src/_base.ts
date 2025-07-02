import generate, { GeneratorResult } from "@babel/generator";
import * as t from "@babel/types";
import * as parser from "@babel/parser";

/**
 * Options for configuring Lingo.dev Compiler.
 */
export type CompilerParams = {
  /**
   * The locale to translate from.
   *
   * This must match one of the following formats:
   *
   * - [ISO 639-1 language code](https://en.wikipedia.org/wiki/ISO_639-1) (e.g., `"en"`)
   * - [IETF BCP 47 language tag](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g., `"en-US"`)
   *
   * @default "en"
   */
  sourceLocale: string;
  /**
   * The locale(s) to translate to.
   *
   * Each locale must match one of the following formats:
   *
   * - [ISO 639-1 language code](https://en.wikipedia.org/wiki/ISO_639-1) (e.g., `"en"`)
   * - [IETF BCP 47 language tag](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g., `"en-US"`)
   *
   * @default ["es"]
   */
  targetLocales: string[];
  /**
   * The name of the directory where translation files will be stored, relative to `sourceRoot`.
   *
   * @default "lingo"
   */
  lingoDir: string;
  /**
   * The directory of the source code that will be translated, relative to the current working directory.
   *
   * @default "src"
   */
  sourceRoot: string;
  /**
   * If `true`, the compiler will generate code for React Server Components (RSC).
   *
   * @default false
   */
  rsc: boolean;
  /**
   * If `true`, the compiler will only localize files that use the `"use i18n";` directive.
   *
   * @default false
   */
  useDirective: boolean;
  /**
   * If `true`, the compiler will log additional information to the console.
   *
   * @default false
   */
  debug: boolean;
  /**
   * The model(s) to use for translation.
   *
   * If set to `"lingo.dev"`, the compiler will use Lingo.dev Engine.
   *
   * If set to an object, the compiler will use the model(s) specified in the object:
   *
   * - The key is a string that represents the source and target locales, separated by a colon (e.g., `"en:es"`).
   * - The value is a string that represents the model to use for translation (e.g., `"google:gemini-2.0-flash"`).
   *
   * You can use `*` as a wildcard to match any locale.
   *
   * @default {}
   *
   * @example Use Lingo.dev Engine
   * ```json
   * "lingo.dev"
   * ```
   *
   * @example Use a single model for all locales
   * ```json
   * {
   *   "*:*": "mistral:mistral-large-latest"
   * }
   * ```
   *
   * @example Use different models for different locales
   * ```json
   * {
   *   "en:es": "groq:llama3-8b-8192",
   *   "en:fr": "google:gemini-2.0-flash",
   * }
   * ```
   */
  models: "lingo.dev" | Record<string, string>;
};
export type CompilerInput = {
  relativeFilePath: string;
  code: string;
  params: CompilerParams;
};

export type CompilerPayload = CompilerInput & {
  ast: t.File;
};
export type CompilerOutput = {
  code: string;
  map: GeneratorResult["map"];
};

export type CodeMutation = (payload: CompilerPayload) => CompilerPayload | null;
export type CodeMutationDefinition = CodeMutation;
export function createCodeMutation(spec: CodeMutationDefinition): CodeMutation {
  return (payload: CompilerPayload) => {
    const result = spec(payload);
    return result;
  };
}

export function createPayload(input: CompilerInput): CompilerPayload {
  const ast = parser.parse(input.code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  return {
    ...input,
    ast,
  };
}

export function createOutput(payload: CompilerPayload): CompilerOutput {
  const generationResult = generate(payload.ast, {}, payload.code);
  return {
    code: generationResult.code,
    map: generationResult.map,
  };
}

export function composeMutations(...mutations: CodeMutation[]) {
  return (input: CompilerPayload) => {
    let result = input;
    for (const mutate of mutations) {
      const intermediateResult = mutate(result);
      if (!intermediateResult) {
        break;
      } else {
        result = intermediateResult;
      }
    }
    return result;
  };
}

export const defaultParams: CompilerParams = {
  sourceRoot: "src",
  lingoDir: "lingo",
  sourceLocale: "en",
  targetLocales: ["es"],
  rsc: false,
  useDirective: false,
  debug: false,
  models: {},
};
