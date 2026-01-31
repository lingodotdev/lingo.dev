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
    Lingo.dev - LLM-સંચાલિત સ્થાનિકીકરણ માટે ઓપન-સોર્સ i18n ટૂલકિટ
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

## ઝડપી શરૂઆત

| ટૂલ                                | ઉપયોગ કેસ                                      | ઝડપી કમાન્ડ                        |
| ---------------------------------- | ---------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React એપ્લિકેશન્સ માટે AI-સહાયિત i18n સેટઅપ    | પ્રોમ્પ્ટ: `Set up i18n`           |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO ફાઇલોનું ભાષાંતર | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions માં સ્વચાલિત ભાષાંતર પાઇપલાઇન   | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | ડાયનેમિક કન્ટેન્ટ માટે રનટાઇમ ભાષાંતર          | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n રેપર્સ વિના બિલ્ડ-ટાઇમ React સ્થાનિકીકરણ  | `withLingo()` પ્લગઇન               |

---

### Lingo.dev MCP

Model Context Protocol સર્વર જે AI કોડિંગ સહાયકોને કુદરતી ભાષા પ્રોમ્પ્ટ્સ દ્વારા React એપ્લિકેશન્સમાં i18n ઇન્ફ્રાસ્ટ્રક્ચર સેટઅપ કરવા સક્ષમ બનાવે છે.

**સપોર્ટેડ IDEs:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**સપોર્ટેડ ફ્રેમવર્ક્સ:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**ઉપયોગ:**

તમારા IDE માં MCP સર્વર કોન્ફિગર કર્યા પછી ([ક્વિકસ્ટાર્ટ માર્ગદર્શિકાઓ જુઓ](https://lingo.dev/en/mcp)), તમારા સહાયકને પ્રોમ્પ્ટ કરો:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

સહાયક આ કરશે:

1. લોકેલ-આધારિત રાઉટિંગ કોન્ફિગર કરો (દા.ત., `/en`, `/es`, `/pt-BR`)
2. ભાષા સ્વિચિંગ કમ્પોનન્ટ્સ સેટઅપ કરો
3. ઓટોમેટિક લોકેલ ડિટેક્શન લાગુ કરો
4. જરૂરી કોન્ફિગરેશન ફાઇલો જનરેટ કરો

**નોંધ:** AI-સહાયિત કોડ જનરેશન નોન-ડિટર્મિનિસ્ટિક છે. કમિટ કરતા પહેલા જનરેટ કરેલા કોડની સમીક્ષા કરો.

[ડોક્સ વાંચો →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI સાથે એપ્લિકેશન્સ અને કન્ટેન્ટનું ભાષાંતર કરવા માટે ઓપન-સોર્સ CLI. JSON, YAML, CSV, PO ફાઇલો અને markdown સહિત તમામ ઇન્ડસ્ટ્રી-સ્ટાન્ડર્ડ ફોર્મેટ્સને સપોર્ટ કરે છે.

**સેટઅપ:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**તે કેવી રીતે કામ કરે છે:**

1. કોન્ફિગર કરેલી ફાઇલોમાંથી ભાષાંતર યોગ્ય કન્ટેન્ટ એક્સ્ટ્રેક્ટ કરે છે
2. ભાષાંતર માટે LLM પ્રોવાઇડરને કન્ટેન્ટ મોકલે છે
3. ભાષાંતરિત કન્ટેન્ટને ફાઇલસિસ્ટમમાં પાછું લખે છે
4. પૂર્ણ થયેલા ભાષાંતરોને ટ્રેક કરવા માટે `i18n.lock` ફાઇલ બનાવે છે (રિડન્ડન્ટ પ્રોસેસિંગ ટાળે છે)

**કોન્ફિગરેશન:**

`init` કમાન્ડ `i18n.json` ફાઇલ જનરેટ કરે છે. લોકેલ્સ અને બકેટ્સ કોન્ફિગર કરો:

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

`provider` ફીલ્ડ વૈકલ્પિક છે (ડિફોલ્ટ Lingo.dev Engine). કસ્ટમ LLM પ્રોવાઇડર્સ માટે:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**સપોર્ટેડ LLM પ્રોવાઇડર્સ:**

- Lingo.dev Engine (ભલામણ કરેલ)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[ડોક્સ વાંચો →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD પાઇપલાઇન્સ માટે ઓટોમેટેડ ભાષાંતર વર્કફ્લો. અપૂર્ણ ભાષાંતરોને પ્રોડક્શનમાં પહોંચતા અટકાવે છે.

**સપોર્ટેડ પ્લેટફોર્મ્સ:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions સેટઅપ:**

`.github/workflows/translate.yml` બનાવો:

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

**સેટઅપ આવશ્યકતાઓ:**

1. રિપોઝિટરી સિક્રેટ્સમાં `LINGODOTDEV_API_KEY` ઉમેરો (Settings > Secrets and variables > Actions)
2. PR વર્કફ્લો માટે: Settings > Actions > General માં "Allow GitHub Actions to create and approve pull requests" સક્ષમ કરો

**વર્કફ્લો વિકલ્પો:**

અનુવાદો સીધા કમિટ કરો:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

અનુવાદો સાથે pull requests બનાવો:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**ઉપલબ્ધ ઇનપુટ્સ:**

| Input                | Default                                        | Description                    |
| -------------------- | ---------------------------------------------- | ------------------------------ |
| `api-key`            | (required)                                     | Lingo.dev API key              |
| `pull-request`       | `false`                                        | સીધા કમિટ કરવાને બદલે PR બનાવો |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | કસ્ટમ કમિટ મેસેજ               |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | કસ્ટમ PR ટાઇટલ                 |
| `working-directory`  | `"."`                                          | જેમાં રન કરવું તે ડિરેક્ટરી    |
| `parallel`           | `false`                                        | પેરેલલ પ્રોસેસિંગ સક્ષમ કરો    |

[ડોક્સ વાંચો →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

ડાયનેમિક કન્ટેન્ટ માટે રનટાઇમ ટ્રાન્સલેશન લાઇબ્રેરી. JavaScript, PHP, Python અને Ruby માટે ઉપલબ્ધ.

**ઇન્સ્ટોલેશન:**

```bash
npm install lingo.dev
```

**ઉપયોગ:**

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

**ઉપલબ્ધ SDK:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - વેબ એપ્સ, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ડોક્સ વાંચો →](https://lingo.dev/en/sdk)

---

### Lingo.dev કમ્પાઈલર

બિલ્ડ-ટાઇમ અનુવાદ સિસ્ટમ જે કમ્પોનન્ટ્સમાં ફેરફાર કર્યા વિના React એપ્લિકેશન્સને બહુભાષી બનાવે છે. રનટાઇમને બદલે બિલ્ડ દરમિયાન કાર્ય કરે છે.

**ઇન્સ્ટોલેશન:**

```bash
pnpm install @lingo.dev/compiler
```

**ઓથેન્ટિકેશન:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**કન્ફિગરેશન (Next.js):**

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

**કન્ફિગરેશન (Vite):**

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

**પ્રોવાઇડર સેટઅપ:**

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

**ભાષા સ્વિચર:**

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

**ડેવલપમેન્ટ:** `npm run dev` (સ્યુડોટ્રાન્સલેટરનો ઉપયોગ કરે છે, કોઈ API કૉલ્સ નહીં)

**પ્રોડક્શન:** `usePseudotranslator: false` સેટ કરો, પછી `next build`

`.lingo/` ડિરેક્ટરીને વર્ઝન કન્ટ્રોલમાં કમિટ કરો.

**મુખ્ય વિશેષતાઓ:**

- શૂન્ય રનટાઇમ પરફોર્મન્સ કોસ્ટ
- કોઈ ટ્રાન્સલેશન કી અથવા JSON ફાઇલો નહીં
- કોઈ `t()` ફંક્શન્સ અથવા `<T>` રેપર કમ્પોનન્ટ્સ નહીં
- JSXમાં અનુવાદ યોગ્ય ટેક્સ્ટની ઓટોમેટિક ડિટેક્શન
- TypeScript સપોર્ટ
- બહુવચન માટે ICU MessageFormat
- `data-lingo-override` એટ્રિબ્યુટ દ્વારા મેન્યુઅલ ઓવરરાઇડ્સ
- બિલ્ટ-ઇન ટ્રાન્સલેશન એડિટર વિજેટ

**બિલ્ડ મોડ્સ:**

- `pseudotranslator`: પ્લેસહોલ્ડર ટ્રાન્સલેશન્સ સાથે ડેવલપમેન્ટ મોડ (કોઈ API કોસ્ટ નહીં)
- `real`: LLMsનો ઉપયોગ કરીને વાસ્તવિક અનુવાદો જનરેટ કરો
- `cache-only`: CIમાંથી પ્રી-જનરેટેડ ટ્રાન્સલેશન્સનો ઉપયોગ કરતો પ્રોડક્શન મોડ (કોઈ API કૉલ્સ નહીં)

**સપોર્ટેડ ફ્રેમવર્ક્સ:**

- Next.js (React Server Components સાથે App Router)
- Vite + React (SPA અને SSR)

વધારાના ફ્રેમવર્ક સપોર્ટ આયોજિત છે.

[દસ્તાવેજો વાંચો →](https://lingo.dev/en/compiler)

---

## યોગદાન

યોગદાનનું સ્વાગત છે. કૃપા કરીને આ માર્ગદર્શિકાઓનું પાલન કરો:

1. **સમસ્યાઓ:** [બગ્સની જાણ કરો અથવા સુવિધાઓની વિનંતી કરો](https://github.com/lingodotdev/lingo.dev/issues)
2. **પુલ રિક્વેસ્ટ્સ:** [ફેરફારો સબમિટ કરો](https://github.com/lingodotdev/lingo.dev/pulls)
   - દરેક PR માટે ચેન્જસેટ જરૂરી છે: `pnpm new` (અથવા નોન-રિલીઝ ફેરફારો માટે `pnpm new:empty`)
   - સબમિટ કરતા પહેલાં ટેસ્ટ્સ પાસ થાય તેની ખાતરી કરો
3. **ડેવલપમેન્ટ:** આ pnpm + turborepo મોનોરેપો છે
   - ડિપેન્ડન્સીઝ ઇન્સ્ટોલ કરો: `pnpm install`
   - ટેસ્ટ્સ ચલાવો: `pnpm test`
   - બિલ્ડ: `pnpm build`

**સપોર્ટ:** [Discord કમ્યુનિટી](https://lingo.dev/go/discord)

## સ્ટાર હિસ્ટ્રી

જો તમને Lingo.dev ઉપયોગી લાગે, તો અમને સ્ટાર આપો અને 10,000 સ્ટાર્સ સુધી પહોંચવામાં અમારી મદદ કરો!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## સ્થાનિકીકૃત દસ્તાવેજીકરણ

**ઉપલબ્ધ અનુવાદો:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**નવી ભાષા ઉમેરવી:**

1. [BCP-47 ફોર્મેટ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) નો ઉપયોગ કરીને [`i18n.json`](./i18n.json) માં લોકેલ કોડ ઉમેરો
2. પુલ રિક્વેસ્ટ સબમિટ કરો

**BCP-47 લોકેલ ફોર્મેટ:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (લોઅરકેસ): `en`, `zh`, `bho`
- `Script`: ISO 15924 (ટાઇટલ કેસ): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (અપરકેસ): `US`, `CN`, `IN`
- ઉદાહરણો: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
