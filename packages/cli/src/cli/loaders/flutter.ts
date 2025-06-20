import _ from "lodash";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createFlutterLoader(): ILoader<
  Record<string, any>,
  Record<string, any>
> {
  return createLoader({
    async pull(locale, input) {
      // skip all metadata (keys starting with @)
      const result = _.pickBy(input, (value, key) => !_isMetadataKey(key));
      return result;
    },
    async push(locale, data, originalInput) {
      // find all metadata keys in originalInput
      const metadata = _.pickBy(originalInput, (value, key) =>
        _isMetadataKey(key),
      );
      const result = _.merge({}, metadata, { "@@locale": locale }, data);
      return result;
    },
  });
}

function _isMetadataKey(key: string) {
  return key.startsWith("@");
}
