import { describe, it, expect } from "vitest";
import createVariableLoader, { VariableLoaderParams } from "./index";

describe("createVariableLoader", () => {
  describe("ieee format", () => {
    it("extracts variables during pull", async () => {
      const loader = createLoader("ieee");
      const input = {
        simple: "Hello %s!",
        multiple: "Value: %d and %f",
        complex: "Precision %.2f with position %1$d",
      };

      const result = await loader.pull("en", input);
      expect(result).toEqual({
        simple: "Hello {variable:0}!",
        multiple: "Value: {variable:0} and {variable:1}",
        complex: "Precision {variable:0} with position {variable:1}",
      });
    });

    it("restores variables during push", async () => {
      const loader = createLoader("ieee");
      const input = {
        simple: "Hello %s!",
        multiple: "Value: %d and %f",
        complex: "Precision %.2f with position %1$d",
      };

      const payload = {
        simple: "[updated] Hello {variable:0}!",
        multiple: "[updated] Value: {variable:0} and {variable:1}",
        complex: "[updated] Precision {variable:0} with position {variable:1}",
      };

      await loader.pull("en", input);
      const result = await loader.push("en", payload);

      expect(result).toEqual({
        simple: "[updated] Hello %s!",
        multiple: "[updated] Value: %d and %f",
        complex: "[updated] Precision %.2f with position %1$d",
      });
    });

    it("handles empty input", async () => {
      const loader = createLoader("ieee");
      const result = await loader.pull("en", {});
      expect(result).toEqual({});
    });

    it("preserves variable order for target locale during push", async () => {
      const loader = createLoader("ieee");

      const sourceInput = {
        message: "Value: %d and %f",
      };

      // Pull the default (source) locale first
      await loader.pull("en", sourceInput);

      // Target locale has variables in different order due to linguistic specifics
      const targetInput = {
        message: "Wert: %f und %d",
      };

      // Pull the target locale to capture its variable ordering
      await loader.pull("de", targetInput);

      // Translator updates the string while keeping placeholders
      const payload = {
        message: "[aktualisiert] Wert: {variable:1} und {variable:0}",
      };

      // Push the updated translation back
      const result = await loader.push("de", payload);

      expect(result).toEqual({
        message: "[aktualisiert] Wert: %f und %d",
      });
    });

    it("extracts variables with positional specifiers during pull", async () => {
      const loader = createLoader("ieee");
      const input = {
        message: "You have %2$d new items and %1$s.",
      };

      const result = await loader.pull("en", input);
      expect(result).toEqual({
        message: "You have {variable:0} new items and {variable:1}.",
      });
    });

    it("restores variables with positional specifiers during push", async () => {
      const loader = createLoader("ieee");
      const input = {
        message: "You have %2$d new items and %1$s.",
      };

      const payload = {
        message: "[updated] You have {variable:0} new items and {variable:1}.",
      };

      await loader.pull("en", input);
      const result = await loader.push("en", payload);

      expect(result).toEqual({
        message: "[updated] You have %2$d new items and %1$s.",
      });
    });
  });

  describe("python format", () => {
    it("extracts python variables during pull", async () => {
      const loader = createLoader("python");
      const input = {
        simple: "Hello %(name)s!",
        multiple: "Value: %(num)d and %(float)f",
      };

      const result = await loader.pull("en", input);
      expect(result).toEqual({
        simple: "Hello {variable:0}!",
        multiple: "Value: {variable:0} and {variable:1}",
      });
    });

    it("restores python variables during push", async () => {
      const loader = createLoader("python");
      const input = {
        simple: "Hello %(name)s!",
        multiple: "Value: %(num)d and %(float)f",
      };

      const payload = {
        simple: "[updated] Hello {variable:0}!",
        multiple: "[updated] Value: {variable:0} and {variable:1}",
      };

      await loader.pull("en", input);
      const result = await loader.push("en", input);
      expect(result).toEqual({
        simple: "Hello %(name)s!",
        multiple: "Value: %(num)d and %(float)f",
      });
    });

    it("preserves variable order for target locale during push", async () => {
      const loader = createLoader("python");

      const sourceInput = {
        message: "Hello %(name)s, you have %(count)d items.",
      };

      // Pull default locale first
      await loader.pull("en", sourceInput);

      // Target locale with reversed variable order
      const targetInput = {
        message: "Du hast %(count)d Artikel, %(name)s.",
      };
      await loader.pull("de", targetInput);

      const payload = {
        message: "[aktualisiert] Du hast {variable:1} Artikel, {variable:0}.",
      };

      const result = await loader.push("de", payload);

      expect(result).toEqual({
        message: "[aktualisiert] Du hast %(count)d Artikel, %(name)s.",
      });
    });
  });

  it("throws error for unsupported format type", () => {
    expect(() => {
      // @ts-expect-error Testing invalid type
      createVariableLoader({ type: "invalid" });
    }).toThrow("Unsupported variable format type: invalid");
  });
});

function createLoader(type: VariableLoaderParams["type"]) {
  return createVariableLoader({ type }).setDefaultLocale("en");
}
