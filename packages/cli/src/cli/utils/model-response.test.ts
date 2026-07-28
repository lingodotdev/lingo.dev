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

  it("treats a plain object without a data field as translation data", () => {
    const input = JSON.stringify({ hello: "hallo" });
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

  it("throws a clear error when valid JSON is an assistant message envelope", () => {
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

// Models break JSON around a quoted ICU placeholder in two ways: they leave the
// quotes unescaped (jsonrepair: `Unexpected character "{"`) or they drop the
// value's opening quote (jsonrepair: `Colon expected`). German is the worst hit:
// its word order moves the placeholder to the front of the sentence ("„{title}"
// anhängen?" vs "Attach '{title}'?"), so the quote ends up next to the brace.
describe("extractLocalizedData — placeholder quoting damage", () => {
  /** Wraps a raw (deliberately malformed) `data` literal in the response envelope. */
  const envelope = (rawData: string) =>
    `{"sourceLocale":"en","targetLocale":"de","data":${rawData}}`;

  it("repairs a value that starts with a straight-quoted placeholder", () => {
    const input = envelope(
      `{"confirm_title":""{title}" anhängen?","attach":"Anhängen"}`,
    );
    expect(extractLocalizedData(input)).toEqual({
      confirm_title: '"{title}" anhängen?',
      attach: "Anhängen",
    });
  });

  it("repairs a German low quote closed with a straight quote", () => {
    const input = envelope(
      `{"confirm_title":"„{title}" anhängen?","attach":"Anhängen"}`,
    );
    expect(extractLocalizedData(input)).toEqual({
      confirm_title: '„{title}" anhängen?',
      attach: "Anhängen",
    });
  });

  it("repairs stray quotes in the middle of a value", () => {
    const input = envelope(
      `{"confirm_title":"Anhängen: "{title}"?","attach":"Anhängen"}`,
    );
    expect(extractLocalizedData(input)).toEqual({
      confirm_title: 'Anhängen: "{title}"?',
      attach: "Anhängen",
    });
  });

  it("repairs the flat-key payload from the field report", () => {
    const input = `{"sourceLocale":"en","targetLocale":"de","data":{"MeetingNotes/calendar_context/participants_heading":"Teilnehmer","MeetingNotes/auto_attach/confirm_title":""{title}" anhängen?","MeetingNotes/auto_attach/attach":"Anhängen"}}`;
    expect(extractLocalizedData(input)).toEqual({
      "MeetingNotes/calendar_context/participants_heading": "Teilnehmer",
      "MeetingNotes/auto_attach/confirm_title": '"{title}" anhängen?',
      "MeetingNotes/auto_attach/attach": "Anhängen",
    });
  });

  it("repairs a value whose opening quote is missing (Colon expected)", () => {
    // jsonrepair reads `{title}` as an object, parses `title` as a key and then
    // finds no colon — this is the "Colon expected at position N" report.
    const input = envelope(
      `{"confirm_title":{title}" anhängen?","attach":"Anhängen"}`,
    );
    expect(extractLocalizedData(input)).toEqual({
      confirm_title: '{title}" anhängen?',
      attach: "Anhängen",
    });
  });

  it("ignores a placeholder mentioned in a conversational preamble", () => {
    // Slicing from the first `{` would start the JSON at the prose placeholder.
    const input = `Hier ist die Übersetzung für {title}:\n${envelope(`{"attach":"Anhängen"}`)}`;
    expect(extractLocalizedData(input)).toEqual({ attach: "Anhängen" });
  });

  it("keeps a real nested object value intact", () => {
    // Guards the placeholder heuristic against genuine objects after a colon.
    const input = `{"sourceLocale":"en","targetLocale":"de","data":{"nested":{"attach":"Anhängen"},},}`;
    expect(extractLocalizedData(input)).toEqual({
      nested: { attach: "Anhängen" },
    });
  });

  it("keeps a colon-and-placeholder inside a value intact", () => {
    // `Zeit: {time}` must not be mistaken for an unquoted placeholder value.
    const input = envelope(`{"when":"Zeit: {time}","t":""{title}" anhängen?"}`);
    expect(extractLocalizedData(input)).toEqual({
      when: "Zeit: {time}",
      t: '"{title}" anhängen?',
    });
  });

  it("repairs stray quotes inside a stringified data payload", () => {
    const input = `{"data":"{\\"data\\":{\\"confirm_title\\":\\"\\"{title}\\" anhängen?\\"}}"}`;
    expect(extractLocalizedData(input)).toEqual({
      confirm_title: '"{title}" anhängen?',
    });
  });

  it("keeps a legitimately empty string empty", () => {
    const input = `{"sourceLocale":"en","targetLocale":"de","data":{"blank":"","attach":"Anhängen"}}`;
    expect(extractLocalizedData(input)).toEqual({
      blank: "",
      attach: "Anhängen",
    });
  });
});
