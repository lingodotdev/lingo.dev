export async function processPayload(
  params: {
    content: string;
    sourceLocale: string;
    targetLocale: string;
  },
  progressFn?: (progressPercentage: number) => void,
): Promise<void> {
  let progress = 0;
  while (progress < 100) {
    // Random increment between 1 and 10 percent
    const increment = Math.floor(Math.random() * 10) + 1;
    progress = Math.min(progress + increment, 100);
    progressFn?.(progress);

    // Random delay between 5 and 50ms
    const delay = Math.floor(Math.random() * 45) + 5;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

export async function findBuckets() {
  return [{ type: "json" }, { type: "markdown" }] as const;
}

type Bucket = Awaited<ReturnType<typeof findBuckets>>[number];

type Pattern = { type: "json" | "markdown"; pattern: string };

export async function findBucketPatterns(bucket: Bucket): Promise<Pattern[]> {
  if (bucket.type === "json") {
    return [
      { type: "json", pattern: "locales/common/*/[locale].json" },
      { type: "json", pattern: "locales/dashboard/*/[locale].json" },
      { type: "json", pattern: "locales/settings/*/[locale].json" },
      { type: "json", pattern: "locales/auth/*/[locale].json" },
      { type: "json", pattern: "locales/profile/*/[locale].json" },
      { type: "json", pattern: "locales/notifications/*/[locale].json" },
    ];
  }

  if (bucket.type === "markdown") {
    return [
      { type: "markdown", pattern: "content/blog/*/[locale].md" },
      { type: "markdown", pattern: "content/docs/*/[locale].md" },
      { type: "markdown", pattern: "content/help/*/[locale].md" },
      { type: "markdown", pattern: "content/legal/*/[locale].md" },
      { type: "markdown", pattern: "content/faq/*/[locale].md" },
      { type: "markdown", pattern: "content/tutorials/*/[locale].md" },
    ];
  }

  return [];
}

export async function findBucketFiles(pattern: Pattern) {
  return ["homepage", "landing", "features", "pricing", "contact"].map(
    (id) => ({
      type: pattern.type,
      path: pattern.pattern.replace("*", id),
    }),
  );
}

export function getSourceLocale() {
  return "en";
}

export function getTargetLocales() {
  return ["es", "fr", "de", "it", "pt"] as const;
}

export async function loadContent(_locale: string, file: string) {
  return file;
}

let counter = 0;
export async function saveLockfile() {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[saving] ${counter++}`);
      resolve(void 0);
    }, 1000);
  });
}
