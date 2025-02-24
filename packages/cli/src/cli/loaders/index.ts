import Z from "zod";
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

type BucketLoaderOptions = {
  isCacheRestore?: boolean;
};

export default function createBucketLoader(
  bucketType: Z.infer<typeof bucketTypeSchema>,
  bucketPathPattern: string,
  { isCacheRestore = false }: BucketLoaderOptions = {},
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
        createUnlocalizableLoader(isCacheRestore),
      );
    case "csv":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createCsvLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "html":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "html", alwaysFormat: true }),
        createHtmlLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "json":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "json" }),
        createJsonLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "markdown":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "markdown" }),
        createMarkdownLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "po":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPoLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
        createVariableLoader({ type: "python" }),
      );
    case "properties":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPropertiesLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "xcode-strings":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXcodeStringsLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "xcode-stringsdict":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXcodeStringsdictLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "xcode-xcstrings":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPlutilJsonTextLoader(),
        createJsonLoader(),
        createXcodeXcstringsLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
        createVariableLoader({ type: "ieee" }),
      );
    case "yaml":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "yaml" }),
        createYamlLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "yaml-root-key":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "yaml" }),
        createYamlLoader(),
        createRootKeyLoader(true),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "flutter":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPrettierLoader({ parser: "json" }),
        createJsonLoader(),
        createFlutterLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "xliff":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXliffLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "xml":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createXmlLoader(),
        createFlatLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "srt":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createSrtLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "dato":
      return composeLoaders(
        createDatoLoader(bucketPathPattern),
        createSyncLoader(),
        createFlatLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "vtt":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createVttLoader(),
        createSyncLoader(),
        createUnlocalizableLoader(isCacheRestore),
      );
    case "php":
      return composeLoaders(
        createTextFileLoader(bucketPathPattern),
        createPhpLoader(),
        createSyncLoader(),
        createFlatLoader(),
        createUnlocalizableLoader(),
      );
  }
}
