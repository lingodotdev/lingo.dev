<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - විවෘත-මූලාශ්‍ර, AI-ශක්තිගත i18n toolkit එකක් වන අතර LLMs භාවිතා කර මොහොතකින් ස්ථානීය කිරීමක් (localization) සඳහා නිර්මාණය කර ඇත.</strong>
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

## Compiler හඳුන්වා දෙමු 🆕

**Lingo.dev Compiler** යනු නොමිලේ, විවෘත-මූලාශ්‍ර compiler middleware එකක් වන අතර එය React අයදුම්පතක් බහු භාෂා සහය සහිතව නිම කිරීමේදී (build-time) සකස් කරයි — React කොම්පෝනන්ට් එකකට කිසිදු වෙනසක් නැතිව.

Install කිරීම:

```bash
npm install lingo.dev
```

Build config එකට සක්‍රීය කිරීම:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ධාවනය කර, ස්පැනිෂ් සහ ප්‍රංශ භාෂා bundle මැදිහත්වෙමින් නිකුත් වීම නරඹන්න ✨

---

### මේ repo එක ඇතුළත තියෙන්නේ මොනවද?

| මෙවලම | කෙටි විස්තරය | ලේඛන |
| -------- | -------------------------------- | -------------------------------- |
| **Compiler** | React අයදුම්පත් සඳහා Build-time ස්ථානීය කිරීම | [/compiler](https://lingo.dev/compiler) |
| **CLI** | වෙබ් සහ ජංගම අයදුම්පත් සඳහා එක පණිවිඩයකින් ස්ථානීය කිරීම | [/cli](https://lingo.dev/cli) |
| **CI/CD** | Push එක්ක translation commit කිරීම හා pull request සෑදීම | [/ci](https://lingo.dev/ci) |
| **SDK** | පරිශීලක අන්තර්ගතය සඳහා ක්ෂණික ස්ථානීය කිරීම | [/sdk](https://lingo.dev/sdk) |

---

### ⚡️ Lingo.dev CLI

Terminal එකෙන්ම අන්තර්ගතය පරිවර්තනය කරන්න.

```bash
npx lingo.dev@latest run
```

මෙය සියලු string හඳුනාගෙන, cache කර, වෙනස් වූ අලුත් දේවල් පමණක් නැවත පරිවර්තනය කරයි.

---

### 🔄 Lingo.dev CI/CD

ස්වයංක්‍රීයව නිවැරදි පරිවර්තන ලබා දෙන්න.

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

ඔබේ repo එක පරිපූර්ණ තත්ත්වයෙන් තබා ගන්න.

---

### 🧩 Lingo.dev SDK

Dynamic content සඳහා ක්ෂණික පරිවර්තන.

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
  targetLocale: "si",
});
// Returns: { greeting: "හෙලෝ", farewell: "ගුඩ්බයි", message: "අපේ වේදිකාවට සාදරයෙන් පිළිගනිමු" }
```

චැට්, පරිශීලක අදහස්, සහ ක්ෂණික පරිවර්තන අවශ්‍ය දේවල් සඳහා පරිපූර්ණයි.

---

## 🤝 සමූහය (Community)

අපි සමූහය මත පදනම් වූ ආයතනයක් — ඔබගේ දායකත්වය සාදරයෙන් පිළිගනිමු!

- නව අදහසක් තිබේද? [Issue එකක් විවෘත කරන්න](https://github.com/lingodotdev/lingo.dev/issues)
- යම් දෙයක් නිවැරදි කිරීමට කැමතිද? [PR එකක් යවන්න](https://github.com/lingodotdev/lingo.dev/pulls)
- උදව් අවශ්‍යද? [අපේ Discord එකට එක්වන්න](https://lingo.dev/go/discord)

---

## ⭐ Star ඉතිහාසය

අපගේ වැඩ ඔබට ප්‍රිය නම්, ⭐ එකක් දෙන්න සහ අපට 4,000 stars පනස් වීමට උදව් කරන්න! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

---

## 🌐 වෙනත් භාෂාවල README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [සිංහල](/readme/si.md)

ඔබගේ භාෂාව නොපෙනෙනවද? [`i18n.json`](./i18n.json) හි එකතු කර PR එකක් විවෘත කරන්න!
