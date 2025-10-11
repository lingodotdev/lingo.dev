import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import _ from "lodash";
import { matchesKeyPattern } from "../utils/key-matching";

export default function createLockedKeysLoader(
  lockedKeys: string[],
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    pull: async (locale, data) => {
      return _.pickBy(
        data,
        (value, key) => !matchesKeyPattern(key, lockedKeys),
      );
    },
    push: async (locale, data, originalInput) => {
      const lockedSubObject = _.chain(originalInput)
        .pickBy((value, key) => matchesKeyPattern(key, lockedKeys))
        .value();

      return _.merge({}, data, lockedSubObject);
    },
  });
}
