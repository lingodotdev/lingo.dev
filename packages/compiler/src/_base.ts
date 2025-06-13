import generate, { GeneratorResult } from "@babel/generator";
import * as t from "@babel/types";
import * as parser from "@babel/parser";
import * as path from "path";

export type CompilerParams = {
  sourceLocale: string;
  targetLocales: string[];
  lingoDir: string;
  sourceRoot: string;
  rsc: boolean;
  useDirective: boolean;
  debug: boolean;
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
