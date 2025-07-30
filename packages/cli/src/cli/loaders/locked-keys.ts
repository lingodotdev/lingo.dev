import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import _ from "lodash";
import { minimatch } from "minimatch";

export default function createLockedKeysLoader(
  lockedKeys: string[],
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    pull: async (locale, data) => {
      return _.pickBy(data, (value, key) => !_isLockedKey(key, lockedKeys));
    },
    push: async (locale, data, originalInput) => {
      const lockedSubObject = _.chain(originalInput)
        .pickBy((value, key) => _isLockedKey(key, lockedKeys))
        .value();

      const result = _.merge({}, data, lockedSubObject);

      return result;
    },
  });
}

function _isLockedKey(key: string, lockedKeys: string[]) {
  return lockedKeys.some(
    (lockedKey) => key.startsWith(lockedKey) || minimatch(key, lockedKey),
  );
}
