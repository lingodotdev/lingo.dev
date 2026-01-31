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
    ⚡ Lingo.dev - open-source, AI-പ്രാപ്തമായ i18n ടൂൾകിറ്റ്; LLMs ഉപയോഗിച്ച്
    തൽക്ഷണ ലോക്കലൈസേഷനായി.
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
      alt="റിലീസ്"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="ലൈസൻസ്"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="അവസാന കമ്മിറ്റ്"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt മാസത്തിലെ #1 ഡെവ് ടൂൾ"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt ആഴ്ചയിലെ #1 ഡെവ് ടൂൾ"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt ദിവസത്തിലെ #2 പ്രോഡക്റ്റ്"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github ട്രെൻഡിംഗ്"
    />
  </a>
</p>

---

## കമ്പൈലറെ പരിചയപ്പെടൂ 🆕

**Lingo.dev Compiler** ഒരു സൗജന്യ, open-source കമ്പൈലർ മിഡിൽവെയർ ആണ്; നിലവിലുള്ള React components-ിൽ മാറ്റങ്ങൾ ഒന്നും വേണമെന്നില്ലാതെ build സമയത്ത് ഏത് React ആപ്പിനെയും ബഹുഭാഷയായാക്കാൻ രൂപകൽപ്പന ചെയ്തതാണ്.

> **ശ്രദ്ധിക്കുക:** നിങ്ങൾ legacy കമ്പൈലർ (`@lingo.dev/_compiler`) ഉപയോഗിക്കുന്നുവെങ്കിൽ, ദയവായി `@lingo.dev/compiler`-ലേക്ക് മാറുക. legacy കമ്പൈലർ ഇപ്പോൾ deprecated ആണ്; വരാനിരിക്കുന്ന ഒരു റിലീസിൽ ഇത് നീക്കം ചെയ്യപ്പെടും.

Install once:

```bash
npm install @lingo.dev/compiler
```

നിങ്ങളുടെ build config-ിൽ സജീവമാക്കുക:

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

`next build` റൺ ചെയ്യുക; തുടർന്ന് സ്പാനിഷ്, ഫ്രഞ്ച് ബണ്ടിലുകൾ പുറത്തുവരുന്നത് കാണൂ ✨

[ഡോകുകൾ വായിക്കുക →](https://lingo.dev/compiler) സമ്പൂർണ മാർഗ്ഗനിർദേശത്തിനായി, കൂടാതെ നിങ്ങളുടെ ക്രമീകരണത്തിന് സഹായം നേടാൻ [ഞങ്ങളുടെ Discord-യിൽ ചേരുക](https://lingo.dev/go/discord).

---

### ഈ റീപ്പോയിൽ എന്തൊക്കെ ഉണ്ട്?

| ടൂൾ          | TL;DR                                                                                     | ഡോകുകൾ                                  |
| ------------ | ----------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | ബിൽഡ് സമയത്തെ React ലോക്കലൈസേഷൻ                                                           | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | വെബ്, മൊബൈൽ ആപ്പുകൾക്കും JSON, YAML, markdown മുതലായവയ്ക്കുമായി ഒറ്റ കമാൻഡ് ലോക്കലൈസേഷൻ   | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ഓരോ push-ലും വിവർത്തനങ്ങൾ auto-commit ചെയ്യുക + ആവശ്യമെങ്കിൽ pull request-ുകൾ സൃഷ്ടിക്കുക | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ഉപയോക്താക്കൾ സൃഷ്ടിക്കുന്ന ഉള്ളടക്കത്തിന് തത്സമയ വിവർത്തനം                                | [/sdk](https://lingo.dev/sdk)           |

ഓരോതിന്റെയും ചുരുക്കം താഴെ നൽകിയിരിക്കുന്നു 👇

---

### ⚡️ Lingo.dev CLI

നിങ്ങളുടെ ടെർമിനലിൽ നിന്നുതന്നെ കോഡും കണ്ടന്റും വിവർത്തനം ചെയ്യൂ.

```bash
npx lingo.dev@latest run
```

ഇത് ഓരോ string-നും fingerprint ചെയ്യുന്നു, ഫലങ്ങൾ cache ചെയ്യുന്നു, മാറിയവ മാത്രം വീണ്ടും translate ചെയ്യുന്നു.

[Docs കാണുക →](https://lingo.dev/cli) set up ചെയ്യുന്നത് എങ്ങനെ എന്ന് അറിയാൻ.

---

### 🔄 Lingo.dev CI/CD

തികഞ്ഞ വിവർത്തനങ്ങൾ ഓട്ടോമാറ്റിക്കായി ഡെലിവർ ചെയ്യൂ.

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

മാനുവൽ steps ഇല്ലാതെ നിങ്ങളുടെ repo green ആയും product multilingual ആയും നിലനിർത്തുന്നു.

[Docs വായിക്കുക →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ഡൈനാമിക് കണ്ടന്റിന് ഓരോ request-ത്തിനുമുള്ള തൽക്ഷണ വിവർത്തനം.

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

ചാറ്റ്, ഉപയോക്തൃ കമന്റുകൾ, മറ്റ് റിയൽ-ടൈം ഫ്ലോകൾ എന്നിവയ്ക്കു അനുയോജ്യം.

[Docs വായിക്കുക →](https://lingo.dev/sdk)

---

## 🤝 കമ്മ്യൂണിറ്റി

ഞങ്ങൾ കമ്മ്യൂണിറ്റി-ഡ്രിവൻ ആണ്, സംഭാവനകളെ ഞങ്ങൾ സ്നേഹിക്കുന്നു!

- ഒരു ആശയമുണ്ടോ? [ഒരു issue തുറക്കൂ](https://github.com/lingodotdev/lingo.dev/issues)
- എന്തെങ്കിലും ശരിയാക്കണമെന്നുണ്ടോ? [ഒരു PR അയയ്ക്കൂ](https://github.com/lingodotdev/lingo.dev/pulls)
- സഹായം വേണോ? [ഞങ്ങളുടെ Discord-ിൽ ചേരൂ](https://lingo.dev/go/discord)

## ⭐ സ്റ്റാർ ഹിസ്റ്ററി

ഞങ്ങൾ ചെയ്യുന്നത് നിങ്ങൾക്ക് ഇഷ്ടമാണെങ്കിൽ, ഞങ്ങൾക്ക് ഒരു ⭐ നൽകി, 10,000 സ്റ്റാറുകൾ നേടാൻ സഹായിക്കൂ! 🌟

[

![സ്റ്റാർ ചരിത്ര ചാർട്ട്](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 മറ്റ് ഭാഷകളിലുള്ള റീഡ്മി

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

നിങ്ങളുടെ ഭാഷ കാണുന്നില്ലേ? [`i18n.json`](./i18n.json)-ൽ അത് ചേർക്കുക, പിന്നെ ഒരു PR തുറക്കുക!

**ലോക്കേൽ ഫോർമാറ്റ്:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) കോഡുകൾ ഉപയോഗിക്കുക: `language[-Script][-REGION]`

- ഭാഷ: ISO 639-1/2/3 ലോവർകേസ് (`en`, `zh`, `bho`)
- ലിപി: ISO 15924 ടൈറ്റിൽ കേസ് (`Hans`, `Hant`, `Latn`)
- പ്രദേശം: ISO 3166-1 ആൽഫ-2 അപ്പർകേസ് (`US`, `CN`, `IN`)
- ഉദാഹരണങ്ങൾ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
