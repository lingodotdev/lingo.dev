import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import _ from "lodash";

export default function createXcodeXcstringsLoader(
  defaultLocale: string,
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    async pull(locale, input, initCtx) {
      const resultData: Record<string, any> = {};
      const isSourceLanguage = locale === defaultLocale;

      for (const [translationKey, _translationEntity] of Object.entries((input as any).strings)) {
        const rootTranslationEntity = _translationEntity as any;

        if (rootTranslationEntity.shouldTranslate === false) {
          continue;
        }

        const langTranslationEntity = rootTranslationEntity?.localizations?.[locale];

        if (langTranslationEntity) {
          if ("stringUnit" in langTranslationEntity) {
            resultData[translationKey] = langTranslationEntity.stringUnit.value;
          } else if ("variations" in langTranslationEntity) {
            if ("plural" in langTranslationEntity.variations) {
              resultData[translationKey] = {};
              const pluralForms = langTranslationEntity.variations.plural;
              for (const form in pluralForms) {
                if (pluralForms[form]?.stringUnit?.value) {
                  resultData[translationKey][form] = pluralForms[form].stringUnit.value;
                }
              }
            }
          }
        } else if (isSourceLanguage) {
          resultData[translationKey] = translationKey;
        }
      }

      return resultData;
    },
    async push(locale, payload, originalInput) {
      const langDataToMerge: any = {};
      langDataToMerge.strings = {};

      const input = _.cloneDeep(originalInput) || { sourceLanguage: locale, strings: {} };

      for (const [key, value] of Object.entries(payload)) {
        if (value === null || value === undefined) {
          continue;
        }

        const hasDoNotTranslateFlag =
          originalInput &&
          (originalInput as any).strings &&
          (originalInput as any).strings[key] &&
          (originalInput as any).strings[key].shouldTranslate === false;

        if (typeof value === "string") {
          langDataToMerge.strings[key] = {
            extractionState: originalInput?.strings?.[key]?.extractionState,
            localizations: {
              [locale]: {
                stringUnit: {
                  state: "translated",
                  value,
                },
              },
            },
          };

          if (hasDoNotTranslateFlag) {
            langDataToMerge.strings[key].shouldTranslate = false;
          }
        } else {
          const updatedVariations: any = {};

          for (const form in value) {
            updatedVariations[form] = {
              stringUnit: {
                state: "translated",
                value: value[form],
              },
            };
          }

          langDataToMerge.strings[key] = {
            extractionState: "manual",
            localizations: {
              [locale]: {
                variations: {
                  plural: updatedVariations,
                },
              },
            },
          };

          if (hasDoNotTranslateFlag) {
            langDataToMerge.strings[key].shouldTranslate = false;
          }
        }
      }

      const result = _.merge({}, originalInput, langDataToMerge);
      return result;
    },
  });
}
