/**
 * Tests for ICU MessageFormat validator
 */

import { describe, it, expect } from "vitest";
import { validateICU } from "./icu-validator";
import { logger } from "../../utils/logger";

describe("validateICU", () => {
  it("should validate correct ICU plural format", () => {
    const icu = "You have {count, plural, one {# item} other {# items}}";

    const result = validateICU(icu, icu, logger);

    expect(result).toBe(true);
  });

  it("should validate ICU with zero case", () => {
    const icu =
      "You have {count, plural, =0 {no items} one {# item} other {# items}}";

    const result = validateICU(icu, icu, logger);

    expect(result).toBe(true);
  });

  it("should allow missing 'one' form (not required by ICU spec)", () => {
    // Note: ICU MessageFormat spec only requires 'other' clause
    // 'one' is optional but recommended
    const icu = "You have {count, plural, other {# items}}";

    const result = validateICU(icu, icu, logger);

    // Should be valid - 'one' is not strictly required
    expect(result).toBe(true);
  });

  it("should detect missing 'other' form (required by spec)", () => {
    const icu = "You have {count, plural, one {# item}}";

    const result = validateICU(icu, icu, logger);

    // Should fail - 'other' is required by ICU spec
    expect(result).toBe(false);
  });

  it("should detect unbalanced braces", () => {
    const icu = "You have {count, plural, one {# item} other {# items}";

    const result = validateICU(icu, icu, logger);

    expect(result).toBe(false);
  });

  it("should accept plain text (valid ICU MessageFormat)", () => {
    // Plain text is valid ICU MessageFormat - no interpolation needed
    const icu = "You have 5 items";

    const result = validateICU(icu, icu, logger);

    // Should be valid - plain text is valid ICU
    expect(result).toBe(true);
  });

  it("should validate complex nested ICU format", () => {
    const icu =
      "{count, plural, =0 {No items} one {You have # item in {category}} other {You have # items in {category}}}";

    const result = validateICU(icu, icu, logger);

    expect(result).toBe(true);
  });

  it("should validate ICU with multiple plural categories", () => {
    const icu =
      "{count, plural, =0 {zero} =1 {one exactly} one {one} few {few} many {many} other {other}}";

    const result = validateICU(icu, icu, logger);

    expect(result).toBe(true);
  });

  it("should handle ICU with text before and after", () => {
    const icu =
      "You have {count, plural, one {# item} other {# items}} in your cart.";

    const result = validateICU(icu, icu, logger);

    expect(result).toBe(true);
  });

  it("should validate ICU with different variable names", () => {
    const icu =
      "{fileCount, plural, one {# file} other {# files}} uploaded successfully";

    const result = validateICU(icu, icu, logger);

    expect(result).toBe(true);
  });
});
