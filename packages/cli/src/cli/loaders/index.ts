import Z from "zod";
import { bucketTypeSchema } from "@lingo.dev/_spec";
import { composeLoaders } from "./_utils";
import createJsonLoader from "./json";
import createJson5Loader from "./json5";
import createJsoncLoader from "./jsonc";
import createFlatLoader from "./flat";
import createTextFileLoader from "./text-file";
import createYamlLoader from "./yaml";
import createRootKeyLoader from "./root-key";
import createFlutterLoader from "./flutter";
import { ILoader } from "./_types";
import createAilLoader from "./ail";
import createAndroidLoader from "./android";
import createCsvLoader from "./csv";
import createHtmlLoader from "./html";
import createMarkdownLoader from "./markdown";
import createMarkdocLoader from "./markdoc";
import createMjmlLoader from "./mjml";
import createPropertiesLoader from "./properties";
import createXcodeStringsLoader from "./xcode-strings";
import createXcodeStringsdictLoader from "./xcode-stringsdict";
import createXcodeXcstringsLoader from "./xcode-xcstrings";
import createXcodeXcstringsV2Loader from "./xcode-xcstrings-v2";
import createUnlocalizableLoader from "./unlocalizable";
import { createFormatterLoader, FormatterType } from "./formatters";
import createPoLoader from "./po";
import createXliffLoader from "./xliff";
import createXmlLoader from "./xml";
import createSrtLoader from "./srt";
import createDatoLoader from "./dato";
import createVttLoader from "./vtt";
import createVariableLoader from "./variable";
import createSyncLoader from "./sync";
import createPlutilJsonTextLoader from "./plutil-json-loader";
import createPhpLoader from "./php";
import createVueJsonLoader from "./vue-json";
import createTypescriptLoader from "./typescript";
import createInjectLocaleLoader from "./inject-locale";
import createLockedKeysLoader from "./locked-keys";
import createMdxFrontmatterSplitLoader from "./mdx2/frontmatter-split";
import createMdxCodePlaceholderLoader from "./mdx2/code-placeholder";
import createLocalizableMdxDocumentLoader from "./mdx2/localizable-document";
import createMdxSectionsSplit2Loader from "./mdx2/sections-split-2";
import createLockedPatternsLoader from "./locked-patterns";
import createIgnoredKeysLoader from "./ignored-keys";
import createEjsLoader from "./ejs";
import createTwigLoader from "./twig";
import createEnsureKeyOrderLoader from "./ensure-key-order";
import createTxtLoader from "./txt";
import createJsonKeysLoader from "./json-dictionary";

type BucketLoaderOptions = {
  returnUnlocalizedKeys?: boolean;
  defaultLocale: string;
  injectLocale?: string[];
  targetLocale?: string;
  formatter?: FormatterType;
};

export default function createBucketLoader(
  bucketType: Z.infer<typeof bucketTypeSchema>,
  bucketPathPattern: string,
  options: BucketLoaderOptions,
  lockedKeys?: string[],
  lockedPatterns?: string[],
  ignoredKeys?: string[],
): ILoader<void, Record<string, any>> {
  switch (bucketType) {
    default:
      throw new Error(`Unsupported bucket type: ${bucketType}`);
    case "ail":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createAilLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "android":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createAndroidLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "csv":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createCsvLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "html":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createFormatterLoader(options.formatter, "html", bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createHtmlLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "ejs":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createEjsLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "json":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createFormatterLoader(options.formatter, "json", bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createJsonLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(options.injectLocale),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "json5":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createJson5Loader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(options.injectLocale),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "jsonc":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createJsoncLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(options.injectLocale),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "markdown":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createFormatterLoader(options.formatter, "markdown", bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createMarkdownLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "markdoc":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createMarkdocLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "mdx":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createFormatterLoader(options.formatter, "mdx", bucketPathPattern),
        createMdxCodePlaceholderLoader(),
        createLockedPatternsLoader(lockedPatterns),
        createMdxFrontmatterSplitLoader(),
        createMdxSectionsSplit2Loader(),
        createLocalizableMdxDocumentLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "mjml":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createFormatterLoader(options.formatter, "html", bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createMjmlLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "po":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createPoLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createVariableLoader({ type: "python" }),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "properties":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createPropertiesLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "xcode-strings":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createXcodeStringsLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "xcode-stringsdict":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createXcodeStringsdictLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "xcode-xcstrings":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPlutilJsonTextLoader(),
        createLockedPatternsLoader(lockedPatterns),
        createJsonLoader(),
        createXcodeXcstringsLoader(options.defaultLocale),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createVariableLoader({ type: "ieee" }),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "xcode-xcstrings-v2":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPlutilJsonTextLoader(),
        createLockedPatternsLoader(lockedPatterns),
        createJsonLoader(),
        createXcodeXcstringsV2Loader(options.defaultLocale),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createVariableLoader({ type: "ieee" }),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "yaml":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createFormatterLoader(options.formatter, "yaml", bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createYamlLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "yaml-root-key":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createFormatterLoader(options.formatter, "yaml", bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createYamlLoader(),
        createRootKeyLoader(true),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "flutter":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createFormatterLoader(options.formatter, "json", bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createJsonLoader(),
        createEnsureKeyOrderLoader(),
        createFlutterLoader(),
        createFlatLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "xliff":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createXliffLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "xml":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createXmlLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "srt":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createSrtLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "dato":
      return composeLoaders(
        createDatoLoader(bucketPathPattern),
        createSyncLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "vtt":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createVttLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "php":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createPhpLoader(),
        createSyncLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "vue-json":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createVueJsonLoader(),
        createSyncLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "typescript":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createFormatterLoader(
          options.formatter,
          "typescript",
          bucketPathPattern,
        ),
        createLockedPatternsLoader(lockedPatterns),
        createTypescriptLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createSyncLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "twig":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createTwigLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "txt":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createTxtLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "json-dictionary":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createFormatterLoader(options.formatter, "json", bucketPathPattern),
        createLockedPatternsLoader(lockedPatterns),
        createJsonLoader(),
        createJsonKeysLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(options.injectLocale),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
  }
}
