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
    Lingo.dev - LLM බලගන්වන ප්‍රාදේශීයකරණය සඳහා විවෘත මූලාශ්‍ර i18n මෙවලම්
    කට්ටලය
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

## ඉක්මන් ආරම්භය

| මෙවලම                              | භාවිත අවස්ථාව                                         | ඉක්මන් විධානය                      |
| ---------------------------------- | ----------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React යෙදුම් සඳහා AI-සහාය i18n සැකසුම                 | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO ගොනු පරිවර්තනය කරන්න    | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions හි ස්වයංක්‍රීය පරිවර්තන pipeline       | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | ගතික අන්තර්ගතය සඳහා runtime පරිවර්තනය                 | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n wrappers නොමැතිව build-time React ප්‍රාදේශීයකරණය | `withLingo()` plugin               |

---

### Lingo.dev MCP

ස්වාභාවික භාෂා prompts හරහා React යෙදුම්වල i18n යටිතල පහසුකම් සැකසීමට AI කේතන සහායකයින්ට හැකියාව ලබා දෙන Model Context Protocol සේවාදායකය.

**සහාය දක්වන IDEs:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**සහාය දක්වන frameworks:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**භාවිතය:**

ඔබේ IDE හි MCP සේවාදායකය වින්‍යාස කිරීමෙන් පසු ([ක්ෂණික ආරම්භක මාර්ගෝපදේශ බලන්න](https://lingo.dev/en/mcp)), ඔබේ සහායකයාට විමසන්න:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

සහායකයා:

1. ස්ථාන-පාදක මාර්ගගත කිරීම වින්‍යාස කරයි (උදා., `/en`, `/es`, `/pt-BR`)
2. භාෂා මාරු කිරීමේ සංරචක සකසයි
3. ස්වයංක්‍රීය ස්ථාන හඳුනාගැනීම ක්‍රියාත්මක කරයි
4. අවශ්‍ය වින්‍යාස ගොනු ජනනය කරයි

**සටහන:** AI-සහාය කේත ජනනය අ-නිර්ණායක වේ. කැපවීමට පෙර ජනනය කළ කේතය සමාලෝචනය කරන්න.

[ලේඛන කියවන්න →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI සමඟ යෙදුම් සහ අන්තර්ගතය පරිවර්තනය කිරීම සඳහා විවෘත-මූලාශ්‍ර CLI. JSON, YAML, CSV, PO ගොනු සහ markdown ඇතුළු සියලුම කර්මාන්ත-සම්මත ආකෘති සඳහා සහාය දක්වයි.

**සැකසුම:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**එය ක්‍රියා කරන ආකාරය:**

1. වින්‍යාස කළ ගොනු වලින් පරිවර්තනය කළ හැකි අන්තර්ගතය උකහා ගනී
2. පරිවර්තනය සඳහා LLM සපයන්නා වෙත අන්තර්ගතය යවයි
3. පරිවර්තනය කළ අන්තර්ගතය ගොනු පද්ධතියට නැවත ලියයි
4. සම්පූර්ණ කළ පරිවර්තන ලුහුබැඳීමට `i18n.lock` ගොනුව සාදයි (අතිරික්ත සැකසීම වළක්වයි)

**වින්‍යාසය:**

`init` විධානය `i18n.json` ගොනුවක් ජනනය කරයි. ස්ථාන සහ බාල්දි වින්‍යාස කරන්න:

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

`provider` ක්ෂේත්‍රය විකල්ප වේ (පෙරනිමියෙන් Lingo.dev Engine වෙත). අභිරුචි LLM සපයන්නන් සඳහා:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**සහාය දක්වන LLM සපයන්නන්:**

- Lingo.dev Engine (නිර්දේශිත)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[ලේඛන කියවන්න →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD නල මාර්ග සඳහා ස්වයංක්‍රීය පරිවර්තන කාර්ය ප්‍රවාහ. අසම්පූර්ණ පරිවර්තන නිෂ්පාදනයට ළඟා වීම වළක්වයි.

**සහාය දක්වන වේදිකා:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions සැකසුම:**

`.github/workflows/translate.yml` නිර්මාණය කරන්න:

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

**සැකසුම් අවශ්‍යතා:**

1. `LINGODOTDEV_API_KEY` ගබඩා රහස්‍යන්ට එක් කරන්න (Settings > Secrets and variables > Actions)
2. PR වැඩ ප්‍රවාහ සඳහා: Settings > Actions > General හි "Allow GitHub Actions to create and approve pull requests" සක්‍රීය කරන්න

**වැඩ ප්‍රවාහ විකල්ප:**

පරිවර්තන සෘජුවම commit කරන්න:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

පරිවර්තන සමඟ pull requests නිර්මාණය කරන්න:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**ලබා ගත හැකි ආදාන:**

| ආදානය                | පෙරනිමි                                        | විස්තරය                                      |
| -------------------- | ---------------------------------------------- | -------------------------------------------- |
| `api-key`            | (අවශ්‍යයි)                                     | Lingo.dev API යතුර                           |
| `pull-request`       | `false`                                        | සෘජුවම commit කිරීම වෙනුවට PR නිර්මාණය කරන්න |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | අභිරුචි commit පණිවිඩය                       |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | අභිරුචි PR ශීර්ෂය                            |
| `working-directory`  | `"."`                                          | ධාවනය කිරීමට නාමාවලිය                        |
| `parallel`           | `false`                                        | සමාන්තර සැකසුම් සක්‍රීය කරන්න                |

[ලේඛන කියවන්න →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

ගතික අන්තර්ගතය සඳහා ධාවන කාල පරිවර්තන පුස්තකාලය. JavaScript, PHP, Python සහ Ruby සඳහා ලබා ගත හැකිය.

**ස්ථාපනය:**

```bash
npm install lingo.dev
```

**භාවිතය:**

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

**ලබා ගත හැකි SDK:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - වෙබ් යෙදුම්, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ලේඛන කියවන්න →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

React යෙදුම් සංරචක වෙනස් නොකර බහුභාෂා බවට පත් කරන build-time පරිවර්තන පද්ධතියකි. Runtime වෙනුවට build කාලය තුළ ක්‍රියාත්මක වේ.

**ස්ථාපනය:**

```bash
pnpm install @lingo.dev/compiler
```

**සත්‍යාපනය:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**වින්‍යාසය (Next.js):**

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

**වින්‍යාසය (Vite):**

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

**Provider setup:**

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

**භාෂා මාරුකරු:**

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

**සංවර්ධනය:** `npm run dev` (pseudotranslator භාවිතා කරයි, API calls නැත)

**නිෂ්පාදනය:** `usePseudotranslator: false` සකසන්න, පසුව `next build`

`.lingo/` directory එක version control වෙත commit කරන්න.

**ප්‍රධාන විශේෂාංග:**

- Runtime performance පිරිවැය ශුන්‍යයි
- පරිවර්තන යතුරු හෝ JSON ගොනු නැත
- `t()` functions හෝ `<T>` wrapper components නැත
- JSX හි පරිවර්තනය කළ හැකි පෙළ ස්වයංක්‍රීයව හඳුනාගැනීම
- TypeScript සහාය
- බහුවචන සඳහා ICU MessageFormat
- `data-lingo-override` attribute හරහා manual overrides
- Built-in පරිවර්තන සංස්කාරක widget

**Build modes:**

- `pseudotranslator`: Placeholder පරිවර්තන සහිත සංවර්ධන ප්‍රකාරය (API පිරිවැය නැත)
- `real`: LLMs භාවිතයෙන් සැබෑ පරිවර්තන උත්පාදනය කරන්න
- `cache-only`: CI වෙතින් පෙර-උත්පාදිත පරිවර්තන භාවිතා කරන නිෂ්පාදන ප්‍රකාරය (API calls නැත)

**සහාය දක්වන frameworks:**

- Next.js (React Server Components සමඟ App Router)
- Vite + React (SPA සහ SSR)

අතිරේක framework සහාය සැලසුම් කර ඇත.

[ලේඛන කියවන්න →](https://lingo.dev/en/compiler)

---

## දායකත්වය

දායකත්වයන් සාදරයෙන් පිළිගනිමු. කරුණාකර මෙම මාර්ගෝපදේශ අනුගමනය කරන්න:

1. **ගැටළු:** [දෝෂ වාර්තා කරන්න හෝ විශේෂාංග ඉල්ලන්න](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [වෙනස්කම් ඉදිරිපත් කරන්න](https://github.com/lingodotdev/lingo.dev/pulls)
   - සෑම PR එකකටම changeset එකක් අවශ්‍යයි: `pnpm new` (හෝ නිකුතු නොවන වෙනස්කම් සඳහා `pnpm new:empty`)
   - ඉදිරිපත් කිරීමට පෙර පරීක්ෂණ සාර්ථක වන බව සහතික කරන්න
3. **සංවර්ධනය:** මෙය pnpm + turborepo monorepo එකකි
   - යැපීම් ස්ථාපනය කරන්න: `pnpm install`
   - පරීක්ෂණ ධාවනය කරන්න: `pnpm test`
   - ගොඩනගන්න: `pnpm build`

**සහාය:** [Discord ප්‍රජාව](https://lingo.dev/go/discord)

## තරු ඉතිහාසය

ඔබට Lingo.dev ප්‍රයෝජනවත් නම්, අපට තරුවක් ලබා දී තරු 10,000ක් කරා ළඟා වීමට අපට උදව් කරන්න!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## දේශීයකරණය කළ ලේඛන

**ලබා ගත හැකි පරිවර්තන:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**නව භාෂාවක් එකතු කිරීම:**

1. [BCP-47 ආකෘතිය](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) භාවිතයෙන් [`i18n.json`](./i18n.json) වෙත locale කේතය එකතු කරන්න
2. Pull request එකක් ඉදිරිපත් කරන්න

**BCP-47 locale ආකෘතිය:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (lowercase): `en`, `zh`, `bho`
- `Script`: ISO 15924 (title case): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (uppercase): `US`, `CN`, `IN`
- උදාහරණ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
