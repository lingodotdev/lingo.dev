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
    Lingo.dev - LLM-இயக்கப்படும் உள்ளூர்மயமாக்கலுக்கான திறந்த மூல i18n
    கருவித்தொகுப்பு
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
      alt="வெளியீடு"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="உரிமம்"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="கடைசி commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 மாத DevTool"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 வார தயாரிப்பு"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 நாள் தயாரிப்பு"
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

## விரைவு தொடக்கம்

| கருவி                              | பயன்பாட்டு நிகழ்வு                                       | விரைவு கட்டளை                      |
| ---------------------------------- | -------------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React பயன்பாடுகளுக்கான AI-உதவி i18n அமைப்பு              | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO கோப்புகளை மொழிபெயர்க்கவும் | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions இல் தானியங்கு மொழிபெயர்ப்பு pipeline      | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | டைனமிக் உள்ளடக்கத்திற்கான runtime மொழிபெயர்ப்பு          | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n wrappers இல்லாமல் build-time React உள்ளூர்மயமாக்கல் | `withLingo()` plugin               |

---

### Lingo.dev MCP

Model Context Protocol சேவையகம், இது AI குறியீட்டு உதவியாளர்களை இயற்கை மொழி prompts மூலம் React பயன்பாடுகளில் i18n உள்கட்டமைப்பை அமைக்க உதவுகிறது.

**ஆதரிக்கப்படும் IDEகள்:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**ஆதரிக்கப்படும் frameworkகள்:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**பயன்பாடு:**

உங்கள் IDE-யில் MCP சர்வரை உள்ளமைத்த பிறகு ([விரைவு தொடக்க வழிகாட்டிகளைப் பார்க்கவும்](https://lingo.dev/en/mcp)), உங்கள் உதவியாளரிடம் கேளுங்கள்:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

உதவியாளர் செய்யும்:

1. locale அடிப்படையிலான routing-ஐ உள்ளமைக்கும் (எ.கா., `/en`, `/es`, `/pt-BR`)
2. மொழி மாற்று components-ஐ அமைக்கும்
3. தானியங்கு locale கண்டறிதலை செயல்படுத்தும்
4. தேவையான configuration கோப்புகளை உருவாக்கும்

**குறிப்பு:** AI-உதவி code உருவாக்கம் non-deterministic ஆகும். commit செய்வதற்கு முன் உருவாக்கப்பட்ட code-ஐ மதிப்பாய்வு செய்யவும்.

[ஆவணங்களைப் படிக்கவும் →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI மூலம் apps மற்றும் content-ஐ மொழிபெயர்ப்பதற்கான open-source CLI. JSON, YAML, CSV, PO கோப்புகள் மற்றும் markdown உள்ளிட்ட அனைத்து industry-standard வடிவங்களையும் ஆதரிக்கிறது.

**அமைப்பு:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**இது எவ்வாறு செயல்படுகிறது:**

1. உள்ளமைக்கப்பட்ட கோப்புகளிலிருந்து மொழிபெயர்க்கக்கூடிய content-ஐ பிரித்தெடுக்கிறது
2. மொழிபெயர்ப்பிற்காக LLM provider-க்கு content-ஐ அனுப்புகிறது
3. மொழிபெயர்க்கப்பட்ட content-ஐ filesystem-க்கு மீண்டும் எழுதுகிறது
4. முடிக்கப்பட்ட மொழிபெயர்ப்புகளைக் கண்காணிக்க `i18n.lock` கோப்பை உருவாக்குகிறது (தேவையற்ற செயலாக்கத்தைத் தவிர்க்கிறது)

**உள்ளமைவு:**

`init` கட்டளை ஒரு `i18n.json` கோப்பை உருவாக்குகிறது. locales மற்றும் buckets-ஐ உள்ளமைக்கவும்:

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

`provider` புலம் விருப்பமானது (இயல்புநிலையாக Lingo.dev Engine). தனிப்பயன் LLM providers-க்கு:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**ஆதரிக்கப்படும் LLM providers:**

- Lingo.dev Engine (பரிந்துரைக்கப்படுகிறது)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[ஆவணங்களைப் படிக்கவும் →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD pipelines-க்கான தானியங்கு மொழிபெயர்ப்பு workflows. முழுமையடையாத மொழிபெயர்ப்புகள் production-ஐ அடைவதைத் தடுக்கிறது.

**ஆதரிக்கப்படும் தளங்கள்:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions அமைப்பு:**

`.github/workflows/translate.yml` ஐ உருவாக்கவும்:

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

**அமைப்பு தேவைகள்:**

1. `LINGODOTDEV_API_KEY` ஐ repository secrets இல் சேர்க்கவும் (Settings > Secrets and variables > Actions)
2. PR workflows க்கு: Settings > Actions > General இல் "Allow GitHub Actions to create and approve pull requests" ஐ இயக்கவும்

**Workflow விருப்பங்கள்:**

மொழிபெயர்ப்புகளை நேரடியாக commit செய்யவும்:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

மொழிபெயர்ப்புகளுடன் pull requests உருவாக்கவும்:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**கிடைக்கும் inputs:**

| Input                | Default                                        | விளக்கம்                                          |
| -------------------- | ---------------------------------------------- | ------------------------------------------------- |
| `api-key`            | (தேவையானது)                                    | Lingo.dev API key                                 |
| `pull-request`       | `false`                                        | நேரடியாக commit செய்வதற்கு பதிலாக PR உருவாக்கவும் |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | தனிப்பயன் commit செய்தி                           |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | தனிப்பயன் PR தலைப்பு                              |
| `working-directory`  | `"."`                                          | இயக்குவதற்கான directory                           |
| `parallel`           | `false`                                        | இணையான செயலாக்கத்தை இயக்கவும்                     |

[ஆவணங்களைப் படிக்கவும் →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

மாறும் உள்ளடக்கத்திற்கான runtime மொழிபெயர்ப்பு நூலகம். JavaScript, PHP, Python மற்றும் Ruby க்கு கிடைக்கிறது.

**நிறுவல்:**

```bash
npm install lingo.dev
```

**பயன்பாடு:**

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

**கிடைக்கும் SDKs:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Web apps, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ஆவணங்களைப் படிக்கவும் →](https://lingo.dev/en/sdk)

---

### Lingo.dev கம்பைலர்

React பயன்பாடுகளை கூறுகளை மாற்றாமல் பன்மொழி ஆக்கும் build-time மொழிபெயர்ப்பு அமைப்பு. Runtime-க்கு பதிலாக build நேரத்தில் செயல்படுகிறது.

**நிறுவல்:**

```bash
pnpm install @lingo.dev/compiler
```

**அங்கீகாரம்:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**கட்டமைப்பு (Next.js):**

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

**கட்டமைப்பு (Vite):**

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

**Provider அமைப்பு:**

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

**மொழி மாற்றி:**

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

**உருவாக்கம்:** `npm run dev` (pseudotranslator பயன்படுத்துகிறது, API அழைப்புகள் இல்லை)

**உற்பத்தி:** `usePseudotranslator: false` அமைக்கவும், பின்னர் `next build`

`.lingo/` டைரக்டரியை version control-க்கு commit செய்யவும்.

**முக்கிய அம்சங்கள்:**

- Runtime செயல்திறன் செலவு இல்லை
- மொழிபெயர்ப்பு keys அல்லது JSON கோப்புகள் இல்லை
- `t()` functions அல்லது `<T>` wrapper components இல்லை
- JSX-இல் மொழிபெயர்க்கக்கூடிய உரையின் தானியங்கு கண்டறிதல்
- TypeScript ஆதரவு
- பன்மைகளுக்கான ICU MessageFormat
- `data-lingo-override` attribute மூலம் கைமுறை மேலெழுதல்கள்
- உள்ளமைக்கப்பட்ட மொழிபெயர்ப்பு எடிட்டர் widget

**Build modes:**

- `pseudotranslator`: placeholder மொழிபெயர்ப்புகளுடன் development mode (API செலவுகள் இல்லை)
- `real`: LLM-களைப் பயன்படுத்தி உண்மையான மொழிபெயர்ப்புகளை உருவாக்கவும்
- `cache-only`: CI-இலிருந்து முன்-உருவாக்கப்பட்ட மொழிபெயர்ப்புகளைப் பயன்படுத்தும் production mode (API அழைப்புகள் இல்லை)

**ஆதரிக்கப்படும் frameworks:**

- Next.js (React Server Components உடன் App Router)
- Vite + React (SPA மற்றும் SSR)

கூடுதல் framework ஆதரவு திட்டமிடப்பட்டுள்ளது.

[ஆவணங்களைப் படிக்கவும் →](https://lingo.dev/en/compiler)

---

## பங்களிப்பு

பங்களிப்புகள் வரவேற்கப்படுகின்றன. தயவுசெய்து இந்த வழிகாட்டுதல்களைப் பின்பற்றவும்:

1. **சிக்கல்கள்:** [பிழைகளைப் புகாரளிக்கவும் அல்லது அம்சங்களைக் கோரவும்](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [மாற்றங்களைச் சமர்ப்பிக்கவும்](https://github.com/lingodotdev/lingo.dev/pulls)
   - ஒவ்வொரு PR-க்கும் changeset தேவை: `pnpm new` (அல்லது வெளியீடு அல்லாத மாற்றங்களுக்கு `pnpm new:empty`)
   - சமர்ப்பிப்பதற்கு முன் சோதனைகள் தேர்ச்சி பெறுவதை உறுதிசெய்யவும்
3. **மேம்பாடு:** இது ஒரு pnpm + turborepo monorepo
   - சார்புகளை நிறுவவும்: `pnpm install`
   - சோதனைகளை இயக்கவும்: `pnpm test`
   - உருவாக்கவும்: `pnpm build`

**ஆதரவு:** [Discord சமூகம்](https://lingo.dev/go/discord)

## நட்சத்திர வரலாறு

Lingo.dev பயனுள்ளதாக இருந்தால், எங்களுக்கு ஒரு நட்சத்திரம் வழங்கி 10,000 நட்சத்திரங்களை அடைய எங்களுக்கு உதவவும்!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## உள்ளூர்மயமாக்கப்பட்ட ஆவணங்கள்

**கிடைக்கும் மொழிபெயர்ப்புகள்:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**புதிய மொழியைச் சேர்ப்பது:**

1. [BCP-47 வடிவமைப்பைப்](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) பயன்படுத்தி [`i18n.json`](./i18n.json)-இல் locale code-ஐச் சேர்க்கவும்
2. pull request-ஐச் சமர்ப்பிக்கவும்

**BCP-47 locale வடிவமைப்பு:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (சிறிய எழுத்துகள்): `en`, `zh`, `bho`
- `Script`: ISO 15924 (தலைப்பு எழுத்து): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (பெரிய எழுத்துகள்): `US`, `CN`, `IN`
- எடுத்துக்காட்டுகள்: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`