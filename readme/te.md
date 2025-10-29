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
    ⚡ Lingo.dev - ఓపెన్-సోర్స్, AI ఆధారిత i18n టూల్‌కిట్, LLMలతో వేగవంతమైన స్థానికీకరణ కోసం.
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

## కంపైలర్‌ని కలవండి 🆕

**Lingo.dev కంపైలర్** అనేది ఉచిత, ఓపెన్-సోర్స్ కంపైలర్ మిడిల్‌వేర్, ఇది React కంపోనెంట్‌లలో ఎలాంటి మార్పులు చేయకుండానే React యాప్‌లను బహుభాషా మద్దతుతో నిర్మించడానికి రూపొందించబడింది.

ఒకసారి ఇన్‌స్టాల్ చేయండి:

```bash
npm install lingo.dev
````

మీ బిల్డ్ కాన్ఫిగ్‌లో ప్రారంభించండి:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` నడపండి మరియు స్పానిష్ మరియు ఫ్రెంచ్ బండిల్స్ ఉత్పత్తి అయినట్లు చూడండి ✨

[పూర్తి గైడ్ చదవండి →](https://lingo.dev/compiler) మరియు [మా Discord‌లో చేరండి](https://lingo.dev/go/discord) మీ సెటప్‌కు సహాయం కోసం.

---

### ఈ రిపోలో ఏముంది?

| టూల్        | చిన్న వివరణ                                                                  | డాక్యుమెంటేషన్                          |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| **కంపైలర్** | బిల్డ్ టైమ్‌లో React స్థానికీకరణ                                             | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | వెబ్ మరియు మొబైల్ యాప్‌లు, JSON, YAML, Markdown మరియు మరిన్నింటి స్థానికీకరణ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | ప్రతి పుష్‌పై అనువాదాలను ఆటో-కమిట్ చేయండి మరియు అవసరమైనప్పుడు PR సృష్టించండి | [/ci](https://lingo.dev/ci)             |
| **SDK**     | వినియోగదారుల ఉత్పత్తి కంటెంట్ కోసం రియల్-టైమ్ అనువాదాలు                      | [/sdk](https://lingo.dev/sdk)           |

ప్రతి ఒక్కదానికి కింద వివరాలు ఉన్నాయి 👇

---

### ⚡️ Lingo.dev CLI

మీ టెర్మినల్ నుండే కోడ్ మరియు కంటెంట్‌ను అనువదించండి.

```bash
npx lingo.dev@latest run
```

ఇది ప్రతి స్ట్రింగ్‌ను ఫింగర్‌ప్రింట్ చేస్తుంది, ఫలితాలను క్యాష్ చేస్తుంది, మరియు మారిన వాటినే తిరిగి అనువదిస్తుంది.

[డాక్యుమెంటేషన్ చూడండి →](https://lingo.dev/cli) దాన్ని ఎలా సెట్ చేయాలో తెలుసుకోండి.

---

### 🔄 Lingo.dev CI/CD

అనువాదాలను ఆటోమేటిక్‌గా విడుదల చేయండి.

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

ఇది మీ రిపోను తాజాగాను, ఉత్పత్తిని మాన్యువల్ దశల అవసరం లేకుండా బహుభాషా మద్దతుతో ఉంచుతుంది.

[డాక్యుమెంటేషన్ చదవండి →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

డైనమిక్ కంటెంట్ కోసం వెంటనే అనువాదాలు.

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

చాట్‌లు, యూజర్ కామెంట్లు మరియు ఇతర రియల్ టైమ్ ఫ్లోలకు ఇది అద్భుతం.

[డాక్యుమెంటేషన్ చదవండి →](https://lingo.dev/sdk)

---

## 🤝 కమ్యూనిటీ

మేము కమ్యూనిటీ ఆధారితమైన ప్రాజెక్ట్ మరియు కాంట్రిబ్యూషన్లు స్వాగతిస్తున్నాము!

* కొత్త ఆలోచన ఉందా? [ఒక ఇష్యూ తెరవండి](https://github.com/lingodotdev/lingo.dev/issues)
* ఏదైనా సరిచేయాలనుకుంటున్నారా? [ఒక PR పంపండి](https://github.com/lingodotdev/lingo.dev/pulls)
* సహాయం కావాలా? [మా Discordలో చేరండి](https://lingo.dev/go/discord)

## ⭐ స్టార్ చరిత్ర

మా పనిని మీరు ఇష్టపడితే, ఒక ⭐ ఇవ్వండి మరియు 3,000 స్టార్లను చేరడానికి మాకు సహాయం చేయండి! 🌟

[

![స్టార్ చరిత్ర గ్రాఫ్](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev\&type=Date)

]([https://www.star-history.com/#lingodotdev/lingo.dev&Date](https://www.star-history.com/#lingodotdev/lingo.dev&Date))

## 🌐 ఇతర భాషలలో README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [తెలుగు](/readme/te.md)

మీ భాష కనిపించడం లేదా? [`i18n.json`](./i18n.json) లో చేర్చి PR ఓపెన్ చేయండి!

