import { describe, it, expect } from "vitest";
import dedent from "dedent";
import createXliffLoader from "./xliff";

function normalize(xml: string) {
  return xml.trim().replace(/\r?\n/g, "\n");
}

describe("XLIFF loader", () => {
  it("round-trips a simple file without changes", async () => {
    const input = dedent`<?xml version="1.0" encoding="utf-8"?>
    <xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
      <file original="demo" source-language="en" target-language="en" datatype="plaintext">
        <body>
          <trans-unit id="hello" resname="hello">
            <source>Hello</source>
            <target state="translated">Hello</target>
          </trans-unit>
        </body>
      </file>
    </xliff>`;

    const loader = createXliffLoader();
    loader.setDefaultLocale("en");

    const data = await loader.pull("en", input);
    expect(data).toEqual({ hello: "Hello" });

    // push back identical payload
    const output = await loader.push("en", data);
    expect(normalize(output)).toBe(normalize(input));
  });

  it("handles duplicate resnames deterministically", async () => {
    const input = dedent`<?xml version="1.0" encoding="utf-8"?>
    <xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
      <file original="dup" source-language="en" target-language="en" datatype="plaintext">
        <body>
          <trans-unit id="a" resname="dup_key"><source>A</source><target>A</target></trans-unit>
          <trans-unit id="b" resname="dup_key"><source>B</source><target>B</target></trans-unit>
        </body>
      </file>
    </xliff>`;

    const loader = createXliffLoader();
    loader.setDefaultLocale("en");
    const pulled = await loader.pull("en", input);
    expect(pulled).toEqual({
      dup_key: "A",
      "dup_key#b": "B",
    });

    // translate and push
    const esPayload = {
      dup_key: "AA",
      "dup_key#b": "BB",
    } as const;

    const esXml = await loader.push("es", esPayload);

    // Pull from Spanish to verify the values were set correctly
    const loaderEs = createXliffLoader();
    loaderEs.setDefaultLocale("en");
    await loaderEs.pull("en", input); // pull original first
    const pullEs = await loaderEs.pull("es", esXml);

    // Should get the translated values, not the original
    expect(pullEs).toEqual({
      dup_key: "AA",
      "dup_key#b": "BB",
    });
  });

  it("wraps XML-sensitive target in CDATA", async () => {
    const input = dedent`<?xml version="1.0" encoding="utf-8"?>
    <xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
      <file original="cdata" source-language="en" target-language="en" datatype="plaintext">
        <body>
          <trans-unit id="expr" resname="expr"><source>5 &lt; 7</source><target>5 &lt; 7</target></trans-unit>
        </body>
      </file>
    </xliff>`;

    const loader = createXliffLoader();
    loader.setDefaultLocale("en");
    await loader.pull("en", input);

    const out = await loader.push("es", { expr: "5 < 7 & 8 > 3" });

    expect(out.includes("<![CDATA[5 < 7 & 8 > 3]]>")).toBe(true);
  });

  it("creates skeleton for missing locale", async () => {
    const loader = createXliffLoader();
    loader.setDefaultLocale("en");

    // pulling default locale from scratch (empty)
    await loader.pull("en", "");

    const payload = { key1: "Valor" };
    const esXml = await loader.push("es", payload);

    // Ensure skeleton contains our translated value
    expect(esXml.includes("Valor")).toBe(true);
    expect(esXml.includes('target-language="es"'));
  });
});
