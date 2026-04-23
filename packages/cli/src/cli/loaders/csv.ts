import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import _ from "lodash";
import { ILoader } from "./_types";
import { composeLoaders, createLoader } from "./_utils";

/**
 * Tries to detect the key column name from a csvString.
 *
 * Current logic: get first cell > 'KEY' fallback if empty
 */
export function detectKeyColumnName(csvString: string) {
  const row: string[] | undefined = parse(csvString)[0];
  const firstColumn = row?.[0]?.trim();
  return firstColumn || "KEY";
}

export type CsvLoaderOptions = {
  /**
   * Name of the column to use as the unique row identifier.
   * If omitted, defaults to the first column in the CSV header.
   */
  keyColumn?: string;
};

export default function createCsvLoader(options?: CsvLoaderOptions) {
  return composeLoaders(_createCsvLoader(options), createPullOutputCleaner());
}

type InternalTransferState = {
  keyColumnName: string;
  inputParsed: Record<string, any>[];
  items: Record<string, string>;
};

function _createCsvLoader(
  options?: CsvLoaderOptions,
): ILoader<string, InternalTransferState> {
  // Validation runs once per loader instance. The loader is created per file
  // path, and the same file is pulled once per locale (source + each target) —
  // re-validating on every pull would do the same O(N) work N+1 times for
  // identical content, with no possibility of catching new issues.
  let validated = false;

  return createLoader({
    async pull(locale, input) {
      const keyColumnName =
        options?.keyColumn ??
        detectKeyColumnName(input.split("\n").find((l) => l.length)!);
      const inputParsed = parse(input, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count_less: true,
      }) as Record<string, any>[];

      if (!validated) {
        if (options?.keyColumn && inputParsed.length > 0) {
          const availableColumns = Object.keys(inputParsed[0]);
          if (!availableColumns.includes(options.keyColumn)) {
            throw new Error(
              `CSV key column "${options.keyColumn}" is not present in the file. ` +
                `Available columns: ${availableColumns.join(", ")}. ` +
                `Either rename a column to "${options.keyColumn}" or update the "keyColumn" setting in your bucket config.`,
            );
          }
        }

        assertUniqueKeys(inputParsed, keyColumnName);
        validated = true;
      }

      const items: Record<string, string> = {};

      // Assign keys that already have translation so AI doesn't re-generate it.
      _.forEach(inputParsed, (row) => {
        const key = row[keyColumnName];
        if (key && row[locale] && row[locale].trim() !== "") {
          items[key] = row[locale];
        }
      });

      return {
        inputParsed,
        keyColumnName,
        items,
      };
    },
    async push(locale, { inputParsed, keyColumnName, items }) {
      const columns =
        inputParsed.length > 0
          ? Object.keys(inputParsed[0])
          : [keyColumnName, locale];
      if (!columns.includes(locale)) {
        columns.push(locale);
      }

      const updatedRows = inputParsed.map((row) => ({
        ...row,
        [locale]: items[row[keyColumnName]] || row[locale] || "",
      }));
      const existingKeys = new Set(
        inputParsed.map((row) => row[keyColumnName]),
      );

      Object.entries(items).forEach(([key, value]) => {
        if (!existingKeys.has(key)) {
          const newRow: Record<string, string> = {
            [keyColumnName]: key,
            ...Object.fromEntries(columns.map((column) => [column, ""])),
          };
          newRow[locale] = value;
          updatedRows.push(newRow);
        }
      });

      return stringify(updatedRows, {
        header: true,
        columns,
      });
    },
  });
}

/**
 * Validates that the key column has unique values across all rows.
 * Without this check, rows with repeated key values silently overwrite
 * each other when building the translation map, causing most source rows
 * to be dropped and the last row's translation to be broadcast everywhere.
 */
function assertUniqueKeys(
  rows: Record<string, any>[],
  keyColumnName: string,
): void {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const row of rows) {
    const key = row[keyColumnName];
    if (key === undefined || key === "") continue;
    if (seen.has(key)) {
      duplicates.add(key);
    } else {
      seen.add(key);
    }
  }
  if (duplicates.size === 0) return;

  const preview = [...duplicates].slice(0, 3).join(", ");
  const more = duplicates.size > 3 ? `, and ${duplicates.size - 3} more` : "";
  throw new Error(
    `CSV column "${keyColumnName}" has duplicate values (${preview}${more}). ` +
      `Lingo uses this column as a unique row identifier, so duplicates would cause rows to silently overwrite each other. ` +
      `Fix: make the first column unique (add an "id" column or move your source-language column first), ` +
      `or set "keyColumn" in this bucket's config to point at a column with unique values.`,
  );
}

/**
 * This is a simple extra loader that is used to clean the data written to lockfile
 */
function createPullOutputCleaner(): ILoader<
  InternalTransferState,
  Record<string, string>
> {
  return createLoader({
    async pull(_locale, input) {
      return input.items;
    },
    async push(_locale, data, _oI, _oL, pullInput) {
      return { ...pullInput!, items: data };
    },
  });
}
