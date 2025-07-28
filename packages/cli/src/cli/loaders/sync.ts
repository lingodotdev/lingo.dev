import _ from "lodash";

import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createSyncLoader(): ILoader<
  Record<string, string>,
  Record<string, string>
> {
  return createLoader({
    async pull(locale, input, initCtx, originalLocale, originalInput) {
      if (!originalInput) {
        return input;
      }

      return _.chain(originalInput)
        .mapValues((value, key) => input[key])
        .value() as Record<string, string>;
    },
    async push(locale, data, originalInput) {
      if (!originalInput) {
        return data;
      }

<<<<<<< HEAD
      return _.chain(originalInput || {})
        .mapValues((value, key) => data[key])
        .value();
=======
      // Only include keys that exist in the original input to maintain sync
      return _.chain(data)
        .pickBy((value, key) => originalInput.hasOwnProperty(key))
        .value() as Record<string, string>;
>>>>>>> be7e3bf (feat(cli): added ignorekeys support for run)
    },
  });
}
