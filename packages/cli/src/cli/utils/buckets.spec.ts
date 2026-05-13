import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBuckets } from "./buckets";
import * as pkg from "glob";
import type { Path } from "glob";
import { normalizePaths } from "./test-helpers";
const { glob } = pkg;

vi.mock("glob", () => ({
  glob: {
    sync: vi.fn(),
  },
}));

describe("getBuckets", () => {
  // WHY: mockReturnValueOnce queues accumulate across tests if not cleared,
  // and toHaveBeenCalledWith matches the full call history. Reset both so each
  // test sees a clean mock.
  beforeEach(() => {
    vi.mocked(glob.sync).mockReset();
  });

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

  it("should return correct buckets", () => {
    mockGlobSync(["src/i18n/en.json"], ["src/translations/en/messages.json"]);

    const i18nConfig = makeI18nConfig([
      "src/i18n/[locale].json",
      "src/translations/[locale]/messages.json",
    ]);
    const buckets = getBuckets(i18nConfig);
    expect(normalizePaths(buckets)).toEqual([
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
    expect(normalizePaths(buckets)).toEqual([
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
    expect(normalizePaths(buckets)).toEqual([
      {
        type: "json",
        paths: [{ pathPattern: "src/i18n/[locale].json", delimiter: "-" }],
      },
    ]);
  });

  it("should accept `keyColumn` on a csv bucket", () => {
    mockGlobSync(["src/translations.csv"]);
    const buckets = getBuckets({
      $schema: "https://lingo.dev/schema/i18n.json",
      version: 0,
      locale: { source: "en", targets: ["es"] },
      buckets: {
        csv: {
          include: ["src/translations.csv"],
          keyColumn: "id",
        },
      },
    } as any);
    expect(buckets[0].keyColumn).toBe("id");
  });

  it("should warn and ignore `keyColumn` when set on a non-csv bucket", () => {
    mockGlobSync(["src/i18n/en.json"]);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const buckets = getBuckets({
      $schema: "https://lingo.dev/schema/i18n.json",
      version: 0,
      locale: { source: "en", targets: ["es"] },
      buckets: {
        json: {
          include: ["src/i18n/[locale].json"],
          keyColumn: "id",
        },
      },
    } as any);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/"keyColumn" is only supported on "csv" buckets/),
    );
    expect(buckets[0].keyColumn).toBeUndefined();
    warnSpy.mockRestore();
  });

  it("should reinsert [locale] on Windows when source locale has uppercase letters", () => {
    // On Windows, `normalizePath` lowercases the path returned from glob to
    // compensate for case-insensitive filesystems. The placeholder
    // reinsertion regex must therefore match case-insensitively or the
    // `[locale]` token is lost — see the customer report where translations
    // were never generated on Windows for sources like `en-US`.
    const originalPlatform = Object.getOwnPropertyDescriptor(
      process,
      "platform",
    );
    Object.defineProperty(process, "platform", {
      value: "win32",
      configurable: true,
    });
    try {
      mockGlobSync(["src/assets/locales/en-US/common.json"]);
      const i18nConfig = {
        $schema: "https://lingo.dev/schema/i18n.json",
        version: 0,
        locale: { source: "en-US", targets: ["de-DE", "pl-PL", "es-ES"] },
        buckets: {
          json: { include: ["src/assets/locales/[locale]/*.json"] },
        },
      };
      const buckets = getBuckets(i18nConfig as any);
      expect(normalizePaths(buckets)).toEqual([
        {
          type: "json",
          paths: [
            {
              pathPattern: "src/assets/locales/[locale]/common.json",
              delimiter: null,
            },
          ],
        },
      ]);
    } finally {
      if (originalPlatform) {
        Object.defineProperty(process, "platform", originalPlatform);
      }
    }
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
    expect(normalizePaths(buckets)).toEqual([
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

  describe("recursive globstar patterns", () => {
    it("restores [locale] when ** precedes the locale segment", () => {
      mockGlobSync([
        "src/modules/core/auth/en/strings/messages.json",
        "src/modules/marketing/en/strings/dashboard.json",
      ]);
      const i18nConfig = makeI18nConfig([
        "src/modules/**/[locale]/strings/*.json",
      ]);
      const buckets = getBuckets(i18nConfig);
      expect(normalizePaths(buckets)).toEqual([
        {
          type: "json",
          paths: [
            {
              pathPattern:
                "src/modules/core/auth/[locale]/strings/messages.json",
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

    it("supports ** at the start of the pattern", () => {
      mockGlobSync([
        "src/modules/core/en/messages.json",
        "src/modules/marketing/en/dashboard.json",
      ]);
      const i18nConfig = makeI18nConfig(["**/[locale]/*.json"]);
      const buckets = getBuckets(i18nConfig);
      expect(normalizePaths(buckets)).toEqual([
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

    it("supports ** surrounding the [locale] segment", () => {
      mockGlobSync([
        "src/modules/core/services/en/api/messages.json",
        "src/modules/marketing/en/email/templates/messages.json",
      ]);
      const i18nConfig = makeI18nConfig([
        "src/**/[locale]/**/messages.json",
      ]);
      const buckets = getBuckets(i18nConfig);
      expect(normalizePaths(buckets)).toEqual([
        {
          type: "json",
          paths: [
            {
              pathPattern:
                "src/modules/core/services/[locale]/api/messages.json",
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

    it("supports ** after the [locale] segment", () => {
      mockGlobSync(["src/i18n/en/deep/messages.json"]);
      const i18nConfig = makeI18nConfig([
        "src/i18n/[locale]/**/messages.json",
      ]);
      const buckets = getBuckets(i18nConfig);
      expect(normalizePaths(buckets)).toEqual([
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

    it("supports ** leading directly into the locale file name", () => {
      mockGlobSync(["src/en.json", "src/translations/en.json"]);
      const i18nConfig = makeI18nConfig(["**/[locale].json"]);
      const buckets = getBuckets(i18nConfig);
      expect(normalizePaths(buckets)).toEqual([
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

    it("handles consecutive ** before the locale segment", () => {
      mockGlobSync(["src/a/b/en/messages.json", "src/en/messages.json"]);
      const i18nConfig = makeI18nConfig([
        "src/**/**/[locale]/messages.json",
      ]);
      const buckets = getBuckets(i18nConfig);
      expect(normalizePaths(buckets)).toEqual([
        {
          type: "json",
          paths: [
            {
              pathPattern: "src/a/b/[locale]/messages.json",
              delimiter: null,
            },
            { pathPattern: "src/[locale]/messages.json", delimiter: null },
          ],
        },
      ]);
    });

    it("deduplicates overlapping ** and concrete patterns", () => {
      mockGlobSync(["src/i18n/en.json"]);
      mockGlobSync(["src/i18n/en.json"]);
      const i18nConfig = makeI18nConfig([
        "src/i18n/**/[locale].json",
        "src/i18n/[locale].json",
      ]);
      const buckets = getBuckets(i18nConfig);
      expect(normalizePaths(buckets)).toEqual([
        {
          type: "json",
          paths: [{ pathPattern: "src/i18n/[locale].json", delimiter: null }],
        },
      ]);
    });

    it("supports exclude patterns containing **", () => {
      mockGlobSync(["src/i18n/en.json", "src/i18n/test/en.json"]);
      mockGlobSync(["src/i18n/test/en.json"]);
      const i18nConfig = makeI18nConfig(
        ["src/i18n/**/[locale].json"],
        ["src/i18n/test/**/[locale].json"],
      );
      const buckets = getBuckets(i18nConfig);
      expect(normalizePaths(buckets)).toEqual([
        {
          type: "json",
          paths: [{ pathPattern: "src/i18n/[locale].json", delimiter: null }],
        },
      ]);
    });
  });

  describe("ambiguity and edge cases", () => {
    it("returns empty paths when glob matches nothing", () => {
      mockGlobSync([]);
      const i18nConfig = makeI18nConfig(["src/**/[locale].json"]);
      const buckets = getBuckets(i18nConfig);
      expect(buckets).toEqual([{ type: "json", paths: [] }]);
    });

    it("throws a hard error when matched file cannot be mapped back to [locale]", () => {
      // The mock makes glob return a path that does not actually fit the
      // pattern with the locale substituted. Previously the algorithm would
      // silently return malformed results — now it throws so the user sees
      // the misconfiguration instead of broken translations downstream.
      mockGlobSync(["src/files/en-en-test.json"]);
      const i18nConfig = makeI18nConfig([
        "src/files/[locale]-*-[locale].json",
      ]);
      expect(() => getBuckets(i18nConfig)).toThrow(
        /matched file .* via glob/,
      );
    });

    it("restores multiple [locale] occurrences in a single segment", () => {
      // Pattern with two [locale] tokens separated by a literal block.
      // Previously the function only handled the first occurrence and threw
      // on a perfectly deterministic input.
      mockGlobSync(["files/en-fixed-en.json"]);
      const i18nConfig = makeI18nConfig(["files/[locale]-fixed-[locale].json"]);
      const buckets = getBuckets(i18nConfig);
      expect(normalizePaths(buckets)).toEqual([
        {
          type: "json",
          paths: [
            {
              pathPattern: "files/[locale]-fixed-[locale].json",
              delimiter: null,
            },
          ],
        },
      ]);
    });

    it("throws when ** allows [locale] to map to multiple source positions", () => {
      // Pattern "**/[locale]/**/dummy.txt" against "en/x/en/dummy.txt" admits
      // two valid alignments: [locale] at index 0 (leaving the trailing "en"
      // intact) or [locale] at index 2 (leaving the leading "en" intact).
      // Picking one silently would corrupt target file paths during
      // translation, so we surface the ambiguity to the user.
      mockGlobSync(["en/x/en/dummy.txt"]);
      const i18nConfig = makeI18nConfig(["**/[locale]/**/dummy.txt"]);
      expect(() => getBuckets(i18nConfig)).toThrow(
        /can be aligned to multiple positions/,
      );
    });

    it("applies DEFAULT_GLOB_IGNORE only for ** patterns", () => {
      mockGlobSync([]);
      const i18nConfig = makeI18nConfig(["src/**/[locale].json"]);
      getBuckets(i18nConfig);
      expect(vi.mocked(glob.sync)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(glob.sync)).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          ignore: expect.arrayContaining([
            "**/node_modules/**",
            "**/.git/**",
          ]),
        }),
      );
    });

    it("does not pass an ignore list for non-recursive patterns (backcompat)", () => {
      mockGlobSync([]);
      const i18nConfig = makeI18nConfig(["src/*/[locale].json"]);
      getBuckets(i18nConfig);
      expect(vi.mocked(glob.sync)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(glob.sync)).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({ ignore: undefined }),
      );
    });

    it("disables symlink following when pattern contains **", () => {
      mockGlobSync([]);
      const i18nConfig = makeI18nConfig(["src/**/[locale].json"]);
      getBuckets(i18nConfig);
      expect(vi.mocked(glob.sync)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(glob.sync)).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({ follow: false }),
      );
    });

    it("keeps follow:true for non-recursive patterns", () => {
      mockGlobSync([]);
      const i18nConfig = makeI18nConfig(["src/[locale].json"]);
      getBuckets(i18nConfig);
      expect(vi.mocked(glob.sync)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(glob.sync)).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({ follow: true }),
      );
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
