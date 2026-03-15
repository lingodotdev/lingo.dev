import { describe, it, expect } from "vitest";
import { parseModelResponse } from "./explicit";

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
