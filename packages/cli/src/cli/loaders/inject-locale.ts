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
      injectLocaleKeys.forEach((key) => {
        if (_.get(originalInput, key) === originalLocale) {
          _.set(data, key, locale);
        }
      });
      return data;
    },
  });
}
