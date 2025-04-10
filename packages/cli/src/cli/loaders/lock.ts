import _ from "lodash";
import z from "zod";
import { MD5 } from "object-hash";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import { tryReadFile, writeFile } from "../utils/fs";
import * as path from "path";
import YAML from "yaml";

export default function createLockLoader(fileKey: string): ILoader<Record<string, any>, Record<string, any>> {
  return createLoader({
    async pull(locale, data) {
      return data;
    },
    async push(locale, data, originalInput, originalLocale) {
      return data;
    },
  });
}

const LockSchema = z.object({
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
export type LockData = z.infer<typeof LockSchema>;

export function createDeltaProcessor(fileKey: string) {
  const lockfilePath = path.join(process.cwd(), "i18n.lock");
  return {
    async calculateDelta(params: {
      sourceData: Record<string, any>;
      targetData: Record<string, any>;
      lockFileData: Record<string, string>;
    }) {
      let added = _.difference(Object.keys(params.sourceData), Object.keys(params.targetData));
      let removed = _.difference(Object.keys(params.targetData), Object.keys(params.sourceData));

      // Find renamed keys - keys that exist in both but with different names (same content)
      const renamed: [string, string][] = [];
      for (const addedKey of added) {
        const addedHash = MD5(params.sourceData[addedKey]);
        for (const removedKey of removed) {
          if (MD5(params.targetData[removedKey]) === addedHash) {
            renamed.push([removedKey, addedKey]);
            break;
          }
        }
      }
      // Remove renamed keys from added and removed arrays
      added = added.filter((key) => !renamed.some(([oldKey, newKey]) => oldKey === key));
      removed = removed.filter((key) => !renamed.some(([oldKey, newKey]) => newKey === key));

      // Find updated keys - keys for which the checksum of the source value differs from what's recorded in the lockfile
      const updated = _.differenceWith(Object.keys(params.sourceData), Object.keys(params.targetData), (key) => {
        return MD5(params.sourceData[key]) !== params.lockFileData[key];
      });

      return {
        added,
        removed,
        updated,
        renamed,
      };
    },
    async loadLock() {
      const lockfileContent = tryReadFile(lockfilePath, null);
      const lockfileYaml = lockfileContent ? YAML.parse(lockfileContent) : null;
      const lockfileData: z.infer<typeof LockSchema> = lockfileYaml
        ? LockSchema.parse(lockfileYaml)
        : {
            version: 1,
            checksums: {},
          };
      return lockfileData;
    },
    async saveLock(lockfileData: Record<string, any>) {
      const lockfileYaml = YAML.stringify(lockfileData);
      writeFile(lockfilePath, lockfileYaml);
    },
    async loadLockForFile() {
      const id = MD5(fileKey);
      const lockfileData = await this.loadLock();
      return lockfileData.checksums[id];
    },
    async saveLockForFile(checksums: Record<string, string>) {
      const id = MD5(fileKey);
      const lockfileData = await this.loadLock();
      lockfileData.checksums[id] = checksums;
      await this.saveLock(lockfileData);
    },
  };
}
