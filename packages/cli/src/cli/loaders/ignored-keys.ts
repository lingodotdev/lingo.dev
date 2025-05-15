import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import _ from "lodash";

export default function createIgnoredKeysLoader(
  ignoredKeys: string[],
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    pull: async (locale, data) => {
      const result = _.chain(data).omit(ignoredKeys).value();
      return result;
    },
    push: async (locale, data, originalInput, originalLocale, pullInput) => {
      const result = _.merge({}, data, _.pick(pullInput, ignoredKeys));
      return result;
    },
  });
}
