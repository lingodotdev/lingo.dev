import _ from "lodash";
import gettextParser from "gettext-parser";
import { GetTextTranslations } from "gettext-parser";
import { ILoader } from "../_types";
import { composeLoaders, createLoader } from "../_utils";

export type PoTranslationEntry = GetTextTranslations["translations"][""];
export type PoTranslationValue = { singular: string; plural: string | null };

export type PoLoaderParams = {
  multiline: boolean;
};

export default function createPoLoader(
  params: PoLoaderParams = { multiline: false },
): ILoader<string, Record<string, PoTranslationValue>> {
  return composeLoaders(createPoDataLoader(params), createPoContentLoader());
}

export function createPoDataLoader(
  params: PoLoaderParams,
): ILoader<string, PoTranslationEntry> {
  return createLoader({
    async pull(locale, input) {
      const parsedPo = gettextParser.po.parse(input);
      const result: PoTranslationEntry = {};
      const sections = input.split("\n\n").filter(Boolean);
      for (const section of sections) {
        const sectionPo = gettextParser.po.parse(section);
        // skip section with no translations (some sections might have only obsolete entries)
        if (Object.keys(sectionPo.translations).length === 0) {
          continue;
        }

        const contextKey = _.keys(sectionPo.translations)[0];
        const entries = sectionPo.translations[contextKey];
        Object.entries(entries).forEach(([msgid, entry]) => {
          if (msgid && entry.msgid) {
            const context = entry.msgctxt || "";
            const fullEntry = parsedPo.translations[context]?.[msgid];
            if (fullEntry) {
              result[msgid] = fullEntry;
            }
          }
        });
      }
      return result;
    },

    async push(locale, data, originalInput, originalLocale, pullInput) {
      // Parse each section to maintain structure
      const currentSections = pullInput?.split("\n\n").filter(Boolean) || [];
      const originalSections =
        originalInput?.split("\n\n").filter(Boolean) || [];
      const result = originalSections
        .map((section) => {
          const sectionPo = gettextParser.po.parse(section);
          // skip section with no translations (some sections might have only obsolete entries)
          if (Object.keys(sectionPo.translations).length === 0) {
            return null;
          }

          const contextKey = _.keys(sectionPo.translations)[0];
          const entries = sectionPo.translations[contextKey];
          const msgid = Object.keys(entries).find((key) => entries[key].msgid);
          if (!msgid) {
            // If the section is empty, try to find it in the current sections
            const currentSection = currentSections.find((cs) => {
              const csPo = gettextParser.po.parse(cs);
              const csContextKey = _.keys(csPo.translations)[0];
              const csEntries = csPo.translations[csContextKey];
              const csMsgid = Object.keys(csEntries).find(
                (key) => csEntries[key].msgid,
              );
              return csMsgid === msgid;
            });

            if (currentSection) {
              return currentSection;
            }
            return section;
          }
          if (data[msgid]) {
            const updatedPo = _.merge({}, sectionPo, {
              translations: {
                [contextKey]: {
                  [msgid]: {
                    msgstr: data[msgid].msgstr,
                  },
                },
              },
            });
            return gettextParser.po
              .compile(updatedPo, { foldLength: params.multiline ? 76 : false })
              .toString()
              .replace(
                [`msgid ""`, `msgstr "Content-Type: text/plain\\n"`].join("\n"),
                "",
              )
              .trim();
          }
          return section.trim();
        })
        .filter(Boolean)
        .join("\n\n");
      return result;
    },
  });
}

export function createPoContentLoader(): ILoader<
  PoTranslationEntry,
  Record<string, PoTranslationEntry>
> {
  return createLoader({
    async pull(locale, input, initCtx, originalLocale) {
      const result = _.chain(input)
        .entries()
        .filter(([, entry]) => !!entry.msgid)
        .map(([, entry]) => {
          const singularFallback =
            locale === originalLocale ? entry.msgid : null;
          const pluralFallback =
            locale === originalLocale
              ? entry.msgid_plural || entry.msgid
              : null;
          const hasPlural = entry.msgstr.length > 1;
          return [
            entry.msgid,
            {
              singular: entry.msgstr[0] || singularFallback,
              plural: hasPlural
                ? ((entry.msgstr[1] || pluralFallback) as string | null)
                : null,
            },
          ];
        })
        .fromPairs()
        .value();
      return result;
    },
    async push(locale, data, originalInput) {
      const result = _.chain(originalInput)
        .entries()
        .map(([, entry]) => [
          entry.msgid,
          {
            ...entry,
            msgstr: [
              data[entry.msgid]?.singular,
              data[entry.msgid]?.plural || null,
            ].filter(Boolean),
          },
        ])
        .fromPairs()
        .value();

      return result;
    },
  });
}
