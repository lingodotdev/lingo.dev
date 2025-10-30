# લિંગો.ડેવ (Lingo.dev)

<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ઓપન સોર્સ, AI-સંચાલિત i18n ટૂલકિટ, જે LLMs સાથે તાત્કાલિક લોકલાઇઝેશન માટે છે।</strong>
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

## કમ્પાઇલર સાથે મળો 🆕

**Lingo.dev Compiler** એક મફત, ઓપન સોર્સ કમ્પાઇલર મિડલવેર છે, જે કોઈપણ React એપ્લિકેશનને બિલ્ડ સમયે બહુભાષી બનાવવા માટે ડિઝાઇન કરવામાં આવ્યું છે, વર્તમાન React કમ્પોનન્ટ્સમાં કોઈ ફેરફાર કર્યા વગર।

એક વખત ઇન્સ્ટોલ કરો:

```bash
npm install lingo.dev
```

તમારા બિલ્ડ કન્ફિગમાં એનેબલ કરો:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ચલાવો અને સ્પેનિશ અને ફ્રેન્ચ બન્ડલ્સ તૈયાર થશે ✨

[Docs વાંચો →](https://lingo.dev/compiler) સંપૂર્ણ માર્ગદર્શિકા માટે, અને [અમારા Discord ને જોઇન કરો](https://lingo.dev/go/discord) તમારા સેટઅપ માટે મદદ લેવા.

---

### આ રેપોમાં શું છે?

| Tool         | TL;DR                                                                          | Docs                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | React માટે બિલ્ડ-ટાઇમ લોકલાઇઝેશન                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | વેબ અને મોબાઇલ એપ્સ, JSON, YAML, markdown વગેરે માટે એક કમાન્ડ લોકલાઇઝેશન          | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | દરેક push પર ઓટો-કમિટ અનુવાદો + જરૂર મુજબ pull requests બનાવો                    | [/ci](https://lingo.dev/ci)             |
| **SDK**      | યૂઝર-જનરેટેડ કન્ટેન્ટ માટે રિયલટાઇમ અનુવાદ                                         | [/sdk](https://lingo.dev/sdk)           |

નીચે દરેક માટે ઝડપી વિગતો છે 👇

---

### ⚡️ Lingo.dev CLI

તમારા ટર્મિનલથી સીધું કોડ અને કન્ટેન્ટનો અનુવાદ કરો.

```bash
npx lingo.dev@latest run
```

તે દરેક સ્ટ્રિંગને ફિંગરપ્રિન્ટ કરે છે, પરિણામો કેશ કરે છે, અને ફક્ત બદલાયેલા ભાગનો જ અનુવાદ કરે છે.

[Docs અનુસરો →](https://lingo.dev/cli) તેને કેવી રીતે સેટ કરવું તે શીખવા માટે.

---

### 🔄 Lingo.dev CI/CD

આપોઆપ સંપૂર્ણ અનુવાદો શિપ કરો.

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

તમારા રેપોને ગ્રીન અને તમારા પ્રોડક્ટને બહુભાષી રાખે છે, મેન્યુઅલ સ્ટેપ્સ વગર.

[Docs વાંચો →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ડાયનેમિક કન્ટેન્ટ માટે તાત્કાલિક પર-રિક્વેસ્ટ અનુવાદ.

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: "your-api-key-here",
});

const content = {
  greeting: "નમસ્કાર",
  farewell: "વિદાય",
  message: "અમારા પ્લેટફોર્મ પર આપનું સ્વાગત છે",
};

const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale: "gu",
  targetLocale: "en",
});
// પરિણામ: { greeting: "Hello", farewell: "Goodbye", message: "Welcome to our platform" }
```

ચેટ, યૂઝર કમેન્ટ્સ અને અન્ય રિયલ-ટાઇમ ફ્લો માટે સંપૂર્ણ.

[Docs વાંચો →](https://lingo.dev/sdk)

---

## 🤝 કમ્યુનિટી

અમે કમ્યુનિટી-ડ્રિવન છીએ અને યોગદાનને પ્રેમ કરીએ છીએ!

- કોઈ આઇડિયા છે? [ઇશ્યૂ ખોલો](https://github.com/lingodotdev/lingo.dev/issues)
- કંઈક ઠીક કરવા માંગો છો? [PR મોકલો](https://github.com/lingodotdev/lingo.dev/pulls)
- મદદ જોઈએ છે? [અમારા Discord ને જોઇન કરો](https://lingo.dev/go/discord)

## ⭐ સ્ટાર હિસ્ટ્રી

જો તમને અમારું કામ ગમતું હોય, તો અમને ⭐ આપો અને અમને 4,000 સ્ટાર્સ સુધી પહોંચવામાં મદદ કરો! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 અન્ય ભાષાઓમાં Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [ગુજરાતી](/readme/gu.md)

તમારી ભાષા દેખાતી નથી? તેને [`i18n.json`](../i18n.json) માં ઉમેરો અને PR ખોલો!