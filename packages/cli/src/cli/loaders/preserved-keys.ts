import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import _ from "lodash";
import { matchesKeyPattern } from "../utils/key-matching";

export default function createPreservedKeysLoader(
  preservedKeys: string[],
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    pull: async (_locale, data) => {
      // Remove preserved keys from data (don't send them for translation)
      return _.pickBy(
        data,
        (_value, key) => !matchesKeyPattern(key, preservedKeys),
      );
    },
    push: async (_locale, data, originalInput, _originalLocale, pullInput) => {
      // For preserved keys:
      // - If exists in pullInput (target file), keep target value
      // - If missing in pullInput, use source value from originalInput
      const preservedSubObject = _.chain(originalInput)
        .pickBy((_value, key) => matchesKeyPattern(key, preservedKeys))
        .mapValues((sourceValue, key) => {
          // Use existing target value if present, otherwise use source
          const targetValue = pullInput?.[key];
          return targetValue !== undefined ? targetValue : sourceValue;
        })
        .value();

      return _.merge({}, data, preservedSubObject);
    },
  });
}
