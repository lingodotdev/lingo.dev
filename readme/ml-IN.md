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
    ⚡ Lingo.dev - ഓപ്പൺ സോഴ്‌സ്, AI-യാൽ പ്രവർത്തിക്കുന്ന i18n ടൂൾകിറ്റ് —
    LLM-കളിലൂടെ തൽക്ഷണ ലോക്കലൈസേഷനായി.
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

## കമ്പൈലറെ പരിചയപ്പെടൂ 🆕

**Lingo.dev Compiler** എന്നത് ഒരു സൗജന്യ, ഓപ്പൺ സോഴ്‌സ് കമ്പൈലർ മിഡിൽവെയറാണ് — നിലവിലുള്ള React ഘടകങ്ങളിൽ മാറ്റമൊന്നുമില്ലാതെ ഏത് React ആപ്പിനെയും ബിൽഡ് സമയത്ത് ബഹുഭാഷയാക്കാൻ ഇതു സഹായിക്കുന്നു.

ഇൻസ്റ്റാൾ ചെയ്യുക:

```bash
npm install lingo.dev
```

നിങ്ങളുടെ ബിൽഡ് കോൺഫിഗറേഷനിൽ സജീവമാക്കുക:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` പ്രവർത്തിപ്പിക്കുക — സ്പാനിഷ്, ഫ്രഞ്ച് ബണ്ടിലുകൾ സ്വയമേവ ലഭിക്കും ✨

പൂർണ്ണമായ മാർഗ്ഗനിർദേശത്തിനായി [ഡോക്യുമെന്റേഷൻ വായിക്കുക →](https://lingo.dev/compiler)  
അല്ലെങ്കിൽ സഹായത്തിനായി [ഞങ്ങളുടെ Discord-ിൽ ചേരുക](https://lingo.dev/go/discord)

---

### ഈ റീപ്പോയിൽ എന്തൊക്കെ ഉണ്ട്?

| ടൂൾ          | ചുരുക്കം                                                                                 | ഡോക്യുമെന്റ്                            |
| ------------ | ---------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | ബിൽഡ് സമയത്ത് React ആപ്പുകൾക്ക് ബഹുഭാഷാ പിന്തുണ                                          | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | വെബ്, മൊബൈൽ ആപ്പുകൾ, JSON, YAML, Markdown എന്നിവയ്ക്ക് ഒരൊറ്റ കമാൻഡ് കൊണ്ട് ഭാഷാന്തരം    | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ഓരോ push-നും ട്രാൻസ്ലേഷൻസ് ഓട്ടോ-കമിറ്റ് ചെയ്യുകയും ആവശ്യമായാൽ PR സൃഷ്ടിക്കുകയും ചെയ്യും | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ഉപയോക്താക്കളുടെ സജീവ ഉള്ളടക്കത്തിന് റിയൽടൈം ഭാഷാന്തരം                                    | [/sdk](https://lingo.dev/sdk)           |

താഴെ ഓരോന്നിന്റെ ചുരുക്കം കാണാം 👇

---

### ⚡️ Lingo.dev CLI

നിങ്ങളുടെ ടർമിനലിൽ നിന്നുതന്നെ കോഡും ഉള്ളടക്കവും ഭാഷാന്തരം ചെയ്യുക.

```bash
npx lingo.dev@latest run
```

ഇത് ഓരോ സ്ട്രിംഗിനും ഫിംഗർപ്രിന്റ് സൃഷ്ടിക്കും, ഫലങ്ങൾ കാഷ് ചെയ്യും, മാറ്റം വന്നവ മാത്രം പുനർഭാഷാന്തരം ചെയ്യും.

[പൂർണ്ണ ഡോക്‌സ് വായിക്കുക →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

ട്രാൻസ്ലേഷൻസ് സ്വയം പ്രയോഗിക്കാം.

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

ഇതിലൂടെ നിങ്ങളുടെ റീപ്പോ പച്ചയായിരിക്കും 🌱, ഉൽപ്പന്നം ബഹുഭാഷയിലായിരിക്കും 🌍.

[ഡോക്യുമെന്റേഷൻ വായിക്കുക →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ഡൈനാമിക് ഉള്ളടക്കത്തിന് തൽക്ഷണ ഭാഷാന്തരം ലഭിക്കുക.

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
// ഫലം: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

ചാറ്റുകൾക്കും, ഉപയോക്തൃ കമന്റുകൾക്കും, തൽക്ഷണ അപ്ഡേറ്റുകൾക്കുമായി മികച്ചതാണ്.

[ഡോക്യുമെന്റേഷൻ വായിക്കുക →](https://lingo.dev/sdk)

---

## 🤝 സമൂഹം

ഞങ്ങൾ സമൂഹാധിഷ്ഠിതരാണ് — നിങ്ങളുടെ സംഭാവനകളെ ഞങ്ങൾ സ്നേഹിക്കുന്നു!

- ആശയമുണ്ടോ? [Issue തുറക്കൂ](https://github.com/lingodotdev/lingo.dev/issues)
- എന്തെങ്കിലും പരിഹരിക്കാനോ? [PR അയക്കൂ](https://github.com/lingodotdev/lingo.dev/pulls)
- സഹായം വേണോ? [ഞങ്ങളുടെ Discord-ൽ ചേരൂ](https://lingo.dev/go/discord)

## ⭐ നക്ഷത്ര ചരിത്രം

ഞങ്ങൾ ചെയ്യുന്നത് നിങ്ങൾക്ക് ഇഷ്ടമാണെങ്കിൽ, ഞങ്ങൾക്ക് ഒരു ⭐ നൽകൂ; 10,000 സ്റ്റാറുകൾ കൈവരിക്കാൻ ഞങ്ങളെ സഹായിക്കൂ! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 മറ്റ് ഭാഷകളിലുള്ള README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

നിങ്ങളുടെ ഭാഷ കാണുന്നില്ലേ? [`i18n.json`](./i18n.json) ഫയലിൽ ചേർക്കുക, ശേഷം PR തുറക്കൂ!

**ലോക്കേൽ ഫോർമാറ്റ്:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) കോഡുകൾ ഉപയോഗിക്കുക: `language[-Script][-REGION]`

- ഭാഷ: ISO 639-1/2/3 ചെറുകക്ഷരത്തിൽ (`en`, `zh`, `bho`)
- ലിപി: ISO 15924 ടൈറ്റിൽ കേസ് (`Hans`, `Hant`, `Latn`)
- പ്രദേശം: ISO 3166-1 alpha-2 വലിയക്ഷരത്തിൽ (`US`, `CN`, `IN`)
- ഉദാഹരണങ്ങൾ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
