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
    ⚡ Lingo.dev - ఓపెన్-సోర్స్, AI-శక్తితో కూడిన i18n టూల్‌కిట్ LLMలతో వేగవంతమైన
    స్థానికీకరణ కోసం.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev కంపైలర్</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="విడుదల"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="లైసెన్స్"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="చివరి కమిట్"
    />
  </a>
</p>

---

## కంపైలర్‌ను కలుసుకోండి 🆕

**Lingo.dev కంపైలర్** అనేది ఉచిత, ఓపెన్-సోర్స్ కంపైలర్ మిడిల్‌వేర్, ఇది ఇప్పటికే ఉన్న React కాంపోనెంట్‌లలో ఎలాంటి మార్పులు చేయకుండా బిల్డ్ టైమ్‌లో ఏదైనా React యాప్‌ను బహుభాషీకరించడానికి రూపొందించబడింది.

ఒకసారి ఇన్‌స్టాల్ చేయండి:

```bash
npm install lingo.dev
```

మీ బిల్డ్ కాన్ఫిగ్‌లో ప్రారంభించండి:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` రన్ చేయండి మరియు స్పానిష్ మరియు ఫ్రెంచ్ బండిల్‌లు కనిపించడం చూడండి ✨

[డాక్యుమెంటేషన్ చదవండి →](https://lingo.dev/compiler) పూర్తి గైడ్ కోసం, మరియు [మా Discord లో చేరండి](https://lingo.dev/go/discord) మీ సెటప్‌తో సహాయం పొందడానికి.

---

### ఈ రెపోలో ఏమి ఉంది?

| టూల్        | సంక్షిప్త వివరణ                                                                           | డాక్యుమెంటేషన్                          |
| ----------- | ----------------------------------------------------------------------------------------- | --------------------------------------- |
| **కంపైలర్** | బిల్డ్-టైమ్ React స్థానికీకరణ                                                             | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | వెబ్ మరియు మొబైల్ యాప్‌లు, JSON, YAML, మార్క్‌డౌన్, + మరిన్ని కోసం వన్-కమాండ్ స్థానికీకరణ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | ప్రతి పుష్‌లో అనువాదాలను ఆటో-కమిట్ చేయండి + అవసరమైనప్పుడు పుల్ రిక్వెస్ట్‌లు సృష్టించండి  | [/ci](https://lingo.dev/ci)             |
| **SDK**     | వినియోగదారు-ఉత్పన్న కంటెంట్ కోసం రియల్‌టైమ్ అనువాదం                                       | [/sdk](https://lingo.dev/sdk)           |

ప్రతిదానికి క్విక్ ఇన్ఫో క్రింద ఉంది 👇

---

### ⚡️ Lingo.dev CLI

మీ టెర్మినల్ నుండి నేరుగా కోడ్ మరియు కంటెంట్‌ను అనువదించండి.

```bash
npx lingo.dev@latest run
```

ఇది ప్రతి స్ట్రింగ్‌ను ఫింగర్‌ప్రింట్ చేస్తుంది, ఫలితాలను కాష్ చేస్తుంది, మరియు మార్చబడిన వాటిని మాత్రమే తిరిగి అనువదిస్తుంది.

[డాక్యుమెంటేషన్ అనుసరించండి →](https://lingo.dev/cli) దీన్ని ఎలా సెటప్ చేయాలో తెలుసుకోవడానికి.

---

### 🔄 Lingo.dev CI/CD

పరిపూర్ణ అనువాదాలను స్వయంచాలకంగా షిప్ చేయండి.

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

మీ రెపోను గ్రీన్‌గా మరియు మీ ప్రొడక్ట్‌ను మాన్యువల్ స్టెప్‌లు లేకుండా బహుభాషీగా ఉంచుతుంది.

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

చాట్, వినియోగదారు వ్యాఖ్యలు మరియు ఇతర రియల్-టైమ్ ఫ్లోల కోసం పరిపూర్ణం.

[డాక్యుమెంటేషన్ చదవండి →](https://lingo.dev/sdk)

---

## 🤝 కమ్యూనిటీ

మేము కమ్యూనిటీ-డ్రివెన్ మరియు కంట్రిబ్యూషన్‌లను ప్రేమిస్తాము!

- ఏదైనా ఆలోచన ఉందా? [ఇష్యూ తెరవండి](https://github.com/lingodotdev/lingo.dev/issues)
- ఏదైనా సరిచేయాలనుకుంటున్నారా? [PR పంపండి](https://github.com/lingodotdev/lingo.dev/pulls)
- సహాయం కావాలా? [మా Discord లో చేరండి](https://lingo.dev/go/discord)

## ⭐ స్టార్ హిస్టరీ

మా పనిని మీరు ఇష్టపడితే, మాకు ⭐ ఇవ్వండి మరియు 3,000 స్టార్‌లను చేరుకోవడంలో మాకు సహాయపడండి! 🌟

[

![స్టార్ హిస్టరీ చార్ట్](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ఇతర భాషలలో రీడ్‌మీ

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [తెలుగు](/readme/te.md)

మీ భాష కనిపించడం లేదా? దీన్ని [`i18n.json`](./i18n.json)లో జోడించి PR తెరవండి!
