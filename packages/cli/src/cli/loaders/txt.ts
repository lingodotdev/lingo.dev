import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createTxtLoader(): ILoader<
  string,
  Record<string, string>
> {
  return createLoader({
    async pull(locale, input) {
      const result: Record<string, string> = {};

      if (input && input.trim() !== "") {
        result.content = input.trim();
      }

      return result;
    },

    async push(locale, payload) {
      return payload.content || "";
    },
  });
}
