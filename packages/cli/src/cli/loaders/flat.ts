import { flatten, unflatten } from "flat";
import { ILoader } from "./_types";
import { composeLoaders, createLoader } from "./_utils";
import _ from "lodash";

export const OBJECT_NUMERIC_KEY_PREFIX = "__lingodotdev__obj__";

export default function createFlatLoader() {
  const composedLoader = composeLoaders(
    createDenormalizeLoader(),
    createNormalizeLoader(),
  );

  return {
    ...composedLoader,
    pullHints: async (input: Record<string, any>) => {
      if (!input || typeof input !== "object") {
        return {};
      }
      return flattenHints(input);
    },
  };
}

type DenormalizeResult = {
  denormalized: Record<string, string>;
  keysMap: Record<string, string>;
};

function createDenormalizeLoader(): ILoader<
  Record<string, any>,
  DenormalizeResult
> {
  return createLoader({
    pull: async (locale, input) => {
      const inputDenormalized = denormalizeObjectKeys(input || {});
      const denormalized: Record<string, string> = flatten(inputDenormalized, {
        delimiter: "/",
        transformKey(key) {
          return encodeURIComponent(String(key));
        },
      });
      const keysMap = buildDenormalizedKeysMap(denormalized);
      return { denormalized, keysMap };
    },
    push: async (locale, { denormalized }) => {
      const normalized = normalizeObjectKeys(denormalized);
      return normalized;
    },
  });
}

function createNormalizeLoader(): ILoader<
  DenormalizeResult,
  Record<string, string>
> {
  return createLoader({
    pull: async (locale, input) => {
      const normalized = normalizeObjectKeys(input.denormalized);
      return normalized;
    },
    push: async (locale, data, originalInput) => {
      const keysMap = originalInput?.keysMap ?? {};
      const input = mapDenormalizedKeys(data, keysMap);
      const denormalized: Record<string, any> = unflatten(input, {
        delimiter: "/",
        transformKey(key) {
          return decodeURIComponent(String(key));
        },
      });
      return { denormalized, keysMap: keysMap || {} };
    },
  });
}

export function buildDenormalizedKeysMap(obj: Record<string, string>) {
  if (!obj) return {};

  return Object.keys(obj).reduce(
    (acc, key) => {
      if (key) {
        const normalizedKey = `${key}`.replace(OBJECT_NUMERIC_KEY_PREFIX, "");
        acc[normalizedKey] = key;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}

export function mapDenormalizedKeys(
  obj: Record<string, any>,
  denormalizedKeysMap: Record<string, string>,
) {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const denormalizedKey = denormalizedKeysMap[key] ?? key;
      acc[denormalizedKey] = obj[key];
      return acc;
    },
    {} as Record<string, string>,
  );
}

export function denormalizeObjectKeys(
  obj: Record<string, any>,
): Record<string, any> {
  if (_.isObject(obj) && !_.isArray(obj)) {
    return _.transform(
      obj,
      (result, value, key) => {
        const newKey = !isNaN(Number(key))
          ? `${OBJECT_NUMERIC_KEY_PREFIX}${key}`
          : key;
        result[newKey] =
          _.isObject(value) && !_.isDate(value)
            ? denormalizeObjectKeys(value)
            : value;
      },
      {} as Record<string, any>,
    );
  } else {
    return obj;
  }
}

export function normalizeObjectKeys(
  obj: Record<string, any>,
): Record<string, any> {
  if (_.isObject(obj) && !_.isArray(obj)) {
    return _.transform(
      obj,
      (result, value, key) => {
        const newKey = `${key}`.replace(OBJECT_NUMERIC_KEY_PREFIX, "");
        result[newKey] =
          _.isObject(value) && !_.isDate(value)
            ? normalizeObjectKeys(value)
            : value;
      },
      {} as Record<string, any>,
    );
  } else {
    return obj;
  }
}

function flattenHints(
  obj: Record<string, any>,
  parentHints: string[] = [],
  parentPath: string = "",
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const [key, _value] of Object.entries(obj)) {
    if (_.isObject(_value) && !_.isArray(_value)) {
      const value = _value as Record<string, any>;
      const currentHints = [...parentHints];
      const currentPath = parentPath ? `${parentPath}/${key}` : key;

      // Add this level's hint if it exists
      if (value.hint && typeof value.hint === "string") {
        currentHints.push(value.hint);
      }

      // Process nested objects (excluding the hint property)
      const nestedObj = _.omit(value, "hint");

      // If this is a leaf node (no nested objects), add to result
      if (Object.keys(nestedObj).length === 0) {
        if (currentHints.length > 0) {
          result[currentPath] = currentHints;
        }
      } else {
        // Recursively process nested objects
        const nestedComments = flattenHints(
          nestedObj,
          currentHints,
          currentPath,
        );
        Object.assign(result, nestedComments);
      }
    }
  }

  return result;
}
