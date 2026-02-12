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

React એપ્સમાં i18n સેટઅપ કરવું કુખ્યાત રીતે ભૂલ-પ્રવણ છે - અનુભવી ડેવલપર્સ માટે પણ. AI કોડિંગ સહાયકો તેને વધુ ખરાબ બનાવે છે: તેઓ અસ્તિત્વમાં ન હોય તેવા API હેલ્યુસિનેટ કરે છે, મિડલવેર કન્ફિગરેશન્સ ભૂલી જાય છે, રાઉટિંગ તોડે છે, અથવા ખોવાઈ જતાં પહેલાં અડધું સોલ્યુશન લાગુ કરે છે. સમસ્યા એ છે કે i18n સેટઅપને બહુવિધ ફાઇલો (રાઉટિંગ, મિડલવેર, કમ્પોનન્ટ્સ, કન્ફિગરેશન) પર સંકલિત ફેરફારોના ચોક્કસ ક્રમની જરૂર છે, અને LLM તે સંદર્ભ જાળવવામાં સંઘર્ષ કરે છે.

Lingo.dev MCP આને AI સહાયકોને ફ્રેમવર્ક-વિશિષ્ટ i18n જ્ઞાનની સ્ટ્રક્ચર્ડ એક્સેસ આપીને હલ કરે છે. અનુમાન લગાવવાને બદલે, તમારો સહાયક Next.js, React Router અને TanStack Start માટે વેરિફાઇડ ઇમ્પ્લિમેન્ટેશન પેટર્નને અનુસરે છે.

**સપોર્ટેડ IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**સપોર્ટેડ ફ્રેમવર્ક્સ:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**ઉપયોગ:**

તમારા IDEમાં MCP સર્વર કન્ફિગર કર્યા પછી ([ક્વિકસ્ટાર્ટ ગાઇડ્સ જુઓ](https://lingo.dev/en/mcp)), તમારા સહાયકને પ્રોમ્પ્ટ કરો:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

સહાયક આ કરશે:

1. લોકેલ-આધારિત રાઉટિંગ કન્ફિગર કરશે (દા.ત., `/en`, `/es`, `/pt-BR`)
2. ભાષા સ્વિચિંગ કમ્પોનન્ટ્સ સેટઅપ કરશે
3. ઓટોમેટિક લોકેલ ડિટેક્શન લાગુ કરશે
4. જરૂરી કન્ફિગરેશન ફાઇલો જનરેટ કરશે

**નોંધ:** AI-સહાયિત કોડ જનરેશન નોન-ડિટર્મિનિસ્ટિક છે. કમિટ કરતાં પહેલાં જનરેટ કરેલા કોડની સમીક્ષા કરો.

[ડોક્સ વાંચો →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

ટ્રાન્સલેશન્સને સિંકમાં રાખવું કંટાળાજનક છે. તમે નવી સ્ટ્રિંગ ઉમેરો છો, તેનું ભાષાંતર કરવાનું ભૂલી જાઓ છો, આંતરરાષ્ટ્રીય યુઝર્સને તૂટેલું UI શિપ કરો છો. અથવા તમે ટ્રાન્સલેટર્સને JSON ફાઇલો મોકલો છો, દિવસો રાહ જુઓ છો, પછી તેમના કામને મેન્યુઅલી પાછા મર્જ કરો છો. 10+ ભાષાઓ સુધી સ્કેલ કરવાનો અર્થ છે સેંકડો ફાઇલોનું સંચાલન કરવું જે સતત સિંકની બહાર જાય છે.

Lingo.dev CLI આને ઓટોમેટ કરે છે. તેને તમારી ટ્રાન્સલેશન ફાઇલો તરફ પોઇન્ટ કરો, એક કમાન્ડ ચલાવો, અને દરેક લોકેલ અપડેટ થાય છે. લોકફાઇલ ટ્રેક કરે છે કે શું પહેલેથી ભાષાંતરિત છે, જેથી તમે ફક્ત નવી અથવા બદલાયેલી કન્ટેન્ટ માટે જ ચૂકવો છો. JSON, YAML, CSV, PO ફાઇલો અને markdown સપોર્ટ કરે છે.

**સેટઅપ:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**તે કેવી રીતે કામ કરે છે:**

1. કન્ફિગર કરેલી ફાઇલોમાંથી અનુવાદ યોગ્ય કન્ટેન્ટ એક્સટ્રેક્ટ કરે છે
2. અનુવાદ માટે LLM પ્રોવાઇડરને કન્ટેન્ટ મોકલે છે
3. અનુવાદિત કન્ટેન્ટને ફાઇલસિસ્ટમમાં પાછું લખે છે
4. પૂર્ણ થયેલા અનુવાદોને ટ્રેક કરવા માટે `i18n.lock` ફાઇલ બનાવે છે (રીડન્ડન્ટ પ્રોસેસિંગ ટાળે છે)

**કન્ફિગરેશન:**

`init` કમાન્ડ `i18n.json` ફાઇલ જનરેટ કરે છે. લોકેલ્સ અને બકેટ્સ કન્ફિગર કરો:

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

અનુવાદો એ એવી ફીચર છે જે હંમેશા "લગભગ પૂર્ણ" હોય છે. એન્જિનિયરો લોકેલ્સ અપડેટ કર્યા વિના કોડ મર્જ કરે છે. QA સ્ટેજિંગમાં ખૂટતા અનુવાદો પકડે છે - અથવા વધુ ખરાબ, યુઝર્સ તેને પ્રોડક્શનમાં પકડે છે. મૂળ કારણ: અનુવાદ એક મેન્યુઅલ સ્ટેપ છે જે ડેડલાઇન પ્રેશર હેઠળ સ્કિપ કરવું સરળ છે.

Lingo.dev CI/CD અનુવાદોને ઓટોમેટિક બનાવે છે. દરેક પુશ અનુવાદને ટ્રિગર કરે છે. કોડ પ્રોડક્શનમાં પહોંચે તે પહેલાં ખૂટતી સ્ટ્રિંગ્સ ભરાઈ જાય છે. કોઈ ડિસિપ્લિનની જરૂર નથી - પાઇપલાઇન તેને હેન્ડલ કરે છે.

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

ભાષાંતરો સાથે pull requests બનાવો:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**ઉપલબ્ધ inputs:**

| Input                | Default                                        | Description                    |
| -------------------- | ---------------------------------------------- | ------------------------------ |
| `api-key`            | (આવશ્યક)                                       | Lingo.dev API key              |
| `pull-request`       | `false`                                        | સીધા કમિટ કરવાને બદલે PR બનાવો |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | કસ્ટમ commit message           |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | કસ્ટમ PR title                 |
| `working-directory`  | `"."`                                          | જેમાં રન કરવું તે ડિરેક્ટરી    |
| `parallel`           | `false`                                        | પેરેલલ પ્રોસેસિંગ સક્ષમ કરો    |

[ડોક્સ વાંચો →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

સ્ટેટિક ટ્રાન્સલેશન ફાઇલો UI લેબલ્સ માટે કામ કરે છે, પરંતુ યુઝર-જનરેટેડ કન્ટેન્ટ વિશે શું? ચેટ મેસેજ, પ્રોડક્ટ વર્ણનો, સપોર્ટ ટિકિટ્સ - જે કન્ટેન્ટ બિલ્ડ ટાઇમ પર અસ્તિત્વમાં નથી તેનું પ્રી-ટ્રાન્સલેશન કરી શકાતું નથી. તમે અનુવાદ વિનાનું ટેક્સ્ટ બતાવવા અથવા કસ્ટમ ટ્રાન્સલેશન પાઇપલાઇન બનાવવા માટે અટવાઈ જાઓ છો.

Lingo.dev SDK રનટાઇમ પર કન્ટેન્ટનું ભાષાંતર કરે છે. કોઈપણ ટેક્સ્ટ, ઑબ્જેક્ટ અથવા HTML પાસ કરો અને લોકલાઇઝ્ડ વર્ઝન પાછું મેળવો. રિયલ-ટાઇમ ચેટ, ડાયનેમિક નોટિફિકેશન્સ અથવા ડિપ્લોયમેન્ટ પછી આવતા કોઈપણ કન્ટેન્ટ માટે કામ કરે છે. JavaScript, PHP, Python અને Ruby માટે ઉપલબ્ધ.

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

**ઉપલબ્ધ SDKs:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Web apps, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ડોક્સ વાંચો →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

પરંપરાગત i18n આક્રમક છે. તમે દરેક સ્ટ્રિંગને `t()` ફંક્શન્સમાં રેપ કરો છો, ટ્રાન્સલેશન કી શોધો છો (`home.hero.title.v2`), પેરેલલ JSON ફાઇલો મેન્ટેઇન કરો છો, અને તમારા કમ્પોનન્ટ્સને લોકલાઇઝેશન બોઇલરપ્લેટથી ફૂલતા જુઓ છો. તે એટલું કંટાળાજનક છે કે ટીમો આંતરરાષ્ટ્રીયકરણને વિલંબિત કરે છે જ્યાં સુધી તે મોટા રિફેક્ટરમાં ન બદલાય.

Lingo.dev કમ્પાઇલર ઔપચારિકતાને દૂર કરે છે. સાદા અંગ્રેજી ટેક્સ્ટ સાથે React કમ્પોનન્ટ્સ લખો. કમ્પાઇલર બિલ્ડ સમયે ભાષાંતર યોગ્ય સ્ટ્રિંગ્સ શોધી કાઢે છે અને આપમેળે સ્થાનિકીકૃત વેરિઅન્ટ્સ જનરેટ કરે છે. કોઈ કી નહીં, કોઈ JSON ફાઇલો નહીં, કોઈ રેપર ફંક્શન્સ નહીં - ફક્ત React કોડ જે બહુવિધ ભાષાઓમાં કામ કરે છે.

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

**કોન્ફિગરેશન (Next.js):**

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

**કોન્ફિગરેશન (Vite):**

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

**ડેવલપમેન્ટ:** `npm run dev` (સ્યુડોટ્રાન્સલેટરનો ઉપયોગ કરે છે, કોઈ API કોલ્સ નહીં)

**પ્રોડક્શન:** `usePseudotranslator: false` સેટ કરો, પછી `next build`

`.lingo/` ડિરેક્ટરીને વર્ઝન કન્ટ્રોલમાં કમિટ કરો.

**મુખ્ય વિશેષતાઓ:**

- શૂન્ય રનટાઇમ પરફોર્મન્સ કોસ્ટ
- કોઈ ટ્રાન્સલેશન કી અથવા JSON ફાઇલો નહીં
- કોઈ `t()` ફંક્શન્સ અથવા `<T>` રેપર કમ્પોનન્ટ્સ નહીં
- JSX માં ભાષાંતર યોગ્ય ટેક્સ્ટની આપમેળે શોધ
- TypeScript સપોર્ટ
- બહુવચન માટે ICU MessageFormat
- `data-lingo-override` એટ્રિબ્યુટ દ્વારા મેન્યુઅલ ઓવરરાઇડ્સ
- બિલ્ટ-ઇન ટ્રાન્સલેશન એડિટર વિજેટ

**બિલ્ડ મોડ્સ:**

- `pseudotranslator`: પ્લેસહોલ્ડર ટ્રાન્સલેશન્સ સાથે ડેવલપમેન્ટ મોડ (કોઈ API કોસ્ટ નહીં)
- `real`: LLMs નો ઉપયોગ કરીને વાસ્તવિક ટ્રાન્સલેશન્સ જનરેટ કરો
- `cache-only`: CI માંથી પ્રી-જનરેટેડ ટ્રાન્સલેશન્સનો ઉપયોગ કરીને પ્રોડક્શન મોડ (કોઈ API કોલ્સ નહીં)

**સપોર્ટેડ ફ્રેમવર્ક્સ:**

- Next.js (React Server Components સાથે App Router)
- Vite + React (SPA અને SSR)

વધારાના ફ્રેમવર્ક સપોર્ટની યોજના છે.

[ડોક્સ વાંચો →](https://lingo.dev/en/compiler)

---

## યોગદાન

યોગદાનનું સ્વાગત છે. કૃપા કરીને આ માર્ગદર્શિકાઓનું પાલન કરો:

1. **સમસ્યાઓ:** [બગ્સની જાણ કરો અથવા સુવિધાઓની વિનંતી કરો](https://github.com/lingodotdev/lingo.dev/issues)
2. **પુલ રિક્વેસ્ટ્સ:** [ફેરફારો સબમિટ કરો](https://github.com/lingodotdev/lingo.dev/pulls)
   - દરેક PR માટે changeset જરૂરી છે: `pnpm new` (અથવા નોન-રિલીઝ ફેરફારો માટે `pnpm new:empty`)
   - સબમિટ કરતા પહેલાં ખાતરી કરો કે ટેસ્ટ્સ પાસ થાય છે
3. **ડેવલપમેન્ટ:** આ pnpm + turborepo monorepo છે
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

1. [BCP-47 ફોર્મેટ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)નો ઉપયોગ કરીને [`i18n.json`](./i18n.json)માં લોકેલ કોડ ઉમેરો
2. પુલ રિક્વેસ્ટ સબમિટ કરો

**BCP-47 લોકેલ ફોર્મેટ:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (lowercase): `en`, `zh`, `bho`
- `Script`: ISO 15924 (title case): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (uppercase): `US`, `CN`, `IN`
- ઉદાહરણો: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
