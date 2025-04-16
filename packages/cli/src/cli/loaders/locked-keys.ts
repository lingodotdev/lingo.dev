import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import _ from "lodash";

export default function createLockedKeysLoader(
  lockedKeys: string[],
  isCacheRestore: boolean = false,
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    pull: async (locale, data) =>
      _.chain(data)
        .pickBy((value, key) => !lockedKeys.includes(key))
        .value(),
    push: async (locale, data, originalInput) => {
      const lockedSubObject = _.chain(originalInput)
        .pickBy((value, key) => lockedKeys.includes(key))
        .value();

      if (isCacheRestore) {
        return _.merge({}, data, lockedSubObject);
      } else {
        return _.merge({}, originalInput, data, lockedSubObject);
      }
    },
  });
}
