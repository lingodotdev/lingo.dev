import fs from "fs";
import path from "path";
import Z from "zod";
import YAML from "yaml";
import { MD5 } from "object-hash";
import _ from "lodash";

export function createLockfileHelper() {
  return {
    isLockfileExists: () => {
      const lockfilePath = _getLockfilePath();
      return fs.existsSync(lockfilePath);
    },
    registerSourceData: (
      pathPattern: string,
      sourceData: Record<string, any>,
    ) => {
      const lockfile = _loadLockfile();

      const sectionKey = MD5(pathPattern);
      const sectionChecksums = _.mapValues(sourceData, (value) => MD5(value));

      lockfile.checksums[sectionKey] = sectionChecksums;

      _saveLockfile(lockfile);
    },
    registerPartialSourceData: (
      pathPattern: string,
      partialSourceData: Record<string, any>,
    ) => {
      const lockfile = _loadLockfile();

      const sectionKey = MD5(pathPattern);
      const sectionChecksums = _.mapValues(partialSourceData, (value) =>
        MD5(value),
      );

      lockfile.checksums[sectionKey] = _.merge(
        {},
        lockfile.checksums[sectionKey] ?? {},
        sectionChecksums,
      );

      _saveLockfile(lockfile);
    },
    extractUpdatedData: (
      pathPattern: string,
      sourceData: Record<string, any>,
    ) => {
      const lockfile = _loadLockfile();

      const sectionKey = MD5(pathPattern);
      const currentChecksums = _.mapValues(sourceData, (value) => MD5(value));

      const savedChecksums = lockfile.checksums[sectionKey] || {};
      const updatedData = _.pickBy(
        sourceData,
        (value, key) => savedChecksums[key] !== currentChecksums[key],
      );

      return updatedData;
    },
  };

  function _loadLockfile() {
    const lockfilePath = _getLockfilePath();
    if (!fs.existsSync(lockfilePath)) {
      return LockfileSchema.parse({});
    }
    const content = fs.readFileSync(lockfilePath, "utf-8");

    const { deduplicatedContent, duplicatesRemoved } = deduplicateLockfileYaml(content);

    if (duplicatesRemoved > 0) {
      fs.writeFileSync(lockfilePath, deduplicatedContent);
      console.log(
        `Removed ${duplicatesRemoved} duplicate ${duplicatesRemoved === 1 ? "entry" : "entries"} from i18n.lock`,
      );
    }

    const parsed = LockfileSchema.parse(YAML.parse(deduplicatedContent));
    return parsed;
  }

  function _saveLockfile(lockfile: Z.infer<typeof LockfileSchema>) {
    const lockfilePath = _getLockfilePath();
    const content = YAML.stringify(lockfile);
    fs.writeFileSync(lockfilePath, content);
  }

  function _getLockfilePath() {
    return path.join(process.cwd(), "i18n.lock");
  }
}

const LockfileSchema = Z.object({
  version: Z.literal(1).prefault(1),
  checksums: Z.record(
    Z.string(), // localizable files' keys
    Z.record(
      // checksums hashmap
      Z.string(), // key
      Z.string(), // checksum of the key's value in the source locale
    ).prefault({}),
  ).prefault({}),
});

export function deduplicateLockfileYaml(yamlContent: string): {
  deduplicatedContent: string;
  duplicatesRemoved: number;
} {
  // Parse using parseDocument to access the raw YAML structure
  const doc = YAML.parseDocument(yamlContent);
  let duplicatesRemoved = 0;

  // Remove duplicate keys from the YAML document structure
  if (doc.contents && YAML.isMap(doc.contents)) {
    const checksums = doc.contents.get('checksums');
    if (checksums && YAML.isMap(checksums)) {
      // Iterate through each path pattern hash
      for (const pathItem of checksums.items) {
        if (YAML.isMap(pathItem.value)) {
          // Track key positions - last occurrence wins
          const keyPositions = new Map<string, number[]>();

          // First pass: collect all positions for each key
          for (let i = 0; i < pathItem.value.items.length; i++) {
            const translationItem = pathItem.value.items[i];
            const key = String(YAML.isScalar(translationItem.key) ? translationItem.key.value : translationItem.key);

            if (!keyPositions.has(key)) {
              keyPositions.set(key, []);
            }
            keyPositions.get(key)!.push(i);
          }

          // Second pass: identify duplicates to remove (all but the last occurrence)
          const indicesToRemove: number[] = [];
          for (const positions of keyPositions.values()) {
            if (positions.length > 1) {
              // Keep the last occurrence, remove all earlier ones
              indicesToRemove.push(...positions.slice(0, -1));
              duplicatesRemoved += positions.length - 1;
            }
          }

          // Remove items in reverse order to maintain correct indices
          indicesToRemove.sort((a, b) => b - a);
          for (const index of indicesToRemove) {
            pathItem.value.items.splice(index, 1);
          }
        }
      }
    }
  }

  // Convert to JavaScript object (which is now clean)
  const cleanedData = doc.toJSON();
  // Create a new document from the cleaned data
  const cleanDoc = new YAML.Document(cleanedData);
  const deduplicatedContent = cleanDoc.toString();

  return {
    deduplicatedContent,
    duplicatesRemoved,
  };
}
