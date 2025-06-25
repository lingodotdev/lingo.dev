import { describe, it, expect, vi } from "vitest";
import { getBuckets } from "./buckets";
import { glob, Path } from "glob";

vi.mock("glob", () => ({
  glob: {
    sync: vi.fn(),
  },
}));

describe("getBuckets", () => {
  const makeI18nConfig = (include: any[]) => ({
    $schema: "https://lingo.dev/schema/i18n.json",
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
    mockGlobSync(["src/i18n/en.json"], ["src/translations/en/messages.json"]);

    const i18nConfig = makeI18nConfig([
      "src/i18n/[locale].json",
      "src/translations/[locale]/messages.json",
    ]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          { pathPattern: "src/i18n/[locale].json", delimiter: null },
          {
            pathPattern: "src/translations/[locale]/messages.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("should return correct buckets for paths with asterisk", () => {
    mockGlobSync(
      [
        "src/translations/landing.en.json",
        "src/translations/app.en.json",
        "src/translations/email.en.json",
      ],
      [
        "src/locale/landing/messages.en.json",
        "src/locale/app/data.en.json",
        "src/locale/email/custom.en.json",
      ],
      [
        "src/i18n/landing/en.messages.json",
        "src/i18n/app/en.data.json",
        "src/i18n/email/en.custom.json",
      ],
      [
        "src/i18n/data-landing-en-strings/en.messages.json",
        "src/i18n/data-app-en-strings/en.data.json",
        "src/i18n/data-email-en-strings/en.custom.json",
      ],
    );

    const i18nConfig = makeI18nConfig([
      "src/translations/*.[locale].json",
      "src/locale/*/*.[locale].json",
      "src/i18n/*/[locale].*.json",
      "src/i18n/data-*-[locale]-*/[locale].*.json",
    ]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "src/translations/landing.[locale].json",
            delimiter: null,
          },
          {
            pathPattern: "src/translations/app.[locale].json",
            delimiter: null,
          },
          {
            pathPattern: "src/translations/email.[locale].json",
            delimiter: null,
          },
          {
            pathPattern: "src/locale/landing/messages.[locale].json",
            delimiter: null,
          },
          { pathPattern: "src/locale/app/data.[locale].json", delimiter: null },
          {
            pathPattern: "src/locale/email/custom.[locale].json",
            delimiter: null,
          },
          {
            pathPattern: "src/i18n/landing/[locale].messages.json",
            delimiter: null,
          },
          { pathPattern: "src/i18n/app/[locale].data.json", delimiter: null },
          {
            pathPattern: "src/i18n/email/[locale].custom.json",
            delimiter: null,
          },
          {
            pathPattern:
              "src/i18n/data-landing-[locale]-strings/[locale].messages.json",
            delimiter: null,
          },
          {
            pathPattern:
              "src/i18n/data-app-[locale]-strings/[locale].data.json",
            delimiter: null,
          },
          {
            pathPattern:
              "src/i18n/data-email-[locale]-strings/[locale].custom.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("should return correct bucket with delimiter", () => {
    mockGlobSync(["src/i18n/en.json"]);
    const i18nConfig = makeI18nConfig([
      { path: "src/i18n/[locale].json", delimiter: "-" },
    ]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        paths: [{ pathPattern: "src/i18n/[locale].json", delimiter: "-" }],
      },
    ]);
  });

  it("should return bucket with multiple locale placeholders", () => {
    mockGlobSync(
      ["src/i18n/en/en.json"],
      ["src/en/translations/en/messages.json"],
    );
    const i18nConfig = makeI18nConfig([
      "src/i18n/[locale]/[locale].json",
      "src/[locale]/translations/[locale]/messages.json",
    ]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          { pathPattern: "src/i18n/[locale]/[locale].json", delimiter: null },
          {
            pathPattern: "src/[locale]/translations/[locale]/messages.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });
});

function mockGlobSync(...args: string[][]) {
  args.forEach((files) => {
    vi.mocked(glob.sync).mockReturnValueOnce(
      files.map(
        (file) => ({ isFile: () => true, fullpath: () => file }) as Path,
      ),
    );
  });
}
