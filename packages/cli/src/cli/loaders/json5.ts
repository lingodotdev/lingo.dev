import JSON5 from "json5";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createJson5Loader(): ILoader<
  string,
  Record<string, any>
> {
  return createLoader({
    pull: async (locale, input) => {
      const json5String = input || "{}";
      return JSON5.parse(json5String);
    },
    push: async (locale, data) => {
      const serializedData = JSON5.stringify(data, null, 2);
      return serializedData;
    },
  });
}
