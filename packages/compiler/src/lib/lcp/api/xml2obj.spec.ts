import { describe, it, expect } from "vitest";
import { xml2obj, obj2xml } from "./xml2obj";

function normalize(xml: string) {
  return xml.replace(/\s+/g, " ").trim();
}

describe("xml2obj / obj2xml", () => {
  it("should convert simple XML to object with key attributes", () => {
    const xml = `
      <object>
        <object key="user">
          <value key="id">123</value>
          <value key="dataValue">abc</value>
          <value key="firstName">John</value>
          <value key="lastName">Doe</value>
        </object>
      </object>
    `;
    const obj = xml2obj(xml);
    expect(obj).toEqual({
      user: {
        id: 123,
        dataValue: "abc",
        firstName: "John",
        lastName: "Doe",
      },
    });
  });

  it("should preserve complex structures through round-trip conversion", () => {
    const original = {
      root: {
        id: 123,
        name: "John & Jane <> \" '",
        notes: "Line1\nLine2",
        isActive: true,
        tags: {
          tag: ["a & b", "c < d"],
        },
        nestedObj: {
          childId: 456,
          weirdSymbols: "@#$%^&*()_+",
        },
        items: {
          item: [
            { keyOne: "value1", keyTwo: "value2" },
            { keyOne: "value3", keyTwo: "value4" },
          ],
        },
      },
    } as const;

    const result = xml2obj(obj2xml(original));
    expect(result).toEqual(original);
  });

  it("should handle empty elements, arrays and self-closing tags", () => {
    const original = `
      <object>
        <value key="products" />
        <array key="prices">
          <value>1.99</value>
          <value>9.99</value>
        </array>
      </object>
    `;
    const expected = {
      products: "",
      prices: [1.99, 9.99],
    };
    expect(xml2obj(original)).toEqual(expected);
  });

  it("should correctly escape special characters when building XML", () => {
    const original = { message: "5 < 6 & 7 > 4" } as const;
    const result = xml2obj(obj2xml(original));
    expect(result).toEqual(original);
  });

  it("check 1", () => {
    const original = `<?xml version="1.0" encoding="UTF-8"?>
<object>
 <value key="version">0.1.1</value>
 <value key="locale">ja</value>
 <object key="files">
 <object key="routes/($locale).z.tsx">
 <object key="entries">
 <value key="1/declaration/body/3/argument">&lt;element:select&gt;&lt;element:option&gt;使用済み&lt;/element:option&gt;&lt;element:option&gt;合計&lt;/element:option&gt;&lt;/element:select&gt; 🚀 あなたの使用状況: {wordType} {subscription.words[wordType]}</value>
 </object>
 </object>
 </object>
</object>`;

    const result = xml2obj(original);
    expect(result).toEqual({
      version: "0.1.1",
      locale: "ja",
      files: {
        "routes/($locale).z.tsx": {
          entries: {
            "1/declaration/body/3/argument":
              "<element:select><element:option>使用済み</element:option><element:option>合計</element:option></element:select> 🚀 あなたの使用状況: {wordType} {subscription.words[wordType]}",
          },
        },
      },
    });
  });
});
