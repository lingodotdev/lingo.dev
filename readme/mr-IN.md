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
  <strong>Lingo.dev - LLM-आधारित स्थानिकीकरणासाठी ओपन-सोर्स i18n टूलकिट</strong>
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

## द्रुत प्रारंभ

| टूल                                | वापर प्रकरण                                     | द्रुत कमांड                        |
| ---------------------------------- | ----------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React अॅप्ससाठी AI-सहाय्यित i18n सेटअप          | प्रॉम्प्ट: `Set up i18n`           |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO फाइल्सचे भाषांतर  | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions मध्ये स्वयंचलित भाषांतर पाइपलाइन | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | डायनॅमिक कंटेंटसाठी रनटाइम भाषांतर              | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n रॅपर्सशिवाय बिल्ड-टाइम React स्थानिकीकरण   | `withLingo()` प्लगइन               |

---

### Lingo.dev MCP

Model Context Protocol सर्व्हर जो AI कोडिंग असिस्टंट्सना नैसर्गिक भाषेतील प्रॉम्प्ट्सद्वारे React अॅप्लिकेशन्समध्ये i18n इन्फ्रास्ट्रक्चर सेट अप करण्यास सक्षम करतो.

**समर्थित IDEs:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**समर्थित फ्रेमवर्क्स:**

- Next.js (App Router आणि Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**वापर:**

तुमच्या IDE मध्ये MCP सर्व्हर कॉन्फिगर केल्यानंतर ([क्विकस्टार्ट मार्गदर्शक पहा](https://lingo.dev/en/mcp)), तुमच्या असिस्टंटला विचारा:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

असिस्टंट हे करेल:

1. लोकेल-आधारित राउटिंग कॉन्फिगर करा (उदा., `/en`, `/es`, `/pt-BR`)
2. भाषा स्विचिंग कंपोनेंट्स सेट अप करा
3. ऑटोमॅटिक लोकेल डिटेक्शन इम्प्लिमेंट करा
4. आवश्यक कॉन्फिगरेशन फाइल्स जनरेट करा

**नोंद:** AI-असिस्टेड कोड जनरेशन नॉन-डिटर्मिनिस्टिक आहे. कमिट करण्यापूर्वी जनरेट केलेल्या कोडचे पुनरावलोकन करा.

[डॉक्युमेंटेशन वाचा →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI सह अॅप्स आणि कंटेंट ट्रान्सलेट करण्यासाठी ओपन-सोर्स CLI. JSON, YAML, CSV, PO फाइल्स आणि markdown यासह सर्व इंडस्ट्री-स्टँडर्ड फॉरमॅट्स सपोर्ट करते.

**सेटअप:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**हे कसे काम करते:**

1. कॉन्फिगर केलेल्या फाइल्समधून ट्रान्सलेट करण्यायोग्य कंटेंट एक्स्ट्रॅक्ट करते
2. ट्रान्सलेशनसाठी LLM प्रोव्हायडरला कंटेंट पाठवते
3. ट्रान्सलेट केलेले कंटेंट फाइलसिस्टममध्ये परत लिहिते
4. पूर्ण झालेल्या ट्रान्सलेशन्सचा मागोवा ठेवण्यासाठी `i18n.lock` फाइल तयार करते (रिडंडंट प्रोसेसिंग टाळते)

**कॉन्फिगरेशन:**

`init` कमांड एक `i18n.json` फाइल जनरेट करते. लोकेल्स आणि बकेट्स कॉन्फिगर करा:

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

`provider` फील्ड ऑप्शनल आहे (डीफॉल्ट Lingo.dev Engine). कस्टम LLM प्रोव्हायडर्ससाठी:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**सपोर्ट केलेले LLM प्रोव्हायडर्स:**

- Lingo.dev Engine (शिफारस केलेले)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[डॉक्युमेंटेशन वाचा →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD पाइपलाइन्ससाठी ऑटोमेटेड ट्रान्सलेशन वर्कफ्लो. अपूर्ण ट्रान्सलेशन्स प्रोडक्शनमध्ये जाण्यापासून प्रतिबंधित करते.

**समर्थित प्लॅटफॉर्म:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions सेटअप:**

`.github/workflows/translate.yml` तयार करा:

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

**सेटअप आवश्यकता:**

1. रिपॉझिटरी सीक्रेट्समध्ये `LINGODOTDEV_API_KEY` जोडा (Settings > Secrets and variables > Actions)
2. PR वर्कफ्लोसाठी: Settings > Actions > General मध्ये "Allow GitHub Actions to create and approve pull requests" सक्षम करा

**वर्कफ्लो पर्याय:**

भाषांतरे थेट कमिट करा:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

भाषांतरांसह pull request तयार करा:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**उपलब्ध इनपुट:**

| Input                | Default                                        | Description                       |
| -------------------- | ---------------------------------------------- | --------------------------------- |
| `api-key`            | (आवश्यक)                                       | Lingo.dev API key                 |
| `pull-request`       | `false`                                        | थेट कमिट करण्याऐवजी PR तयार करा   |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | कस्टम कमिट मेसेज                  |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | कस्टम PR शीर्षक                   |
| `working-directory`  | `"."`                                          | ज्या डिरेक्टरीमध्ये रन करायचे आहे |
| `parallel`           | `false`                                        | पॅरलल प्रोसेसिंग सक्षम करा        |

[डॉक्युमेंटेशन वाचा →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

डायनॅमिक कंटेंटसाठी रनटाइम भाषांतर लायब्ररी. JavaScript, PHP, Python आणि Ruby साठी उपलब्ध.

**इन्स्टॉलेशन:**

```bash
npm install lingo.dev
```

**वापर:**

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

**उपलब्ध SDK:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - वेब अॅप्स, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[डॉक्युमेंटेशन वाचा →](https://lingo.dev/en/sdk)

---

### Lingo.dev कंपायलर

बिल्ड-टाइम अनुवाद प्रणाली जी React अॅप्सना कंपोनेंट्स बदलल्याशिवाय बहुभाषिक बनवते. रनटाइम ऐवजी बिल्ड दरम्यान कार्य करते.

**इंस्टॉलेशन:**

```bash
pnpm install @lingo.dev/compiler
```

**ऑथेंटिकेशन:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**कॉन्फिगरेशन (Next.js):**

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

**कॉन्फिगरेशन (Vite):**

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

**प्रोव्हायडर सेटअप:**

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

**भाषा स्विचर:**

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

**डेव्हलपमेंट:** `npm run dev` (स्यूडोट्रान्सलेटर वापरते, API कॉल्स नाहीत)

**प्रोडक्शन:** `usePseudotranslator: false` सेट करा, नंतर `next build`

`.lingo/` डिरेक्टरी व्हर्जन कंट्रोलमध्ये कमिट करा.

**मुख्य वैशिष्ट्ये:**

- शून्य रनटाइम परफॉर्मन्स कॉस्ट
- अनुवाद की किंवा JSON फाइल्स नाहीत
- `t()` फंक्शन्स किंवा `<T>` रॅपर कंपोनेंट्स नाहीत
- JSX मध्ये अनुवाद करण्यायोग्य टेक्स्टचे स्वयंचलित शोधन
- TypeScript सपोर्ट
- अनेकवचनासाठी ICU MessageFormat
- `data-lingo-override` अॅट्रिब्यूटद्वारे मॅन्युअल ओव्हरराइड्स
- बिल्ट-इन अनुवाद एडिटर विजेट

**बिल्ड मोड्स:**

- `pseudotranslator`: प्लेसहोल्डर अनुवादांसह डेव्हलपमेंट मोड (API खर्च नाही)
- `real`: LLM वापरून वास्तविक अनुवाद जनरेट करा
- `cache-only`: CI मधून पूर्व-जनरेट केलेले अनुवाद वापरून प्रोडक्शन मोड (API कॉल्स नाहीत)

**सपोर्टेड फ्रेमवर्क्स:**

- Next.js (React Server Components सह App Router)
- Vite + React (SPA आणि SSR)

अतिरिक्त फ्रेमवर्क सपोर्ट नियोजित आहे.

[दस्तऐवज वाचा →](https://lingo.dev/en/compiler)

---

## योगदान

योगदानाचे स्वागत आहे. कृपया या मार्गदर्शक तत्त्वांचे पालन करा:

1. **समस्या:** [बग रिपोर्ट करा किंवा वैशिष्ट्यांची विनंती करा](https://github.com/lingodotdev/lingo.dev/issues)
2. **पुल रिक्वेस्ट:** [बदल सबमिट करा](https://github.com/lingodotdev/lingo.dev/pulls)
   - प्रत्येक PR साठी चेंजसेट आवश्यक आहे: `pnpm new` (किंवा नॉन-रिलीज बदलांसाठी `pnpm new:empty`)
   - सबमिट करण्यापूर्वी चाचण्या पास होत असल्याची खात्री करा
3. **डेव्हलपमेंट:** हे pnpm + turborepo मोनोरेपो आहे
   - डिपेंडन्सी इन्स्टॉल करा: `pnpm install`
   - चाचण्या चालवा: `pnpm test`
   - बिल्ड करा: `pnpm build`

**सपोर्ट:** [Discord समुदाय](https://lingo.dev/go/discord)

## स्टार हिस्ट्री

जर तुम्हाला Lingo.dev उपयुक्त वाटत असेल, तर आम्हाला स्टार द्या आणि 10,000 स्टार गाठण्यात मदत करा!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## स्थानिकीकृत दस्तऐवजीकरण

**उपलब्ध भाषांतरे:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**नवीन भाषा जोडणे:**

1. [`i18n.json`](./i18n.json) मध्ये [BCP-47 फॉरमॅट](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) वापरून लोकेल कोड जोडा
2. पुल रिक्वेस्ट सबमिट करा

**BCP-47 लोकेल फॉरमॅट:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (लोअरकेस): `en`, `zh`, `bho`
- `Script`: ISO 15924 (टायटल केस): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (अप्परकेस): `US`, `CN`, `IN`
- उदाहरणे: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
