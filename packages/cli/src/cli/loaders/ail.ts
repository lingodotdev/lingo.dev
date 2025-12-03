import { parseStringPromise, Builder } from "xml2js";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

// Advanced Installer AIL (localization dictionary) file format
// Structure:
// <DICTIONARY type="multilanguage">
//   <ENTRY id="Control.Text.WelcomeDlg#Title">
//     <STRING lang="en" value="Welcome"/>
//     <STRING lang="de" value="Willkommen"/>
//   </ENTRY>
// </DICTIONARY>

interface StringNode {
  $: {
    lang: string;
    value: string;
  };
}

interface EntryNode {
  $?: {
    id: string;
  };
  STRING?: StringNode[];
}

interface DictionaryNode {
  $?: Record<string, string>; // Preserve attributes like type="multilanguage", ignore="..."
  ENTRY?: EntryNode[];
}

interface ParsedAIL {
  DICTIONARY: DictionaryNode;
}

export default function createAilLoader(): ILoader<
  string,
  Record<string, string>
> {
  return createLoader({
    async pull(locale, input) {
      const result: Record<string, string> = {};

      if (!input || !input.trim()) {
        return result;
      }

      try {
        // Parse AIL XML
        const parsed = (await parseStringPromise(input, {
          explicitArray: true, // Always use arrays for consistency
          mergeAttrs: false, // Keep attributes separate in $
          trim: true,
          explicitRoot: true,
        })) as ParsedAIL;

        const dictionary = parsed.DICTIONARY;
        if (!dictionary) {
          return result;
        }

        const entries = dictionary.ENTRY || [];

        // Extract entries for source locale
        for (const entry of entries) {
          const id = entry.$?.id;
          if (!id) {
            // Skip entries without id
            continue;
          }

          const strings = entry.STRING || [];

          // Find STRING element matching source locale
          const sourceString = strings.find(
            (s) => s.$?.lang === locale
          );

          if (sourceString?.$.value) {
            result[id] = sourceString.$.value;
          }
        }

        return result;
      } catch (error) {
        console.error("Failed to parse AIL file:", error);
        return result;
      }
    },

    async push(locale, data, originalInput) {
      if (!originalInput || !originalInput.trim()) {
        // Create new AIL file from scratch
        const dictionary: DictionaryNode = {
          $: { type: "multilanguage" },
          ENTRY: Object.entries(data).map(([id, value]) => ({
            $: { id },
            STRING: [
              {
                $: { lang: locale, value },
              },
            ],
          })),
        };

        const builder = new Builder({
          xmldec: { version: "1.0", encoding: "UTF-8" },
          headless: false,
        });

        return builder.buildObject({ DICTIONARY: dictionary });
      }

      try {
        // Parse original AIL XML
        const parsed = (await parseStringPromise(originalInput, {
          explicitArray: true,
          mergeAttrs: false,
          trim: true,
          explicitRoot: true,
        })) as ParsedAIL;

        const dictionary = parsed.DICTIONARY;
        if (!dictionary) {
          throw new Error("No DICTIONARY root element found");
        }

        const entries = dictionary.ENTRY || [];

        // Update or add translations for target locale
        for (const [id, value] of Object.entries(data)) {
          // Find existing entry by id
          let entry = entries.find((e) => e.$?.id === id);

          if (!entry) {
            // Create new entry if doesn't exist
            entry = {
              $: { id },
              STRING: [],
            };
            entries.push(entry);
          }

          // Ensure STRING array exists
          if (!entry.STRING) {
            entry.STRING = [];
          }

          // Find or create STRING element for target locale
          let targetString = entry.STRING.find(
            (s) => s.$?.lang === locale
          );

          if (targetString) {
            // Update existing translation
            targetString.$.value = value;
          } else {
            // Add new translation
            entry.STRING.push({
              $: { lang: locale, value },
            });
          }
        }

        // Update ENTRY array in dictionary
        dictionary.ENTRY = entries;

        // Build XML output
        const builder = new Builder({
          xmldec: { version: "1.0", encoding: "UTF-8" },
          headless: false,
        });

        return builder.buildObject({ DICTIONARY: dictionary });
      } catch (error) {
        console.error("Failed to build AIL file:", error);
        throw error;
      }
    },
  });
}
