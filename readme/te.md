````markdown
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
    ⚡ Lingo.dev - ఓపెన్-సోర్స్ i18n టూల్‌కిట్, LLMs ద్వారా తక్షణ స్థానికీకరణ కోసం AI-చేత బలం పొందినది.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="పబ్లిష్"
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
      alt="లేటెస్ట్ కమిట్"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt"
    />
  </a>
</p>

---

## Lingo.dev Compiler ని కనుగొనండి 🆕

**Lingo.dev Compiler** ఒక ఫ్రీ మరియు ఓపెన్-సోర్స్ కాంపైలర్ మధ్యంలేయర్, ఇది ఎలాంటి React అప్లికేషన్‌ను కూడా బిల్డ్ సమయంలో బహుభాషకంగా మార్చుతుంది, React components ని మార్చాల్సిన అవసరం లేకుండా.

సింగిల్ ఇన్‌స్టాల్:

```bash
npm install lingo.dev
```
````

బిల్డ్ కాన్ఫిగరేషన్‌లో యాక్టివేట్ చేయండి:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` నడిపి స్పానిష్ మరియు ఫ్రెంచ్ బండిల్స్ కనిపిస్తాయ్ ✨

[డాక్యుమెంటేషన్ చూడండి →](https://lingo.dev/compiler) పూర్తి గైడ్ కోసం, మరియు సహాయానికి మా Discord లో చేరండి: https://lingo.dev/go/discord.

---

### ఈ రిపోలో ఏముంది?

| టూల్         | సంక్షిప్తంగా                                                                                                   | డాక్యుమెంటేషన్                          |
| ------------ | -------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | React కోసం బిల్డ్-టైమ్‌లో స్థానికీకరణ                                                                          | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | టెర్మినల్ నుండి నేరుగా కోడ్ మరియు కంటెంట్ అనువదించండి, JSON, YAML, markdown, మరియు మరిన్ని ఫార్మాట్స్కి మద్దతు | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ప్రతి push నిమిషంలో అనువాదాలను ఆటో-కమిట్ చేయండి మరియు అవసరమైతే PRల్ని సృష్టించు                                | [/ci](https://lingo.dev/ci)             |
| **SDK**      | యూజర్-జనరేటెడ్ కంటెంట్ కోసం రియల్-టైమ్ అనువాదం                                                                 | [/sdk](https://lingo.dev/sdk)           |

---

### ⚡️ Lingo.dev CLI

కోడ్‌ని మరియు కంటెంట్‌ని మీ టెర్మినల్ నుండి నేరుగా అనువదించండి.

```bash
npx lingo.dev@latest run
```

ఇది ప్రతి స్ట్రింగ్‌కు ఫింగర్‌ప్రింట్ సృష్టిస్తుంది, క్యాచింగ్ చేస్తుంది మరియు మారిన వాక్యాలను మాత్రమే మళ్ళీ అనువదిస్తుంది.

[డాక్యుమెంటేషన్ చూడండి →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

అనువాదాలను ఆటోమేటిక్‌గా డెలివర్ చేయండి.

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

---

### 🧩 Lingo.dev SDK

రివెల్టు కంటెంట్‌కు రియల్-టైమ్ అనువాదం.

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

---

## 🤝 కమ్యూనిటీ

మేము కమ్యూనిటీ-కేంద్రీకృతం మరియు కాంట్రిబ్యూషన్స్‌ను మనస్ఫూర్తిగా స్వీకరిస్తాము!

- మీకు ఒక ఐడియా ఉందా? [ఓ టికెట్ తెరువండి](https://github.com/lingodotdev/lingo.dev/issues)
- ఒక్కొ సాధారణ దిద్దుదల చేయాలనుకుంటున్నారా? [PR పంపండి](https://github.com/lingodotdev/lingo.dev/pulls)
- సహాయం కావాలా? [మా Discord లో చేరండి](https://lingo.dev/go/discord)

## 🌐 ఇతర భాషల్లో Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [తెలుగు](/readme/te.md)

```

```
