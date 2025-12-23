import { describe, it, expect } from "vitest";
import { pseudolocalize } from "./index";

describe("pseudolocalize", () => {
  it("should pseudolocalize plain text", () => {
    const result = pseudolocalize("Hello World");
    // Not match because we add extra spaces for layout testing purposes.
    expect(result).toContain("Ĥéĺĺó Ŵóŕĺḍ");
  });

  it("should preserve variable placeholders", () => {
    const result = pseudolocalize("Hello {name}");
    expect(result).toContain("{name}"); // Variable should be preserved
    expect(result).toContain("Ĥéĺĺó"); // Text should be pseudolocalized
  });

  it("should preserve multiple variable placeholders", () => {
    const result = pseudolocalize("Hello {name}, you have {count} messages");
    expect(result).toContain("{name}");
    expect(result).toContain("{count}");
    expect(result).toContain("Ĥéĺĺó");
    expect(result).toContain("ṁéśśáĝéś");
  });

  it("should preserve component tags", () => {
    const result = pseudolocalize("Click <a0>here</a0>");
    expect(result).toContain("<a0>");
    expect(result).toContain("</a0>");
    expect(result).toContain("Çĺíçḳ");
    expect(result).toContain("ĥéŕé");
  });

  it("should preserve multiple component tags", () => {
    const result = pseudolocalize("Click <a0>here</a0> or <a1>there</a1>");
    expect(result).toContain("<a0>");
    expect(result).toContain("</a0>");
    expect(result).toContain("<a1>");
    expect(result).toContain("</a1>");
    expect(result).toContain("Çĺíçḳ");
    expect(result).toContain("ĥéŕé");
    expect(result).toContain("ţĥéŕé");
  });

  it("should preserve mixed placeholders and tags", () => {
    const result = pseudolocalize(
      "Hello {name}, you have <strong0>{count}</strong0> messages",
    );
    expect(result).toContain("{name}");
    expect(result).toContain("{count}");
    expect(result).toContain("<strong0>");
    expect(result).toContain("</strong0>");
    expect(result).toContain("Ĥéĺĺó");
    expect(result).toContain("ṁéśśáĝéś");
  });

  it("should return whitespace unchanged", () => {
    expect(pseudolocalize("   ")).toBe("   ");
    expect(pseudolocalize("\n")).toBe("\n");
  });
});
