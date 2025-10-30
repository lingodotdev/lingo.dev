# Lingo.dev CLI Integration Guide for Svelte

This guide walks you from a fresh Svelte app to a multilingual workflow using the Lingo.dev CLI. You'll translate your project with a single command and learn how to keep translations up to date via CI.

## Prerequisites

- Node.js 18+
- pnpm, npm, or yarn (examples use pnpm)
- An AI API key supported by Lingo.dev (Groq, Google, or Mistral)
  - Set as an environment variable, e.g. `GROQ_API_KEY`, `GOOGLE_API_KEY`, or `MISTRAL_API_KEY`

## 1) Create a new Svelte project

```bash
pnpm dlx create-svelte@latest my-svelte-app
cd my-svelte-app
pnpm install
pnpm dev
```

Open http://localhost:5173 to confirm the app runs.

## 2) Add Lingo.dev CLI

You can run the CLI without installing:

```bash
npx lingo.dev@latest --help
```

Or install as a dev dependency:

```bash
pnpm add -D lingo.dev
```

## 3) Create `i18n.json`

At the root of your Svelte app, add an `i18n.json` file to describe what to translate.

```json
{
  "sourceLocale": "en",
  "targetLocales": ["es", "fr"],
  "include": [
    "src/**/*.svelte",
    "src/**/*.ts",
    "src/**/*.js",
    "public/**/*.html"
  ],
  "exclude": [
    "node_modules/**",
    ".svelte-kit/**",
    "build/**"
  ],
  "output": {
    "format": "json",
    "path": "i18n/{locale}.json"
  }
}
```

Notes:
- `include` selects files to scan for user-facing strings.
- `output` writes compiled translations to JSON files per locale.

## 4) Add a few translatable strings

Edit a Svelte page, e.g. `src/routes/+page.svelte`:

```svelte
<script>
  const greeting = "Welcome to our Svelte app";
</script>

<h1>{greeting}</h1>
<p>Click the button to start</p>
<button>Start</button>
```

## 5) Authenticate with a model provider

Set one of the supported API keys in your environment before running the CLI, e.g.:

- macOS/Linux:
  ```bash
  export GROQ_API_KEY=your_groq_key
  ```
- Windows PowerShell:
  ```powershell
  $env:GROQ_API_KEY = "your_groq_key"
  ```

See also: https://lingo.dev/en/cli/quick-start#step-2-authentication

## 6) Run the CLI

From the project root:

```bash
# Using npx
npx lingo.dev@latest run

# Or if installed
pnpm lingo.dev run
```

The CLI fingerprints strings, caches results, and writes translations to `i18n/es.json`, `i18n/fr.json`, etc.

## 7) Load translations in Svelte (minimal example)

Create a tiny loader `src/lib/i18n.ts`:

```ts
export async function loadMessages(locale: string) {
  try {
    const messages = await import(`../../i18n/${locale}.json`);
    return messages.default ?? messages;
  } catch {
    const messages = await import("../../i18n/en.json");
    return messages.default ?? messages;
  }
}
```

Use it in a page `src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { loadMessages } from "$lib/i18n";

  let t: Record<string, string> = {};
  const locale = navigator.language?.slice(0, 2) || "en";

  onMount(async () => {
    t = await loadMessages(locale);
  });
</script>

<h1>{t["Welcome to our Svelte app"] ?? "Welcome to our Svelte app"}</h1>
<p>{t["Click the button to start"] ?? "Click the button to start"}</p>
<button>{t["Start"] ?? "Start"}</button>
```

This minimal approach uses the original English string as the key. For larger apps, consider a key-based convention and a tiny translate helper.

## 8) Keep translations fresh in CI

Add a GitHub Actions workflow `.github/workflows/i18n.yml`:

```yaml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9.12.3
      - uses: actions/setup-node@v4
        with:
          node-version: 20.12.2
      - run: pnpm install --frozen-lockfile
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

This runs the CLI on each push and can commit updated translation files automatically depending on your configuration.

## 9) Troubleshooting

- No translations generated: ensure an AI API key is set and `include` patterns match your files.
- Access errors: check provider limits or wrong API key env var name.
- Over-translation: refine `include` and `exclude` patterns to skip non-user strings.

## 10) Next steps

- Add more locales in `i18n.json`.
- Introduce a key-based pattern and a central translate helper.
- Add e2e tests that assert translated outputs exist for critical pages.

---

Screenshots to include (add before publishing):
- App before translation
- CLI run output
- App after switching locale
