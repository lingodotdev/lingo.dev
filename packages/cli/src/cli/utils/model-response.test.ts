import { describe, it, expect } from "vitest";
import { parseModelResponse, extractLocalizedData } from "./model-response";

describe("parseModelResponse", () => {
  it("parses clean JSON", () => {
    const input = JSON.stringify({ data: { hello: "hola" } });
    expect(parseModelResponse(input)).toEqual({ data: { hello: "hola" } });
  });

  it("strips 'OK' prefix (Gemini-style filler)", () => {
    const input = `OK${JSON.stringify({ data: { hello: "hola" } })}`;
    expect(parseModelResponse(input)).toEqual({ data: { hello: "hola" } });
  });

  it("strips arbitrary conversational preamble", () => {
    const input = `Sure, here is your translation:\n${JSON.stringify({ data: { hello: "hola" } })}`;
    expect(parseModelResponse(input)).toEqual({ data: { hello: "hola" } });
  });

  it("strips trailing text after closing brace", () => {
    const input = `${JSON.stringify({ data: { hello: "hola" } })}\nDone!`;
    expect(parseModelResponse(input)).toEqual({ data: { hello: "hola" } });
  });

  it("repairs mildly malformed JSON", () => {
    // Trailing comma — invalid JSON but jsonrepair handles it
    const input = `{"data": {"hello": "hola",}}`;
    expect(parseModelResponse(input)).toEqual({ data: { hello: "hola" } });
  });
});

describe("extractLocalizedData", () => {
  it("returns the data object from a clean envelope", () => {
    const input = JSON.stringify({
      sourceLocale: "en",
      targetLocale: "de",
      data: { hello: "hallo" },
    });
    expect(extractLocalizedData(input)).toEqual({ hello: "hallo" });
  });

  it("repairs an envelope with a missing colon", () => {
    // Raw JSON.parse fails with "Expected ':' after property name in JSON"
    const input = `{"sourceLocale": "en", "targetLocale": "de", "data" {"hello": "hallo"}}`;
    expect(extractLocalizedData(input)).toEqual({ hello: "hallo" });
  });

  it("repairs an envelope with a missing comma", () => {
    // Raw JSON.parse fails with "Expected ',' or '}' after property value in JSON"
    const input = `{"sourceLocale": "en" "targetLocale": "de", "data": {"hello": "hallo"}}`;
    expect(extractLocalizedData(input)).toEqual({ hello: "hallo" });
  });

  it("extracts data from a stringified data payload", () => {
    const input = JSON.stringify({
      data: JSON.stringify({ data: { hello: "hallo" } }),
    });
    expect(extractLocalizedData(input)).toEqual({ hello: "hallo" });
  });

  it("throws a clear error when valid JSON has no data object", () => {
    // e.g. the model wraps its answer in a role/content envelope
    const input = JSON.stringify({
      role: "assistant",
      content: { data: { hello: "hallo" } },
    });
    expect(() => extractLocalizedData(input)).toThrow(
      /without translation data/,
    );
  });

  it("throws a clear error when the response is not JSON at all", () => {
    expect(() => extractLocalizedData("I cannot translate this.")).toThrow(
      /not valid JSON|without translation data/,
    );
  });
});
