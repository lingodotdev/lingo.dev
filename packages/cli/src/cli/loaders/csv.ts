import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import _ from "lodash";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

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

export default function createCsvLoader(): ILoader<
  string,
  Record<string, string>
> {
  let inputParsed: Record<string, any>[];
  let keyColumnName: string = "KEY";

  return createLoader({
    async pull(locale, input) {
      inputParsed = parse(input, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count_less: true,
      }) as Record<string, any>[];

      keyColumnName = detectKeyColumnName(input.split('\n').find(l => l.length)!);

      const result: Record<string, string> = {};

      _.forEach(inputParsed, (row) => {
        const key = row[keyColumnName];
        if (key && row[locale] && row[locale].trim() !== "") {
          result[key] = row[locale];
        }
      });

      return result;
    },
    async push(locale, data) {
      const columns = inputParsed.length > 0 ? Object.keys(inputParsed[0]) : [keyColumnName, locale];
      if (!columns.includes(locale)) {
        columns.push(locale);
      }

      const updatedRows = inputParsed.map((row) => ({
        ...row,
        [locale]: data[row[keyColumnName]] || row[locale] || "",
      }));
      const existingKeys = new Set(inputParsed.map((row) => row[keyColumnName]));

      Object.entries(data).forEach(([key, value]) => {
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
