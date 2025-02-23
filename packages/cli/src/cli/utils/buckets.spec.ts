import { describe, it, expect, vi } from "vitest";
import { getBuckets } from "./buckets";

vi.mock("glob", () => ({
  sync: vi.fn().mockImplementation((path) => [{ isFile: () => true, fullpath: () => path }]),
}));

describe("getBuckets", () => {
  const makeI18nConfig = (include: any[]) => ({
    version: 0,
    locale: {
      source: "en",
      targets: ["fr", "es"],
    },
    buckets: {
      json: {
        include,
      },
    },
  });

  it("should return correct buckets", () => {
    const i18nConfig = makeI18nConfig(["src/i18n/[locale].json", "src/translations/[locale]/messages.json"]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        config: [
          { pathPattern: "src/i18n/[locale].json", delimiter: null },
          { pathPattern: "src/translations/[locale]/messages.json", delimiter: null },
        ],
      },
    ]);
  });

  it("should return correct bucket with delimiter", () => {
    const i18nConfig = makeI18nConfig([{ path: "src/i18n/[locale].json", delimiter: "-" }]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([{ type: "json", config: [{ pathPattern: "src/i18n/[locale].json", delimiter: "-" }] }]);
  });

  it("should return bucket with multiple locale placeholders", () => {
    const i18nConfig = makeI18nConfig([
      "src/i18n/[locale]/[locale].json",
      "src/[locale]/translations/[locale]/messages.json",
    ]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        config: [
          { pathPattern: "src/i18n/[locale]/[locale].json", delimiter: null },
          { pathPattern: "src/[locale]/translations/[locale]/messages.json", delimiter: null },
        ],
      },
    ]);
  });
});
