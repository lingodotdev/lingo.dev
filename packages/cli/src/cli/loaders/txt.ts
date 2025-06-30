import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createTxtLoader(): ILoader<
  string,
  Record<string, string>
> {
  return createLoader({
    async pull(locale, input) {
      const result: Record<string, string> = {};

      if (input !== undefined && input !== null && input !== "") {
        const lines = input.split("\n");
        lines.forEach((line, index) => {
          result[String(index + 1)] = line === "" ? " " : line;
        });
      }

      return result;
    },

    async push(locale, payload) {
      const sortedEntries = Object.entries(payload).sort(
        ([a], [b]) => parseInt(a) - parseInt(b),
      );
      return sortedEntries
        .map(([_, value]) => (value === " " ? "" : value))
        .join("\n");
    },
  });
}
