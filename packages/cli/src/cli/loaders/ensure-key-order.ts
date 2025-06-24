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
    push: async (_locale, data, originalInput) => {
      if (!originalInput || !data) {
        return data;
      }
      return reorderKeys(data, originalInput);
    },
  });
}

function reorderKeys(
  data: Record<string, any>,
  originalInput: Record<string, any>,
): Record<string, any> {
  if (!_.isObject(data) || _.isArray(data) || _.isDate(data)) {
    return data;
  }

  const orderedData: Record<string, any> = {};
  const originalKeys = Object.keys(originalInput);
  const dataKeys = new Set(Object.keys(data));

  for (const key of originalKeys) {
    if (dataKeys.has(key)) {
      if (data[key]) {
        orderedData[key] = reorderKeys(data[key], originalInput[key]);
      }
      dataKeys.delete(key);
    }
  }


  return orderedData;
}
