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

export default function createCsvLoader() {
  return composeLoaders(_createCsvLoader(), createPullOutputCleaner())
}

type InternalTransferState = {
  keyColumnName: string;
  inputParsed: Record<string, any>[];
  items: Record<string, string>;
}

function _createCsvLoader(): ILoader<
  string,
  InternalTransferState
> {
  return createLoader({
    async pull(locale, input) {
      const keyColumnName = detectKeyColumnName(input.split('\n').find(l => l.length)!);
      const inputParsed = parse(input, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count_less: true,
      }) as Record<string, any>[];

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
        items
      };
    },
    async push(locale, {inputParsed, keyColumnName, items}) {
      const columns = inputParsed.length > 0 ? Object.keys(inputParsed[0]) : [keyColumnName, locale];
      if (!columns.includes(locale)) {
        columns.push(locale);
      }

      const updatedRows = inputParsed.map((row) => ({
        ...row,
        [locale]: items[row[keyColumnName]] || row[locale] || "",
      }));
      const existingKeys = new Set(inputParsed.map((row) => row[keyColumnName]));

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
      return { ...pullInput!, items:data };
    },
  });
}
