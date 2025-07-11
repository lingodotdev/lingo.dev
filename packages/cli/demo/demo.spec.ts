import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { bucketTypes, parseI18nConfig } from "@lingo.dev/_spec";


describe("packages/cli/demo", () => {
  it("should include a demo for each bucket type", () => {
    const demoRoot = path.resolve(__dirname);
    const missingBuckets: string[] = [];

    for (const bucketType of new Set(bucketTypes)) {
      const bucketPath = path.join(demoRoot, bucketType);
      const exists = fs.existsSync(bucketPath);
      if (!exists) {
        missingBuckets.push(bucketType);
      }
    }

    expect(missingBuckets).toEqual([]);
  });

  it("should have an i18n.json file in each bucket demo", () => {
    const demoRoot = path.resolve(__dirname);
    const missingFiles: string[] = [];

    for (const bucketType of new Set(bucketTypes)) {
      const bucketPath = path.join(demoRoot, bucketType);
      const i18nJsonPath = path.join(bucketPath, "i18n.json");
      if (!fs.existsSync(i18nJsonPath)) {
        missingFiles.push(bucketType);
      }
    }

    expect(missingFiles).toEqual([]);
  });

  it("should have valid i18n.json config in each bucket demo", () => {
    const demoRoot = path.resolve(__dirname);
    const invalidConfigs: Array<{ bucketType: string; error: string }> = [];

    for (const bucketType of new Set(bucketTypes)) {
      const bucketPath = path.join(demoRoot, bucketType);
      const i18nJsonPath = path.join(bucketPath, "i18n.json");
      try {
        const configContent = fs.readFileSync(i18nJsonPath, "utf-8");
        const rawConfig = JSON.parse(configContent);
        parseI18nConfig(rawConfig);
      } catch (error) {
        invalidConfigs.push({
          bucketType,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    expect(invalidConfigs).toEqual([]);
  });

  it("should have an i18n.lock file in each bucket demo", () => {
    const demoRoot = path.resolve(__dirname);
    const missingFiles: string[] = [];

    for (const bucketType of new Set(bucketTypes)) {
      const bucketPath = path.join(demoRoot, bucketType);
      const i18nLockPath = path.join(bucketPath, "i18n.lock");
      if (!fs.existsSync(i18nLockPath)) {
        missingFiles.push(bucketType);
      }
    }

    expect(missingFiles).toEqual([]);
  });
});
