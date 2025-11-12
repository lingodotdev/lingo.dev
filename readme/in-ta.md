<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - திறந்த மூல, செயற்கை நுண்ணறிவு இயக்கப்படும் i18n கருவிப்பெட்டி, உடனடி உள்ளூர்மயமாக்கலுக்காக.</strong>
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
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last Commit" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Month" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Week" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="Product Hunt #2 Product of the Day" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="Github trending" />
  </a>
</p>

---

## Compiler ஐ சந்திக்கவும் 🆕

**Lingo.dev Compiler** என்பது ஒரு இலவச, திறந்த மூல தொகுப்பி மிடில்வேர் ஆகும், இது எந்த React பயன்பாட்டையும் பலமொழியாக்க வடிவில் கட்டமைக்க அனுமதிக்கிறது, தற்போதைய கூறுகளில் எந்த மாற்றங்களும் இல்லாமல்.

ஒருமுறை நிறுவவும்:

```bash
npm install lingo.dev
```

உங்கள் கட்டமைப்பில் இயக்கவும்:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ஐ இயக்கவும், பின்னர் ஸ்பானிஷ் மற்றும் பிரெஞ்ச் பண்டில்கள் தோன்றும் ✨

முழு வழிகாட்டி பெற [ஆவணங்களைப் படிக்கவும் →](https://lingo.dev/compiler) மற்றும் உதவி பெற [எங்கள் Discord-இல் சேரவும்](https://lingo.dev/go/discord).

---

### இந்த repo-வில் என்ன உள்ளது?

| கருவி | TL;DR | ஆவணங்கள் |
| ----------- | ------------------------- | ------------------------- |
| **Compiler** | React பயன்பாடுகளுக்கான கட்டுமான நேர உள்ளூர்மயமாக்கல் | [/compiler](https://lingo.dev/compiler) |
| **CLI** | வலை மற்றும் மொபைல் பயன்பாடுகளுக்கான ஒரு கட்டளை உள்ளூர்மயமாக்கல் | [/cli](https://lingo.dev/cli) |
| **CI/CD** | ஒவ்வொரு push-இலும் தானியங்கி மொழிபெயர்ப்புகள் | [/ci](https://lingo.dev/ci) |
| **SDK** | பயனர் உருவாக்கிய உள்ளடக்கத்திற்கான உடனடி மொழிபெயர்ப்பு | [/sdk](https://lingo.dev/sdk) |

---

### ⚡️ Lingo.dev CLI

கோடு மற்றும் உள்ளடக்கத்தை நேரடியாக உங்கள் டெர்மினலில் மொழிபெயர்க்கவும்.

```bash
npx lingo.dev@latest run
```

அது ஒவ்வொரு சரத்தையும் கைரேகைப்படுத்தி, கேச் செய்கிறது மற்றும் மாற்றியவற்றை மட்டுமே மீண்டும் மொழிபெயர்க்கிறது.

[ஆவணங்களைப் பின்பற்றவும் →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

தானியங்கிக் கூடிய மொழிபெயர்ப்புகளை அனுப்பவும்.

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

உடனடி கோரிக்கைக்கு தகுந்த மொழிபெயர்ப்பு.

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
```

---

## 🤝 சமூக

நாங்கள் சமூகத்தின் மூலம் இயக்கப்படுகிறோம்!

- ஒரு யோசனை உள்ளதா? [Issue திறக்கவும்](https://github.com/lingodotdev/lingo.dev/issues)
- ஏதாவது சரிசெய்ய வேண்டுமா? [PR அனுப்பவும்](https://github.com/lingodotdev/lingo.dev/pulls)
- உதவி தேவைதா? [Discord-இல் சேரவும்](https://lingo.dev/go/discord)

## ⭐ நட்சத்திர வரலாறு

நாங்கள் செய்கிறதை நீங்கள் விரும்பினால், எங்களுக்கு ⭐ கொடுக்கவும்! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 பிற மொழிகளில் Readme

[English](https://github.com/lingodotdev/lingo.dev) • [தமிழ்](/readme/ta.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [Русский](/readme/ru.md) • [Français](/readme/fr.md)