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
      const omitKeys = _getKeysWithLocales(data, injectLocaleKeys, locale);
      const result = _.omit(data, omitKeys);
      return result;
    },
    async push(locale, data, originalInput, originalLocale) {
      if (!injectLocaleKeys || !originalInput) {
        return data;
      }

      const localeKeys = _getKeysWithLocales(
        originalInput,
        injectLocaleKeys,
        originalLocale,
      );

      localeKeys.forEach((key) => {
        _.set(data, key, locale);
      });

      return data;
    },
  });
}

function _getKeysWithLocales(
  data: Record<string, any>,
  injectLocaleKeys: string[],
  locale: string,
) {
  return injectLocaleKeys.filter((key) => {
    return _.get(data, key) === locale;
  });
}
