import _ from "lodash";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

const TOP_LEVEL_KEY = "--content--";

export default function createJsonDictionaryLoader(): ILoader<
  Record<string, any>,
  Record<string, any>
> {
  return createLoader({
    pull: async (locale, input) => {
      const result = extractTranslatables(input, locale);

      // if locale keys are on top level, only single string is extracted and returned under special key
      if (typeof result === "string") {
        return { [TOP_LEVEL_KEY]: result };
      }

      return result;
    },
    push: async (locale, data, originalInput, originalLocale) => {
      if (!originalInput) {
        throw new Error("Error while parsing json-dictionary bucket");
      }
      const input = _.cloneDeep(originalInput);

      // if content is under special key, locale keys are on top level
      if (
        Object.keys(data).length === 1 &&
        Object.keys(data)[0] === TOP_LEVEL_KEY
      ) {
        setNestedLocale(
          { [TOP_LEVEL_KEY]: input },
          [TOP_LEVEL_KEY],
          locale,
          data[TOP_LEVEL_KEY],
          originalLocale,
        );
        return input;
      }

      // set the translation under the target locale key, use value from data (which is now a string)
      function walk(obj: any, dataNode: any, path: string[] = []) {
        if (Array.isArray(obj) && Array.isArray(dataNode)) {
          obj.forEach((item, idx) =>
            walk(item, dataNode[idx], [...path, String(idx)]),
          );
        } else if (
          obj &&
          typeof obj === "object" &&
          dataNode &&
          typeof dataNode === "object" &&
          !Array.isArray(dataNode)
        ) {
          for (const key of Object.keys(obj)) {
            if (dataNode.hasOwnProperty(key)) {
              walk(obj[key], dataNode[key], [...path, key]);
            }
          }
        } else if (
          obj &&
          typeof obj === "object" &&
          !Array.isArray(obj) &&
          typeof dataNode === "string"
        ) {
          // dataNode is the new string for the target locale
          setNestedLocale(input, path, locale, dataNode, originalLocale);
        }
      }
      walk(input, data);

      return input;
    },
  });
}

// extract all keys that match locale from object
function extractTranslatables(obj: any, locale: string): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => extractTranslatables(item, locale));
  } else if (isTranslatableObject(obj, locale)) {
    return obj[locale];
  } else if (obj && typeof obj === "object") {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      const value = extractTranslatables(obj[key], locale);
      if (
        (typeof value === "object" &&
          value !== null &&
          Object.keys(value).length > 0) ||
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === "string" && value.length > 0)
      ) {
        result[key] = value;
      }
    }
    return result;
  }
  return undefined;
}

function isTranslatableObject(obj: any, locale: string): boolean {
  return (
    obj &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.prototype.hasOwnProperty.call(obj, locale)
  );
}

function setNestedLocale(
  obj: any,
  path: string[],
  locale: string,
  value: string,
  originalLocale: string,
) {
  let curr = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!(key in curr)) curr[key] = {};
    curr = curr[key];
  }
  const last = path[path.length - 1];
  if (curr[last] && typeof curr[last] === "object") {
    curr[last][locale] = value;
    // Reorder keys: source locale first, then others alphabetically
    if (originalLocale && curr[last][originalLocale]) {
      const entries = Object.entries(curr[last]);
      const first = entries.filter(([k]) => k === originalLocale);
      const rest = entries
        .filter(([k]) => k !== originalLocale)
        .sort(([a], [b]) => a.localeCompare(b));
      const ordered = [...first, ...rest];
      const reordered: Record<string, string> = {};
      for (const [k, v] of ordered) {
        reordered[k] = v as string;
      }
      curr[last] = reordered;
    }
  }
}
