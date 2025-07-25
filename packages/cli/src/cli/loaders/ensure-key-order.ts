import _ from "lodash";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createEnsureKeyOrderLoader(): ILoader<
  Record<string, any>,
  Record<string, any>
> {
  return createLoader({
    pull: async (_locale, input) => {
      return input;
    },
    push: async (locale, data, originalInput) => {
      if (!originalInput || !data) {
        return data;
      }

      const result = reorderKeys(data, originalInput);

      return result;
    },
  });
}

function reorderKeys(
  data: Record<string, any>,
  originalInput: Record<string, any>,
): Record<string, any> {
  if (_.isArray(originalInput) && _.isArray(data)) {
    // If both are arrays, recursively reorder keys in each element
    return data.map((item, idx) => reorderKeys(item, originalInput[idx] ?? {}));
  }
  if (!_.isObject(data) || _.isArray(data) || _.isDate(data)) {
    return data;
  }

  const orderedData: Record<string, any> = {};
  const originalKeys = Object.keys(originalInput);
  const dataKeys = new Set(Object.keys(data));

  for (const key of originalKeys) {
    if (dataKeys.has(key)) {
      orderedData[key] = reorderKeys(data[key], originalInput[key]);
      dataKeys.delete(key);
    }
  }

  return orderedData;
}
