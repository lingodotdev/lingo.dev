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

React ऐप्स में i18n सेटअप करल बहुत गलती-प्रवण बा - अनुभवी डेवलपर लोग खातिर भी। AI कोडिंग असिस्टेंट एकरा के आउर खराब बना देला: ऊ लोग गैर-मौजूद API के हैलुसिनेट करेला, मिडलवेयर कॉन्फ़िगरेशन भूल जाला, राउटिंग तोड़ देला, या आधा समाधान लागू करे के बाद भटक जाला। समस्या ई बा कि i18n सेटअप खातिर कई फाइलन (राउटिंग, मिडलवेयर, कंपोनेंट, कॉन्फ़िगरेशन) में समन्वित बदलाव के एगो सटीक क्रम के जरूरत होला, आ LLM लोग ओह संदर्भ के बनाए रखे में संघर्ष करेला।

Lingo.dev MCP एकरा के हल करेला AI असिस्टेंट के फ्रेमवर्क-विशिष्ट i18n ज्ञान के संरचित पहुंच देके। अनुमान लगावे के बजाय, रउआ के असिस्टेंट Next.js, React Router, आ TanStack Start खातिर सत्यापित कार्यान्वयन पैटर्न के पालन करेला।

**समर्थित IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**समर्थित फ्रेमवर्क:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**उपयोग:**

रउआ के IDE में MCP सर्वर कॉन्फ़िगर करे के बाद ([क्विकस्टार्ट गाइड देखीं](https://lingo.dev/en/mcp)), अपना असिस्टेंट के प्रॉम्प्ट करीं:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

असिस्टेंट करी:

1. लोकेल-आधारित राउटिंग कॉन्फ़िगर करी (जइसे, `/en`, `/es`, `/pt-BR`)
2. भाषा स्विचिंग कंपोनेंट सेटअप करी
3. ऑटोमैटिक लोकेल डिटेक्शन लागू करी
4. जरूरी कॉन्फ़िगरेशन फाइल जेनरेट करी

**नोट:** AI-सहायता प्राप्त कोड जेनरेशन गैर-निर्धारक बा। कमिट करे से पहिले जेनरेट कइल कोड के समीक्षा करीं।

[दस्तावेज़ पढ़ीं →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

अनुवाद के सिंक में रखल थकाऊ बा। रउआ एगो नया स्ट्रिंग जोड़ेनी, ओकर अनुवाद करल भूल जानी, अंतरराष्ट्रीय उपयोगकर्ता लोग के टूटल UI भेज देनी। या रउआ अनुवादक लोग के JSON फाइल भेजेनी, दिन भर इंतजार करेनी, फिर मैन्युअल रूप से उनकर काम के वापस मर्ज करेनी। 10+ भाषा में स्केल करे के मतलब बा सैकड़ों फाइल के प्रबंधन करल जे लगातार सिंक से बाहर हो जाला।

Lingo.dev CLI एकरा के ऑटोमेट करेला। एकरा के रउआ के अनुवाद फाइल पर इंगित करीं, एगो कमांड चलाईं, आ हर लोकेल अपडेट हो जाला। एगो लॉकफाइल ट्रैक करेला कि का पहिले से अनुवादित बा, तs रउआ सिर्फ नया या बदलल सामग्री खातिर भुगतान करेनी। JSON, YAML, CSV, PO फाइल, आ markdown के समर्थन करेला।

**सेटअप:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**ई कइसे काम करेला:**

1. कॉन्फ़िगर कइल फाइल सभ से अनुवाद योग्य सामग्री निकालेला
2. अनुवाद खातिर सामग्री के LLM प्रोवाइडर के भेजेला
3. अनुवादित सामग्री के वापस फाइलसिस्टम में लिखेला
4. पूरा भइल अनुवाद के ट्रैक करे खातिर `i18n.lock` फाइल बनावेला (अनावश्यक प्रोसेसिंग से बचावेला)

**कॉन्फ़िगरेशन:**

`init` कमांड एगो `i18n.json` फाइल जेनरेट करेला। लोकेल आ बकेट कॉन्फ़िगर करीं:

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

`provider` फील्ड वैकल्पिक बा (डिफ़ॉल्ट रूप से Lingo.dev Engine)। कस्टम LLM प्रोवाइडर खातिर:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**समर्थित LLM प्रोवाइडर:**

- Lingo.dev Engine (अनुशंसित)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[दस्तावेज़ पढ़ीं →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

अनुवाद ऊ फीचर बा जवन हमेशा "लगभग पूरा" होखेला। इंजीनियर लोकेल अपडेट कइले बिना कोड मर्ज कर देला। QA स्टेजिंग में गायब अनुवाद पकड़ेला - या बदतर, यूजर प्रोडक्शन में पकड़ेला। मूल कारण: अनुवाद एगो मैनुअल स्टेप बा जेकरा के डेडलाइन के दबाव में छोड़ल आसान बा।

Lingo.dev CI/CD अनुवाद के ऑटोमैटिक बना देला। हर पुश अनुवाद ट्रिगर करेला। गायब स्ट्रिंग कोड के प्रोडक्शन में पहुँचे से पहिले भर जाला। कवनो अनुशासन के जरूरत नइखे - पाइपलाइन संभाल लेला।

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

1. रिपॉजिटरी सीक्रेट में `LINGODOTDEV_API_KEY` जोड़ीं (Settings > Secrets and variables > Actions)
2. PR वर्कफ़्लो खातिर: Settings > Actions > General में "Allow GitHub Actions to create and approve pull requests" सक्षम करीं

**वर्कफ़्लो विकल्प:**

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

| इनपुट                | डिफ़ॉल्ट                                       | विवरण                           |
| -------------------- | ---------------------------------------------- | ------------------------------- |
| `api-key`            | (जरूरी)                                        | Lingo.dev API की                |
| `pull-request`       | `false`                                        | सीधे कमिट करे के बजाय PR बनाईं  |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | कस्टम कमिट संदेश                |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | कस्टम PR शीर्षक                 |
| `working-directory`  | `"."`                                          | जवना डायरेक्टरी में चलावे के बा |
| `parallel`           | `false`                                        | समानांतर प्रोसेसिंग सक्षम करीं  |

[डॉक्स पढ़ीं →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

स्टैटिक अनुवाद फाइल UI लेबल खातिर काम करेला, बाकिर यूजर-जेनरेटेड कंटेंट के का होई? चैट संदेश, प्रोडक्ट विवरण, सपोर्ट टिकट - जवन कंटेंट बिल्ड टाइम पर मौजूद नइखे ओकर पहिले से अनुवाद ना हो सकेला। रउआ बिना अनुवाद वाला टेक्स्ट देखावे खातिर मजबूर बानी या कस्टम अनुवाद पाइपलाइन बनावे के पड़ी।

Lingo.dev SDK रनटाइम पर कंटेंट के अनुवाद करेला। कवनो टेक्स्ट, ऑब्जेक्ट, या HTML पास करीं आ लोकलाइज्ड वर्जन वापस पाईं। रियल-टाइम चैट, डायनामिक नोटिफिकेशन, या कवनो कंटेंट जवन डिप्लॉयमेंट के बाद आवेला ओकरा खातिर काम करेला। JavaScript, PHP, Python, आ Ruby खातिर उपलब्ध बा।

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

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - वेब ऐप, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[डॉक्स पढ़ीं →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

पारंपरिक i18n आक्रामक बा। रउआ हर स्ट्रिंग के `t()` फंक्शन में लपेटीला, अनुवाद की (`home.hero.title.v2`) के आविष्कार करीला, समानांतर JSON फाइल के मेंटेन करीला, आ अपना कंपोनेंट के लोकलाइजेशन बॉयलरप्लेट से फूलल देखीला। ई एतना थकाऊ बा कि टीम अंतर्राष्ट्रीयकरण के तब तक टाल देवेला जब तक ई एगो बहुत बड़ रिफैक्टर ना बन जाला।

Lingo.dev Compiler औपचारिकता के खत्म क देला। सादा अंग्रेजी टेक्स्ट के साथ React कंपोनेंट लिखीं। कंपाइलर बिल्ड टाइम पर अनुवाद योग्य स्ट्रिंग के पहचान लेला आ स्वचालित रूप से स्थानीयकृत वेरिएंट जेनरेट क देला। ना कुंजी, ना JSON फाइल, ना रैपर फंक्शन - बस React कोड जवन कई भाषा में काम करेला।

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

**डेवलपमेंट:** `npm run dev` (स्यूडोट्रांसलेटर के उपयोग करेला, कवनो API कॉल नइखे)

**प्रोडक्शन:** `usePseudotranslator: false` सेट करीं, फिर `next build`

`.lingo/` डायरेक्टरी के वर्जन कंट्रोल में कमिट करीं।

**मुख्य विशेषता:**

- शून्य रनटाइम परफॉर्मेंस लागत
- ना अनुवाद कुंजी ना JSON फाइल
- ना `t()` फंक्शन ना `<T>` रैपर कंपोनेंट
- JSX में अनुवाद योग्य टेक्स्ट के स्वचालित पहचान
- TypeScript समर्थन
- बहुवचन खातिर ICU MessageFormat
- `data-lingo-override` एट्रिब्यूट के माध्यम से मैनुअल ओवरराइड
- बिल्ट-इन अनुवाद एडिटर विजेट

**बिल्ड मोड:**

- `pseudotranslator`: प्लेसहोल्डर अनुवाद के साथ डेवलपमेंट मोड (कवनो API लागत नइखे)
- `real`: LLM के उपयोग करके वास्तविक अनुवाद जेनरेट करीं
- `cache-only`: CI से पहिले से जेनरेट कइल अनुवाद के उपयोग करके प्रोडक्शन मोड (कवनो API कॉल नइखे)

**समर्थित फ्रेमवर्क:**

- Next.js (React Server Components के साथ App Router)
- Vite + React (SPA आ SSR)

अतिरिक्त फ्रेमवर्क समर्थन योजनाबद्ध बा।

[दस्तावेज़ पढ़ीं →](https://lingo.dev/en/compiler)

---

## योगदान

योगदान के स्वागत बा। कृपया एह दिशा-निर्देशन के पालन करीं:

1. **समस्या:** [बग रिपोर्ट करीं या फीचर के अनुरोध करीं](https://github.com/lingodotdev/lingo.dev/issues)
2. **पुल रिक्वेस्ट:** [बदलाव सबमिट करीं](https://github.com/lingodotdev/lingo.dev/pulls)
   - हर PR खातिर एगो changeset जरूरी बा: `pnpm new` (या `pnpm new:empty` गैर-रिलीज बदलाव खातिर)
   - सबमिट करे से पहिले सुनिश्चित करीं कि टेस्ट पास हो जाला
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

**नया भाषा जोड़ल:**

1. [`i18n.json`](./i18n.json) में [BCP-47 फॉर्मेट](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) के इस्तेमाल करके locale code जोड़ीं
2. एगो pull request सबमिट करीं

**BCP-47 locale फॉर्मेट:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (lowercase): `en`, `zh`, `bho`
- `Script`: ISO 15924 (title case): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (uppercase): `US`, `CN`, `IN`
- उदाहरण: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
