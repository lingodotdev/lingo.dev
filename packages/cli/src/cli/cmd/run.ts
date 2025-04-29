import { Command } from "interactive-commander";

/*
  0: 30k ms <- processor x locales x files x patterns x buckets
  1: 15k ms <- processor x locales x files x patterns
  2: 2.5k ms <- processor x locales x files
  3: 0.5k ms <- processor x locales
  4: 0.1k ms <- processor
*/

/*
LOCALIZATION IN PROGRESS

json
  json/a/ * /[locale].md
    json/a/one/[locale].md
      es: 100%
      fr: 95%
      it: 50%
    json/a/two/[locale].md
  json/b/ * /[locale].md

markdown
  markdown/a/ * /[loca]

*/

let counter = 0;

function createSafeRunner() {
  let acc = Promise.resolve();
  return async function (fn: () => void | Promise<void>) {
    await acc;
    const promisifiedFn = Promise.resolve(fn());
    acc = acc.then(() => promisifiedFn);
    await acc;
  };
}

// TODO: instead of concurrently: boolean, use semaphors
async function runConcurrently<I, O>(
  args: I[],
  fn: (arg: I) => Promise<O>,
  concurrently: boolean,
) {
  let results: O[] = [];

  if (concurrently) {
    results = await Promise.all(args.map((a) => fn(a)));
  } else {
    for (const a of args) {
      const subResult = await fn(a);
      results.push(subResult);
    }
  }

  return results;
}

async function processPayload(params: {
  content: string;
  sourceLocale: string;
  targetLocale: string;
}) {
  const randomComponent = (Math.random() * 1000) ^ 0;
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `[${params.sourceLocale} -> ${params.targetLocale}] ${params.content}`,
      );
      resolve(void 0);
    }, 1000 + randomComponent);
  });
}

async function findBuckets() {
  return [{ type: "json" }, { type: "markdown" }];
}

async function findBucketPatterns(
  bucket: Awaited<ReturnType<typeof findBuckets>>[number],
) {
  if (bucket.type === "json") {
    return [
      { type: "json", pattern: "json/a/*/[locale].json" },
      { type: "json", pattern: "json/b/*/[locale].json" },
      { type: "json", pattern: "json/c/*/[locale].json" },
      { type: "json", pattern: "json/d/*/[locale].json" },
      { type: "json", pattern: "json/e/*/[locale].json" },
      { type: "json", pattern: "json/f/*/[locale].json" },
    ];
  } else if (bucket.type === "markdown") {
    return [
      { type: "markdown", pattern: "markdown/a/*/[locale].md" },
      { type: "markdown", pattern: "markdown/b/*/[locale].md" },
      { type: "markdown", pattern: "markdown/c/*/[locale].md" },
      { type: "markdown", pattern: "markdown/d/*/[locale].md" },
      { type: "markdown", pattern: "markdown/e/*/[locale].md" },
      { type: "markdown", pattern: "markdown/f/*/[locale].md" },
    ];
  } else {
    return [];
  }
}

async function findBucketFiles(
  pattern: Awaited<ReturnType<typeof findBucketPatterns>>[number],
) {
  return ["one", "two", "three", "four", "five"].map((id) => ({
    type: pattern.type,
    path: pattern.pattern.replace("*", id),
  }));
}

function getSourceLocale() {
  return "en";
}

function getTargetLocales() {
  return ["es", "fr", "de", "it", "pt"];
}

async function loadContent(locale: string, file: string) {
  return file;
}

export default new Command()
  .command("run")
  .description("Run Lingo.dev")
  .helpOption("-h, --help", "Show help")
  .option("-c, --concurrency <number>", "")
  .action(async (args) => {
    const start = Date.now();

    const concurrencyLevel = parseInt(args.concurrency) || 0;
    const buckets = await findBuckets();
    const lockfileSafeSaver = createSafeRunner();

    await runConcurrently(
      buckets,
      async (bucket) => {
        const patterns = await findBucketPatterns(bucket);
        await runConcurrently(
          patterns,
          async (pattern) => {
            const files = await findBucketFiles(pattern);
            await runConcurrently(
              files,
              async (file) => {
                const sourceLocale = getSourceLocale();
                const targetLocales = getTargetLocales();

                const content = await loadContent(sourceLocale, file.path);
                await runConcurrently(
                  targetLocales,
                  async (targetLocale) => {
                    return processPayload({
                      sourceLocale,
                      targetLocale,
                      content,
                    });
                  },
                  concurrencyLevel > 3,
                );

                await lockfileSafeSaver(async () => {
                  // upd lockfile
                  await new Promise((r) => {
                    setTimeout(() => {
                      console.log(`[saving] ${counter++} ${file.path}`);
                      r(void 0);
                    }, 10);
                  });
                });
              },
              concurrencyLevel > 2,
            );
          },
          concurrencyLevel > 1,
        );
      },
      concurrencyLevel > 0,
    );

    const end = Date.now();
    const duration = end - start;

    console.log(`Duration: ${duration.toLocaleString()}ms`);
  });
