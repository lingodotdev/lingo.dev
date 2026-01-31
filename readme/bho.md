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
    Lingo.dev - LLM-संचालित स्थानीयकरण खातिर ओपन-सोर्स i18n टूलकिट
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

## तुरंत शुरुआत

| टूल                                | उपयोग केस                                            | त्वरित कमांड                       |
| ---------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React ऐप्स खातिर AI-सहायता प्राप्त i18n सेटअप        | प्रॉम्प्ट: `Set up i18n`           |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO फाइल सभ के अनुवाद करीं | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions में स्वचालित अनुवाद पाइपलाइन          | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | डायनामिक कंटेंट खातिर रनटाइम अनुवाद                  | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n रैपर बिना बिल्ड-टाइम React स्थानीयकरण           | `withLingo()` प्लगइन               |

---

### Lingo.dev MCP

Model Context Protocol सर्वर जवन AI कोडिंग असिस्टेंट सभ के प्राकृतिक भाषा प्रॉम्प्ट के माध्यम से React एप्लिकेशन सभ में i18n इंफ्रास्ट्रक्चर सेटअप करे के सक्षम बनावेला।

**समर्थित IDE सभ:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**समर्थित फ्रेमवर्क सभ:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**उपयोग:**

अपना IDE में MCP सर्वर के कॉन्फ़िगर करे के बाद ([क्विकस्टार्ट गाइड देखीं](https://lingo.dev/en/mcp)), अपना असिस्टेंट से पूछीं:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

असिस्टेंट ई काम करी:

1. लोकेल-आधारित रूटिंग के कॉन्फ़िगर करी (जइसे कि `/en`, `/es`, `/pt-BR`)
2. भाषा स्विचिंग कंपोनेंट के सेटअप करी
3. ऑटोमेटिक लोकेल डिटेक्शन के लागू करी
4. जरूरी कॉन्फ़िगरेशन फाइल के जेनरेट करी

**नोट:** AI-असिस्टेड कोड जेनरेशन नॉन-डिटर्मिनिस्टिक बा। कमिट करे से पहिले जेनरेट कइल कोड के रिव्यू करीं।

[डॉक्स पढ़ीं →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

ओपन-सोर्स CLI जवन AI के साथ ऐप आ कंटेंट के अनुवाद करे खातिर बा। सगरी इंडस्ट्री-स्टैंडर्ड फॉर्मेट के सपोर्ट करेला जइसे कि JSON, YAML, CSV, PO फाइल, आ markdown।

**सेटअप:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**ई कइसे काम करेला:**

1. कॉन्फ़िगर कइल फाइल से अनुवाद योग्य कंटेंट के एक्सट्रैक्ट करेला
2. अनुवाद खातिर कंटेंट के LLM प्रोवाइडर के भेजेला
3. अनुवादित कंटेंट के फाइलसिस्टम में वापस लिखेला
4. पूरा भइल अनुवाद के ट्रैक करे खातिर `i18n.lock` फाइल बनावेला (रिडंडेंट प्रोसेसिंग से बचावेला)

**कॉन्फ़िगरेशन:**

`init` कमांड एगो `i18n.json` फाइल जेनरेट करेला। लोकेल आ बकेट के कॉन्फ़िगर करीं:

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

`provider` फील्ड ऑप्शनल बा (डिफ़ॉल्ट रूप से Lingo.dev Engine)। कस्टम LLM प्रोवाइडर खातिर:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**सपोर्टेड LLM प्रोवाइडर:**

- Lingo.dev Engine (सिफारिश कइल)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[डॉक्स पढ़ीं →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD पाइपलाइन खातिर ऑटोमेटेड अनुवाद वर्कफ्लो। अधूरा अनुवाद के प्रोडक्शन में पहुँचे से रोकेला।

**समर्थित प्लेटफॉर्म:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions सेटअप:**

`.github/workflows/translate.yml` बनाईं:

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

1. `LINGODOTDEV_API_KEY` के रिपॉजिटरी सीक्रेट्स में जोड़ीं (Settings > Secrets and variables > Actions)
2. PR वर्कफ्लो खातिर: "Allow GitHub Actions to create and approve pull requests" के Settings > Actions > General में सक्षम करीं

**वर्कफ्लो विकल्प:**

अनुवाद सीधे कमिट करीं:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

अनुवाद के साथ पुल रिक्वेस्ट बनाईं:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**उपलब्ध इनपुट:**

| इनपुट                | डिफ़ॉल्ट                                       | विवरण                          |
| -------------------- | ---------------------------------------------- | ------------------------------ |
| `api-key`            | (आवश्यक)                                       | Lingo.dev API कुंजी            |
| `pull-request`       | `false`                                        | सीधे कमिट करे के बजाय PR बनाईं |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | कस्टम कमिट संदेश               |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | कस्टम PR शीर्षक                |
| `working-directory`  | `"."`                                          | जवन डायरेक्टरी में चलावे के बा |
| `parallel`           | `false`                                        | समानांतर प्रोसेसिंग सक्षम करीं |

[दस्तावेज़ पढ़ीं →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

गतिशील सामग्री खातिर रनटाइम अनुवाद लाइब्रेरी। JavaScript, PHP, Python आ Ruby खातिर उपलब्ध बा।

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

**उपलब्ध SDK:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - वेब ऐप्स, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[दस्तावेज़ पढ़ीं →](https://lingo.dev/en/sdk)

---

### Lingo.dev कंपाइलर

बिल्ड-टाइम अनुवाद सिस्टम जवन React ऐप्स के बिना कंपोनेंट बदले बहुभाषी बना देला। रनटाइम के बजाय बिल्ड के दौरान काम करेला।

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

**डेवलपमेंट:** `npm run dev` (स्यूडोट्रांसलेटर के इस्तेमाल करेला, कवनो API कॉल ना)

**प्रोडक्शन:** `usePseudotranslator: false` सेट करीं, फिर `next build`

`.lingo/` डायरेक्टरी के वर्जन कंट्रोल में कमिट करीं।

**मुख्य फीचर:**

- जीरो रनटाइम परफॉर्मेंस कॉस्ट
- कवनो अनुवाद की या JSON फाइल ना
- कवनो `t()` फंक्शन या `<T>` रैपर कंपोनेंट ना
- JSX में अनुवाद योग्य टेक्स्ट के ऑटोमैटिक डिटेक्शन
- TypeScript सपोर्ट
- बहुवचन खातिर ICU MessageFormat
- `data-lingo-override` एट्रिब्यूट के जरिए मैनुअल ओवरराइड
- बिल्ट-इन अनुवाद एडिटर विजेट

**बिल्ड मोड:**

- `pseudotranslator`: प्लेसहोल्डर अनुवाद के साथ डेवलपमेंट मोड (कवनो API कॉस्ट ना)
- `real`: LLMs के इस्तेमाल से वास्तविक अनुवाद जेनरेट करीं
- `cache-only`: CI से पहिले से जेनरेट कइल अनुवाद के इस्तेमाल करत प्रोडक्शन मोड (कवनो API कॉल ना)

**सपोर्टेड फ्रेमवर्क:**

- Next.js (React Server Components के साथ App Router)
- Vite + React (SPA आ SSR)

अतिरिक्त फ्रेमवर्क सपोर्ट के योजना बा।

[दस्तावेज पढ़ीं →](https://lingo.dev/en/compiler)

---

## योगदान

योगदान के स्वागत बा। कृपया एह दिशानिर्देशन के पालन करीं:

1. **समस्या:** [बग रिपोर्ट करीं या फीचर के अनुरोध करीं](https://github.com/lingodotdev/lingo.dev/issues)
2. **पुल रिक्वेस्ट:** [बदलाव सबमिट करीं](https://github.com/lingodotdev/lingo.dev/pulls)
   - हर PR खातिर एगो changeset जरूरी बा: `pnpm new` (या `pnpm new:empty` गैर-रिलीज बदलाव खातिर)
   - सबमिट करे से पहिले टेस्ट पास होखे के सुनिश्चित करीं
3. **डेवलपमेंट:** ई एगो pnpm + turborepo monorepo बा
   - डिपेंडेंसी इंस्टॉल करीं: `pnpm install`
   - टेस्ट चलाईं: `pnpm test`
   - बिल्ड करीं: `pnpm build`

**सहायता:** [Discord समुदाय](https://lingo.dev/go/discord)

## स्टार इतिहास

अगर Lingo.dev उपयोगी लागे त हमनी के एगो स्टार दीं आ 10,000 स्टार तक पहुँचे में मदद करीं!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## स्थानीयकृत दस्तावेज

**उपलब्ध अनुवाद:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

\*\*नया भाषा जोड़ल:

1. [`i18n.json`](./i18n.json) में [BCP-47 फॉर्मेट](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) के उपयोग करत लोकेल कोड जोड़ीं
2. एगो पुल रिक्वेस्ट सबमिट करीं

**BCP-47 लोकेल फॉर्मेट:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (लोअरकेस): `en`, `zh`, `bho`
- `Script`: ISO 15924 (टाइटल केस): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (अपरकेस): `US`, `CN`, `IN`
- उदाहरण: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
