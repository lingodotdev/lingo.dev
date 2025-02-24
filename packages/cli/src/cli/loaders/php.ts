import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import { fromString } from "php-array-reader";

export default function createPhpLoader(): ILoader<string, Record<string, any>> {
  return createLoader({
    pull: async (locale, input) => {
      try {
        const output = fromString(input);
        return output;
      } catch (error) {
        throw new Error(`Error parsing PHP file for locale ${locale}`);
      }
    },
    push: async (locale, data, originalInput) => {
      const output = toPhpString(data, originalInput);
      return output;
    },
  });
}

function toPhpString(data: Record<string, any>, originalPhpString: string | null) {
  const defaultFilePrefix = "<?php\n\n";
  if (originalPhpString) {
    const [filePrefix = defaultFilePrefix] = originalPhpString.split("return ");
    const shortArraySyntax = !originalPhpString.includes("array(");
    const output = `${filePrefix}return ${toPhpArray(data, shortArraySyntax)};`;
    return output;
  }
  return `${defaultFilePrefix}return ${toPhpArray(data)};`;
}

function toPhpArray(data: any, shortSyntax = true, indentLevel = 1): string {
  if (data === null || data === undefined) {
    return "null";
  }
  if (typeof data === "string") {
    return `'${escapePhpString(data)}'`;
  }
  if (typeof data === "number") {
    return data.toString();
  }
  if (typeof data === "boolean") {
    return data ? "true" : "false";
  }

  const arrayStart = shortSyntax ? "[" : "array(";
  const arrayEnd = shortSyntax ? "]" : ")";

  if (Array.isArray(data)) {
    return `${arrayStart}\n${data
      .map((value) => `${indent(indentLevel)}${toPhpArray(value, shortSyntax, indentLevel + 1)}`)
      .join(",\n")}\n${indent(indentLevel - 1)}${arrayEnd}`;
  }

  const output = `${arrayStart}\n${Object.entries(data)
    .map(([key, value]) => `${indent(indentLevel)}'${key}' => ${toPhpArray(value, shortSyntax, indentLevel + 1)}`)
    .join(",\n")}\n${indent(indentLevel - 1)}${arrayEnd}`;
  return output;
}

function indent(level: number) {
  return "  ".repeat(level);
}

function escapePhpString(str: string) {
  return str
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")
    .replaceAll("\r", "\\r")
    .replaceAll("\n", "\\n")
    .replaceAll("\t", "\\t");
}
