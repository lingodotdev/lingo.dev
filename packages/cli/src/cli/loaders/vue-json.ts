import { jsonrepair } from "jsonrepair";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createVueJsonLoader(): ILoader<
  string,
  Record<string, any>
> {
  return createLoader({
    pull: async (locale, input, ctx) => {
      const parsed = parseVueFile(input);
      return parsed?.i18n?.[locale] ?? {};
    },
    push: async (locale, data, originalInput) => {
      const parsed = parseVueFile(originalInput ?? "");
      if (!parsed) {
        return originalInput ?? "";
      }

      parsed.i18n[locale] = data;
      return `${parsed.before}<i18n>\n${JSON.stringify(
        parsed.i18n,
        null,
        2,
      )}\n</i18n>${parsed.after}`;
    },
  });
}

function parseVueFile(input: string) {
  const match = input.match(/^([\s\S]*)<i18n>([\s\S]*)<\/i18n>([\s\S]*)$/);

  if (!match) {
    return null;
  }

  const [, before, jsonString = "{}", after] = match;
  let i18n: Record<string, any>;
  try {
    i18n = JSON.parse(jsonString);
  } catch (error) {
    i18n = JSON.parse(jsonrepair(jsonString));
  }

  return { before, after, i18n };
}
