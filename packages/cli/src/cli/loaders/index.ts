import Z from "zod";
import jsdom from "jsdom";
import { bucketTypeSchema } from "@lingo.dev/_spec";
import { composeLoaders } from "./_utils";
import createJsonLoader from "./json";
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
import createInjectLocaleLoader from "./inject-locale";
import createLockedKeysLoader from "./locked-keys";
import createMdxFrontmatterSplitLoader from "./mdx2/frontmatter-split";
import createMdxCodePlaceholderLoader from "./mdx2/code-placeholder";
import createLocalizableMdxDocumentLoader from "./mdx2/localizable-document";
import createMdxSectionsSplit2Loader from "./mdx2/sections-split-2";
import createMdxLockedPatternsLoader from "./mdx2/locked-patterns";

type BucketLoaderOptions = {
  isCacheRestore: boolean;
  returnUnlocalizedKeys?: boolean;
  defaultLocale: string;
  injectLocale?: string[];
};

export default function createBucketLoader(
  bucketType: Z.infer<typeof bucketTypeSchema>,
  bucketPathPattern: string,
  options: BucketLoaderOptions,
  lockedKeys?: string[],
): ILoader<void, Record<string, string>> {
  switch (bucketType) {
    default:
      throw new Error(`Unsupported bucket type: ${bucketType}`);
    case "android":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createAndroidLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "csv":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createCsvLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "html":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "html", bucketPathPattern }),
        createHtmlLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "json":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "json", bucketPathPattern }),
        createJsonLoader(),
        createInjectLocaleLoader(options.injectLocale),
        createFlatLoader(),
        createLockedKeysLoader(lockedKeys || [], options.isCacheRestore),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "markdown":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "markdown", bucketPathPattern }),
        createMarkdownLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "mdx":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({
          parser: "mdx",
          bucketPathPattern,
        }),
        createMdxCodePlaceholderLoader(),
        createMdxLockedPatternsLoader(),
        createMdxFrontmatterSplitLoader(),
        createMdxSectionsSplit2Loader(),
        createLocalizableMdxDocumentLoader(),
        createFlatLoader(),
        createLockedKeysLoader(lockedKeys || [], options.isCacheRestore),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "po":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPoLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createVariableLoader({ type: "python" }),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "properties":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPropertiesLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "xcode-strings":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXcodeStringsLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "xcode-stringsdict":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXcodeStringsdictLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "xcode-xcstrings":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPlutilJsonTextLoader(),
        createJsonLoader(),
        createXcodeXcstringsLoader(options.defaultLocale),
        createFlatLoader(),
        createSyncLoader(),
        createVariableLoader({ type: "ieee" }),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "yaml":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "yaml", bucketPathPattern }),
        createYamlLoader(),
        createFlatLoader(),
        createLockedKeysLoader(lockedKeys || [], options.isCacheRestore),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "yaml-root-key":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "yaml", bucketPathPattern }),
        createYamlLoader(),
        createRootKeyLoader(true),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "flutter":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "json", bucketPathPattern }),
        createJsonLoader(),
        createFlutterLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "xliff":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXliffLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "xml":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXmlLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "srt":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createSrtLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "dato":
      return composeLoaders(
        createDatoLoader(bucketPathPattern),
        createSyncLoader(),
        createFlatLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "vtt":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createVttLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "php":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPhpLoader(),
        createSyncLoader(),
        createFlatLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
    case "vue-json":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createVueJsonLoader(),
        createSyncLoader(),
        createFlatLoader(),
        createUnlocalizableLoader(
          options.isCacheRestore,
          options.returnUnlocalizedKeys,
        ),
      );
  }
}
