import { Command } from "interactive-commander";
import fs from "fs";
import path from "path";
import Ora from "ora";
import { pathToFileURL } from "url";

import { getConfig } from "../../utils/config";

type Config = NonNullable<ReturnType<typeof getConfig>>;

type LCPScope = {
  type: "element" | "attribute";
  content?: string;
  hash?: string;
  context?: string;
  skip?: boolean;
  overrides?: Record<string, string>;
  marker?: {
    attribute: string;
    value: string;
  };
};

type LCPFile = {
  scopes?: Record<string, LCPScope>;
};

type LCPSchema = {
  version?: number | string;
  files?: Record<string, LCPFile>;
};

type DictionaryCacheEntry = {
  content: Record<string, string>;
  hash: string;
};

type DictionaryCacheFile = {
  entries?: Record<string, DictionaryCacheEntry>;
};

type DictionaryCacheSchema = {
  version?: number | string;
  files?: Record<string, DictionaryCacheFile>;
};

interface ReviewCaptureOptions {
  meta?: string;
  output?: string;
}

type ReviewRoute = {
  path: string;
  name?: string;
  locales?: string[];
};

type NormalizedRoute = {
  path: string;
  name?: string;
  locales: string[];
};

type ContextManifestEntry = {
  id: string;
  file: string;
  entry: string;
  type: string;
  hash?: string;
  skip: boolean;
  source: {
    locale: string;
    text: string;
    context?: string;
  };
  translations: Record<string, string>;
  overrides: Record<string, string>;
  marker: {
    attribute: string;
    value: string;
  };
};

type ContextManifest = {
  version: string;
  generatedAt: string;
  marker: {
    attribute: string;
  };
  compiler: {
    sourceRoot: string;
    lingoDir: string;
    metaPath: string;
    dictionaryPath?: string | null;
  };
  locales: {
    source: string;
    targets: string[];
  };
  routes: NormalizedRoute[];
  entries: ContextManifestEntry[];
};

const DEFAULT_MARKER_ATTRIBUTE = "data-lingo-id";

function resolveCompilerPaths(
  config: Config,
  metaOverride?: string,
): { metaPath: string; dictionaryPath: string } {
  const review = config.review;
  const compilerSourceRoot = review.compiler?.sourceRoot ?? "src";
  const compilerLingoDir = review.compiler?.lingoDir ?? "lingo";

  const defaultMetaPath = path.resolve(
    process.cwd(),
    compilerSourceRoot,
    compilerLingoDir,
    "meta.json",
  );

  const metaPath = metaOverride
    ? path.resolve(process.cwd(), metaOverride)
    : defaultMetaPath;

  const dictionaryPath = path.join(path.dirname(metaPath), "dictionary.js");

  return { metaPath, dictionaryPath };
}

async function loadDictionaryCache(
  dictionaryPath: string,
): Promise<DictionaryCacheSchema | null> {
  if (!fs.existsSync(dictionaryPath)) {
    return null;
  }

  try {
    const module = await import(pathToFileURL(dictionaryPath).href);
    const dictionary = module?.default as DictionaryCacheSchema | undefined;
    return dictionary ?? null;
  } catch (error) {
    return null;
  }
}

function normalizeRoutes(
  routes: Array<string | ReviewRoute>,
  defaultLocales: string[],
): NormalizedRoute[] {
  return routes
    .map((route) => {
      if (!route) return null;
      if (typeof route === "string") {
        const normalized: NormalizedRoute = {
          path: route,
          locales: [...defaultLocales],
        };
        return normalized;
      }

      if (!route.path) {
        return null;
      }

      const locales = route.locales ? [...route.locales] : [...defaultLocales];

      const normalized: NormalizedRoute = {
        path: route.path,
        name: route.name,
        locales,
      };
      return normalized;
    })
    .filter((route): route is NormalizedRoute => Boolean(route));
}

function buildManifestEntry(params: {
  fallbackAttribute: string;
  fileKey: string;
  entryKey: string;
  scope: LCPScope;
  dictionary?: DictionaryCacheSchema | null;
  sourceLocale: string;
}): ContextManifestEntry {
  const {
    fallbackAttribute,
    fileKey,
    entryKey,
    scope,
    dictionary,
    sourceLocale,
  } = params;

  const markerAttributeCandidate = scope.marker?.attribute ?? fallbackAttribute;
  const markerValueCandidate = scope.marker?.value ?? `${fileKey}::${entryKey}`;

  const markerAttribute = markerAttributeCandidate.trim().length
    ? markerAttributeCandidate.trim()
    : fallbackAttribute;
  const markerValue = markerValueCandidate.trim().length
    ? markerValueCandidate.trim()
    : `${fileKey}::${entryKey}`;

  const translations: Record<string, string> = {};
  const overrides = scope.overrides ?? {};

  if (dictionary?.files?.[fileKey]?.entries?.[entryKey]?.content) {
    Object.assign(
      translations,
      dictionary.files[fileKey]!.entries![entryKey]!.content,
    );
  }

  if (!translations[sourceLocale]) {
    translations[sourceLocale] = scope.content ?? "";
  }

  return {
    id: markerValue,
    file: fileKey,
    entry: entryKey,
    type: scope.type,
    hash: scope.hash,
    skip: Boolean(scope.skip),
    source: {
      locale: sourceLocale,
      text: scope.content ?? "",
      context: scope.context,
    },
    translations,
    overrides,
    marker: {
      attribute: markerAttribute,
      value: markerValue,
    },
  };
}

function buildManifest(params: {
  config: Config;
  meta: LCPSchema;
  dictionary: DictionaryCacheSchema | null;
  metaPath: string;
  dictionaryPath: string;
  attributeName: string;
}): ContextManifest {
  const { config, meta, dictionary, metaPath, dictionaryPath, attributeName } =
    params;
  const entries: ContextManifestEntry[] = [];

  const files = (meta.files ?? {}) as Record<string, LCPFile>;
  for (const [fileKey, file] of Object.entries(files)) {
    const scopes = (file?.scopes ?? {}) as Record<string, LCPScope>;
    for (const [entryKey, scope] of Object.entries(scopes)) {
      entries.push(
        buildManifestEntry({
          fallbackAttribute: attributeName,
          fileKey,
          entryKey,
          scope,
          dictionary,
          sourceLocale: config.locale.source,
        }),
      );
    }
  }

  entries.sort((a, b) => a.id.localeCompare(b.id));

  const routes = normalizeRoutes(config.review.routes ?? [], config.locale.targets);
  routes.sort((a, b) => a.path.localeCompare(b.path));

  return {
    version: "1.0",
    generatedAt: new Date().toISOString(),
    marker: {
      attribute: attributeName,
    },
    compiler: {
      sourceRoot: config.review.compiler?.sourceRoot ?? "src",
      lingoDir: config.review.compiler?.lingoDir ?? "lingo",
      metaPath: path.relative(process.cwd(), metaPath),
      dictionaryPath: fs.existsSync(dictionaryPath)
        ? path.relative(process.cwd(), dictionaryPath)
        : null,
    },
    locales: {
      source: config.locale.source,
      targets: config.locale.targets,
    },
    routes,
    entries,
  };
}

function resolveMarkerAttribute(raw: string | undefined | null): {
  name: string;
  usedFallback: boolean;
} {
  const trimmed = raw?.trim() ?? "";
  if (trimmed.startsWith("data-")) {
    return { name: trimmed, usedFallback: false };
  }

  return { name: DEFAULT_MARKER_ATTRIBUTE, usedFallback: Boolean(trimmed) };
}

export default new Command()
  .command("capture")
  .description(
    "Generate a context manifest that links compiler scopes to DOM markers for screenshot tooling.",
  )
  .helpOption("-h, --help", "Show help")
  .option(
    "--meta <path>",
    "Override the path to meta.json (defaults to <sourceRoot>/<lingoDir>/meta.json)",
  )
  .option(
    "--output <dir>",
    "Directory to write the context manifest (defaults to review.outputDir)",
  )
  .action(async function capture(options: ReviewCaptureOptions) {
    const ora = Ora();

    try {
      ora.start("Loading i18n configuration...");
      const config = getConfig();
      if (!config) {
        ora.fail("i18n.json not found. Please run `lingo.dev init` first.");
        process.exit(1);
      }
      ora.succeed("Configuration loaded");

      const { metaPath, dictionaryPath } = resolveCompilerPaths(
        config,
        options.meta,
      );

      const { name: attributeName, usedFallback } = resolveMarkerAttribute(
        config.review.attribute,
      );

      ora.start("Reading compiler metadata...");
      if (!fs.existsSync(metaPath)) {
        ora.fail(
          `meta.json not found at ${path.relative(process.cwd(), metaPath)}. Run your build (next build / vite build) to regenerate compiler artifacts, or provide --meta <path>.`,
        );
        process.exit(1);
      }

      const metaContent = fs.readFileSync(metaPath, "utf8");
      const meta = JSON.parse(metaContent) as LCPSchema;
      ora.succeed("Compiler metadata loaded");

      ora.start("Loading dictionary cache...");
      const dictionary = await loadDictionaryCache(dictionaryPath);
      if (dictionary) {
        ora.succeed("Dictionary cache loaded");
      } else {
        ora.warn(
          "dictionary.js not found or failed to load. Continuing without cached translations.",
        );
      }

      const manifest = buildManifest({
        config,
        meta,
        dictionary,
        metaPath,
        dictionaryPath,
        attributeName,
      });

      const outputDir = options.output
        ? path.resolve(process.cwd(), options.output)
        : path.resolve(process.cwd(), config.review.outputDir ?? ".lingo/context");
      const outputPath = path.join(outputDir, "context-manifest.json");

      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

      if (manifest.entries.length === 0) {
        ora.warn(
          "No compiler scopes were found in meta.json. Run your framework build with the Lingo.dev compiler enabled to generate scope metadata.",
        );
      }

      ora.succeed(
        `Context manifest created with ${manifest.entries.length} entries → ${path.relative(process.cwd(), outputPath)}`,
      );
      if (usedFallback) {
        ora.warn(
          `Configured review.attribute must start with "data-". Falling back to ${DEFAULT_MARKER_ATTRIBUTE}. Update i18n.json to avoid this warning.`,
        );
      }
      ora.info(
        `Ensure your compiler config sets exposeContextAttribute: true so ${manifest.marker.attribute} markers are emitted in rendered HTML.`,
      );
    } catch (error) {
      const err = error as Error;
      ora.fail(err.message);
      process.exit(1);
    }
  });
