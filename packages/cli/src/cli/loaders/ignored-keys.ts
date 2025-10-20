import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import _ from "lodash";
import { matchesKeyPattern } from "../utils/key-matching";

export default function createIgnoredKeysLoader(
  ignoredKeys: string[],
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    pull: async (locale, data) => {
      const result = _.omitBy(data, (value, key) =>
        matchesKeyPattern(key, ignoredKeys),
      );
      return result;
    },
    push: async (locale, data, originalInput, originalLocale, pullInput) => {
      // Remove ignored keys from the data being pushed
      const result = _.omitBy(data, (value, key) =>
        matchesKeyPattern(key, ignoredKeys),
      );
      return result;
    },
  });
}
