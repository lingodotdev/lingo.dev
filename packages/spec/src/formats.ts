import Z from "zod";

export const bucketTypes = [
  "android",
  "csv",
  "ejs",
  "flutter",
  "html",
  "json",
  "markdown",
  "mdx",
  "xcode-strings",
  "xcode-stringsdict",
  "xcode-xcstrings",
  "yaml",
  "yaml-root-key",
  "properties",
  "po",
  "xliff",
  "xml",
  "srt",
  "dato",
  "compiler",
  "vtt",
  "php",
  "po",
  "vue-json",
  "typescript",
] as const;

export const bucketTypeSchema = Z.enum(bucketTypes);
