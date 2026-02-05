import { describe, it, expect } from "vitest";
import { deduplicateLockfileYaml } from "./lockfile";
import YAML from "yaml";

describe("deduplicateLockfileYaml", () => {
  it("should return unchanged content when there are no duplicates", () => {
    const yamlContent = `version: 1
checksums:
  pathHash1:
    key1: checksum1
    key2: checksum2
  pathHash2:
    key3: checksum3
    key4: checksum4
`;

    const result = deduplicateLockfileYaml(yamlContent);

    expect(result.duplicatesRemoved).toBe(0);

    // Parse both to compare structure
    const originalParsed = YAML.parse(yamlContent);
    const resultParsed = YAML.parse(result.deduplicatedContent);
    expect(resultParsed).toEqual(originalParsed);
  });

  it("should remove duplicate keys within a path pattern", () => {
    // Create YAML with actual duplicate keys (not possible in JS object literals)
    const yamlContent = `version: 1
checksums:
  pathHash1:
    key1: checksum1
    key2: checksum2
    key1: checksum1_duplicate
`;

    const result = deduplicateLockfileYaml(yamlContent);

    expect(result.duplicatesRemoved).toBe(1);

    const parsed = YAML.parse(result.deduplicatedContent);
    // Last occurrence should win
    expect(parsed.checksums.pathHash1.key1).toBe("checksum1_duplicate");
    expect(parsed.checksums.pathHash1.key2).toBe("checksum2");
    expect(Object.keys(parsed.checksums.pathHash1)).toHaveLength(2);
  });

  it("should handle conflicting duplicates (same key, different checksums) and keep last occurrence", () => {
    const yamlContent = `version: 1
checksums:
  pathHash1:
    key1: checksum1
    key2: checksum2
    key1: checksum_updated
    key2: checksum2_updated
`;

    const result = deduplicateLockfileYaml(yamlContent);

    expect(result.duplicatesRemoved).toBe(2);

    const parsed = YAML.parse(result.deduplicatedContent);
    // The last occurrences should win
    expect(parsed.checksums.pathHash1.key1).toBe("checksum_updated");
    expect(parsed.checksums.pathHash1.key2).toBe("checksum2_updated");
    expect(Object.keys(parsed.checksums.pathHash1)).toHaveLength(2);
  });

  it("should handle multiple duplicates of the same key", () => {
    const yamlContent = `version: 1
checksums:
  pathHash1:
    key1: checksum1
    key1: checksum2
    key1: checksum3
    key1: checksum_final
    key2: checksum_other
`;

    const result = deduplicateLockfileYaml(yamlContent);

    expect(result.duplicatesRemoved).toBe(3); // 4 occurrences - 1 = 3 duplicates removed

    const parsed = YAML.parse(result.deduplicatedContent);
    expect(parsed.checksums.pathHash1.key1).toBe("checksum_final");
    expect(parsed.checksums.pathHash1.key2).toBe("checksum_other");
    expect(Object.keys(parsed.checksums.pathHash1)).toHaveLength(2);
  });

  it("should deduplicate across multiple path patterns independently", () => {
    const yamlContent = `version: 1
checksums:
  pathHash1:
    key1: checksum1
    key2: checksum2
    key1: checksum1_duplicate
  pathHash2:
    key1: checksumA
    key3: checksumB
    key1: checksumA_duplicate
`;

    const result = deduplicateLockfileYaml(yamlContent);

    expect(result.duplicatesRemoved).toBe(2); // One duplicate in each path pattern

    const parsed = YAML.parse(result.deduplicatedContent);
    expect(parsed.checksums.pathHash1.key1).toBe("checksum1_duplicate");
    expect(parsed.checksums.pathHash2.key1).toBe("checksumA_duplicate");
  });

  it("should preserve same key names across different path patterns (no cross-block deduplication)", () => {
    const yamlContent = `version: 1
checksums:
  pathHash1:
    greeting: checksum1
    button: checksum2
  pathHash2:
    greeting: checksum3
    button: checksum4
`;

    const result = deduplicateLockfileYaml(yamlContent);

    expect(result.duplicatesRemoved).toBe(0);

    const parsed = YAML.parse(result.deduplicatedContent);
    expect(parsed.checksums.pathHash1.greeting).toBe("checksum1");
    expect(parsed.checksums.pathHash1.button).toBe("checksum2");
    expect(parsed.checksums.pathHash2.greeting).toBe("checksum3");
    expect(parsed.checksums.pathHash2.button).toBe("checksum4");
    expect(Object.keys(parsed.checksums.pathHash1)).toHaveLength(2);
    expect(Object.keys(parsed.checksums.pathHash2)).toHaveLength(2);
  });

  it("should handle empty lockfile", () => {
    const yamlContent = `version: 1
checksums: {}
`;

    const result = deduplicateLockfileYaml(yamlContent);

    expect(result.duplicatesRemoved).toBe(0);

    const parsed = YAML.parse(result.deduplicatedContent);
    expect(parsed.checksums).toEqual({});
  });

  it("should handle path pattern with empty checksums", () => {
    const yamlContent = `version: 1
checksums:
  pathHash1: {}
  pathHash2:
    key1: checksum1
`;

    const result = deduplicateLockfileYaml(yamlContent);

    expect(result.duplicatesRemoved).toBe(0);

    const parsed = YAML.parse(result.deduplicatedContent);
    expect(parsed.checksums.pathHash1).toEqual({});
    expect(parsed.checksums.pathHash2.key1).toBe("checksum1");
  });

  it("should be idempotent (running multiple times produces same result)", () => {
    const yamlContent = `version: 1
checksums:
  pathHash1:
    key1: checksum1
    key2: checksum2
    key1: checksum1_duplicate
`;

    const result1 = deduplicateLockfileYaml(yamlContent);
    const result2 = deduplicateLockfileYaml(result1.deduplicatedContent);
    const result3 = deduplicateLockfileYaml(result2.deduplicatedContent);

    expect(result1.duplicatesRemoved).toBe(1);
    expect(result2.duplicatesRemoved).toBe(0);
    expect(result3.duplicatesRemoved).toBe(0);

    const parsed1 = YAML.parse(result1.deduplicatedContent);
    const parsed2 = YAML.parse(result2.deduplicatedContent);
    const parsed3 = YAML.parse(result3.deduplicatedContent);

    expect(parsed1).toEqual(parsed2);
    expect(parsed2).toEqual(parsed3);
  });

  it("should correctly count duplicates removed across multiple patterns", () => {
    const yamlContent = `version: 1
checksums:
  pathHash1:
    key1: checksum1
    key2: checksum2
    key1: checksum1_dup
    key3: checksum3
    key2: checksum2_dup
  pathHash2:
    keyA: checksumA
    keyB: checksumB
    keyA: checksumA_dup
`;

    const result = deduplicateLockfileYaml(yamlContent);

    // pathHash1 has 2 duplicates (key1, key2), pathHash2 has 1 duplicate (keyA)
    expect(result.duplicatesRemoved).toBe(3);
  });

  it("should preserve version field", () => {
    const yamlContent = `version: 1
checksums:
  pathHash1:
    key1: checksum1
`;

    const result = deduplicateLockfileYaml(yamlContent);

    expect(result.duplicatesRemoved).toBe(0);

    const parsed = YAML.parse(result.deduplicatedContent);
    expect(parsed.version).toBe(1);
  });

  it("should handle many keys in a single path pattern", () => {
    const keys = Array.from({ length: 100 }, (_, i) => `    key${i}: checksum${i}`).join('\n');
    const yamlContent = `version: 1
checksums:
  pathHash1:
${keys}
`;

    const result = deduplicateLockfileYaml(yamlContent);

    expect(result.duplicatesRemoved).toBe(0);

    const parsed = YAML.parse(result.deduplicatedContent);
    expect(Object.keys(parsed.checksums.pathHash1)).toHaveLength(100);
  });

  it("should handle Git merge conflict scenario", () => {
    // Simulates what might happen after a git merge with conflicts in i18n.lock
    const yamlContent = `version: 1
checksums:
  pathHash1:
    greeting.hello: abc123
    greeting.goodbye: def456
    greeting.hello: xyz789
    button.submit: ghi012
    button.submit: jkl345
    button.cancel: mno678
`;

    const result = deduplicateLockfileYaml(yamlContent);

    expect(result.duplicatesRemoved).toBe(2); // greeting.hello and button.submit duplicates

    const parsed = YAML.parse(result.deduplicatedContent);
    expect(parsed.checksums.pathHash1["greeting.hello"]).toBe("xyz789");
    expect(parsed.checksums.pathHash1["greeting.goodbye"]).toBe("def456");
    expect(parsed.checksums.pathHash1["button.submit"]).toBe("jkl345");
    expect(parsed.checksums.pathHash1["button.cancel"]).toBe("mno678");
    expect(Object.keys(parsed.checksums.pathHash1)).toHaveLength(4);
  });
});
