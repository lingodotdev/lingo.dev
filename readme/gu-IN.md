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
    ⚡ Lingo.dev - ઓપન-સોર્સ, AI-સંચાલિત i18n ટૂલકિટ LLMs સાથે તાત્કાલિક
    સ્થાનિકીકરણ માટે.
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

## Compiler સાથે મળો 🆕

**Lingo.dev Compiler** એક મફત, ઓપન-સોર્સ કમ્પાઇલર મિડલવેર છે, જે કોઈપણ React એપ્લિકેશનને બિલ્ડ સમયે બહુભાષી બનાવવા માટે ડિઝાઇન કરવામાં આવ્યું છે, જેમાં હાલના React કમ્પોનન્ટ્સમાં કોઈ ફેરફારની જરૂર નથી.

એકવાર ઇન્સ્ટોલ કરો:

```bash
npm install @lingo.dev/compiler
```

તમારા બિલ્ડ કોન્ફિગમાં સક્ષમ કરો:

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

`next build` ચલાવો અને સ્પેનિશ અને ફ્રેન્ચ બંડલ્સ બહાર આવતા જુઓ ✨

સંપૂર્ણ માર્ગદર્શિકા માટે [દસ્તાવેજો વાંચો →](https://lingo.dev/compiler), અને તમારા સેટઅપમાં મદદ મેળવવા માટે [અમારા Discord માં જોડાઓ](https://lingo.dev/go/discord).

---

### આ રેપોમાં શું છે?

| ટૂલ          | TL;DR                                                                        | દસ્તાવેજો                               |
| ------------ | ---------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | બિલ્ડ-ટાઇમ React સ્થાનિકીકરણ                                                 | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | વેબ અને મોબાઇલ એપ્સ, JSON, YAML, markdown અને વધુ માટે એક-કમાન્ડ સ્થાનિકીકરણ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | દરેક પુશ પર ઓટો-કમિટ અનુવાદો + જરૂર હોય તો પુલ રિક્વેસ્ટ બનાવો               | [/ci](https://lingo.dev/ci)             |
| **SDK**      | યુઝર-જનરેટેડ કન્ટેન્ટ માટે રિયલટાઇમ અનુવાદ                                   | [/sdk](https://lingo.dev/sdk)           |

નીચે દરેક માટે ઝડપી માહિતી છે 👇

---

### ⚡️ Lingo.dev CLI

તમારા ટર્મિનલમાંથી સીધા કોડ અને સામગ્રીનું ભાષાંતર કરો.

```bash
npx lingo.dev@latest run
```

તે દરેક સ્ટ્રિંગને ફિંગરપ્રિન્ટ કરે છે, પરિણામોને કેશ કરે છે, અને ફક્ત જે બદલાયું છે તેનું જ ફરીથી ભાષાંતર કરે છે.

તેને કેવી રીતે સેટઅપ કરવું તે જાણવા માટે [દસ્તાવેજો અનુસરો →](https://lingo.dev/cli).

---

### 🔄 Lingo.dev CI/CD

સંપૂર્ણ ભાષાંતરો આપમેળે મોકલો.

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

તમારા રેપોને ગ્રીન અને તમારા પ્રોડક્ટને મેન્યુઅલ સ્ટેપ્સ વિના બહુભાષી રાખે છે.

[દસ્તાવેજો વાંચો →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ડાયનેમિક સામગ્રી માટે તાત્કાલિક પ્રતિ-વિનંતી ભાષાંતર.

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

ચેટ, યુઝર કોમેન્ટ્સ અને અન્ય રીઅલ-ટાઇમ ફ્લો માટે સંપૂર્ણ.

[દસ્તાવેજો વાંચો →](https://lingo.dev/sdk)

---

## 🤝 સમુદાય

અમે સમુદાય-સંચાલિત છીએ અને યોગદાનને પ્રેમ કરીએ છીએ!

- કોઈ વિચાર છે? [ઇશ્યૂ ખોલો](https://github.com/lingodotdev/lingo.dev/issues)
- કંઈક ઠીક કરવા માંગો છો? [PR મોકલો](https://github.com/lingodotdev/lingo.dev/pulls)
- મદદની જરૂર છે? [અમારા Discord જોડાઓ](https://lingo.dev/go/discord)

## ⭐ સ્ટાર હિસ્ટ્રી

જો તમને અમે જે કરી રહ્યા છીએ તે ગમે, તો અમને ⭐ આપો અને 6,000 સ્ટાર્સ સુધી પહોંચવામાં અમારી મદદ કરો! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 અન્ય ભાષાઓમાં Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

તમારી ભાષા દેખાતી નથી? તેને [`i18n.json`](./i18n.json) માં ઉમેરો અને PR ખોલો!

**લોકેલ ફોર્મેટ:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) કોડ્સનો ઉપયોગ કરો: `language[-Script][-REGION]`

- ભાષા: ISO 639-1/2/3 લોઅરકેસ (`en`, `zh`, `bho`)
- સ્ક્રિપ્ટ: ISO 15924 ટાઇટલ કેસ (`Hans`, `Hant`, `Latn`)
- પ્રદેશ: ISO 3166-1 alpha-2 અપરકેસ (`US`, `CN`, `IN`)
- ઉદાહરણો: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
