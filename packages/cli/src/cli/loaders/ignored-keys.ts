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
      const ignoredSubObject = _.pickBy(pullInput, (value, key) =>
        _isIgnoredKey(key, ignoredKeys),
      );
      const result = _.merge({}, data, ignoredSubObject); 
      
      return result;
    },
  });
}

function _isIgnoredKey(key: string, ignoredKeys: string[]) {
  return ignoredKeys.some(
    (ignoredKey) => key.startsWith(ignoredKey) || minimatch(key, ignoredKey),
  );
}
