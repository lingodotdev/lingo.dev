
<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ఓపెన్ సోర్స్, AI ఆధారిత i18n టూల్‌కిట్ – మీ యాప్‌ను తక్షణంగా బహుభాషా చేయండి!</strong>
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
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last Commit" />
  </a>
</p>

---

## కంపైలర్ పరిచయం 🆕

**Lingo.dev కంపైలర్** ఒక ఉచిత మరియు ఓపెన్ సోర్స్ మిడిల్‌వేర్, ఇది మీ React యాప్‌ను build సమయంలోనే బహుభాషా చేయడానికి సహాయపడుతుంది, ఏ కోడ్ మార్పులు అవసరం లేకుండా.

ఇన్స్టాల్ చేయండి:

```bash
npm install lingo.dev
```

బిల్డ్ కాన్ఫిగ్‌లో యాక్టివ్ చేయండి:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["te", "hi"],
})(existingNextConfig);
```

`next build` రన్ చేసి తెలుగు మరియు హిందీ బండిల్స్‌ను చూడండి ✨

[డాక్యుమెంటేషన్ చదవండి →](https://lingo.dev/compiler) మరియు [డిస్కార్డ్‌లో చేరండి](https://lingo.dev/go/discord) సహాయం కోసం.

---

### ఈ రిపోజిటరీలో ఏముంది?

| టూల్ | వివరణ | డాక్యుమెంట్స్ |
|------|--------|----------------|
| **కంపైలర్** | React బిల్డ్ సమయంలో లోకలైజేషన్ | [/compiler](https://lingo.dev/compiler) |
| **CLI** | ఒక కమాండ్‌తో వెబ్, మొబైల్, JSON, YAML, markdown అనువాదం | [/cli](https://lingo.dev/cli) |
| **CI/CD** | ప్రతి పుష్‌కి ఆటోమేటిక్ ట్రాన్స్‌లేషన్ కమిట్ | [/ci](https://lingo.dev/ci) |
| **SDK** | యూజర్ కంటెంట్‌కు రియల్‌టైమ్ అనువాదం | [/sdk](https://lingo.dev/sdk) |

---

### ⚡️ Lingo.dev CLI

టెర్మినల్ నుంచే కోడ్ మరియు కంటెంట్ అనువదించండి.

```bash
npx lingo.dev@latest run
```

ఇది ప్రతి స్ట్రింగ్‌కి ఫింగర్‌ప్రింట్ చేస్తుంది, క్యాష్ చేస్తుంది మరియు మారిన వాటినే మళ్లీ అనువదిస్తుంది.

[డాక్స్ చదవండి →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

ప్రతీ పుష్‌తో ఆటోమేటిక్ ట్రాన్స్‌లేషన్ డెలివరీ.

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

మీ ప్రాజెక్ట్‌ను ఎల్లప్పుడూ బహుభాషా మరియు గ్రీన్‌గా ఉంచుతుంది.

[డాక్స్ చదవండి →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

డైనమిక్ కంటెంట్ కోసం తక్షణ అనువాదం.

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
  targetLocale: "te",
});
// ఫలితం: { greeting: "హలో", farewell: "వీడ్కోలు", message: "మా ప్లాట్‌ఫారమ్‌కి స్వాగతం" }
```

చాట్‌లు, కామెంట్లు మరియు రియల్‌టైమ్ కంటెంట్‌కి సరైనది.

[డాక్స్ చదవండి →](https://lingo.dev/sdk)

---

## 🤝 కమ్యూనిటీ

మేము కమ్యూనిటీ ఆధారిత ప్రాజెక్ట్. మీ సహకారం స్వాగతం!

- కొత్త ఐడియా ఉందా? [Issue ఓపెన్ చేయండి](https://github.com/lingodotdev/lingo.dev/issues)
- కోడ్ కాంట్రిబ్యూట్ చేయాలా? [PR పంపండి](https://github.com/lingodotdev/lingo.dev/pulls)
- సహాయం కావాలా? [Discordలో చేరండి](https://lingo.dev/go/discord)

---

## ⭐ స్టార్ చరిత్ర

మా ప్రాజెక్ట్ నచ్చితే, ⭐ ఇవ్వండి!

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

---

## 🌐 ఇతర భాషలలో README

[English](https://github.com/lingodotdev/lingo.dev) • [हिन्दी](/readme/hi.md) • [తెలుగు](/readme/te.md)

మీ భాష కనిపించడం లేదా? [`i18n.json`](./i18n.json) లో జోడించి PR ఓపెన్ చేయండి!
