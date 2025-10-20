import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import {
  xcstringsToPluralWithMeta,
  pluralWithMetaToXcstrings,
  isPluralFormsObject,
  isICUPluralObject,
} from "./xcode-xcstrings-icu";

/**
 * Loader for xcode-xcstrings-v2 bucket type with ICU MessageFormat support.
 *
 * This should be placed AFTER xcode-xcstrings loader and BEFORE flat loader.
 *
 * Input:  {items: {zero: "No items", one: "1 item", other: "%d items"}}
 * Output: {items: {icu: "{count, plural, =0 {No items} one {1 item} other {# items}}", _meta: {...}}}
 *
 * Lock files will contain checksums of ICU format (new format for pluralization support).
 */
export default function createXcodeXcstringsV2Loader(
  defaultLocale: string = "en",
): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    async pull(locale, input) {
      const result: Record<string, any> = {};

      for (const [key, value] of Object.entries(input)) {
        if (isPluralFormsObject(value)) {
          try {
            // Convert plural object to ICU format with metadata
            result[key] = xcstringsToPluralWithMeta(value, locale);
          } catch (error) {
            console.error(
              `\n[xcode-xcstrings-icu] Failed to convert plural forms for key "${key}":`,
              `\nError: ${error instanceof Error ? error.message : String(error)}`,
              `\nLocale: ${locale}\n`
            );
            // Pass through original value on error
            result[key] = value;
          }
        } else {
          // Pass through non-plural values
          result[key] = value;
        }
      }

      return result;
    },

    async push(locale, payload) {
      const result: Record<string, any> = {};

      for (const [key, value] of Object.entries(payload)) {
        if (isICUPluralObject(value)) {
          try {
            // Convert ICU back to plural object format
            const pluralForms = pluralWithMetaToXcstrings(value);
            result[key] = pluralForms;
          } catch (error) {
            console.error(
              `\n[xcode-xcstrings-icu] Failed to convert ICU back to plural forms for key "${key}"`,
              `\nICU string: ${value.icu}`,
              `\nMetadata: ${JSON.stringify(value._meta, null, 2)}`,
              `\nError: ${error instanceof Error ? error.message : String(error)}`,
              `\nLocale: ${locale}\n`
            );
            // Pass through original value on error
            result[key] = value;
          }
        } else {
          // Pass through non-ICU values
          result[key] = value;
        }
      }

      return result;
    },
  });
}
