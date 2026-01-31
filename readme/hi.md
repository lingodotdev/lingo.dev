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

React ऐप्स में i18n सेटअप करना कुख्यात रूप से त्रुटि-प्रवण है - अनुभवी डेवलपर्स के लिए भी। AI कोडिंग असिस्टेंट इसे और खराब बना देते हैं: वे गैर-मौजूद API की कल्पना करते हैं, मिडलवेयर कॉन्फ़िगरेशन भूल जाते हैं, राउटिंग तोड़ देते हैं, या खो जाने से पहले आधा समाधान लागू करते हैं। समस्या यह है कि i18n सेटअप के लिए कई फ़ाइलों (राउटिंग, मिडलवेयर, कंपोनेंट, कॉन्फ़िगरेशन) में समन्वित परिवर्तनों के एक सटीक क्रम की आवश्यकता होती है, और LLM उस संदर्भ को बनाए रखने में संघर्ष करते हैं।

Lingo.dev MCP इसे AI असिस्टेंट को फ्रेमवर्क-विशिष्ट i18n ज्ञान तक संरचित पहुंच देकर हल करता है। अनुमान लगाने के बजाय, आपका असिस्टेंट Next.js, React Router और TanStack Start के लिए सत्यापित कार्यान्वयन पैटर्न का पालन करता है।

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

असिस्टेंट करेगा:

1. लोकेल-आधारित राउटिंग कॉन्फ़िगर करें (जैसे, `/en`, `/es`, `/pt-BR`)
2. भाषा स्विचिंग कंपोनेंट सेटअप करें
3. स्वचालित लोकेल डिटेक्शन लागू करें
4. आवश्यक कॉन्फ़िगरेशन फ़ाइलें जेनरेट करें

**नोट:** AI-असिस्टेड कोड जेनरेशन नॉन-डिटर्मिनिस्टिक है। कमिट करने से पहले जेनरेट किए गए कोड की समीक्षा करें।

[दस्तावेज़ पढ़ें →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

अनुवादों को सिंक में रखना थकाऊ है। आप एक नई स्ट्रिंग जोड़ते हैं, इसे अनुवाद करना भूल जाते हैं, अंतर्राष्ट्रीय उपयोगकर्ताओं को टूटा हुआ UI भेज देते हैं। या आप अनुवादकों को JSON फ़ाइलें भेजते हैं, दिनों तक प्रतीक्षा करते हैं, फिर मैन्युअल रूप से उनके काम को वापस मर्ज करते हैं। 10+ भाषाओं तक स्केल करने का मतलब है सैकड़ों फ़ाइलों को मैनेज करना जो लगातार सिंक से बाहर हो जाती हैं।

Lingo.dev CLI इसे स्वचालित करता है। इसे अपनी अनुवाद फ़ाइलों पर पॉइंट करें, एक कमांड चलाएं, और हर लोकेल अपडेट हो जाता है। एक लॉकफ़ाइल ट्रैक करती है कि क्या पहले से अनुवादित है, इसलिए आप केवल नए या बदले हुए कंटेंट के लिए भुगतान करते हैं। JSON, YAML, CSV, PO फ़ाइलें और markdown को सपोर्ट करता है।

**सेटअप:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**यह कैसे काम करता है:**

1. कॉन्फ़िगर की गई फ़ाइलों से अनुवाद योग्य कंटेंट निकालता है
2. अनुवाद के लिए कंटेंट को LLM प्रोवाइडर को भेजता है
3. अनुवादित कंटेंट को फ़ाइल सिस्टम में वापस लिखता है
4. पूर्ण किए गए अनुवादों को ट्रैक करने के लिए `i18n.lock` फ़ाइल बनाता है (अनावश्यक प्रोसेसिंग से बचाता है)

**कॉन्फ़िगरेशन:**

`init` कमांड एक `i18n.json` फ़ाइल जेनरेट करती है। लोकेल और बकेट कॉन्फ़िगर करें:

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

`provider` फ़ील्ड वैकल्पिक है (डिफ़ॉल्ट रूप से Lingo.dev Engine)। कस्टम LLM प्रोवाइडर के लिए:

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

[दस्तावेज़ पढ़ें →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

अनुवाद वह फ़ीचर है जो हमेशा "लगभग पूरा" होता है। इंजीनियर लोकेल अपडेट किए बिना कोड मर्ज कर देते हैं। QA को स्टेजिंग में गायब अनुवाद मिलते हैं - या इससे भी बुरा, यूज़र्स को प्रोडक्शन में मिलते हैं। मूल कारण: अनुवाद एक मैनुअल स्टेप है जिसे डेडलाइन के दबाव में छोड़ना आसान है।

Lingo.dev CI/CD अनुवाद को स्वचालित बनाता है। हर पुश अनुवाद ट्रिगर करता है। गायब स्ट्रिंग्स कोड के प्रोडक्शन में पहुंचने से पहले भर जाती हैं। किसी अनुशासन की आवश्यकता नहीं - पाइपलाइन इसे संभालती है।

**समर्थित प्लेटफ़ॉर्म:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions सेटअप:**

`.github/workflows/translate.yml` बनाएं:

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

**सेटअप आवश्यकताएं:**

1. रिपॉज़िटरी सीक्रेट्स में `LINGODOTDEV_API_KEY` जोड़ें (Settings > Secrets and variables > Actions)
2. PR वर्कफ़्लो के लिए: Settings > Actions > General में "Allow GitHub Actions to create and approve pull requests" सक्षम करें

**वर्कफ़्लो विकल्प:**

अनुवाद सीधे कमिट करें:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

अनुवादों के साथ pull request बनाएं:

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
| `api-key`            | (आवश्यक)                                       | Lingo.dev API key               |
| `pull-request`       | `false`                                        | सीधे कमिट करने के बजाय PR बनाएं |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | कस्टम कमिट मैसेज                |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | कस्टम PR टाइटल                  |
| `working-directory`  | `"."`                                          | जिस डायरेक्टरी में रन करना है   |
| `parallel`           | `false`                                        | पैरेलल प्रोसेसिंग सक्षम करें    |

[डॉक्स पढ़ें →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

स्टैटिक ट्रांसलेशन फ़ाइलें UI लेबल के लिए काम करती हैं, लेकिन यूज़र-जेनरेटेड कंटेंट का क्या? चैट मैसेज, प्रोडक्ट डिस्क्रिप्शन, सपोर्ट टिकट - ऐसा कंटेंट जो बिल्ड टाइम पर मौजूद नहीं होता, उसे प्री-ट्रांसलेट नहीं किया जा सकता। आप अनट्रांसलेटेड टेक्स्ट दिखाने या कस्टम ट्रांसलेशन पाइपलाइन बनाने में फंस जाते हैं।

Lingo.dev SDK रनटाइम पर कंटेंट को ट्रांसलेट करता है। कोई भी टेक्स्ट, ऑब्जेक्ट, या HTML पास करें और लोकलाइज़्ड वर्जन प्राप्त करें। रियल-टाइम चैट, डायनामिक नोटिफ़िकेशन, या डिप्लॉयमेंट के बाद आने वाले किसी भी कंटेंट के लिए काम करता है। JavaScript, PHP, Python, और Ruby के लिए उपलब्ध।

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

[डॉक्स पढ़ें →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

पारंपरिक i18n इनवेसिव है। आप हर स्ट्रिंग को `t()` फंक्शन में रैप करते हैं, ट्रांसलेशन कुंजियां बनाते हैं (`home.hero.title.v2`), पैरेलल JSON फ़ाइलें मेंटेन करते हैं, और अपने कंपोनेंट को लोकलाइज़ेशन बॉयलरप्लेट से भरा हुआ देखते हैं। यह इतना थकाऊ है कि टीमें इंटरनेशनलाइज़ेशन को तब तक टालती हैं जब तक यह एक बड़ा रिफ़ैक्टर नहीं बन जाता।

Lingo.dev Compiler औपचारिकता को समाप्त करता है। सादे अंग्रेजी टेक्स्ट के साथ React components लिखें। Compiler बिल्ड टाइम पर अनुवाद योग्य स्ट्रिंग्स का पता लगाता है और स्वचालित रूप से स्थानीयकृत वेरिएंट जेनरेट करता है। कोई keys नहीं, कोई JSON फ़ाइलें नहीं, कोई wrapper functions नहीं - बस React कोड जो कई भाषाओं में काम करता है।

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

**Provider सेटअप:**

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

**Development:** `npm run dev` (pseudotranslator का उपयोग करता है, कोई API कॉल नहीं)

**Production:** `usePseudotranslator: false` सेट करें, फिर `next build`

`.lingo/` डायरेक्टरी को version control में commit करें।

**मुख्य विशेषताएं:**

- शून्य runtime performance cost
- कोई translation keys या JSON फ़ाइलें नहीं
- कोई `t()` functions या `<T>` wrapper components नहीं
- JSX में अनुवाद योग्य टेक्स्ट का स्वचालित पता लगाना
- TypeScript समर्थन
- बहुवचन के लिए ICU MessageFormat
- `data-lingo-override` attribute के माध्यम से मैनुअल overrides
- बिल्ट-इन translation editor widget

**बिल्ड मोड:**

- `pseudotranslator`: प्लेसहोल्डर अनुवादों के साथ development मोड (कोई API लागत नहीं)
- `real`: LLMs का उपयोग करके वास्तविक अनुवाद जेनरेट करें
- `cache-only`: CI से पूर्व-जेनरेट किए गए अनुवादों का उपयोग करके production मोड (कोई API कॉल नहीं)

**समर्थित frameworks:**

- Next.js (React Server Components के साथ App Router)
- Vite + React (SPA और SSR)

अतिरिक्त framework समर्थन योजनाबद्ध है।

[दस्तावेज़ पढ़ें →](https://lingo.dev/en/compiler)

---

## योगदान

योगदान का स्वागत है। कृपया इन दिशानिर्देशों का पालन करें:

1. **इश्यूज़:** [बग रिपोर्ट करें या फीचर का अनुरोध करें](https://github.com/lingodotdev/lingo.dev/issues)
2. **पुल रिक्वेस्ट:** [परिवर्तन सबमिट करें](https://github.com/lingodotdev/lingo.dev/pulls)
   - प्रत्येक PR के लिए चेंजसेट आवश्यक है: `pnpm new` (या `pnpm new:empty` नॉन-रिलीज़ परिवर्तनों के लिए)
   - सबमिट करने से पहले सुनिश्चित करें कि टेस्ट पास हो जाएं
3. **डेवलपमेंट:** यह एक pnpm + turborepo मोनोरेपो है
   - डिपेंडेंसीज़ इंस्टॉल करें: `pnpm install`
   - टेस्ट चलाएं: `pnpm test`
   - बिल्ड करें: `pnpm build`

**सपोर्ट:** [Discord कम्युनिटी](https://lingo.dev/go/discord)

## स्टार हिस्ट्री

यदि आपको Lingo.dev उपयोगी लगता है, तो हमें एक स्टार दें और 10,000 स्टार तक पहुंचने में हमारी मदद करें!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## स्थानीयकृत डॉक्यूमेंटेशन

**उपलब्ध अनुवाद:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**नई भाषा जोड़ना:**

1. [`i18n.json`](./i18n.json) में [BCP-47 फॉर्मेट](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) का उपयोग करके लोकेल कोड जोड़ें
2. एक पुल रिक्वेस्ट सबमिट करें

**BCP-47 लोकेल फॉर्मेट:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (लोअरकेस): `en`, `zh`, `bho`
- `Script`: ISO 15924 (टाइटल केस): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (अपरकेस): `US`, `CN`, `IN`
- उदाहरण: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
