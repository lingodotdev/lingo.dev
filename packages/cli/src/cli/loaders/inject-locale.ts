import _ from "lodash";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createInjectLocaleLoader(
  injectLocaleKeys?: string[],
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    async pull(locale, data) {
      if (!injectLocaleKeys) {
        return data;
      }
      const omitKeys = injectLocaleKeys.filter((key) => {
        return _.get(data, key) === locale;
      });
      const result = _.omit(data, omitKeys);
      return result;
    },
    async push(locale, data, originalInput, originalLocale) {
      if (!injectLocaleKeys) {
        return data;
      }

      // ensures locale keys are in correct position
      const mergedData = _.merge({}, originalInput, data);

      injectLocaleKeys.forEach((key) => {
        if (_.get(mergedData, key) === originalLocale) {
          _.set(mergedData, key, locale);
        }
      });

      return mergedData;
    },
  });
}
