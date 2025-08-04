import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import _ from "lodash";
import { minimatch } from "minimatch";

export default function createIgnoredKeysLoader(
  ignoredKeys: string[],
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    pull: async (locale, data) => {
      const result = _.omitBy(data, (value, key) =>
        _isIgnoredKey(key, ignoredKeys),
      );
      return result;
    },
    push: async (locale, data, originalInput, originalLocale, pullInput) => {
      // Ignored keys loader should remove ignored keys from push data too
      const result = _.omitBy(data, (value, key) =>
        _isIgnoredKey(key, ignoredKeys),
      );

      return result;
    },
  });
}

function _isIgnoredKey(key: string, ignoredKeys: string[]) {
  return ignoredKeys.some(
    (ignoredKey) => key.startsWith(ignoredKey) || minimatch(key, ignoredKey),
  );
}
