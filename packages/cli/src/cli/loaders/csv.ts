import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import _ from "lodash";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export default function createCsvLoader(): ILoader<
  string,
  Record<string, string>
> {
  return createLoader({
    async pull(locale, _input) {
      const input = parse(_input, {
        columns: true,
        skip_empty_lines: true,
      });

      const result: Record<string, string> = {};

      _.forEach(input, (row) => {
        const key = row.id;
        if (key && row[locale] && row[locale].trim() !== "") {
          result[key] = row[locale];
        }
      });

      return result;
    },
    async push(locale, data, originalInput) {
      const input = parse(originalInput || "", {
        columns: true,
        skip_empty_lines: true,
      }) as Record<string, any>[];

      const columns = input.length > 0 ? Object.keys(input[0]) : ["id", locale];
      if (!columns.includes(locale)) {
        columns.push(locale);
      }

      const updatedRows = input.map((row) => ({
        ...row,
        [locale]: data[row.id] || row[locale] || "",
      }));
      const existingKeys = new Set(input.map((row) => row.id));

      Object.entries(data).forEach(([key, value]) => {
        if (!existingKeys.has(key)) {
          const newRow: Record<string, string> = {
            id: key,
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
