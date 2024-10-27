import YAML from 'yaml';
import { ILoader } from "./_types";
import { createLoader } from './_utils';

export default function createYamlLoader(): ILoader<string, Record<string, any>> {
  return createLoader({
    async pull(locale, rawData) {
      return YAML.parse(rawData) || {};
    },
    async push(locale, payload) {
      return YAML.stringify(payload, {
        lineWidth: -1,
      });
    }
  });
}
