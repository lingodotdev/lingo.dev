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
    ⚡ Lingo.dev - විවෘත මූලාශ්‍ර, AI බලගැන්වූ i18n මෙවලම් කට්ටලය LLMs සමඟ
    ක්ෂණික ප්‍රාදේශීයකරණය සඳහා.
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
      alt="නිකුතුව"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="බලපත්‍රය"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="අවසාන කැමිට්"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt මාසයේ #1 DevTool"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt සතියේ #1 DevTool"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt දිනයේ #2 නිෂ්පාදනය"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github ට්‍රෙන්ඩින්"
    />
  </a>
</p>

---

## Compiler හමුවන්න 🆕

**Lingo.dev Compiler** යනු නොමිලේ, විවෘත මූලාශ්‍ර compiler middleware එකක්, දැනට පවතින React components වලට කිසිදු වෙනසක් අවශ්‍ය නොවී build time එකේදී ඕනෑම React යෙදුමක් බහුභාෂා බවට පත් කිරීමට නිර්මාණය කර ඇත.

> **සටහන:** ඔබ legacy compiler (`@lingo.dev/_compiler`) භාවිතා කරන්නේ නම්, කරුණාකර `@lingo.dev/compiler` වෙත සංක්‍රමණය වන්න. Legacy compiler එක deprecated වී ඇති අතර අනාගත නිකුතුවකදී ඉවත් කරනු ලැබේ.

එක් වරක් ස්ථාපනය කරන්න:

```bash
npm install @lingo.dev/compiler
```

ඔබේ build config එකේ සක්‍රීය කරන්න:

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

`next build` ධාවනය කර ස්පාඤ්ඤ සහ ප්‍රංශ bundles එළියට එනවා බලන්න ✨

සම්පූර්ණ මාර්ගෝපදේශය සඳහා [ලේඛන කියවන්න →](https://lingo.dev/compiler), සහ ඔබේ setup එක සඳහා උදව් ලබා ගැනීමට [අපගේ Discord එකට එකතු වන්න](https://lingo.dev/go/discord).

---

### මෙම repo එක තුළ මොනවාද තියෙන්නේ?

| මෙවලම        | TL;DR                                                                                   | ලේඛන                                    |
| ------------ | --------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Build-time React ප්‍රාදේශීයකරණය                                                         | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | වෙබ් සහ ජංගම යෙදුම්, JSON, YAML, markdown, + තවත් දේ සඳහා එක් විධානයකින් ප්‍රාදේශීයකරණය | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | සෑම push එකකදීම ස්වයංක්‍රීය-commit පරිවර්තන + අවශ්‍ය නම් pull requests නිර්මාණය කරන්න   | [/ci](https://lingo.dev/ci)             |
| **SDK**      | පරිශීලක-ජනනය කළ අන්තර්ගතය සඳහා තත්‍ය කාලීන පරිවර්තනය                                    | [/sdk](https://lingo.dev/sdk)           |

එක් එක් සඳහා ඉක්මන් විස්තර පහතින් 👇

---

### ⚡️ Lingo.dev CLI

ඔබේ terminal එකෙන් කෙලින්ම කේතය සහ අන්තර්ගතය පරිවර්තනය කරන්න.

```bash
npx lingo.dev@latest run
```

එය සෑම string එකක්ම fingerprint කරයි, ප්‍රතිඵල cache කරයි, සහ වෙනස් වූ දේ පමණක් නැවත පරිවර්තනය කරයි.

[ලේඛන අනුගමනය කරන්න →](https://lingo.dev/cli) එය සකසන ආකාරය ඉගෙන ගැනීමට.

---

### 🔄 Lingo.dev CI/CD

පරිපූර්ණ පරිවර්තන ස්වයංක්‍රීයව යවන්න.

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

අතින් කළ යුතු පියවර නොමැතිව ඔබේ repo එක හරිත තබා ගෙන ඔබේ නිෂ්පාදනය බහුභාෂා කරයි.

[ලේඛන කියවන්න →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ගතික අන්තර්ගතය සඳහා ක්ෂණික per-request පරිවර්තනය.

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

chat, පරිශීලක අදහස්, සහ අනෙකුත් තත්‍ය කාලීන ප්‍රවාහ සඳහා පරිපූර්ණයි.

[ලේඛන කියවන්න →](https://lingo.dev/sdk)

---

## 🤝 ප්‍රජාව

අපි ප්‍රජාව මත පදනම් වූ අතර දායකත්වයට ආදරය කරමු!

- අදහසක් තිබේද? [issue එකක් විවෘත කරන්න](https://github.com/lingodotdev/lingo.dev/issues)
- යමක් නිවැරදි කිරීමට අවශ්‍යද? [PR එකක් යවන්න](https://github.com/lingodotdev/lingo.dev/pulls)
- උදව්වක් අවශ්‍යද? [අපගේ Discord එකට එකතු වන්න](https://lingo.dev/go/discord)

## ⭐ තරු ඉතිහාසය

අපි කරන දේ ඔබට කැමති නම්, අපට ⭐ එකක් දී තරු 10,000 කට ළඟා වීමට අපට උදව් කරන්න! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 වෙනත් භාෂාවලින් Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

ඔබේ භාෂාව නොපෙනේද? එය [`i18n.json`](./i18n.json) වෙත එක් කර PR එකක් විවෘත කරන්න!

**Locale ආකෘතිය:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) කේත භාවිතා කරන්න: `language[-Script][-REGION]`

- භාෂාව: ISO 639-1/2/3 කුඩා අකුරු (`en`, `zh`, `bho`)
- ලිපිය: ISO 15924 මාතෘකා අකුරු (`Hans`, `Hant`, `Latn`)
- කලාපය: ISO 3166-1 alpha-2 ලොකු අකුරු (`US`, `CN`, `IN`)
- උදාහරණ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
