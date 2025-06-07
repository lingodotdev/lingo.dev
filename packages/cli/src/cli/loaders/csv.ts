import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import _ from "lodash";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createCsvLoader(): ILoader<
  string,
  Record<string, string>
> {
  let inputParsed: Record<string, any>[];
  let keyColumnName: string = "KEY";
  let detectedKeyColumnName: string | null = null;

  return createLoader({
    async pull(locale, input) {
      inputParsed = parse(input, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count_less: true,
      }) as Record<string, any>[];

      const result: Record<string, string> = {};

      /**
       * Tries to detect the key column name
       *
       * Current detect logics and orders:
       * + known preferred keys
       * + first non-empty cell
       */
      function _detectKeyColumnName() {
        if (detectedKeyColumnName) return detectedKeyColumnName;

        for (const key of ["KEY", "key"]) {
          if (inputParsed[0][key]) {
            // console.debug(`Detected key column name from preferred keys: ${key}`);
            return keyColumnName = detectedKeyColumnName = key;
          }
        }

        const firstContentfulRow = parse(input.split('\n').find(l => l.length)!)[0];
        const firstContentfulColumn = firstContentfulRow.find(Boolean)
        if (firstContentfulColumn) {
          // console.debug(`Detected key column name from first non-empty cell: ${firstContentfulColumn}`);
          return keyColumnName = detectedKeyColumnName = firstContentfulColumn;
        }
      }

      _.forEach(inputParsed, (row) => {
        const key = row[_detectKeyColumnName()];
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
