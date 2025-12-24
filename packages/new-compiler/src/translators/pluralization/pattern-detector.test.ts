import { describe, expect, it } from "vitest";
import { detectPluralCandidates } from "./pattern-detector";
import { logger } from "../../utils/logger";

describe("detectPluralCandidates", () => {
  it("should detect messages with expressions", () => {
    const entries = {
      hash1: "You have {count} items",
      // Though it's tempting to count this as a non plural message, I have a feeling that on some languages the word before the number could be pluralized too (at least in rtl languages)
      hash2: "Hello {name}",
      hash3: "{itemNumber} of {totalItems}",
      hash4: "Hello {name{",
    };

    const candidates = detectPluralCandidates(entries, logger);

    expect(candidates).toHaveLength(3);
  });

  it("should skip empty expressions", () => {
    const entries = {
      hash1: "Hello {}",
    };

    const candidates = detectPluralCandidates(entries, logger);

    expect(candidates).toHaveLength(0);
  });

  it.todo("should skip escaped expressions", () => {});
});
