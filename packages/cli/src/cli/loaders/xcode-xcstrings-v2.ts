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
 * Get CLDR plural categories used by a locale
 * @param locale - The locale to check (e.g., "en", "ru", "zh")
 * @returns Array of plural category names used by this locale
 */
function getRequiredPluralCategories(locale: string): string[] {
  try {
    const pluralRules = new Intl.PluralRules(locale);
    const categories = pluralRules.resolvedOptions().pluralCategories;
    if (!categories || categories.length === 0) {
      return ["other"];
    }
    return categories;
  } catch (error) {
    // Fallback for unsupported locales - 'other' is the only universally required form
    return ["other"];
  }
}

/**
 * Check if a plural form is valid for a given locale
 * Always allows exact match forms (=0, =1, =2)
 * @param form - The plural form to check (e.g., "one", "few", "=0")
 * @param locale - The target locale
 * @returns true if the form should be kept
 */
function isValidPluralForm(form: string, locale: string): boolean {
  // Always allow exact match forms (=0, =1, =2, etc.)
  if (form.startsWith("=")) return true;

  // Check if form is a required CLDR category for this locale
  const requiredCategories = getRequiredPluralCategories(locale);
  return requiredCategories.includes(form);
}

/**
 * Build ICU MessageFormat string from xcstrings plural forms
 * Converts optional CLDR forms to exact match syntax for better backend understanding
 * @param forms - Plural forms from xcstrings
 * @param sourceLocale - Source language locale to determine required vs optional forms
 * @returns ICU MessageFormat string
 */
function buildIcuPluralString(
  forms: Record<string, string>,
  sourceLocale: string,
): string {
  const requiredCategories = new Set(getRequiredPluralCategories(sourceLocale));

  const parts = Object.entries(forms).map(([form, text]) => {
    // Convert optional CLDR forms to exact match syntax
    let normalizedForm = form;
    if (!requiredCategories.has(form)) {
      if (form === "zero") normalizedForm = "=0";
      else if (form === "one") normalizedForm = "=1";
      else if (form === "two") normalizedForm = "=2";
    }
    return `${normalizedForm} {${text}}`;
  });

  return `{count, plural, ${parts.join(" ")}}`;
}

function parseIcuPluralString(
  icuString: string,
  locale: string,
): Record<string, string> {
  const pluralMatch = icuString.match(/\{[\w]+,\s*plural,\s*(.+)\}$/);
  if (!pluralMatch) {
    throw new Error(`Invalid ICU plural format: ${icuString}`);
  }

  const formsText = pluralMatch[1];
  const forms: Record<string, string> = {};
  const exactMatches = new Set<string>(); // Track which forms came from exact matches

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

    // Convert exact match syntax back to CLDR category names
    if (formName === "=0") {
      formName = "zero";
      exactMatches.add("zero");
    } else if (formName === "=1") {
      formName = "one";
      exactMatches.add("one");
    } else if (formName === "=2") {
      formName = "two";
      exactMatches.add("two");
    }

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

  const filteredForms: Record<string, string> = {};
  for (const [form, text] of Object.entries(forms)) {
    if (exactMatches.has(form) || isValidPluralForm(form, locale)) {
      filteredForms[form] = text;
    }
  }

  return filteredForms;
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

                  const icuString = buildIcuPluralString(forms, locale);
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

              const icuString = buildIcuPluralString(forms, locale);
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
                const pluralForms = parseIcuPluralString(pluralValue, locale);
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
              const pluralForms = parseIcuPluralString(pluralValue, locale);
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
