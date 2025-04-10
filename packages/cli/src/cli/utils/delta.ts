import z from "zod";
import { tryReadFile } from "./fs";
import { MD5 } from "object-hash";
import _ from "lodash";

const LockfileSchema = z.object({
  version: z.literal(1).default(1),
  checksums: z
    .record(
      z.string(), // localizable files' keys
      // checksums hashmap
      z
        .record(
          // key
          z.string(),
          // checksum of the key's value in the source locale
          z.string(),
        )
        .default({}),
    )
    .default({}),
});

const DeltaSchema = z.object({
  // Keys present in source object but missing in target object
  added: z.array(z.string()),
  // Keys present in target object but missing in source object
  removed: z.array(z.string()),
  // Keys present in both objects where the source value's checksum differs from what's recorded in the lockfile
  updated: z.array(z.string()),
  // Pair of [oldKey, newKey] when a key appears to be renamed (same value checksum but different key)
  renamed: z.tuple([z.string(), z.string()]),
});

export function createDeltaProcessor(lockfilePath: string, fileKey: string) {
  const lockfileContent = tryReadFile(lockfilePath, null);
  const lockfileData = lockfileContent ? LockfileSchema.parse(lockfileContent) : null;
  const fileKeyHash = MD5(fileKey);
  const lockfileFileData = lockfileData?.checksums[fileKeyHash] || {};

  return {
    async calculateDelta(sourceData: Record<string, any>, targetData: Record<string, any>) {
      let added = _.difference(Object.keys(sourceData), Object.keys(targetData));
      let removed = _.difference(Object.keys(targetData), Object.keys(sourceData));

      // Find renamed keys - keys that exist in both but with different names (same content)
      const renamed: [string, string][] = [];
      for (const addedKey of added) {
        const addedHash = MD5(sourceData[addedKey]);
        for (const removedKey of removed) {
          if (MD5(targetData[removedKey]) === addedHash) {
            renamed.push([removedKey, addedKey]);
            break;
          }
        }
      }
      // Remove renamed keys from added and removed arrays
      added = added.filter((key) => !renamed.some(([oldKey, newKey]) => oldKey === key));
      removed = removed.filter((key) => !renamed.some(([oldKey, newKey]) => newKey === key));

      // Find updated keys - keys for which the checksum of the source value differs from what's recorded in the lockfile
      const updated = added.filter((key) => MD5(sourceData[key]) !== lockfileFileData[key]);

      return {
        added,
        removed,
        updated,
        renamed,
      };
    },
  };
}
