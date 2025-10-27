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
import createMarkdocLoader from "./markdoc";
import createPropertiesLoader from "./properties";
import createXcodeStringsLoader from "./xcode-strings";
import createXcodeStringsdictLoader from "./xcode-stringsdict";
import createXcodeXcstringsLoader from "./xcode-xcstrings";
import createXcodeXcstringsV2Loader from "./xcode-xcstrings-v2-loader";
import { isICUPluralObject } from "./xcode-xcstrings-icu";
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

export type BucketLoaderContext = {
  bucketPathPattern: string;
  options: BucketLoaderOptions;
  lockedKeys?: string[];
  lockedPatterns?: string[];
  ignoredKeys?: string[];
};

export type Bucket = {
  displayName: string;
  supportsFormatter: boolean;
  supportsInjectLocale: boolean;
  supportsLockedKeys: boolean;
  supportsIgnoredKeys: boolean;
  supportsLockedPatterns: boolean;
  supportsLocalePlaceholder: boolean;
  createLoader: (
    ctx: BucketLoaderContext,
  ) => ILoader<void, Record<string, any>>;
};

export const BUCKETS: Record<string, Bucket> = {
  android: {
    displayName: "Android XML",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createAndroidLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  csv: {
    displayName: "CSV",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: false,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createCsvLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  html: {
    displayName: "HTML",
    supportsFormatter: true,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createFormatterLoader(
          ctx.options.formatter,
          "html",
          ctx.bucketPathPattern,
        ),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createHtmlLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  ejs: {
    displayName: "EJS",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createEjsLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  json: {
    displayName: "JSON",
    supportsFormatter: true,
    supportsInjectLocale: true,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createFormatterLoader(
          ctx.options.formatter,
          "json",
          ctx.bucketPathPattern,
        ),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createJsonLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(ctx.options.injectLocale),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  json5: {
    displayName: "JSON5",
    supportsFormatter: false,
    supportsInjectLocale: true,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createJson5Loader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(ctx.options.injectLocale),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  jsonc: {
    displayName: "JSONC",
    supportsFormatter: false,
    supportsInjectLocale: true,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createJsoncLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(ctx.options.injectLocale),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  markdown: {
    displayName: "Markdown",
    supportsFormatter: true,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createFormatterLoader(
          ctx.options.formatter,
          "markdown",
          ctx.bucketPathPattern,
        ),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createMarkdownLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  markdoc: {
    displayName: "Markdoc",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createMarkdocLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  mdx: {
    displayName: "MDX",
    supportsFormatter: true,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createFormatterLoader(
          ctx.options.formatter,
          "mdx",
          ctx.bucketPathPattern,
        ),
        createMdxCodePlaceholderLoader(),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createMdxFrontmatterSplitLoader(),
        createMdxSectionsSplit2Loader(),
        createLocalizableMdxDocumentLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  po: {
    displayName: "PO",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createPoLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createVariableLoader({ type: "python" }),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  properties: {
    displayName: "Properties",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createPropertiesLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  "xcode-strings": {
    displayName: "Xcode Strings",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createXcodeStringsLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  "xcode-stringsdict": {
    displayName: "Xcode Stringsdict",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createXcodeStringsdictLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  "xcode-xcstrings": {
    displayName: "Xcode XCStrings",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: false,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createPlutilJsonTextLoader(),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createJsonLoader(),
        createXcodeXcstringsLoader(ctx.options.defaultLocale),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createVariableLoader({ type: "ieee" }),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  "xcode-xcstrings-v2": {
    displayName: "Xcode XCStrings (v2)",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: false,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createPlutilJsonTextLoader(),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createJsonLoader(),
        createXcodeXcstringsLoader(ctx.options.defaultLocale),
        createXcodeXcstringsV2Loader(ctx.options.defaultLocale),
        createFlatLoader({ shouldPreserveObject: isICUPluralObject }),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createVariableLoader({ type: "ieee" }),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  yaml: {
    displayName: "YAML",
    supportsFormatter: true,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createFormatterLoader(
          ctx.options.formatter,
          "yaml",
          ctx.bucketPathPattern,
        ),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createYamlLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  "yaml-root-key": {
    displayName: "YAML Root Key",
    supportsFormatter: true,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: false,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createFormatterLoader(
          ctx.options.formatter,
          "yaml",
          ctx.bucketPathPattern,
        ),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createYamlLoader(),
        createRootKeyLoader(true),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  flutter: {
    displayName: "Flutter ARB",
    supportsFormatter: true,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createFormatterLoader(
          ctx.options.formatter,
          "json",
          ctx.bucketPathPattern,
        ),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createJsonLoader(),
        createEnsureKeyOrderLoader(),
        createFlutterLoader(),
        createFlatLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  xliff: {
    displayName: "XLIFF",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createXliffLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  xml: {
    displayName: "XML",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createXmlLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  srt: {
    displayName: "SRT",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createSrtLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  dato: {
    displayName: "DatoCMS",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: false,
    supportsLocalePlaceholder: false,
    createLoader: (ctx) =>
      composeLoaders(
        createDatoLoader(ctx.bucketPathPattern),
        createSyncLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  vtt: {
    displayName: "WebVTT",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createVttLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  php: {
    displayName: "PHP",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createPhpLoader(),
        createSyncLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  "vue-json": {
    displayName: "Vue I18n",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: false,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createVueJsonLoader(),
        createSyncLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  typescript: {
    displayName: "TypeScript",
    supportsFormatter: true,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createFormatterLoader(
          ctx.options.formatter,
          "typescript",
          ctx.bucketPathPattern,
        ),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createTypescriptLoader(),
        createFlatLoader(),
        createEnsureKeyOrderLoader(),
        createSyncLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  txt: {
    displayName: "Plain text",
    supportsFormatter: false,
    supportsInjectLocale: false,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: true,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createTxtLoader(),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
  "json-dictionary": {
    displayName: "JSON Dictionary",
    supportsFormatter: true,
    supportsInjectLocale: true,
    supportsLockedKeys: true,
    supportsIgnoredKeys: true,
    supportsLockedPatterns: true,
    supportsLocalePlaceholder: false,
    createLoader: (ctx) =>
      composeLoaders(
        createTextFileLoader(ctx.bucketPathPattern),
        createFormatterLoader(
          ctx.options.formatter,
          "json",
          ctx.bucketPathPattern,
        ),
        createLockedPatternsLoader(ctx.lockedPatterns),
        createJsonLoader(),
        createJsonKeysLoader(),
        createEnsureKeyOrderLoader(),
        createFlatLoader(),
        createInjectLocaleLoader(ctx.options.injectLocale),
        createLockedKeysLoader(ctx.lockedKeys || []),
        createIgnoredKeysLoader(ctx.ignoredKeys || []),
        createSyncLoader(),
        createUnlocalizableLoader(ctx.options.returnUnlocalizedKeys),
      ),
  },
};

export function getBucket(bucketType: string): Bucket | undefined {
  return BUCKETS[bucketType];
}

export default function createBucketLoader(
  bucketType: Z.infer<typeof bucketTypeSchema>,
  bucketPathPattern: string,
  options: BucketLoaderOptions,
  lockedKeys?: string[],
  lockedPatterns?: string[],
  ignoredKeys?: string[],
): ILoader<void, Record<string, any>> {
  const bucket = BUCKETS[bucketType];
  if (!bucket) {
    throw new Error(`Unsupported bucket type: ${bucketType}`);
  }
  return bucket.createLoader({
    bucketPathPattern,
    options,
    lockedKeys,
    lockedPatterns,
    ignoredKeys,
  });
}
