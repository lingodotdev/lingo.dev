import { MD5 } from 'object-hash';
import YAML from 'yaml';

export interface IBucketParser {
  deserialize: (locale: string, content: any) => Promise<Record<string, string>>;
  serialize: (locale: string, content: Record<string, string>) => Promise<any>;
}

export function createJsonParser(): IBucketParser {
  return {
    async deserialize(locale: string, content: any) {
      return JSON.parse(content);
    },
    async serialize(locale: string, content: Record<string, string>) {
      return JSON.stringify(content, null, 2);
    }
  };
}

export function createMarkdownParser(): IBucketParser {
  return {
    async deserialize(locale: string, content: any) {
      const sections = String(content).split(/^#+\s/gm).filter(Boolean);

      const result: Record<string, string> = {};
      for (const section of sections) {
        const sectionKey = MD5(section);
        result[sectionKey] = section;
      }

      return result;
    },
    async serialize(locale: string, content: Record<string, string>) {
      return Object.values(content).join('\n');
    }
  };
}

export type YamlBucketParserParams = {
  rootKey: boolean;
};
export function createYamlParser(params: YamlBucketParserParams): IBucketParser {
  return {
    async deserialize(locale: string, content: any) {
      const parsed = YAML.parse(content);
      return params.rootKey ? parsed[locale] : parsed;
    },
    async serialize(locale: string, content: Record<string, string>) {
      return YAML.stringify(params.rootKey ? { [locale]: content } : content);
    }
  };
}

export function createXcodeParser() {
  let _existingData: any;
  return {
    async deserialize(locale: string, content: any) {
      _existingData = await JSON.parse(content);
  
      const resultData: Record<string, any> = {};
  
      for (const [translationKey, _translationEntity] of Object.entries(_existingData.strings)) {
        const rootTranslationEntity = _translationEntity as any;
        const langTranslationEntity = rootTranslationEntity?.localizations?.[locale];
        if (langTranslationEntity) {
          if ('stringUnit' in langTranslationEntity) {
            resultData[translationKey] = langTranslationEntity.stringUnit.value;
          } else if ('variations' in langTranslationEntity) {
            if ('plural' in langTranslationEntity.variations) {
              resultData[translationKey] = {
                one: langTranslationEntity.variations.plural.one?.stringUnit?.value || '',
                other: langTranslationEntity.variations.plural.other?.stringUnit?.value || '',
                zero: langTranslationEntity.variations.plural.zero?.stringUnit?.value || '',
              };
            }
          }
        }
      }
  
      return resultData;
    },
    async serialize(locale: string, payload: Record<string, any>): Promise<string> {
      const langDataToMerge: any = {};
      langDataToMerge.strings = {};
  
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'string') {
          langDataToMerge.strings[key] = {
            extractionState: 'manual',
            localizations: {
              [locale]: {
                stringUnit: {
                  state: 'translated',
                  value,
                },
              },
            },
          };
        } else {
          langDataToMerge.strings[key] = {
            extractionState: 'manual',
            localizations: {
              [locale]: {
                variations: {
                  plural: {
                    one: {
                      stringUnit: {
                        state: 'translated',
                        value: value.one,
                      },
                    },
                    other: {
                      stringUnit: {
                        state: 'translated',
                        value: value.other,
                      },
                    },
                    zero: {
                      stringUnit: {
                        state: 'translated',
                        value: value.zero,
                      },
                    },
                  },
                },
              },
            },
          };
        }
      }
  
      const resultData = { ..._existingData, ...langDataToMerge };
      return JSON.stringify(resultData, null, 2);
    }
  };
}