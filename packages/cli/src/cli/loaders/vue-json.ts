import { jsonrepair } from "jsonrepair";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createVueJsonLoader(): ILoader<string, Record<string, any>> {
  return createLoader({
    pull: async (locale, input, ctx) => {
      const { i18n } = parseVueFile(input);
      return i18n[locale] ?? {};
    },
    push: async (locale, data, originalInput) => {
      const { before, i18n, after } = parseVueFile(originalInput ?? "");
      i18n[locale] = data;
      return `${before}<i18n>\n${JSON.stringify(i18n, null, 2)}\n</i18n>${after}`;
    },
  });
}

function parseVueFile(input: string) {
  const [, before, jsonString = "{}", after] = input.match(/^([\s\S]*)<i18n>([\s\S]*)<\/i18n>([\s\S]*)$/) || [];

  let i18n: Record<string, any>;
  try {
    i18n = JSON.parse(jsonString);
  } catch (error) {
    i18n = JSON.parse(jsonrepair(jsonString));
  }

  return { before, after, i18n };
}
