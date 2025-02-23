import fs from "fs";
import path from "path";
import { glob } from "glob";
import _ from "lodash";
import { LocaleCode, resolveLocaleCode } from "@lingo.dev/_spec";

export default function findLocaleFiles(bucket: string) {
  switch (bucket) {
    case "json":
      return findLocaleFilesWithExtension(".json");
    case "yaml":
      return findLocaleFilesWithExtension(".yml");
    case "flutter":
      return findLocaleFilesWithExtension(".arb");
    case "android":
      return findLocaleFilesWithExtension(".xml");
    case "markdown":
      return findLocaleFilesWithExtension(".md");
    case "php":
      return findLocaleFilesWithExtension(".php");
    case "xcode-xcstrings":
      return findLocaleFilesForFilename("Localizable.xcstrings");
    case "xcode-strings":
      return findLocaleFilesForFilename("Localizable.strings");
    case "xcode-stringsdict":
      return findLocaleFilesForFilename("Localizable.stringsdict");
    default:
      throw new Error(`Unsupported bucket type: ${bucket}`);
  }
}

function findLocaleFilesWithExtension(ext: string) {
  const files = glob.sync(`**/*${ext}`, {
    ignore: ["node_modules/**", "package*.json", "i18n.json", "lingo.json"],
  });

  const localeFilePattern = new RegExp(`\/([a-z]{2}(-[A-Z]{2})?)${ext}$`);
  const localeDirectoryPattern = new RegExp(`\/([a-z]{2}(-[A-Z]{2})?)\/[^\/]+${ext}$`);
  const potentialLocaleFiles = files.filter(
    (file: string) => localeFilePattern.test(file) || localeDirectoryPattern.test(file),
  );

  const potantialLocaleFilesAndPatterns = potentialLocaleFiles
    .map((file: string) => {
      const matchPotentialLocales = Array.from(
        file.matchAll(new RegExp(`\/([a-z]{2}(-[A-Z]{2})?|[^\/]+)(?=\/|${ext})`, "g")),
      );
      const potantialLocales = matchPotentialLocales.map((match) => match[1]);
      return { file, potantialLocales };
    })
    .map(({ file, potantialLocales }) => {
      for (const locale of potantialLocales) {
        try {
          resolveLocaleCode(locale as LocaleCode);
          return { locale, file };
        } catch (e) {}
      }
      return { file, locale: null };
    })
    .filter(({ locale }) => locale !== null);

  const localeFilesAndPatterns = potantialLocaleFilesAndPatterns.map(({ file, locale }) => {
    const pattern = file
      .replaceAll(new RegExp(`/${locale}${ext}`, "g"), `/[locale]${ext}`)
      .replaceAll(new RegExp(`/${locale}/`, "g"), `/[locale]/`)
      .replaceAll(new RegExp(`/${locale}/`, "g"), `/[locale]/`); // for when there are 2 locales one after another
    return { pattern, file };
  });

  const grouppedFilesAndPatterns = _.groupBy(localeFilesAndPatterns, "pattern");
  const patterns = Object.keys(grouppedFilesAndPatterns);

  if (patterns.length > 0) {
    return { found: true, patterns };
  }

  return { found: false, patterns: [`i18n/[locale]${ext}`] };
}

function findLocaleFilesForFilename(fileName: string) {
  const pattern = fileName;
  const localeFiles = glob.sync(`**/${fileName}`, {
    ignore: ["node_modules/**", "package*.json", "i18n.json", "lingo.json"],
  });

  const localeFilesAndPatterns = localeFiles.map((file: string) => ({
    file,
    pattern: path.join(path.dirname(file), pattern),
  }));
  const grouppedFilesAndPatterns = _.groupBy(localeFilesAndPatterns, "pattern");
  const patterns = Object.keys(grouppedFilesAndPatterns);

  if (patterns.length > 0) {
    return { found: true, patterns };
  }

  return { found: false, patterns: [fileName] };
}
