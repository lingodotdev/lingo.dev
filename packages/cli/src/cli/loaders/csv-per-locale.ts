import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

function dedupeHeaders(headers: string[]) {
  const seen = new Map<string, number>();

  return headers.map((h) => {
    const count = seen.get(h) ?? 0;
    seen.set(h, count + 1);
    return count === 0 ? h : `${h}__${count + 1}`;
  });
}

export default function createCsvPerLocaleLoader(): ILoader<
  string,
  Record<string, any>
> {
  return createLoader({
    async pull(_locale, input) {
      if (!input?.trim()) return {};


      const parsed = parse(input, {
        skip_empty_lines: true,
        columns: (headers: string[]) => {
          const dedupedHeaders = dedupeHeaders(headers);
          return dedupedHeaders;
        },
      }) as Array<Record<string, any>>;

      if (parsed.length === 0) return {};

      return parsed;
    },
    async push(_locale, data, originalInput) {

      const rawRows = parse(originalInput || "", {
        skip_empty_lines: true,
      }) as string[][];

      const originalHeaders = rawRows[0];

      const dedupedHeaders = dedupeHeaders(originalHeaders);

      const columns = originalHeaders.map((header, i) => ({
        key: dedupedHeaders[i],
        header,
      }));

      const rows = Object.values(data).filter(
        (row) =>
          row &&
          Object.values(row).some(
            (v) => v !== undefined && v !== null,
          ),
      );
      // const output = stringify(rows, { header: true }).trimEnd();
      const output = stringify(rows, {
        header: true,
        columns,
      }).trimEnd();

      return output;
    },
  });
}
