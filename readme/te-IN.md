<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    ⚡ Lingo.dev - LLMలతో తక్షణ స్థానికీకరణ కోసం ఓపెన్-సోర్స్, AI-ఆధారిత i18n
    టూల్‌కిట్.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/mcp">Lingo.dev MCP</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
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

## కంపైలర్‌ను కలవండి 🆕

**Lingo.dev Compiler** అనేది ఉచిత, ఓపెన్-సోర్స్ కంపైలర్ మిడిల్‌వేర్, ఇది ఇప్పటికే ఉన్న React కాంపోనెంట్‌లకు ఎలాంటి మార్పులు అవసరం లేకుండా బిల్డ్ టైమ్‌లో ఏ React యాప్‌ను అయినా బహుభాషాగా మార్చడానికి రూపొందించబడింది.

ఒకసారి ఇన్‌స్టాల్ చేయండి:

```bash
npm install @lingo.dev/compiler
```

మీ బిల్డ్ కాన్ఫిగ్‌లో ఎనేబుల్ చేయండి:

```ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr"],
    models: "lingo.dev",
  });
}
```

`next build` రన్ చేయండి మరియు స్పానిష్ మరియు ఫ్రెంచ్ బండిల్స్ బయటకు రావడం చూడండి ✨

పూర్తి గైడ్ కోసం [డాక్స్ చదవండి →](https://lingo.dev/compiler), మరియు మీ సెటప్‌తో సహాయం పొందడానికి [మా Discordలో చేరండి](https://lingo.dev/go/discord).

---

### ఈ రిపోలో ఏముంది?

| టూల్         | TL;DR                                                                                    | డాక్స్                                  |
| ------------ | ---------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | బిల్డ్-టైమ్ React స్థానికీకరణ                                                            | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | వెబ్ మరియు మొబైల్ యాప్‌లు, JSON, YAML, markdown, + మరిన్నింటి కోసం ఒక-కమాండ్ స్థానికీకరణ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ప్రతి పుష్‌లో అనువాదాలను ఆటో-కమిట్ చేయండి + అవసరమైతే పుల్ రిక్వెస్ట్‌లు సృష్టించండి      | [/ci](https://lingo.dev/ci)             |
| **SDK**      | యూజర్-జనరేటెడ్ కంటెంట్ కోసం రియల్‌టైమ్ అనువాదం                                           | [/sdk](https://lingo.dev/sdk)           |

ప్రతి ఒక్కదానికి సంబంధించిన ముఖ్య విషయాలు క్రింద ఉన్నాయి 👇

---

### ⚡️ Lingo.dev CLI

మీ టెర్మినల్ నుండి నేరుగా కోడ్ & కంటెంట్‌ను అనువదించండి.

```bash
npx lingo.dev@latest run
```

ఇది ప్రతి స్ట్రింగ్‌కు ఫింగర్‌ప్రింట్ చేస్తుంది, ఫలితాలను క్యాష్ చేస్తుంది మరియు మార్చబడిన వాటిని మాత్రమే తిరిగి అనువదిస్తుంది.

[డాక్యుమెంటేషన్ చూడండి →](https://lingo.dev/cli) సెటప్ ఎలా చేయాలో తెలుసుకోవడానికి.

---

### 🔄 Lingo.dev CI/CD

పరిపూర్ణ అనువాదాలను ఆటోమేటిక్‌గా డెలివర్ చేయండి.

```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

మాన్యువల్ స్టెప్స్ లేకుండా మీ రిపోను గ్రీన్‌గా మరియు మీ ప్రోడక్ట్‌ను బహుభాషాగా ఉంచుతుంది.

[డాక్యుమెంటేషన్ చదవండి →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

డైనమిక్ కంటెంట్ కోసం తక్షణ పర్-రిక్వెస్ట్ అనువాదం.

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: "your-api-key-here",
});

const content = {
  greeting: "Hello",
  farewell: "Goodbye",
  message: "Welcome to our platform",
};

const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
// Returns: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

చాట్, యూజర్ కామెంట్స్ మరియు ఇతర రియల్-టైం ఫ్లోస్ కోసం పర్ఫెక్ట్.

[డాక్యుమెంటేషన్ చదవండి →](https://lingo.dev/sdk)

---

## 🤝 కమ్యూనిటీ

మేము కమ్యూనిటీ-డ్రివెన్ మరియు కంట్రిబ్యూషన్స్‌ను ఇష్టపడతాము!

- ఐడియా ఉందా? [ఇష్యూ ఓపెన్ చేయండి](https://github.com/lingodotdev/lingo.dev/issues)
- ఏదైనా ఫిక్స్ చేయాలనుకుంటున్నారా? [PR పంపండి](https://github.com/lingodotdev/lingo.dev/pulls)
- సహాయం కావాలా? [మా డిస్కార్డ్‌లో చేరండి](https://lingo.dev/go/discord)

## ⭐ స్టార్ హిస్టరీ

మేము చేస్తున్నది మీకు నచ్చితే, మాకు ⭐ ఇవ్వండి మరియు 6,000 స్టార్స్ చేరుకోవడానికి సహాయం చేయండి! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ఇతర భాషలలో రీడ్‌మీ

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

మీ భాష కనిపించడం లేదా? దీన్ని [`i18n.json`](./i18n.json)కి జోడించి PR ఓపెన్ చేయండి!

**లొకేల్ ఫార్మాట్:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) కోడ్‌లను ఉపయోగించండి: `language[-Script][-REGION]`

- భాష: ISO 639-1/2/3 చిన్నబడి (`en`, `zh`, `bho`)
- లిపి: ISO 15924 టైటిల్ కేస్ (`Hans`, `Hant`, `Latn`)
- ప్రాంతం: ISO 3166-1 alpha-2 పెద్దబడి (`US`, `CN`, `IN`)
- ఉదాహరణలు: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
