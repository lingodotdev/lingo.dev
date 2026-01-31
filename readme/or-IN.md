<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev - LLM-ଚାଳିତ ଲୋକାଲାଇଜେସନ୍ ପାଇଁ ଓପନ୍-ସୋର୍ସ i18n ଟୁଲକିଟ୍
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Compiler</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="Release"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="License"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Last Commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Month"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Week"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Product of the Day"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github trending"
    />
  </a>
</p>

---

## ଶୀଘ୍ର ଆରମ୍ଭ

| ଟୁଲ୍                               | ବ୍ୟବହାର କେସ୍                                      | ଶୀଘ୍ର କମାଣ୍ଡ                       |
| ---------------------------------- | ------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React ଆପ୍ ପାଇଁ AI-ସହାୟକ i18n ସେଟଅପ୍               | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO ଫାଇଲ୍ ଅନୁବାଦ କରନ୍ତୁ | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions ରେ ସ୍ୱୟଂଚାଳିତ ଅନୁବାଦ ପାଇପଲାଇନ୍     | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | ଡାଇନାମିକ୍ କଣ୍ଟେଣ୍ଟ ପାଇଁ ରନଟାଇମ୍ ଅନୁବାଦ            | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n ରାପର୍ ବିନା ବିଲ୍ଡ-ଟାଇମ୍ React ଲୋକାଲାଇଜେସନ୍    | `withLingo()` plugin               |

---

### Lingo.dev MCP

Model Context Protocol ସର୍ଭର ଯାହା AI କୋଡିଂ ଆସିଷ୍ଟାଣ୍ଟମାନଙ୍କୁ ପ୍ରାକୃତିକ ଭାଷା ପ୍ରମ୍ପଟ୍ ମାଧ୍ୟମରେ React ଆପ୍ଲିକେସନ୍ରେ i18n ଇନଫ୍ରାଷ୍ଟ୍ରକଚର୍ ସେଟଅପ୍ କରିବାକୁ ସକ୍ଷମ କରେ।

**ସମର୍ଥିତ IDEs:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**ସମର୍ଥିତ ଫ୍ରେମୱାର୍କଗୁଡ଼ିକ:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**ବ୍ୟବହାର:**

ଆପଣଙ୍କ IDE ରେ MCP ସର୍ଭର କନଫିଗର୍ କରିବା ପରେ ([quickstart guides ଦେଖନ୍ତୁ](https://lingo.dev/en/mcp)), ଆପଣଙ୍କ ସହାୟକଙ୍କୁ ପ୍ରମ୍ପ୍ଟ କରନ୍ତୁ:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

ସହାୟକ କରିବ:

1. Locale-based routing କନଫିଗର୍ କରିବା (ଯେମିତି `/en`, `/es`, `/pt-BR`)
2. ଭାଷା ସୁଇଚିଂ କମ୍ପୋନେଣ୍ଟ ସେଟଅପ୍ କରିବା
3. ସ୍ୱୟଂଚାଳିତ locale ଚିହ୍ନଟ ପ୍ରୟୋଗ କରିବା
4. ଆବଶ୍ୟକ configuration ଫାଇଲ ଜେନେରେଟ୍ କରିବା

**ଧ୍ୟାନ ଦିଅନ୍ତୁ:** AI-assisted କୋଡ୍ ଜେନେରେସନ୍ non-deterministic ଅଟେ। କମିଟ୍ କରିବା ପୂର୍ବରୁ ଜେନେରେଟ୍ ହୋଇଥିବା କୋଡ୍ ସମୀକ୍ଷା କରନ୍ତୁ।

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI ସହିତ ଆପ୍ ଏବଂ କଣ୍ଟେଣ୍ଟ ଅନୁବାଦ କରିବା ପାଇଁ open-source CLI। JSON, YAML, CSV, PO ଫାଇଲ, ଏବଂ markdown ସମେତ ସମସ୍ତ industry-standard ଫର୍ମାଟ୍ ସପୋର୍ଟ କରେ।

**ସେଟଅପ୍:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**ଏହା କିପରି କାମ କରେ:**

1. କନଫିଗର୍ ହୋଇଥିବା ଫାଇଲରୁ ଅନୁବାଦଯୋଗ୍ୟ କଣ୍ଟେଣ୍ଟ ଏକ୍ସଟ୍ରାକ୍ଟ କରେ
2. ଅନୁବାଦ ପାଇଁ LLM provider କୁ କଣ୍ଟେଣ୍ଟ ପଠାଏ
3. ଅନୁବାଦିତ କଣ୍ଟେଣ୍ଟକୁ filesystem ରେ ଲେଖେ
4. ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଥିବା ଅନୁବାଦ ଟ୍ରାକ୍ କରିବା ପାଇଁ `i18n.lock` ଫାଇଲ ସୃଷ୍ଟି କରେ (ଅନାବଶ୍ୟକ ପ୍ରକ୍ରିୟାକରଣରୁ ଦୂରେଇ ରହେ)

**କନଫିଗରେସନ୍:**

`init` କମାଣ୍ଡ ଏକ `i18n.json` ଫାଇଲ ଜେନେରେଟ୍ କରେ। Locales ଏବଂ buckets କନଫିଗର୍ କରନ୍ତୁ:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
```

`provider` ଫିଲ୍ଡ ଇଚ୍ଛାଧୀନ (Lingo.dev Engine କୁ default କରେ)। କଷ୍ଟମ୍ LLM providers ପାଇଁ:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**ସପୋର୍ଟ ହୋଇଥିବା LLM providers:**

- Lingo.dev Engine (ସୁପାରିଶ କରାଯାଇଛି)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD pipelines ପାଇଁ ସ୍ୱୟଂଚାଳିତ ଅନୁବାଦ workflows। ଅସମ୍ପୂର୍ଣ୍ଣ ଅନୁବାଦକୁ production ରେ ପହଞ୍ଚିବାରୁ ପ୍ରତିରୋଧ କରେ।

**ସମର୍ଥିତ ପ୍ଲାଟଫର୍ମଗୁଡ଼ିକ:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions ସେଟଅପ୍:**

`.github/workflows/translate.yml` ସୃଷ୍ଟି କରନ୍ତୁ:

```yaml
name: Translate
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lingo.dev
        uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**ସେଟଅପ୍ ଆବଶ୍ୟକତା:**

1. ରିପୋଜିଟୋରୀ ସିକ୍ରେଟ୍ସରେ `LINGODOTDEV_API_KEY` ଯୋଗ କରନ୍ତୁ (Settings > Secrets and variables > Actions)
2. PR ୱର୍କଫ୍ଲୋ ପାଇଁ: Settings > Actions > General ରେ "Allow GitHub Actions to create and approve pull requests" ସକ୍ଷମ କରନ୍ତୁ

**ୱର୍କଫ୍ଲୋ ବିକଳ୍ପଗୁଡ଼ିକ:**

ଅନୁବାଦଗୁଡ଼ିକୁ ସିଧାସଳଖ କମିଟ୍ କରନ୍ତୁ:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

ଅନୁବାଦ ସହିତ pull request ସୃଷ୍ଟି କରନ୍ତୁ:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**ଉପଲବ୍ଧ ଇନପୁଟ୍ସ:**

| Input                | Default                                        | Description                                     |
| -------------------- | ---------------------------------------------- | ----------------------------------------------- |
| `api-key`            | (required)                                     | Lingo.dev API key                               |
| `pull-request`       | `false`                                        | ସିଧାସଳଖ କମିଟ୍ କରିବା ପରିବର୍ତ୍ତେ PR ସୃଷ୍ଟି କରନ୍ତୁ |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | କଷ୍ଟମ୍ କମିଟ୍ ମେସେଜ୍                             |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | କଷ୍ଟମ୍ PR ଟାଇଟଲ୍                                |
| `working-directory`  | `"."`                                          | ଚଲାଇବାକୁ ଥିବା ଡିରେକ୍ଟୋରୀ                        |
| `parallel`           | `false`                                        | ସମାନ୍ତରାଳ ପ୍ରକ୍ରିୟାକରଣ ସକ୍ଷମ କରନ୍ତୁ             |

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

ଡାଇନାମିକ୍ କଣ୍ଟେଣ୍ଟ ପାଇଁ ରନଟାଇମ୍ ଅନୁବାଦ ଲାଇବ୍ରେରୀ। JavaScript, PHP, Python, ଏବଂ Ruby ପାଇଁ ଉପଲବ୍ଧ।

**ଇନଷ୍ଟଲେସନ୍:**

```bash
npm install lingo.dev
```

**ବ୍ୟବହାର:**

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate objects (preserves structure)
const translated = await lingoDotDev.localizeObject(
  { greeting: "Hello", farewell: "Goodbye" },
  { sourceLocale: "en", targetLocale: "es" },
);
// { greeting: "Hola", farewell: "Adiós" }

// Translate text
const text = await lingoDotDev.localizeText("Hello!", {
  sourceLocale: "en",
  targetLocale: "fr",
});

// Translate to multiple languages at once
const results = await lingoDotDev.batchLocalizeText("Hello!", {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
});

// Translate chat (preserves speaker names)
const chat = await lingoDotDev.localizeChat(
  [{ name: "Alice", text: "Hello!" }],
  { sourceLocale: "en", targetLocale: "es" },
);

// Translate HTML (preserves markup)
const html = await lingoDotDev.localizeHtml("<h1>Welcome</h1>", {
  sourceLocale: "en",
  targetLocale: "de",
});

// Detect language
const locale = await lingoDotDev.recognizeLocale("Bonjour le monde");
// "fr"
```

**ଉପଲବ୍ଧ SDKs:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Web apps, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/sdk)

---

### Lingo.dev କମ୍ପାଇଲର୍

ବିଲ୍ଡ-ଟାଇମ୍ ଅନୁବାଦ ସିଷ୍ଟମ୍ ଯାହା କମ୍ପୋନେଣ୍ଟଗୁଡ଼ିକୁ ପରିବର୍ତ୍ତନ ନକରି React ଆପ୍‌ଗୁଡ଼ିକୁ ବହୁଭାଷିକ କରିଥାଏ। ରନଟାଇମ୍ ପରିବର୍ତ୍ତେ ବିଲ୍ଡ ସମୟରେ କାର୍ଯ୍ୟ କରେ।

**ଇନଷ୍ଟଲେସନ୍:**

```bash
pnpm install @lingo.dev/compiler
```

**ପ୍ରମାଣୀକରଣ:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**କନଫିଗରେସନ୍ (Next.js):**

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    models: "lingo.dev",
    dev: { usePseudotranslator: true },
  });
}
```

**କନଫିଗରେସନ୍ (Vite):**

```ts
// vite.config.ts
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      models: "lingo.dev",
      dev: { usePseudotranslator: true },
    }),
    react(),
  ],
});
```

**Provider ସେଟଅପ୍:**

```tsx
// app/layout.tsx (Next.js)
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }) {
  return (
    <LingoProvider>
      <html>
        <body>{children}</body>
      </html>
    </LingoProvider>
  );
}
```

**ଭାଷା ସୁଇଚର୍:**

```tsx
import { useLocale, setLocale } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**ଡେଭଲପମେଣ୍ଟ:** `npm run dev` (pseudotranslator ବ୍ୟବହାର କରେ, କୌଣସି API କଲ୍ ନାହିଁ)

**ପ୍ରଡକ୍ସନ୍:** `usePseudotranslator: false` ସେଟ୍ କରନ୍ତୁ, ତାପରେ `next build`

`.lingo/` ଡିରେକ୍ଟୋରୀକୁ version control ରେ commit କରନ୍ତୁ।

**ମୁଖ୍ୟ ବୈଶିଷ୍ଟ୍ୟଗୁଡ଼ିକ:**

- ଶୂନ୍ୟ runtime performance cost
- କୌଣସି translation keys କିମ୍ବା JSON ଫାଇଲ୍ ନାହିଁ
- କୌଣସି `t()` functions କିମ୍ବା `<T>` wrapper components ନାହିଁ
- JSX ରେ ଅନୁବାଦଯୋଗ୍ୟ ଟେକ୍ସଟ୍‌ର ସ୍ୱୟଂଚାଳିତ ଚିହ୍ନଟ
- TypeScript ସପୋର୍ଟ
- ବହୁବଚନ ପାଇଁ ICU MessageFormat
- `data-lingo-override` attribute ମାଧ୍ୟମରେ manual overrides
- ବିଲ୍ଟ-ଇନ୍ translation editor widget

**ବିଲ୍ଡ ମୋଡ୍‌ଗୁଡ଼ିକ:**

- `pseudotranslator`: placeholder translations ସହିତ development mode (କୌଣସି API costs ନାହିଁ)
- `real`: LLMs ବ୍ୟବହାର କରି ପ୍ରକୃତ ଅନୁବାଦ ସୃଷ୍ଟି କରନ୍ତୁ
- `cache-only`: CI ରୁ ପୂର୍ବ-ସୃଷ୍ଟ ଅନୁବାଦ ବ୍ୟବହାର କରି production mode (କୌଣସି API calls ନାହିଁ)

**ସପୋର୍ଟେଡ୍ frameworks:**

- Next.js (React Server Components ସହିତ App Router)
- Vite + React (SPA ଏବଂ SSR)

ଅତିରିକ୍ତ framework ସପୋର୍ଟ ଯୋଜନା କରାଯାଇଛି।

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/compiler)

---

## ଅବଦାନ

ଅବଦାନ ସ୍ୱାଗତଯୋଗ୍ୟ। ଦୟାକରି ଏହି ନିର୍ଦ୍ଦେଶାବଳୀ ଅନୁସରଣ କରନ୍ତୁ:

1. **ସମସ୍ୟା:** [ବଗ୍ ରିପୋର୍ଟ କରନ୍ତୁ କିମ୍ବା ଫିଚର୍ ଅନୁରୋଧ କରନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/issues)
2. **ପୁଲ୍ ରିକ୍ୱେଷ୍ଟ:** [ପରିବର୍ତ୍ତନ ସବମିଟ୍ କରନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/pulls)
   - ପ୍ରତ୍ୟେକ PR ପାଇଁ ଏକ changeset ଆବଶ୍ୟକ: `pnpm new` (କିମ୍ବା ନନ୍-ରିଲିଜ୍ ପରିବର୍ତ୍ତନ ପାଇଁ `pnpm new:empty`)
   - ସବମିଟ୍ କରିବା ପୂର୍ବରୁ ଟେଷ୍ଟ ପାସ୍ ହେବା ନିଶ୍ଚିତ କରନ୍ତୁ
3. **ଡେଭଲପମେଣ୍ଟ:** ଏହା ଏକ pnpm + turborepo monorepo
   - ଡିପେଣ୍ଡେନ୍ସି ଇନଷ୍ଟଲ୍ କରନ୍ତୁ: `pnpm install`
   - ଟେଷ୍ଟ ଚଲାନ୍ତୁ: `pnpm test`
   - ବିଲ୍ଡ: `pnpm build`

**ସପୋର୍ଟ:** [Discord କମ୍ୟୁନିଟି](https://lingo.dev/go/discord)

## ଷ୍ଟାର୍ ହିଷ୍ଟୋରୀ

ଯଦି ଆପଣ Lingo.dev କୁ ଉପଯୋଗୀ ମନେ କରନ୍ତି, ଆମକୁ ଏକ ଷ୍ଟାର୍ ଦିଅନ୍ତୁ ଏବଂ 10,000 ଷ୍ଟାର୍ ପହଞ୍ଚିବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## ଲୋକାଲାଇଜ୍ଡ ଡକ୍ୟୁମେଣ୍ଟେସନ୍

**ଉପଲବ୍ଧ ଅନୁବାଦ:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**ନୂତନ ଭାଷା ଯୋଡ଼ିବା:**

1. [BCP-47 ଫର୍ମାଟ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ବ୍ୟବହାର କରି [`i18n.json`](./i18n.json) ରେ ଲୋକେଲ୍ କୋଡ୍ ଯୋଡ଼ନ୍ତୁ
2. ଏକ pull request ସବମିଟ୍ କରନ୍ତୁ

**BCP-47 ଲୋକେଲ୍ ଫର୍ମାଟ:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (lowercase): `en`, `zh`, `bho`
- `Script`: ISO 15924 (title case): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (uppercase): `US`, `CN`, `IN`
- ଉଦାହରଣ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
