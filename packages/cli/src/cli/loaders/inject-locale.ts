import _ from "lodash";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import { minimatch } from "minimatch";

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
  const allKeys = _getAllKeys(data);
  return allKeys.filter((key) => {
    return (
      injectLocaleKeys.some((pattern) => minimatch(key, pattern)) &&
      _.get(data, key) === locale
    );
  });
}

// Helper to get all deep keys in lodash path style (e.g., 'a.b.c')
function _getAllKeys(obj: Record<string, any>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      keys = keys.concat(_getAllKeys(obj[key], path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}
