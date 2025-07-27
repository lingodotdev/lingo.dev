import { parse, ParseError } from "jsonc-parser";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createJsoncLoader(): ILoader<
  string,
  Record<string, any>
> {
  return createLoader({
    pull: async (locale, input) => {
      const jsoncString = input || "{}";
      const errors: ParseError[] = [];
      const result = parse(jsoncString, errors, {
        allowTrailingComma: true,
        disallowComments: false,
        allowEmptyContent: true,
      });

      if (errors.length > 0) {
        throw new Error(`Failed to parse JSONC: ${errors[0].error}`);
      }

      return result || {};
    },
    push: async (locale, data) => {
      // JSONC parser's stringify preserves formatting but doesn't add comments
      // We'll use standard JSON.stringify with pretty formatting for output
      const serializedData = JSON.stringify(data, null, 2);
      return serializedData;
    },
  });
}
