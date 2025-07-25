import _ from "lodash";
import _isUrl from "is-url";
import { isValid, parseISO } from "date-fns";

import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createUnlocalizableLoader(
  returnUnlocalizedKeys: boolean = false,
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    async pull(locale, input) {
      const unlocalizableKeys = _getUnlocalizableKeys(input);

      const result = _.omitBy(input, (_, key) =>
        unlocalizableKeys.includes(key),
      );

      if (returnUnlocalizedKeys) {
        result.unlocalizable = _.omitBy(
          input,
          (_, key) => !unlocalizableKeys.includes(key),
        );
      }

      return result;
    },
    async push(locale, data, originalInput) {
      if (!originalInput) {
        return data;
      }

      const unlocalizableKeys = _getUnlocalizableKeys(originalInput);

<<<<<<< HEAD
      const result = _.merge(
        {},
        data,
        _.omitBy(originalInput, (_, key) => !unlocalizableKeys.includes(key)),
      );

      return result;
=======
      // Only merge back keys that are actually unlocalizable
      const unlocalizableData = _.pickBy(originalInput, (value, key) =>
        unlocalizableKeys.includes(key),
      );

      // Merge unlocalizable data back with translated data
      // Translated data takes precedence for any overlapping keys
      return {
        ...unlocalizableData,
        ...data,
      };
>>>>>>> 6ded610 (feat(cli): updated existing test cases for ignoredKeys in typescript)
    },
  });
}

function _isSystemId(v: string) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9]{22}$/.test(v);
}

function _isIsoDate(v: string) {
  return isValid(parseISO(v));
}

function _getUnlocalizableKeys(input?: Record<string, any> | null) {
  const rules = {
    isEmpty: (v: any) => _.isEmpty(v),
    isNumber: (v: any) => typeof v === "number" || /^[0-9]+$/.test(v),
    isBoolean: (v: any) => _.isBoolean(v),
    isIsoDate: (v: any) => _.isString(v) && _isIsoDate(v),
    isSystemId: (v: any) => _.isString(v) && _isSystemId(v),
    isUrl: (v: any) => _.isString(v) && _isUrl(v),
  };

  if (!input) {
    return [];
  }

  return Object.entries(input)
    .filter(([key, value]) => {
      for (const [ruleName, rule] of Object.entries(rules)) {
        if (rule(value)) {
          return true;
        }
      }
      return false;
    })
    .map(([key, _]) => key);
}
