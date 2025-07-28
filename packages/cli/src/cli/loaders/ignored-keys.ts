import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import _, { result } from "lodash";
import { minimatch } from "minimatch";

export default function createIgnoredKeysLoader(
  ignoredKeys: string[],
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    pull: async (locale, data) => {
      // Keep all keys that are NOT ignored
      const result = _.omitBy(data, (value, key) =>
        _isIgnoredKey(key, ignoredKeys),
      );

      return result;
    },

    push: async (locale, data) => {
      // Remove ignored keys from the data being pushed to target files
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
