import _ from "lodash";
import z from "zod";
import { md5 } from "./md5";
import { tryReadFile, writeFile, checkIfFileExists } from "../utils/fs";
import * as path from "path";
import YAML from "yaml";

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
    async checkIfLockExists() {
      return checkIfFileExists(lockfilePath);
    },
    async calculateDelta(params: {
      sourceData: Record<string, any>;
      targetData: Record<string, any>;
      checksums: Record<string, string>;
    }) {
      let added = _.difference(Object.keys(params.sourceData), Object.keys(params.targetData));
      let removed = _.difference(Object.keys(params.targetData), Object.keys(params.sourceData));
      const updated = _.filter(Object.keys(params.sourceData), (key) => {
        return md5(params.sourceData[key]) !== params.checksums[key] && params.checksums[key];
      });

      const renamed: [string, string][] = [];
      for (const addedKey of added) {
        const addedHash = md5(params.sourceData[addedKey]);
        for (const removedKey of removed) {
          if (params.checksums[removedKey] === addedHash) {
            renamed.push([removedKey, addedKey]);
            break;
          }
        }
      }
      added = added.filter((key) => !renamed.some(([oldKey, newKey]) => newKey === key));
      removed = removed.filter((key) => !renamed.some(([oldKey, newKey]) => oldKey === key));

      const hasChanges = [added.length > 0, removed.length > 0, updated.length > 0, renamed.length > 0].some((v) => v);

      return {
        added,
        removed,
        updated,
        renamed,
        hasChanges,
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
    async saveLock(lockData: LockData) {
      const lockfileYaml = YAML.stringify(lockData);
      writeFile(lockfilePath, lockfileYaml);
    },
    async loadChecksums() {
      const id = md5(fileKey);
      const lockfileData = await this.loadLock();
      return lockfileData.checksums[id] || {};
    },
    async saveChecksums(checksums: Record<string, string>) {
      const id = md5(fileKey);
      const lockfileData = await this.loadLock();
      lockfileData.checksums[id] = checksums;
      await this.saveLock(lockfileData);
    },
    async createChecksums(sourceData: Record<string, any>) {
      const checksums = _.mapValues(sourceData, (value) => md5(value));
      return checksums;
    },
  };
}
