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
      // Get locked keys from original input
      const lockedSubObject = _.chain(originalInput)
        .pickBy((value, key) => lockedKeys.includes(key))
        .value();

      if (isCacheRestore) {
        // During cache restoration, only include the payload keys and locked keys
        return { ...data, ...lockedSubObject };
      } else {
        // In normal operation, preserve all original keys
        return _.merge({}, originalInput, data, lockedSubObject);
      }
    },
  });
}
