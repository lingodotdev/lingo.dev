import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBuckets, parsePatternTemplate } from "./buckets";
import { glob, Path } from "glob";

vi.mock("glob", () => ({
  glob: {
    sync: vi.fn(),
  },
}));

describe("parsePatternTemplate", () => {
  it("captures globstars and placeholder segments", () => {
    expect(parsePatternTemplate("src/**/[locale]/**/messages.json")).toEqual([
      {
        kind: "segment",
        original: "src",
        parts: [{ kind: "literal", value: "src" }],
        hasPlaceholder: false,
        hasGlob: false,
      },
      { kind: "globstar", original: "**" },
      {
        kind: "segment",
        original: "[locale]",
        parts: [{ kind: "placeholder", name: "locale" }],
        hasPlaceholder: true,
        hasGlob: false,
      },
      { kind: "globstar", original: "**" },
      {
        kind: "segment",
        original: "messages.json",
        parts: [{ kind: "literal", value: "messages.json" }],
        hasPlaceholder: false,
        hasGlob: false,
      },
    ]);
  });

  it("identifies placeholders embedded within segments", () => {
    expect(parsePatternTemplate("src/messages.[locale].json")).toEqual([
      {
        kind: "segment",
        original: "src",
        parts: [{ kind: "literal", value: "src" }],
        hasPlaceholder: false,
        hasGlob: false,
      },
      {
        kind: "segment",
        original: "messages.[locale].json",
        parts: [
          { kind: "literal", value: "messages." },
          { kind: "placeholder", name: "locale" },
          { kind: "literal", value: ".json" },
        ],
        hasPlaceholder: true,
        hasGlob: false,
      },
    ]);
  });

  it("marks glob syntax distinct from placeholders", () => {
    expect(
      parsePatternTemplate("src/modules/@(core|marketing)-[locale].json"),
    ).toEqual([
      {
        kind: "segment",
        original: "src",
        parts: [{ kind: "literal", value: "src" }],
        hasPlaceholder: false,
        hasGlob: false,
      },
      {
        kind: "segment",
        original: "modules",
        parts: [{ kind: "literal", value: "modules" }],
        hasPlaceholder: false,
        hasGlob: false,
      },
      {
        kind: "segment",
        original: "@(core|marketing)-[locale].json",
        parts: [
          { kind: "glob", value: "@(core|marketing)-" },
          { kind: "placeholder", name: "locale" },
          { kind: "literal", value: ".json" },
        ],
        hasPlaceholder: true,
        hasGlob: true,
      },
    ]);
  });
});

describe("getBuckets", () => {
  beforeEach(() => {
    vi.mocked(glob.sync).mockReset();
  });

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

  it("restores locale placeholder when using recursive globstar patterns", () => {
    mockGlobSync([
      "src/modules/core/auth/en/strings/messages.json",
      "src/modules/marketing/en/strings/dashboard.json",
    ]);

    const i18nConfig = makeI18nConfig([
      "src/modules/**/[locale]/strings/*.json",
    ]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "src/modules/core/auth/[locale]/strings/messages.json",
            delimiter: null,
          },
          {
            pathPattern:
              "src/modules/marketing/[locale]/strings/dashboard.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("restores placeholder when extglob wraps the locale segment", () => {
    mockGlobSync(["src/modules/core-en.json", "src/modules/marketing-en.json"]);

    const i18nConfig = makeI18nConfig([
      "src/modules/@(core|marketing)-[locale].json",
    ]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          { pathPattern: "src/modules/core-[locale].json", delimiter: null },
          {
            pathPattern: "src/modules/marketing-[locale].json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("restores placeholder when brace expansion surrounds locale segment", () => {
    mockGlobSync([
      "src/modules/core/en/strings/messages.json",
      "src/modules/marketing/en/strings/dashboard.json",
    ]);

    const i18nConfig = makeI18nConfig([
      "src/modules/{core,marketing}/[locale]/strings/*.json",
    ]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "src/modules/core/[locale]/strings/messages.json",
            delimiter: null,
          },
          {
            pathPattern:
              "src/modules/marketing/[locale]/strings/dashboard.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("preserves glob character classes around locale placeholder", () => {
    mockGlobSync(["src/files/id-en.json"]);

    const i18nConfig = makeI18nConfig(["src/files/??-[locale].json"]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "src/files/id-[locale].json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("supports globstar at the beginning of the pattern", () => {
    mockGlobSync([
      "src/modules/core/en/messages.json",
      "src/modules/marketing/en/dashboard.json",
    ]);

    const i18nConfig = makeI18nConfig(["**/[locale]/*.json"]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "src/modules/core/[locale]/messages.json",
            delimiter: null,
          },
          {
            pathPattern: "src/modules/marketing/[locale]/dashboard.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("supports multiple globstars surrounding the locale segment", () => {
    mockGlobSync([
      "src/modules/core/services/en/api/messages.json",
      "src/modules/marketing/en/email/templates/messages.json",
    ]);

    const i18nConfig = makeI18nConfig(["src/**/[locale]/**/messages.json"]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "src/modules/core/services/[locale]/api/messages.json",
            delimiter: null,
          },
          {
            pathPattern:
              "src/modules/marketing/[locale]/email/templates/messages.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("supports globstar segments after the locale placeholder", () => {
    mockGlobSync(["src/i18n/en/deep/messages.json"]);

    const i18nConfig = makeI18nConfig(["src/i18n/[locale]/**/messages.json"]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "src/i18n/[locale]/deep/messages.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("supports globstar leading directly into the locale file name", () => {
    mockGlobSync(["src/en.json", "src/translations/en.json"]);

    const i18nConfig = makeI18nConfig(["**/[locale].json"]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          { pathPattern: "src/[locale].json", delimiter: null },
          {
            pathPattern: "src/translations/[locale].json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("supports trailing globstar before the file extension", () => {
    mockGlobSync(["src/files/en/report.json", "src/files/en/app.json"]);

    const i18nConfig = makeI18nConfig(["src/files/[locale]/**.json"]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "src/files/[locale]/report.json",
            delimiter: null,
          },
          {
            pathPattern: "src/files/[locale]/app.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("handles consecutive globstars before the locale segment", () => {
    mockGlobSync(["src/a/b/en/messages.json", "src/en/messages.json"]);

    const i18nConfig = makeI18nConfig(["src/**/**/[locale]/messages.json"]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "src/a/b/[locale]/messages.json",
            delimiter: null,
          },
          {
            pathPattern: "src/[locale]/messages.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("prioritizes the earliest matching locale segment when duplicates exist", () => {
    mockGlobSync(["src/en/module/en/messages.json"]);

    const i18nConfig = makeI18nConfig(["src/**/[locale]/**/messages.json"]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          {
            pathPattern: "src/[locale]/module/en/messages.json",
            delimiter: null,
          },
        ],
      },
    ]);
  });

  it("deduplicates overlapping include patterns", () => {
    mockGlobSync(["src/i18n/en.json"]);
    mockGlobSync(["src/i18n/en.json"]);

    const i18nConfig = makeI18nConfig([
      "src/i18n/**/[locale].json",
      "src/i18n/[locale].json",
    ]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [{ pathPattern: "src/i18n/[locale].json", delimiter: null }],
      },
    ]);
  });

  it("keeps distinct entries for matching paths with different delimiters", () => {
    mockGlobSync(["src/i18n/en.json"]);
    mockGlobSync(["src/i18n/en.json"]);

    const i18nConfig = makeI18nConfig([
      { path: "src/i18n/[locale].json", delimiter: "-" },
      { path: "src/i18n/[locale].json", delimiter: "_" },
    ]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          { pathPattern: "src/i18n/[locale].json", delimiter: "-" },
          { pathPattern: "src/i18n/[locale].json", delimiter: "_" },
        ],
      },
    ]);
  });

  it("excludes entries matching both path pattern and delimiter", () => {
    mockGlobSync(["src/i18n/en.json"]);
    mockGlobSync(["src/i18n/en.json"]);
    mockGlobSync(["src/i18n/en.json"]);

    const i18nConfig = makeI18nConfig([
      { path: "src/i18n/[locale].json", delimiter: "-" },
      { path: "src/i18n/[locale].json", delimiter: "_" },
    ]);
    i18nConfig.buckets.json.exclude = [
      { path: "src/i18n/[locale].json", delimiter: "-" },
    ];

    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [{ pathPattern: "src/i18n/[locale].json", delimiter: "_" }],
      },
    ]);
  });

  it("restores placeholder when locale appears multiple times in a segment", () => {
    mockGlobSync(["src/files/en-en.json"]);

    const i18nConfig = makeI18nConfig(["src/files/[locale]-[locale].json"]);
    const buckets = getBuckets(i18nConfig);

    expect(buckets).toEqual([
      {
        type: "json",
        paths: [
          { pathPattern: "src/files/[locale]-[locale].json", delimiter: null },
        ],
      },
    ]);
  });

  it("throws when pattern resolves outside of the current working directory", () => {
    const i18nConfig = makeI18nConfig(["../outside/[locale].json"]);

    expect(() => getBuckets(i18nConfig)).toThrowError(
      /Invalid path pattern: \.{2}\//,
    );
  });

  describe("placeholder restoration matrix", () => {
    const cases: Array<{
      name: string;
      include: any[];
      globResults: string[][];
    }> = [
      {
        name: "basic segment placeholder",
        include: ["src/[locale]/messages.json"],
        globResults: [["src/en/messages.json"]],
      },
      {
        name: "placeholder inside file extension",
        include: ["src/messages.[locale].json"],
        globResults: [["src/messages.en.json"]],
      },
      {
        name: "placeholder with prefix and suffix in same segment",
        include: ["src/files/pre[locale]post.json"],
        globResults: [["src/files/preenpost.json"]],
      },
      {
        name: "duplicated placeholder within a single segment",
        include: ["src/files/[locale]-[locale].json"],
        globResults: [["src/files/en-en.json"]],
      },
      {
        name: "multiple placeholder segments",
        include: ["src/[locale]/module/[locale]/messages.json"],
        globResults: [["src/en/module/en/messages.json"]],
      },
      {
        name: "static locale directory before placeholder",
        include: ["src/en/module/[locale]/messages.json"],
        globResults: [["src/en/module/en/messages.json"]],
      },
      {
        name: "static locale directory after placeholder",
        include: ["src/[locale]/module/en/messages.json"],
        globResults: [["src/en/module/en/messages.json"]],
      },
      {
        name: "globstar before placeholder with extra segments",
        include: ["src/**/[locale]/messages.json"],
        globResults: [["src/features/en/messages.json"]],
      },
      {
        name: "globstar before placeholder with zero extra segments",
        include: ["src/**/[locale]/messages.json"],
        globResults: [["src/en/messages.json"]],
      },
      {
        name: "globstar after placeholder",
        include: ["src/i18n/[locale]/**/messages.json"],
        globResults: [["src/i18n/en/deep/messages.json"]],
      },
      {
        name: "globstar surrounding placeholder with duplicate locale segment",
        include: ["src/**/[locale]/**/messages.json"],
        globResults: [["src/en/module/en/messages.json"]],
      },
      {
        name: "multiple placeholders separated by globstars",
        include: ["src/**/[locale]/**/[locale].json"],
        globResults: [["src/en/foo/en/en.json"]],
      },
      {
        name: "extglob wrapping locale placeholder",
        include: ["src/modules/@(core|marketing)-[locale].json"],
        globResults: [["src/modules/core-en.json"]],
      },
      {
        name: "brace expansion containing locale segment",
        include: ["src/modules/{core,marketing}/[locale]/strings/*.json"],
        globResults: [["src/modules/core/en/strings/messages.json"]],
      },
      {
        name: "character class adjacent to locale placeholder",
        include: ["src/files/??-[locale].json"],
        globResults: [["src/files/id-en.json"]],
      },
      {
        name: "placeholder between single-segment wildcards",
        include: ["src/*/[locale]/file.json"],
        globResults: [["src/app/en/file.json"]],
      },
      {
        name: "deep translations path with static locale duplication",
        include: ["src/**/[locale]/**/translations/[locale].json"],
        globResults: [["src/en/module/en/translations/en.json"]],
      },
    ];

    cases.forEach(({ name, include, globResults }) => {
      it(name, () => {
        mockGlobSync(...globResults);
        const i18nConfig = makeI18nConfig(include);
        const buckets = getBuckets(i18nConfig);

        expect(buckets).toMatchSnapshot();
      });
    });
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
