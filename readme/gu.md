<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ઓપન-સોર્સ, AI-સંચાલિત i18n ટૂલકિટ, જે LLMs સાથે તરત લોકલાઇઝેશન માટે બનાવવામાં આવી છે.</strong>
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

## કમ્પાઇલરને મેળવો 🆕

**Lingo.dev Compiler**આ એક મફત, ઓપન-સોર્સ કમ્પાઇલર મિડલવેર છે, જે બિલ્ડ સમયે કોઈપણ React એપને મલ્ટિલિંગ્યુઅલ બનાવવા માટે ડિઝાઇન કરવામાં આવ્યું છે — તે પણ હાલના React ઘટકોમાં કોઈ ફેરફાર કર્યા વગર.

એકવાર ઇન્સ્ટોલ કરો:

```bash
npm install lingo.dev
```
તમારા બિલ્ડ રૂપરેખામાં સક્ષમ કરો:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ચલાવો અને સ્પેનિશ અને ફ્રેન્ચ બંડલ્સ પોપ આઉટ થતા જુઓ ✨

[દસ્તાવેજો અનુસરો →](https://lingo.dev/compiler) પૂર્ણ માર્ગદર્શિકા માટે, અને [અમારા Discordમાં જોડાઓ](https://lingo.dev/go/discord) તમારી સેટઅપ માટે મદદ મેળવવા માટે.

---

### આ રેપોમાં શું છે?

| સાધન         | TL;DR                                                                                | દસ્તાવેજ                                |
| ------------- | ------------------------------------------------------------------------------------| --------------------------------------- |
| **Compiler**  | બિલ્ડ-ટાઇમ React લોકલાઇઝેશન                                                          | [/compiler](https://lingo.dev/compiler) |
| **CLI**       | વેબ અને મોબાઇલ એપ્સ, JSON, YAML, Markdown અને વધુ માટે એક જ કમાન્ડથી લોકલાઇઝેશન કરો   | [/cli](https://lingo.dev/cli)           |
| **CI/CD**     | દરેક પુષ પર અનુવાદોને આપમેળે કમિટ કરો + જરૂર પડે તો પુલ રિક્વેસ્ટ બનાવો                     | [/ci](https://lingo.dev/ci)             |
| **SDK**       | વપરાશકર્તા દ્વારા બનાવેલી સામગ્રી માટે રિયલટાઇમ અનુવાદ                                      | [/sdk](https://lingo.dev/sdk)           |


નીચે દરેક માટેની ઝડપી માહિતી આપેલી છે 👇

---

### ⚡️ Lingo.dev CLI

તમારા ટર્મિનલમાંથી સીધા કોડ અને સામગ્રીનો અનુવાદ કરો

```bash
npx lingo.dev@latest run
```

તે દરેક સ્ટ્રિંગનું ફિંગરપ્રિન્ટ બનાવે છે, પરિણામોને કૅશ કરે છે અને ફક્ત બદલાયેલ ભાગોનું ફરી અનુવાદ કરે છે.

[દસ્તાવેજો અનુસરો →](https://lingo.dev/cli) તે કેવી રીતે સેટ કરવું તે શીખવા માટે.

---

### 🔄 Lingo.dev CI/CD

પરફેક્ટ અનુવાદોને આપમેળે મોકલો.

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

તમારું રેપો હંમેશા ગ્રીન રાખે છે અને તમારા પ્રોડક્ટને મલ્ટિલિંગ્યુઅલ બનાવે છે — એ પણ કોઈ મેન્યુઅલ પગલાં વગર.

[દસ્તાવેજો વાંચો →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ડાયનામિક સામગ્રી માટે તાત્કાલિક પ્રતિ-વિનંતી અનુવાદ.

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

ચેટ, વપરાશકર્તા ટિપ્પણીઓ અને અન્ય રિયલ-ટાઈમ પ્રવાહો માટે સંપૂર્ણ.

[દસ્તાવેજો વાંચો →](https://lingo.dev/sdk)

---

## 🤝 સમુદાય

અમે સમુદાય દ્વારા ચલાવાતા છીએ અને યોગદાનને પ્રેમ કરીએ છીએ!

- કોઈ વિચાર છે? [Issue ખોલો](https://github.com/lingodotdev/lingo.dev/issues)
- કંઈક સુધારવું છે? [PR મોકલો](https://github.com/lingodotdev/lingo.dev/pulls)
- મદદ જોઈએ છે? [અમારા Discordમાં જોડાઓ](https://lingo.dev/go/discord)

## ⭐ સ્ટાર ઇતિહાસ

જો તમને અમારી કામગીરી પસંદ હોય, તો અમને ⭐ આપો અને અમને 4,000 સ્ટાર સુધી પહોંચવામાં મદદ કરો! 🌟

[![સ્ટાર ઇતિહાસ ચાર્ટ](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 અન્ય ભાષાઓમાં રીડમી

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)•[ગુજરાતી](/readme/fa.md)

તમારી ભાષા દેખાતી નથી? [`i18n.json`](./i18n.json) માં તેને ઉમેરો અને PR ખોલો!
