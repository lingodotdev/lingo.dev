import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBuckets } from "./buckets";
import { glob, Path } from "glob";

vi.mock("glob", () => ({
  glob: {
    sync: vi.fn(),
  },
}));

describe("getBuckets", () => {
  const makeI18nConfig = (include: any[], exclude?: any[]) => ({
    $schema: "https://lingo.dev/schema/i18n.json",
    version: 0,
    locale: {
      source: "en",
      targets: ["fr", "es"],
    },
    buckets: {
      json: {
        include,
        ...(exclude ? { exclude } : {}),
      },
    },
  });

  beforeEach(() => {
    vi.mocked(glob.sync).mockReset();
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

  it("expands single globstar in the middle of the path", () => {
    mockGlobSync(["src/a/i18n/en.json", "src/a/b/i18n/en.json"]);

    const i18nConfig = makeI18nConfig(["src/**/i18n/[locale].json"]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          { pathPattern: "src/a/i18n/[locale].json", delimiter: null },
          { pathPattern: "src/a/b/i18n/[locale].json", delimiter: null },
        ],
      },
    ]);
  });

  it("handles leading and trailing globstars", () => {
    mockGlobSync([
      "apps/web/en/i18n/messages.en.json",
      "packages/ui/en/locales/messages.en.json",
    ]);

    const i18nConfig = makeI18nConfig([
      "**/[locale]/**/messages.[locale].json",
    ]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "apps/web/[locale]/i18n/messages.[locale].json",
            delimiter: null,
          },
          {
            pathPattern: "packages/ui/[locale]/locales/messages.[locale].json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("aligns multiple globstars separated by fixed segments", () => {
    mockGlobSync(["src/a/i18n/en.json", "src/a/b/i18n/x/en.json"]);

    const i18nConfig = makeI18nConfig(["src/**/i18n/**/[locale].json"]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          { pathPattern: "src/a/i18n/[locale].json", delimiter: null },
          {
            pathPattern: "src/a/b/i18n/x/[locale].json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("supports mixed single and double wildcards", () => {
    mockGlobSync(["src/app/x/y/data-en-core.json"]);

    const i18nConfig = makeI18nConfig(["src/*/**/data-[locale]-*.json"]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "src/app/x/y/data-[locale]-core.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("collapses adjacent globstars", () => {
    mockGlobSync(["src/a/i18n/en.json"]);

    const i18nConfig = makeI18nConfig(["src/**/**/i18n/[locale].json"]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        paths: [{ pathPattern: "src/a/i18n/[locale].json", delimiter: null }],
      },
    ]);
  });

  it("applies globstar excludes", () => {
    mockGlobSync(
      ["src/a/i18n/en.json", "src/a/legacy/i18n/en.json"],
      ["src/a/legacy/i18n/en.json"],
    );

    const i18nConfig = makeI18nConfig(
      ["src/**/i18n/**/[locale].json"],
      ["src/**/legacy/**/[locale].json"],
    );
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        paths: [{ pathPattern: "src/a/i18n/[locale].json", delimiter: null }],
      },
    ]);
  });

  it("skips paths that cannot be re-projected", () => {
    mockGlobSync(["src/a/i18n/en.json", "src/invalid/en.json"]);

    const i18nConfig = makeI18nConfig(["src/**/i18n/[locale].json"]);
    const buckets = getBuckets(i18nConfig);
    expect(buckets).toEqual([
      {
        type: "json",
        paths: [{ pathPattern: "src/a/i18n/[locale].json", delimiter: null }],
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
