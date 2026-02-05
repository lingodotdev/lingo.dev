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

React பயன்பாடுகளில் i18n-ஐ அமைப்பது பிழைகள் ஏற்படக்கூடியது என்பது நன்கு அறியப்பட்டது - அனுபவம் வாய்ந்த developers-க்கு கூட. AI coding உதவியாளர்கள் இதை மோசமாக்குகின்றன: அவை இல்லாத API-களை கற்பனை செய்கின்றன, middleware கட்டமைப்புகளை மறக்கின்றன, routing-ஐ உடைக்கின்றன, அல்லது தொலைந்து போவதற்கு முன் பாதி தீர்வை செயல்படுத்துகின்றன. பிரச்சனை என்னவென்றால், i18n அமைப்புக்கு பல கோப்புகளில் (routing, middleware, components, configuration) துல்லியமான வரிசைப்படுத்தப்பட்ட மாற்றங்கள் தேவைப்படுகின்றன, மேலும் LLM-கள் அந்த சூழலை பராமரிக்க சிரமப்படுகின்றன.

Lingo.dev MCP இதை தீர்க்கிறது, AI உதவியாளர்களுக்கு framework-சார்ந்த i18n அறிவுக்கான கட்டமைக்கப்பட்ட அணுகலை வழங்குவதன் மூலம். யூகிப்பதற்கு பதிலாக, உங்கள் உதவியாளர் Next.js, React Router மற்றும் TanStack Start-க்கான சரிபார்க்கப்பட்ட செயல்படுத்தல் முறைகளை பின்பற்றுகிறது.

**ஆதரிக்கப்படும் IDE-கள்:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**ஆதரிக்கப்படும் frameworks:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**பயன்பாடு:**

உங்கள் IDE-யில் MCP server-ஐ கட்டமைத்த பிறகு ([quickstart வழிகாட்டிகளைப் பார்க்கவும்](https://lingo.dev/en/mcp)), உங்கள் உதவியாளரிடம் கேளுங்கள்:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

உதவியாளர் செய்யும்:

1. Locale-அடிப்படையிலான routing-ஐ கட்டமைக்கும் (எ.கா., `/en`, `/es`, `/pt-BR`)
2. மொழி மாற்றும் components-ஐ அமைக்கும்
3. தானியங்கு locale கண்டறிதலை செயல்படுத்தும்
4. தேவையான கட்டமைப்பு கோப்புகளை உருவாக்கும்

**குறிப்பு:** AI-உதவி code உருவாக்கம் non-deterministic ஆகும். commit செய்வதற்கு முன் உருவாக்கப்பட்ட code-ஐ மதிப்பாய்வு செய்யவும்.

[ஆவணங்களைப் படிக்கவும் →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

மொழிபெயர்ப்புகளை ஒத்திசைவில் வைத்திருப்பது சலிப்பானது. நீங்கள் புதிய string-ஐ சேர்க்கிறீர்கள், அதை மொழிபெயர்க்க மறக்கிறீர்கள், சர்வதேச பயனர்களுக்கு உடைந்த UI-ஐ அனுப்புகிறீர்கள். அல்லது நீங்கள் மொழிபெயர்ப்பாளர்களுக்கு JSON கோப்புகளை அனுப்புகிறீர்கள், நாட்கள் காத்திருக்கிறீர்கள், பின்னர் அவர்களின் வேலையை கைமுறையாக மீண்டும் இணைக்கிறீர்கள். 10+ மொழிகளுக்கு அளவிடுவது என்பது தொடர்ந்து ஒத்திசைவிலிருந்து விலகும் நூற்றுக்கணக்கான கோப்புகளை நிர்வகிப்பதாகும்.

Lingo.dev CLI இதை தானியங்குபடுத்துகிறது. உங்கள் மொழிபெயர்ப்பு கோப்புகளை சுட்டிக்காட்டி, ஒரு கட்டளையை இயக்கவும், ஒவ்வொரு locale-ம் புதுப்பிக்கப்படும். ஏற்கனவே மொழிபெயர்க்கப்பட்டதை lockfile கண்காணிக்கிறது, எனவே நீங்கள் புதிய அல்லது மாற்றப்பட்ட content-க்கு மட்டுமே பணம் செலுத்துகிறீர்கள். JSON, YAML, CSV, PO கோப்புகள் மற்றும் markdown-ஐ ஆதரிக்கிறது.

**அமைப்பு:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**இது எவ்வாறு செயல்படுகிறது:**

1. கட்டமைக்கப்பட்ட கோப்புகளிலிருந்து மொழிபெயர்க்கக்கூடிய உள்ளடக்கத்தை பிரித்தெடுக்கிறது
2. மொழிபெயர்ப்புக்காக உள்ளடக்கத்தை LLM provider-க்கு அனுப்புகிறது
3. மொழிபெயர்க்கப்பட்ட உள்ளடக்கத்தை filesystem-க்கு மீண்டும் எழுதுகிறது
4. முடிக்கப்பட்ட மொழிபெயர்ப்புகளைக் கண்காணிக்க `i18n.lock` கோப்பை உருவாக்குகிறது (தேவையற்ற செயலாக்கத்தைத் தவிர்க்கிறது)

**கட்டமைப்பு:**

`init` கட்டளை ஒரு `i18n.json` கோப்பை உருவாக்குகிறது. locales மற்றும் buckets-ஐ கட்டமைக்கவும்:

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

மொழிபெயர்ப்புகள் எப்போதும் "கிட்டத்தட்ட முடிந்துவிட்ட" அம்சமாகும். பொறியாளர்கள் locales-ஐ புதுப்பிக்காமல் code-ஐ merge செய்கிறார்கள். QA staging-இல் காணாமல் போன மொழிபெயர்ப்புகளைக் கண்டறிகிறது - அல்லது மோசமாக, பயனர்கள் production-இல் அவற்றைக் கண்டறிகிறார்கள். மூல காரணம்: மொழிபெயர்ப்பு என்பது deadline அழுத்தத்தின் கீழ் தவிர்க்க எளிதான ஒரு கைமுறை படியாகும்.

Lingo.dev CI/CD மொழிபெயர்ப்புகளை தானியங்குபடுத்துகிறது. ஒவ்வொரு push-ம் மொழிபெயர்ப்பைத் தூண்டுகிறது. காணாமல் போன strings code production-ஐ அடையும் முன் நிரப்பப்படுகின்றன. ஒழுக்கம் தேவையில்லை - pipeline அதைக் கையாளுகிறது.

**ஆதரிக்கப்படும் platforms:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions அமைப்பு:**

`.github/workflows/translate.yml` உருவாக்கவும்:

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

1. repository secrets-க்கு `LINGODOTDEV_API_KEY` சேர்க்கவும் (Settings > Secrets and variables > Actions)
2. PR workflows-க்கு: Settings > Actions > General-இல் "Allow GitHub Actions to create and approve pull requests" இயக்கவும்

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

| Input                | Default                                        | விளக்கம்                                            |
| -------------------- | ---------------------------------------------- | --------------------------------------------------- |
| `api-key`            | (தேவையானது)                                    | Lingo.dev API key                                   |
| `pull-request`       | `false`                                        | நேரடியாக commit செய்வதற்குப் பதிலாக PR உருவாக்கவும் |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | தனிப்பயன் commit செய்தி                             |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | தனிப்பயன் PR தலைப்பு                                |
| `working-directory`  | `"."`                                          | இயக்குவதற்கான டைரக்டரி                              |
| `parallel`           | `false`                                        | இணையான செயலாக்கத்தை இயக்கவும்                       |

[ஆவணங்களைப் படிக்கவும் →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

UI labels-க்கு static மொழிபெயர்ப்பு கோப்புகள் வேலை செய்கின்றன, ஆனால் பயனர் உருவாக்கிய content-ஐப் பற்றி என்ன? Chat செய்திகள், தயாரிப்பு விளக்கங்கள், support tickets - build time-இல் இல்லாத content-ஐ முன்கூட்டியே மொழிபெயர்க்க முடியாது. மொழிபெயர்க்கப்படாத உரையைக் காட்டுவதில் அல்லது தனிப்பயன் மொழிபெயர்ப்பு pipeline உருவாக்குவதில் நீங்கள் சிக்கிக்கொள்கிறீர்கள்.

Lingo.dev SDK runtime-இல் content-ஐ மொழிபெயர்க்கிறது. எந்த உரை, object அல்லது HTML-ஐயும் அனுப்பி, localized version-ஐப் பெறுங்கள். real-time chat, dynamic அறிவிப்புகள் அல்லது deployment-க்குப் பிறகு வரும் எந்த content-க்கும் வேலை செய்கிறது. JavaScript, PHP, Python மற்றும் Ruby-க்குக் கிடைக்கிறது.

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

### Lingo.dev Compiler

பாரம்பரிய i18n ஊடுருவக்கூடியது. ஒவ்வொரு string-ஐயும் `t()` functions-இல் wrap செய்கிறீர்கள், மொழிபெயர்ப்பு keys-ஐக் கண்டுபிடிக்கிறீர்கள் (`home.hero.title.v2`), இணையான JSON கோப்புகளைப் பராமரிக்கிறீர்கள், மேலும் localization boilerplate மூலம் உங்கள் components வீங்குவதைப் பார்க்கிறீர்கள். இது மிகவும் சலிப்பானது, அது பெரிய refactor ஆகும் வரை குழுக்கள் internationalization-ஐ தாமதப்படுத்துகின்றன.

Lingo.dev Compiler சடங்குகளை நீக்குகிறது. சாதாரண ஆங்கில உரையுடன் React components எழுதுங்கள். Compiler build நேரத்தில் மொழிபெயர்க்கக்கூடிய strings-ஐ கண்டறிந்து தானாகவே localized variants-ஐ உருவாக்குகிறது. Keys இல்லை, JSON கோப்புகள் இல்லை, wrapper functions இல்லை - பல மொழிகளில் வேலை செய்யும் React code மட்டுமே.

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

**உள்ளமைவு (Next.js):**

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

**உள்ளமைவு (Vite):**

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

**Development:** `npm run dev` (pseudotranslator-ஐ பயன்படுத்துகிறது, API calls இல்லை)

**Production:** `usePseudotranslator: false`-ஐ அமைக்கவும், பின்னர் `next build`

`.lingo/` directory-ஐ version control-க்கு commit செய்யவும்.

**முக்கிய அம்சங்கள்:**

- Zero runtime performance செலவு
- மொழிபெயர்ப்பு keys அல்லது JSON கோப்புகள் இல்லை
- `t()` functions அல்லது `<T>` wrapper components இல்லை
- JSX-இல் மொழிபெயர்க்கக்கூடிய உரையின் தானியங்கு கண்டறிதல்
- TypeScript ஆதரவு
- Plurals-க்கான ICU MessageFormat
- `data-lingo-override` attribute வழியாக manual overrides
- உள்ளமைக்கப்பட்ட மொழிபெயர்ப்பு editor widget

**Build modes:**

- `pseudotranslator`: Placeholder மொழிபெயர்ப்புகளுடன் development mode (API செலவுகள் இல்லை)
- `real`: LLMs-ஐ பயன்படுத்தி உண்மையான மொழிபெயர்ப்புகளை உருவாக்கவும்
- `cache-only`: CI-இலிருந்து முன்பே உருவாக்கப்பட்ட மொழிபெயர்ப்புகளைப் பயன்படுத்தும் production mode (API calls இல்லை)

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
   - ஒவ்வொரு PR-க்கும் changeset தேவை: `pnpm new` (அல்லது release அல்லாத மாற்றங்களுக்கு `pnpm new:empty`)
   - சமர்ப்பிப்பதற்கு முன் tests தேர்ச்சி பெறுவதை உறுதிசெய்யவும்
3. **Development:** இது ஒரு pnpm + turborepo monorepo
   - dependencies நிறுவவும்: `pnpm install`
   - tests இயக்கவும்: `pnpm test`
   - Build: `pnpm build`

**ஆதரவு:** [Discord சமூகம்](https://lingo.dev/go/discord)

## Star வரலாறு

Lingo.dev பயனுள்ளதாக இருந்தால், எங்களுக்கு star கொடுத்து 10,000 stars அடைய உதவவும்!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## உள்ளூர்மயமாக்கப்பட்ட ஆவணங்கள்

**கிடைக்கும் மொழிபெயர்ப்புகள்:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**புதிய மொழியைச் சேர்ப்பது:**

1. [`i18n.json`](./i18n.json)-ல் [BCP-47 format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) பயன்படுத்தி locale code சேர்க்கவும்
2. pull request சமர்ப்பிக்கவும்

**BCP-47 locale format:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (lowercase): `en`, `zh`, `bho`
- `Script`: ISO 15924 (title case): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (uppercase): `US`, `CN`, `IN`
- எடுத்துக்காட்டுகள்: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`