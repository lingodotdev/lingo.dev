import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import { Tokenizer } from "./xcode-strings/tokenizer";
import { Parser } from "./xcode-strings/parser";
import { escapeString } from "./xcode-strings/escape";

export default function createXcodeStringsLoader(): ILoader<
  string,
  Record<string, any>
> {
  return createLoader({
    async pull(locale, input) {
      // Tokenize the input
      const tokenizer = new Tokenizer(input);
      const tokens = tokenizer.tokenize();

      // Parse tokens into key-value pairs
      const parser = new Parser(tokens);
      const result = parser.parse();

      return result;
    },

    async push(locale, payload) {
      const lines = Object.entries(payload)
        .filter(([_, value]) => value != null)
        .map(([key, value]) => {
          const escapedValue = escapeString(value);
          return `"${key}" = "${escapedValue}";`;
        });

      return lines.join("\n");
    },
  });
}
