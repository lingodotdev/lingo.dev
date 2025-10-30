<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - എൽഎൽഎമ്മുകൾ (LLM-കൾ) ഉപയോഗിച്ച് തൽക്ഷണ ലോക്കലൈസേഷനായി ഓപ്പൺ സോഴ്‌സ്, AI-പവർഡ് i18n ടൂൾകിറ്റ്.</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev കംപൈലർ</a> •
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

## കംപൈലറിനെ പരിചയപ്പെടാം 🆕

**Lingo.dev കംപൈലർ** ഇതൊരു സൗജന്യ, ഓപ്പൺ സോഴ്‌സ് കംപൈലർ മിഡിൽവെയർ ആണ്. നിലവിലുള്ള റിയാക്റ്റ് കമ്പോണന്റുകളിൽ യാതൊരു മാറ്റവും വരുത്താതെ, ബിൽഡ് സമയത്ത് തന്നെ ഏത് റിയാക്റ്റ് ആപ്പിനെയും ബഹുഭാഷകളിലേക്ക് മാറ്റാൻ ഇത് സഹായിക്കുന്നു.

ഒരിക്കൽ ഇൻസ്റ്റാൾ ചെയ്യുക:

```bash
npm install lingo.dev
```

നിങ്ങളുടെ ബിൽഡ് കോൺഫിഗിൽ പ്രവർത്തനക്ഷമമാക്കുക:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`നെക്സ്റ്റ് ബിൽഡ്` റൺ ചെയ്യുക, സ്പാനിഷ്, ഫ്രഞ്ച് ബണ്ടിലുകൾ തയ്യാറാവുന്നത് കാണാം ✨

[ഡോക്സ് വായിക്കുക →](https://lingo.dev/compiler) പൂർണ്ണമായ ഗൈഡിനായി, കൂടാതെ [ഞങ്ങളുടെ ഡിസ്കോർഡിൽ ചേരുക](https://lingo.dev/go/discord) നിങ്ങളുടെ സെറ്റപ്പുമായി ബന്ധപ്പെട്ട സഹായം ലഭിക്കാൻ.

---

### ഈ റിപ്പോസിറ്ററിയിൽ എന്തെല്ലാമാണ്?

| ടൂൾ         | TL;DR                                                                          | ഡോക്സ്                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | ബിൽഡ് സമയത്തുള്ള റിയാക്റ്റ് ലോക്കലൈസേഷൻ                                                 | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | വെബ്, മൊബൈൽ ആപ്പുകൾ, JSON, YAML, മാർക്ക്ഡൗൺ, കൂടാതെ മറ്റു പലതിനും ഒരൊറ്റ കമാൻഡിൽ ലോക്കലൈസേഷൻ. | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    |ഓരോ പുഷിലും തർജ്ജമകൾ ഓട്ടോ-കമ്മിറ്റ് ചെയ്യുക + ആവശ്യമെങ്കിൽ പുൾ റിക്വസ്റ്റുകൾ സൃഷ്ടിക്കുക       | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ഉപയോക്താവ് സൃഷ്ടിക്കുന്ന ഉള്ളടക്കത്തിനായുള്ള തത്സമയ തർജ്ജമ                              | [/sdk](https://lingo.dev/sdk)           |

ഓരോന്നിനെക്കുറിച്ചുമുള്ള ഹ്രസ്വവിവരണം താഴെ നൽകുന്നു 👇

---

### ⚡️ Lingo.dev CLI

നിങ്ങളുടെ ടെർമിനലിൽ നിന്ന് നേരിട്ട് കോഡും ഉള്ളടക്കവും തർജ്ജമ ചെയ്യുക.

```bash
npx lingo.dev@latest run
```

ഇത് എല്ലാ സ്ട്രിംഗുകളും ഫിംഗർപ്രിൻ്റ് ചെയ്യുന്നു, ഫലങ്ങൾ കാഷേ ചെയ്യുന്നു, കൂടാതെ മാറ്റം വന്നവ മാത്രം വീണ്ടും തർജ്ജCമ ചെയ്യുന്നു.

[ഡോക്സ് പിന്തുടരുക →](https://lingo.dev/cli) ഇത് എങ്ങനെ സജ്ജീകരിക്കാമെന്ന് അറിയാൻ.

---

### 🔄 Lingo.dev CI/CD

മികച്ച തർജ്ജമകൾ ഓട്ടോമാറ്റിക്കായി ഷിപ്പ് ചെയ്യുക.

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

മാനുവൽ സ്റ്റെപ്പുകളില്ലാതെ നിങ്ങളുടെ റിപ്പോ 'ഗ്രീൻ' ആയും പ്രൊഡക്റ്റ് ബഹുഭാഷയിലും നിലനിർത്തുന്നു.

[ഡോക്സ് വായിക്കുക →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ഡൈനാമിക് ഉള്ളടക്കത്തിനായി, ഓരോ റിക്വസ്റ്റിനും തൽക്ഷണ തർജ്ജമ.

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

ചാറ്റ്, ഉപയോക്താക്കളുടെ കമൻ്റുകൾ, മറ്റ് തത്സമയ ഫ്ലോകൾ എന്നിവയ്ക്ക് ഏറ്റവും അനുയോജ്യം.

[ഡോക്സ് വായിക്കുക →](https://lingo.dev/sdk)

---

## 🤝 കമ്മ്യൂണിറ്റി

ഞങ്ങൾ കമ്മ്യൂണിറ്റി-ഡ്രിവൺ ആണ്, സംഭാവനകളെ സ്വാഗതം ചെയ്യുന്നു!

- ഒരു ആശയം ഉണ്ടോ? [ഒരു ഇഷ്യൂ ഓപ്പൺ ചെയ്യുക](https://github.com/lingodotdev/lingo.dev/issues)
- എന്തെങ്കിലും ശരിയാക്കാനുണ്ടോ? [ഒരു PR അയക്കുക](https://github.com/lingodotdev/lingo.dev/pulls)
- സഹായം വേണോ? [ഞങ്ങളുടെ ഡിസ്കോർഡിൽ ചേരുക](https://lingo.dev/go/discord)

## ⭐ സ്റ്റാർ ഹിസ്റ്ററി

ഞങ്ങൾ ചെയ്യുന്നത് നിങ്ങൾക്ക് ഇഷ്ടമായെങ്കിൽ, ഞങ്ങൾക്ക് ഒരു ⭐ നൽകുക, 4,000 സ്റ്റാറുകളിലെത്താൻ സഹായിക്കൂ! 🌟

[![സ്റ്റാർ ഹിസ്റ്ററി ചാർട്ട്](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 മറ്റ് ഭാഷകളിലുള്ള Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

നിങ്ങളുടെ ഭാഷ കാണുന്നില്ലേ? അത് ...ഇൽ ചേർക്കുക [`i18n.json`](./i18n.json) ഉം ഒരു PR ഓപ്പൺ ചെയ്യുക!