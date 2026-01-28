import { describe, it, expect } from "vitest";
import { jsonrepair } from "jsonrepair";

describe("JSON extraction from chatty LLM responses", () => {
  it("should extract JSON from response with OK prefix", () => {
    const response =
      'OK{"sourceLocale":"en","targetLocale":"es","data":{"key":"value"}}';

    // Simulate the fix logic
    let text = response;
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const result = JSON.parse(text);
    expect(result.data).toEqual({ key: "value" });
  });

  it("should extract JSON from response with conversational prefix", () => {
    const response =
      'Sure, here is the translation: {"sourceLocale":"en","targetLocale":"es","data":{"message":"Hola"}}';

    let text = response;
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const result = JSON.parse(text);
    expect(result.data).toEqual({ message: "Hola" });
  });

  it("should handle clean JSON without prefix", () => {
    const response =
      '{"sourceLocale":"en","targetLocale":"es","data":{"key":"value"}}';

    let text = response;
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const result = JSON.parse(text);
    expect(result.data).toEqual({ key: "value" });
  });

  it("should fallback to jsonrepair for malformed JSON", () => {
    const malformed =
      '{sourceLocale:"en",targetLocale:"es",data:{key:"value"}}';

    let parseFailed = false;
    let result;

    try {
      result = JSON.parse(malformed);
    } catch (e) {
      parseFailed = true;
      const repaired = jsonrepair(malformed);
      result = JSON.parse(repaired);
    }

    expect(parseFailed).toBe(true);
    expect(result.data).toEqual({ key: "value" });
  });

  it("should handle response with text after JSON", () => {
    const response =
      '{"sourceLocale":"en","targetLocale":"es","data":{"key":"value"}}\n\nLet me know if you need anything else!';

    let text = response;
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const result = JSON.parse(text);
    expect(result.data).toEqual({ key: "value" });
  });

  it("should handle multiline JSON response with conversational wrapper", () => {
    const response = `Here is the translation:

{
  "sourceLocale": "en",
  "targetLocale": "es",
  "data": {
    "message": "Hola"
  }
}

Let me know if you need more translations!`;

    let text = response;
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const result = JSON.parse(text);
    expect(result.data).toEqual({ message: "Hola" });
  });
});
