import Z from "zod";
import jsdom from "jsdom";
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
import createAndroidLoader from "./android";
import createCsvLoader from "./csv";
import createHtmlLoader from "./html";
import createMarkdownLoader from "./markdown";
import createPropertiesLoader from "./properties";
import createXcodeStringsLoader from "./xcode-strings";
import createXcodeStringsdictLoader from "./xcode-stringsdict";
import createXcodeXcstringsLoader from "./xcode-xcstrings";
import createPrettierLoader from "./prettier";
import createUnlocalizableLoader from "./unlocalizable";
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
import createMdxLockedPatternsLoader from "./mdx2/locked-patterns";
import createIgnoredKeysLoader from "./ignored-keys";
import createEjsLoader from "./ejs";
import createEnsureKeyOrderLoader from "./ensure-key-order";
import createTxtLoader from "./txt";
import createJsonKeysLoader from "./json-dictionary";

type BucketLoaderOptions = {
  returnUnlocalizedKeys?: boolean;
  defaultLocale: string;
  injectLocale?: string[];
  targetLocale?: string;
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
    case "android":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createAndroidLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "csv":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createCsvLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "html":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "html", bucketPathPattern }),
        createHtmlLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "ejs":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createEjsLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "json":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "json", bucketPathPattern }),
        createJsonLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(options.injectLocale),
        createLockedKeysLoader(lockedKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "json5":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createJson5Loader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(options.injectLocale),
        createLockedKeysLoader(lockedKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "jsonc":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createJsoncLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(options.injectLocale),
        createLockedKeysLoader(lockedKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "markdown":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "markdown", bucketPathPattern }),
        createMarkdownLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "mdx":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({
          parser: "mdx",
          bucketPathPattern,
        }),
        createMdxCodePlaceholderLoader(),
        createMdxLockedPatternsLoader(lockedPatterns),
        createMdxFrontmatterSplitLoader(),
        createMdxSectionsSplit2Loader(),
        createLocalizableMdxDocumentLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "po":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPoLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createSyncLoader(),
        createVariableLoader({ type: "python" }),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "properties":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPropertiesLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "xcode-strings":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXcodeStringsLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "xcode-stringsdict":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXcodeStringsdictLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "xcode-xcstrings":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPlutilJsonTextLoader(),
        createJsonLoader(),
        createXcodeXcstringsLoader(options.defaultLocale),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createSyncLoader(),
        createVariableLoader({ type: "ieee" }),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "yaml":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "yaml", bucketPathPattern }),
        createYamlLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "yaml-root-key":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "yaml", bucketPathPattern }),
        createYamlLoader(),
        createRootKeyLoader(true),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "flutter":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "json", bucketPathPattern }),
        createJsonLoader(),
        createEnsureKeyOrderLoader(),
        createFlutterLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "xliff":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXliffLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "xml":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXmlLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "srt":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createSrtLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "dato":
      return composeLoaders(
        createDatoLoader(bucketPathPattern),
        createSyncLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "vtt":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createVttLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "php":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPhpLoader(),
        createSyncLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "vue-json":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createVueJsonLoader(),
        createSyncLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "typescript":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "typescript", bucketPathPattern }),
        createTypescriptLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createSyncLoader(),
        createLockedKeysLoader(lockedKeys || []),
        createIgnoredKeysLoader(ignoredKeys || []),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "txt":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createTxtLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
    case "json-dictionary":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "json", bucketPathPattern }),
        createJsonLoader(),
        createJsonKeysLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(options.injectLocale),
        createLockedKeysLoader(lockedKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(options.returnUnlocalizedKeys),
      );
  }
}
