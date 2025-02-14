import { flatten, unflatten } from "flat";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import _ from "lodash";

export const OBJECT_NUMERIC_KEY_PREFIX = "__lingodotdev__obj__";

export default function createFlatLoader(): ILoader<Record<string, any>, Record<string, string>> {
  let normalizedKeysMap: Record<string, string>;

  return createLoader({
    pull: async (locale, input) => {
      const denormalized = denormalizeObjectKeys(input || {});
      const flattened: Record<string, string> = flatten(denormalized, {
        delimiter: "/",
        transformKey(key) {
          return encodeURIComponent(String(key));
        },
      });
      normalizedKeysMap = buildNormalizedKeysMap(flattened);
      const normalized = normalizeObjectKeys(flattened);
      return normalized;
    },
    push: async (locale, data) => {
      const denormalized = mapNormalizedKeys(data, normalizedKeysMap);
      const unflattened: Record<string, any> = unflatten(denormalized || {}, {
        delimiter: "/",
        transformKey(key) {
          return decodeURIComponent(String(key));
        },
      });
      const normalized = normalizeObjectKeys(unflattened);
      return normalized;
    },
  });
}

export function buildNormalizedKeysMap(obj: Record<string, string>) {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const normalizedKey = `${key}`.replace(OBJECT_NUMERIC_KEY_PREFIX, "");
      acc[normalizedKey] = key;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export function mapNormalizedKeys(obj: Record<string, any>, normalizedKeysMap: Record<string, string>) {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const denormalizedKey = normalizedKeysMap[key];
      acc[denormalizedKey] = obj[key];
      return acc;
    },
    {} as Record<string, string>,
  );
}

export function denormalizeObjectKeys(obj: Record<string, any>): Record<string, any> {
  if (_.isObject(obj) && !_.isArray(obj)) {
    return _.transform(
      obj,
      (result, value, key) => {
        const newKey = !isNaN(Number(key)) ? `${OBJECT_NUMERIC_KEY_PREFIX}${key}` : key;
        result[newKey] = _.isObject(value) ? denormalizeObjectKeys(value) : value;
      },
      {} as Record<string, any>,
    );
  } else {
    return obj;
  }
}

export function normalizeObjectKeys(obj: Record<string, any>): Record<string, any> {
  if (_.isObject(obj) && !_.isArray(obj)) {
    return _.transform(
      obj,
      (result, value, key) => {
        const newKey = `${key}`.replace(OBJECT_NUMERIC_KEY_PREFIX, "");
        result[newKey] = _.isObject(value) ? normalizeObjectKeys(value) : value;
      },
      {} as Record<string, any>,
    );
  } else {
    return obj;
  }
}
