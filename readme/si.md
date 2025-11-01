<![CDATA[<p align="center">
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
    ⚡ Lingo.dev - විවෘත-මූලාශ්‍ර, AI-බලගැන්වූ i18n මෙවලම් කට්ටලය LLMs සමඟ ක්ෂණික දේශීයකරණය සඳහා.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev සංකලකය</a> •
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
      alt="අවසන් කොමිට්"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="මාසයේ #1 DevTool" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="සතියේ #1 නිෂ්පාදනය" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="දවසේ #2 නිෂ්පාදනය" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="Github හි ප්‍රවණතා" />
  </a>
</p>

---

## සංකලකය හමුවන්න 🆕

**Lingo.dev සංකලකය** යනු නොමිලේ ලබාගත හැකි, විවෘත-මූලාශ්‍ර සංකලක මැදිවැර (middleware) එකකි, පවතින React සංරචක වෙනස් කිරීමකින් තොරව ගොඩනැගීමේ කාලයේදී ඕනෑම React යෙදුමක් බහුභාෂා සහිත කිරීමට නිර්මාණය කර ඇත.

එක් වරක් ස්ථාපනය කරන්න:

```bash
npm install lingo.dev
```

ඔබේ ගොඩනැගීමේ වින්‍යාසයේ සක්‍රිය කරන්න:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ධාවනය කර ස්පාඤ්ඤ සහ ප්‍රංශ බන්ඩල පැන නැගෙනු බලන්න ✨

සම්පූර්ණ මාර්ගෝපදේශය සඳහා [ලේඛන කියවන්න →](https://lingo.dev/compiler), සහ ඔබේ පිහිටුවීම සඳහා උපකාර ලබා ගැනීමට [අපගේ Discord වෙත එක්වන්න](https://lingo.dev/go/discord).

---

### මෙම ගබඩාවේ ඇත්තේ කුමක්ද?

| මෙවලම       | කෙටි විස්තරය                                                               | ලේඛන                                    |
| ------------ | -------------------------------------------------------------------------- | ---------------------------------------- |
| **සංකලකය**  | ගොඩනැගීම්-කාල React දේශීයකරණය                                           | [/compiler](https://lingo.dev/compiler)   |
| **CLI**      | වෙබ් හා ජංගම යෙදුම්, JSON, YAML, markdown, + තවත් දෑ සඳහා එක-විධාන දේශීයකරණය | [/cli](https://lingo.dev/cli)             |
| **CI/CD**    | සෑම push එකකටම ස්වයංක්‍රීය-කොමිට් පරිවර්තන + අවශ්‍ය නම් pull requests නිර්මාණය | [/ci](https://lingo.dev/ci)               |
| **SDK**      | පරිශීලක-ජනිත අන්තර්ගතය සඳහා තත්‍ය-කාලීන පරිවර්තනය                       | [/sdk](https://lingo.dev/sdk)             |

පහත සඳහන්වන්නේ එක් එක් දෑ සඳහා ක්ෂණික විස්තරයි 👇

---

### ⚡️ Lingo.dev CLI

ඔබේ අග්‍රය (terminal) වෙතින් කේතය සහ අන්තර්ගතය කෙලින්ම පරිවර්තනය කරන්න.

```bash
npx lingo.dev@latest run
```

එය සෑම පේළියක්ම ඇඟිලි සලකුණු කරයි, ප්‍රතිඵල සංචිත කරයි, සහ වෙනස් වූ දෑ පමණක් නැවත පරිවර්තනය කරයි.

එය පිහිටුවන්නේ කෙසේදැයි දැනගැනීමට [ලේඛන අනුගමනය කරන්න →](https://lingo.dev/cli).

---

### 🔄 Lingo.dev CI/CD

ස්වයංක්‍රීයව සම්පූර්ණ පරිවර්තන යවන්න.

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

මාර්ගපෙන්වූ පියවර නොමැතිව ඔබේ ගබඩාව කොළ පැහැයෙන් සහ ඔබේ නිෂ්පාදනය බහුභාෂා සහිතව තබයි.

[ලේඛන කියවන්න →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ගතික අන්තර්ගතය සඳහා ඉල්ලුම්-පදනම් වූ ක්ෂණික පරිවර්තනය.

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

පිළිසඳර, පරිශීලක අදහස් සහ වෙනත් තත්‍ය-කාලීන ගලායාම් සඳහා විශිෂ්ටයි.

[ලේඛන කියවන්න →](https://lingo.dev/sdk)

---

## 🤝 ප්‍රජාව

අපි ප්‍රජාව විසින් මෙහෙයවන අතර දායකත්වයන් අගය කරමු!

- අදහසක් තිබේද? [ගැටලුවක් විවෘත කරන්න](https://github.com/lingodotdev/lingo.dev/issues)
- යමක් නිවැරදි කිරීමට අවශ්‍යද? [PR එකක් යවන්න](https://github.com/lingodotdev/lingo.dev/pulls)
- උදව් අවශ්‍යද? [අපගේ Discord වෙත එක්වන්න](https://lingo.dev/go/discord)

## ⭐ තරු ඉතිහාසය

ඔබට අපගේ කාර්යය රුචි නම්, අපට තරුවක් ⭐ ලබා දී තරු 3,000 ක් කරා ළඟා වීමට උදව් කරන්න! 🌟

[

![තරු ඉතිහාස ප්‍රස්තාරය](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 වෙනත් භාෂාවලින් README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [සිංහල](/readme/si.md) • [فارسی](/readme/fa.md)

ඔබේ භාෂාව නොපෙනේද? එය [`i18n.json`](./i18n.json) වෙත එක් කර PR එකක් විවෘත කරන්න!

---]]>