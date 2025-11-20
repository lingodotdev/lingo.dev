import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import _ from "lodash";

/**
 * CLDR plural categories
 */
const CLDR_PLURAL_CATEGORIES = new Set([
  "zero",
  "one",
  "two",
  "few",
  "many",
  "other",
]);

/**
 * Build ICU MessageFormat string from xcstrings plural forms
 * @example {one: "1 item", other: "%d items"} → "{count, plural, one {1 item} other {%d items}}"
 */
function buildIcuPluralString(forms: Record<string, string>): string {
  const parts = Object.entries(forms).map(
    ([form, text]) => `${form} {${text}}`,
  );
  return `{count, plural, ${parts.join(" ")}}`;
}

/**
 * Parse ICU MessageFormat string back to xcstrings plural forms
 * @example "{count, plural, one {1 item} other {%d items}}" → {one: "1 item", other: "%d items"}
 */
function parseIcuPluralString(icuString: string): Record<string, string> {
  const pluralMatch = icuString.match(/\{[\w]+,\s*plural,\s*(.+)\}$/);
  if (!pluralMatch) {
    throw new Error(`Invalid ICU plural format: ${icuString}`);
  }

  const formsText = pluralMatch[1];
  const forms: Record<string, string> = {};

  let i = 0;
  while (i < formsText.length) {
    // Skip whitespace
    while (i < formsText.length && /\s/.test(formsText[i])) {
      i++;
    }

    if (i >= formsText.length) break;

    // Read form name (e.g., "one", "other", "=0")
    let formName = "";
    if (formsText[i] === "=") {
      // Exact match like =0, =1
      formName += formsText[i];
      i++;
      while (i < formsText.length && /\d/.test(formsText[i])) {
        formName += formsText[i];
        i++;
      }
    } else {
      // CLDR keyword like "one", "other"
      while (i < formsText.length && /\w/.test(formsText[i])) {
        formName += formsText[i];
        i++;
      }
    }

    if (!formName) break;

    // Skip whitespace and find opening brace
    while (i < formsText.length && /\s/.test(formsText[i])) {
      i++;
    }

    if (i >= formsText.length || formsText[i] !== "{") {
      throw new Error(`Expected '{' after form name '${formName}'`);
    }

    // Find matching closing brace
    i++; // skip opening brace
    let braceCount = 1;
    let formText = "";

    while (i < formsText.length && braceCount > 0) {
      if (formsText[i] === "{") {
        braceCount++;
        formText += formsText[i];
      } else if (formsText[i] === "}") {
        braceCount--;
        if (braceCount > 0) {
          formText += formsText[i];
        }
      } else {
        formText += formsText[i];
      }
      i++;
    }

    if (braceCount !== 0) {
      throw new Error(
        `Unclosed brace for form '${formName}' in ICU: ${icuString}`,
      );
    }

    forms[formName] = formText;
  }

  return forms;
}

/**
 * Check if a value looks like an ICU plural string
 */
function isIcuPluralString(value: any): boolean {
  return typeof value === "string" && /^\{[\w]+,\s*plural,\s*.+\}$/.test(value);
}

export default function createXcodeXcstringsV2Loader(
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
          if (!resultData[translationKey]) {
            resultData[translationKey] = {};
          }

          if ("stringUnit" in langTranslationEntity) {
            resultData[translationKey].stringUnit =
              langTranslationEntity.stringUnit.value;

            if ("substitutions" in langTranslationEntity) {
              resultData[translationKey].substitutions = {};

              for (const [subName, subData] of Object.entries(
                langTranslationEntity.substitutions as any,
              )) {
                const pluralForms = (subData as any).variations?.plural;
                if (pluralForms) {
                  const forms: Record<string, string> = {};
                  for (const [form, formData] of Object.entries(pluralForms)) {
                    forms[form] = (formData as any).stringUnit.value;
                  }

                  const icuString = buildIcuPluralString(forms);
                  resultData[translationKey].substitutions[subName] = {
                    variations: {
                      plural: icuString,
                    },
                  };
                }
              }
            }
          } else if ("stringSet" in langTranslationEntity) {
            const values = langTranslationEntity.stringSet.values;
            if (Array.isArray(values) && values.length > 0) {
              resultData[translationKey].stringSet = values;
            }
          } else if ("variations" in langTranslationEntity) {
            if ("plural" in langTranslationEntity.variations) {
              const pluralForms = langTranslationEntity.variations.plural;

              const forms: Record<string, string> = {};
              for (const [form, formData] of Object.entries(pluralForms)) {
                if ((formData as any)?.stringUnit?.value) {
                  forms[form] = (formData as any).stringUnit.value;
                }
              }

              const icuString = buildIcuPluralString(forms);
              resultData[translationKey].variations = {
                plural: icuString,
              };
            }
          }
        } else if (isSourceLanguage) {
          if (!resultData[translationKey]) {
            resultData[translationKey] = {};
          }
          resultData[translationKey].stringUnit = translationKey;
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

      for (const [baseKey, keyData] of Object.entries(payload)) {
        if (!keyData || typeof keyData !== "object") {
          continue;
        }

        const hasDoNotTranslateFlag =
          originalInput &&
          (originalInput as any).strings &&
          (originalInput as any).strings[baseKey] &&
          (originalInput as any).strings[baseKey].shouldTranslate === false;

        const localizationData: any = {};

        if ("stringUnit" in keyData) {
          localizationData.stringUnit = {
            state: "translated",
            value: keyData.stringUnit,
          };
        }

        if ("substitutions" in keyData && keyData.substitutions) {
          const subs: any = {};

          for (const [subName, subData] of Object.entries(
            keyData.substitutions as any,
          )) {
            const pluralValue = (subData as any)?.variations?.plural;

            if (pluralValue && isIcuPluralString(pluralValue)) {
              try {
                const pluralForms = parseIcuPluralString(pluralValue);
                const pluralOut: any = {};
                for (const [form, text] of Object.entries(pluralForms)) {
                  pluralOut[form] = {
                    stringUnit: {
                      state: "translated",
                      value: text,
                    },
                  };
                }

                const sourceLocale =
                  (originalInput as any)?.sourceLanguage || "en";
                const origFormatSpec =
                  (originalInput as any)?.strings?.[baseKey]?.localizations?.[
                    sourceLocale
                  ]?.substitutions?.[subName]?.formatSpecifier || subName;

                subs[subName] = {
                  formatSpecifier: origFormatSpec,
                  variations: {
                    plural: pluralOut,
                  },
                };
              } catch (error) {
                throw new Error(
                  `Failed to write substitution plural translation for key "${baseKey}/substitutions/${subName}" (locale: ${locale}).\n` +
                    `${error instanceof Error ? error.message : String(error)}`,
                );
              }
            }
          }

          if (Object.keys(subs).length > 0) {
            localizationData.substitutions = subs;
          }
        }

        if ("stringSet" in keyData && Array.isArray(keyData.stringSet)) {
          localizationData.stringSet = {
            state: "translated",
            values: keyData.stringSet,
          };
        }

        if ("variations" in keyData && keyData.variations?.plural) {
          const pluralValue = keyData.variations.plural;

          if (isIcuPluralString(pluralValue)) {
            try {
              const pluralForms = parseIcuPluralString(pluralValue);
              const pluralOut: any = {};
              for (const [form, text] of Object.entries(pluralForms)) {
                pluralOut[form] = {
                  stringUnit: {
                    state: "translated",
                    value: text,
                  },
                };
              }

              localizationData.variations = {
                plural: pluralOut,
              };
            } catch (error) {
              throw new Error(
                `Failed to write plural translation for key "${baseKey}" (locale: ${locale}).\n` +
                  `${error instanceof Error ? error.message : String(error)}`,
              );
            }
          }
        }

        if (Object.keys(localizationData).length > 0) {
          langDataToMerge.strings[baseKey] = {
            extractionState: originalInput?.strings?.[baseKey]?.extractionState,
            localizations: {
              [locale]: localizationData,
            },
          };

          if (hasDoNotTranslateFlag) {
            langDataToMerge.strings[baseKey].shouldTranslate = false;
          }
        }
      }

      return _.merge(input, langDataToMerge);
    },

    async pullHints(input) {
      const hints: Record<string, any> = {};

      for (const [translationKey, _translationEntity] of Object.entries(
        (input as any).strings || {},
      )) {
        const rootTranslationEntity = _translationEntity as any;
        if (
          rootTranslationEntity.comment &&
          typeof rootTranslationEntity.comment === "string"
        ) {
          hints[translationKey] = { hint: rootTranslationEntity.comment };
        }
      }

      return hints;
    },
  });
}
