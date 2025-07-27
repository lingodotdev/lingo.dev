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

      for (const [translationKey, _translationEntity] of Object.entries(
        (input as any).strings,
      )) {
        const rootTranslationEntity = _translationEntity as any;

        if (rootTranslationEntity.shouldTranslate === false) {
          continue;
        }

        const langTranslationEntity =
          rootTranslationEntity?.localizations?.[locale];

        if (langTranslationEntity) {
          if ("stringUnit" in langTranslationEntity) {
            resultData[translationKey] = langTranslationEntity.stringUnit.value;
          } else if ("variations" in langTranslationEntity) {
            if ("plural" in langTranslationEntity.variations) {
              resultData[translationKey] = {};
              const pluralForms = langTranslationEntity.variations.plural;
              for (const form in pluralForms) {
                if (pluralForms[form]?.stringUnit?.value) {
                  resultData[translationKey][form] =
                    pluralForms[form].stringUnit.value;
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

      const input = _.cloneDeep(originalInput) || {
        sourceLanguage: locale,
        strings: {},
      };

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

      const originalInputWithoutLocale = originalInput
        ? _removeLocale(originalInput, locale)
        : {};

      const result = _.merge({}, originalInputWithoutLocale, langDataToMerge);
      return result;
    },
    async pullHints(originalInput) {
      if (!originalInput || !originalInput.strings) {
        return {};
      }

      const hints: Record<string, any> = {};

      for (const [translationKey, translationEntity] of Object.entries(
        originalInput.strings
      )) {
        const entity = translationEntity as any;
        
        // Extract comment field if it exists
        if (entity.comment && typeof entity.comment === 'string') {
          hints[translationKey] = { hint: entity.comment };
        }
        
        // For plural forms, we might want to include the base comment for all variants
        if (entity.localizations) {
          for (const [locale, localization] of Object.entries(entity.localizations)) {
            if ((localization as any).variations?.plural) {
              const pluralForms = (localization as any).variations.plural;
              for (const form in pluralForms) {
                const pluralKey = `${translationKey}/${form}`;
                if (entity.comment && typeof entity.comment === 'string') {
                  hints[pluralKey] = { hint: entity.comment };
                }
              }
            }
          }
        }
      }

      return hints;
    },
  });
}

export function _removeLocale(input: Record<string, any>, locale: string) {
  const { strings } = input;
  const newStrings = _.cloneDeep(strings);
  for (const [key, value] of Object.entries(newStrings)) {
    if ((value as any).localizations?.[locale]) {
      delete (value as any).localizations[locale];
    }
  }
  return { ...input, strings: newStrings };
}
