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
    Lingo.dev - LLM-संचालित स्थानीयकरण के लिए ओपन-सोर्स i18n टूलकिट
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

## त्वरित शुरुआत

| टूल                                | उपयोग का मामला                                       | त्वरित कमांड                       |
| ---------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React ऐप्स के लिए AI-सहायता प्राप्त i18n सेटअप       | प्रॉम्प्ट: `Set up i18n`           |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO फ़ाइलों का अनुवाद करें | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions में स्वचालित अनुवाद पाइपलाइन          | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | डायनामिक कंटेंट के लिए रनटाइम अनुवाद                 | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n रैपर्स के बिना बिल्ड-टाइम React स्थानीयकरण      | `withLingo()` प्लगइन               |

---

### Lingo.dev MCP

Model Context Protocol सर्वर जो AI कोडिंग असिस्टेंट्स को प्राकृतिक भाषा प्रॉम्प्ट के माध्यम से React एप्लिकेशन में i18n इंफ्रास्ट्रक्चर सेटअप करने में सक्षम बनाता है।

**समर्थित IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**समर्थित फ्रेमवर्क:**

- Next.js (App Router और Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**उपयोग:**

अपने IDE में MCP सर्वर को कॉन्फ़िगर करने के बाद ([क्विकस्टार्ट गाइड देखें](https://lingo.dev/en/mcp)), अपने असिस्टेंट को प्रॉम्प्ट करें:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

असिस्टेंट निम्नलिखित कार्य करेगा:

1. लोकेल-आधारित राउटिंग कॉन्फ़िगर करें (जैसे, `/en`, `/es`, `/pt-BR`)
2. भाषा स्विचिंग कंपोनेंट्स सेट अप करें
3. स्वचालित लोकेल डिटेक्शन लागू करें
4. आवश्यक कॉन्फ़िगरेशन फ़ाइलें जेनरेट करें

**नोट:** AI-असिस्टेड कोड जेनरेशन नॉन-डिटर्मिनिस्टिक है। कमिट करने से पहले जेनरेट किए गए कोड की समीक्षा करें।

[डॉक्स पढ़ें →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI के साथ ऐप्स और कंटेंट को ट्रांसलेट करने के लिए ओपन-सोर्स CLI। JSON, YAML, CSV, PO फ़ाइलें और markdown सहित सभी इंडस्ट्री-स्टैंडर्ड फ़ॉर्मेट्स को सपोर्ट करता है।

**सेटअप:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**यह कैसे काम करता है:**

1. कॉन्फ़िगर की गई फ़ाइलों से ट्रांसलेट करने योग्य कंटेंट एक्सट्रैक्ट करता है
2. ट्रांसलेशन के लिए कंटेंट को LLM प्रोवाइडर को भेजता है
3. ट्रांसलेट किए गए कंटेंट को फ़ाइल सिस्टम में वापस लिखता है
4. पूर्ण किए गए ट्रांसलेशन को ट्रैक करने के लिए `i18n.lock` फ़ाइल बनाता है (रिडंडेंट प्रोसेसिंग से बचाता है)

**कॉन्फ़िगरेशन:**

`init` कमांड एक `i18n.json` फ़ाइल जेनरेट करती है। लोकेल और बकेट्स कॉन्फ़िगर करें:

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

`provider` फ़ील्ड ऑप्शनल है (डिफ़ॉल्ट रूप से Lingo.dev Engine)। कस्टम LLM प्रोवाइडर्स के लिए:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**सपोर्टेड LLM प्रोवाइडर्स:**

- Lingo.dev Engine (अनुशंसित)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[डॉक्स पढ़ें →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD पाइपलाइन्स के लिए स्वचालित ट्रांसलेशन वर्कफ़्लो। अधूरे ट्रांसलेशन को प्रोडक्शन में पहुँचने से रोकता है।

**समर्थित प्लेटफ़ॉर्म:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions सेटअप:**

`.github/workflows/translate.yml` बनाएँ:

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

**सेटअप आवश्यकताएँ:**

1. `LINGODOTDEV_API_KEY` को repository secrets में जोड़ें (Settings > Secrets and variables > Actions)
2. PR workflows के लिए: Settings > Actions > General में "Allow GitHub Actions to create and approve pull requests" सक्षम करें

**वर्कफ़्लो विकल्प:**

अनुवादों को सीधे commit करें:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

अनुवादों के साथ pull requests बनाएँ:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**उपलब्ध inputs:**

| Input                | Default                                        | Description                       |
| -------------------- | ---------------------------------------------- | --------------------------------- |
| `api-key`            | (आवश्यक)                                       | Lingo.dev API key                 |
| `pull-request`       | `false`                                        | सीधे commit करने के बजाय PR बनाएँ |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | कस्टम commit संदेश                |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | कस्टम PR शीर्षक                   |
| `working-directory`  | `"."`                                          | जिस डायरेक्टरी में चलाना है       |
| `parallel`           | `false`                                        | समानांतर प्रोसेसिंग सक्षम करें    |

[दस्तावेज़ पढ़ें →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

डायनामिक कंटेंट के लिए रनटाइम अनुवाद लाइब्रेरी। JavaScript, PHP, Python और Ruby के लिए उपलब्ध।

**इंस्टॉलेशन:**

```bash
npm install lingo.dev
```

**उपयोग:**

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

**उपलब्ध SDKs:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Web apps, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[दस्तावेज़ पढ़ें →](https://lingo.dev/en/sdk)

---

### Lingo.dev कंपाइलर

बिल्ड-टाइम अनुवाद प्रणाली जो React ऐप्स को कंपोनेंट्स में बदलाव किए बिना बहुभाषी बनाती है। रनटाइम के बजाय बिल्ड के दौरान काम करती है।

**इंस्टॉलेशन:**

```bash
pnpm install @lingo.dev/compiler
```

**प्रमाणीकरण:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**कॉन्फ़िगरेशन (Next.js):**

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

**कॉन्फ़िगरेशन (Vite):**

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

**प्रोवाइडर सेटअप:**

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

**डेवलपमेंट:** `npm run dev` (स्यूडोट्रांसलेटर का उपयोग करता है, कोई API कॉल नहीं)

**प्रोडक्शन:** `usePseudotranslator: false` सेट करें, फिर `next build`

`.lingo/` डायरेक्टरी को वर्जन कंट्रोल में कमिट करें।

**मुख्य विशेषताएं:**

- शून्य रनटाइम परफॉर्मेंस कॉस्ट
- कोई अनुवाद कुंजी या JSON फाइलें नहीं
- कोई `t()` फंक्शन या `<T>` रैपर कंपोनेंट नहीं
- JSX में अनुवाद योग्य टेक्स्ट की स्वचालित पहचान
- TypeScript सपोर्ट
- बहुवचन के लिए ICU MessageFormat
- `data-lingo-override` एट्रिब्यूट के माध्यम से मैनुअल ओवरराइड
- बिल्ट-इन अनुवाद एडिटर विजेट

**बिल्ड मोड:**

- `pseudotranslator`: प्लेसहोल्डर अनुवादों के साथ डेवलपमेंट मोड (कोई API कॉस्ट नहीं)
- `real`: LLM का उपयोग करके वास्तविक अनुवाद जेनरेट करें
- `cache-only`: CI से पहले से जेनरेट किए गए अनुवादों का उपयोग करते हुए प्रोडक्शन मोड (कोई API कॉल नहीं)

**समर्थित फ्रेमवर्क:**

- Next.js (React Server Components के साथ App Router)
- Vite + React (SPA और SSR)

अतिरिक्त फ्रेमवर्क सपोर्ट की योजना है।

[दस्तावेज़ पढ़ें →](https://lingo.dev/en/compiler)

---

## योगदान

योगदान का स्वागत है। कृपया इन दिशानिर्देशों का पालन करें:

1. **समस्याएं:** [बग रिपोर्ट करें या फीचर का अनुरोध करें](https://github.com/lingodotdev/lingo.dev/issues)
2. **पुल रिक्वेस्ट:** [परिवर्तन सबमिट करें](https://github.com/lingodotdev/lingo.dev/pulls)
   - प्रत्येक PR के लिए चेंजसेट आवश्यक है: `pnpm new` (या गैर-रिलीज़ परिवर्तनों के लिए `pnpm new:empty`)
   - सबमिट करने से पहले सुनिश्चित करें कि टेस्ट पास हो जाएं
3. **डेवलपमेंट:** यह एक pnpm + turborepo मोनोरेपो है
   - डिपेंडेंसी इंस्टॉल करें: `pnpm install`
   - टेस्ट चलाएं: `pnpm test`
   - बिल्ड करें: `pnpm build`

**सहायता:** [Discord कम्युनिटी](https://lingo.dev/go/discord)

## स्टार हिस्ट्री

यदि आपको Lingo.dev उपयोगी लगता है, तो हमें स्टार दें और 10,000 स्टार तक पहुंचने में हमारी मदद करें!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## स्थानीयकृत दस्तावेज़ीकरण

**उपलब्ध अनुवाद:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**नई भाषा जोड़ना:**

1. [`i18n.json`](./i18n.json) में [BCP-47 फॉर्मेट](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) का उपयोग करके लोकेल कोड जोड़ें
2. पुल रिक्वेस्ट सबमिट करें

**BCP-47 लोकेल फॉर्मेट:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (लोअरकेस): `en`, `zh`, `bho`
- `Script`: ISO 15924 (टाइटल केस): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (अपरकेस): `US`, `CN`, `IN`
- उदाहरण: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
