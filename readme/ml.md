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
    ⚡ Lingo.dev — ഓപ്പൺ-സോഴ്‌സ്, എഐ-സഹായിയുള്ള i18n ടൂൾകിറ്റ്; LLMs-ഉപയോഗിച്ച്
    ഉടൻ ലോക്കലൈസ് ചെയ്യുക.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev കമ്പൈലർ</a> •
  <a href="https://lingo.dev/mcp">Lingo.dev MCP</a> •
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
      alt="Last commit"
    />
  </a>
</p>

---

## കമ്പൈലറിനെ കണ്ടുമുട്ടുക 🆕

**Lingo.dev Compiler** ഒരു സൗജന്യ, ഓപ്പൺ-സോഴ്‌സ് കമ്പൈലർ മിഡിൽവെയറാണ് — നിലവിലെ React
കമ്പോണന്റുകളിൽ മാറ്റമില്ലാതെ build-time-ൽ ആപ്പുകൾ ബഹുഭാഷീയമാക്കാൻ രൂപകൽപ്പന ചെയ്തിരിക്കുന്നു.

ഒരു തവണ ഇൻസ്റ്റാൾ ചെയ്യുക:

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

`next build` പ്രവർത്തിപ്പിക്കുകയും സ്പാനിഷ്, ഫ്രഞ്ച് ബണ്ടിലുകൾ പ്രത്യക്ഷപ്പെടുന്നത് കാണുകയും ചെയ്യുക ✨

[ഡോക്യുമെന്റേഷൻ വായിക്കുക →](https://lingo.dev/compiler) പൂർണ്ണ ഗൈഡിനായി, കൂടാതെ [ഞങ്ങളുടെ Discord-ൽ ചേരുക](https://lingo.dev/go/discord) നിങ്ങളുടെ സെറ്റപ്പിന് സഹായം ലഭിക്കാൻ.

---

### ഈ റെപ്പോയിൽ എന്താണ് ഉള്ളത്?

| ടൂൾ         | സംക്ഷിപ്ത വിവരണം                                                                            | ഡോക്യുമെന്റേഷൻ                          |
| ----------- | ------------------------------------------------------------------------------------------- | --------------------------------------- |
| **കമ്പൈലർ** | Build-time React localization                                                               | [/compiler](https://lingo.dev/compiler) |
| **MCP**     | Model Context Protocol integrations                                                         | [/mcp](https://lingo.dev/mcp)           |
| **CLI**     | വെബ്, മൊബൈൽ ആപ്പുകൾ, JSON, YAML, മാർക്ക്ഡൗൺ, + കൂടുതൽ എന്നിവയ്ക്കായി ഒരു-കമാൻഡ് ലോക്കലൈസേഷൻ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | ഓരോ പുഷിലും അനുവാദങ്ങൾ ഓട്ടോ-കമ്മിറ്റ് ചെയ്യുക + ആവശ്യമെങ്കിൽ പുൾ റിക്വസ്റ്റുകൾ സൃഷ്ടിക്കുക | [/ci](https://lingo.dev/ci)             |
| **SDK**     | ഉപയോക്തൃ-ജനിത ഉള്ളടക്കത്തിനായി റിയൽടൈം അനുവാദം                                              | [/sdk](https://lingo.dev/sdk)           |

താഴെ ഓരോന്നിനുമുള്ള ദ്രുത വിവരങ്ങൾ നൽകിയിരിക്കുന്നു 👇

---

### ⚡️ Lingo.dev CLI

നിങ്ങളുടെ ടെർമിനലിൽ നിന്ന് നേരിട്ട് കോഡും ഉള്ളടക്കവും അനുവദിക്കുക.

```bash
npx lingo.dev@latest run
```

ഇത് ഓരോ സ്ട്രിങ്ങിനെയും ഫിംഗർപ്രിന്റ് ചെയ്യുന്നു, ഫലങ്ങൾ കാഷെ ചെയ്യുന്നു, മാറിയവ മാത്രം പുനരനുവദിക്കുന്നു.

[ഡോക്യുമെന്റേഷൻ പിന്തുടരുക →](https://lingo.dev/cli) ഇത് സെറ്റ് അപ്പ് ചെയ്യുന്ന വിധം അറിയാൻ.

---

### 🔄 Lingo.dev CI/CD

സ്വയമേവയുള്ള പൂർണ്ണ അനുവാദങ്ങൾ ഷിപ്പ് ചെയ്യുക.

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

നിങ്ങളുടെ റെപ്പോയെ പച്ചയാക്കി നിലനിർത്തുകയും നിങ്ങളുടെ ഉൽപ്പന്നത്തെ മാനുവൽ ഘട്ടങ്ങൾ ഇല്ലാതെ ബഹുഭാഷാ ആക്കുകയും ചെയ്യുന്നു.

[ഡോക്യുമെന്റേഷൻ വായിക്കുക →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ഡൈനാമിക് ഉള്ളടക്കത്തിനായി തൽക്ഷണ പ്രതി-അഭ്യർത്ഥന അനുവാദം.

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

ചാറ്റ്, ഉപയോക്തൃ അഭിപ്രായങ്ങൾ, മറ്റ് റിയൽ-ടൈം ഫ്ലോകൾ എന്നിവയ്ക്ക് മികച്ചത്.

[ഡോക്യുമെന്റേഷൻ വായിക്കുക →](https://lingo.dev/sdk)

---

## 🤝 സമൂഹം

ഞങ്ങൾ സമൂഹ-സഞ്ചാലിതരാണ്, യോഗദാനങ്ങൾ ഇഷ്ടപ്പെടുന്നു!

- ഏതെങ്കിലും ആശയമുണ്ടോ? [ഒരു ഇഷ്യൂ തുറക്കുക](https://github.com/lingodotdev/lingo.dev/issues)
- എന്തെങ്കിലും പരിഹരിക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ? [ഒരു PR അയയ്ക്കുക](https://github.com/lingodotdev/lingo.dev/pulls)
- സഹായം ആവശ്യമുണ്ടോ? [ഞങ്ങളുടെ Discord-ൽ ചേരുക](https://lingo.dev/go/discord)

## ⭐ സ്റ്റാർ ഹിസ്റ്ററി

ഞങ്ങളുടെ ജോലി ഇഷ്ടപ്പെട്ടാൽ, ഞങ്ങൾക്ക് ഒരു ⭐ നൽകുകയും കൂടുതൽ ജനങ്ങൾ എത്തിച്ചെല്ലാൻ സഹായിക്കുകയും ചെയ്യുക! 🌟

![സ്റ്റാർ ഹിസ്റ്ററി ചാർട്ട്](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

## 🌐 മറ്റ് ഭാഷകളിലുള്ള റീഡ്മി

English • [中文](https://github.com/lingodotdev/lingo.dev/blob/main/readme/zh-Hans.md) • [日本語](https://github.com/lingodotdev/lingo.dev/blob/main/readme/ja.md) • [한국어](https://github.com/lingodotdev/lingo.dev/blob/main/readme/ko.md) • [Español](https://github.com/lingodotdev/lingo.dev/blob/main/readme/es.md) • [Français](https://github.com/lingodotdev/lingo.dev/blob/main/readme/fr.md) • [Русский](https://github.com/lingodotdev/lingo.dev/blob/main/readme/ru.md) • [Українська](https://github.com/lingodotdev/lingo.dev/blob/main/readme/uk-UA.md) • [Deutsch](https://github.com/lingodotdev/lingo.dev/blob/main/readme/de.md) • [Italiano](https://github.com/lingodotdev/lingo.dev/blob/main/readme/it.md) • [العربية](https://github.com/lingodotdev/lingo.dev/blob/main/readme/ar.md) • [עברית](https://github.com/lingodotdev/lingo.dev/blob/main/readme/he.md) • [हिन्दी](https://github.com/lingodotdev/lingo.dev/blob/main/readme/hi.md) • [বাংলা](https://github.com/lingodotdev/lingo.dev/blob/main/readme/bn.md) • [فارسی](https://github.com/lingodotdev/lingo.dev/blob/main/readme/fa.md)

നിങ്ങളുടെ ഭാഷ കാണുന്നില്ലേ? അത് [`i18n.json`](./i18n.json) -ൽ ചേർത്ത് ഒരു PR തുറക്കുക!

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Bhojpuri](/readme/bho.md)

നിങ്ങളുടെ ഭാഷ കാണുന്നില്ലേ? അതിനെ [`i18n.json`](./i18n.json) ലേക്ക് ചേർക്കുക, പിന്നെ ഒരു PR തുറക്കുക!
