
<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ખુલ્લા સ્ત્રોત, AI આધારિત i18n ટૂલકિટ જે LLMs દ્વારા તરત જ લોકલાઇઝેશન કરે છે.</strong>
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

## Compiler સાથે મળો 🆕

**Lingo.dev Compiler** એક મુક્ત, ખુલ્લા સ્ત્રોતનું કમ્પાઇલર મિડલવેર છે, જે કોઈપણ React એપ્લિકેશનને બિલ્ડ સમયે બહુભાષી બનાવે છે — તે પણ હાલના React કોમ્પોનેન્ટમાં કોઈ ફેરફાર કર્યા વિના.

એક વાર ઇન્સ્ટોલ કરો:

```bash
npm install lingo.dev
```

તમારા બિલ્ડ કન્ફિગમાં સક્ષમ કરો:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

હવે `next build` ચલાવો અને જુઓ — Spanish અને French બંડલ તૈયાર ✨

પૂર્ણ માર્ગદર્શિકા માટે [દસ્તાવેજો વાંચો →](https://lingo.dev/compiler)  
અને તમારી મદદ માટે [અમારા Discord જોડાઓ](https://lingo.dev/go/discord).

---

### આ રિપોઝિટરીમાં શું છે?

| સાધન (Tool) | ટૂંકમાં (TL;DR) | દસ્તાવેજો |
| ------------ | ------------------------------- | ------------------------------ |
| **Compiler** | બિલ્ડ-સમયે React લોકલાઇઝેશન | [/compiler](https://lingo.dev/compiler) |
| **CLI** | વેબ અને મોબાઇલ એપ્સ માટે એક જ કમાન્ડમાં અનુવાદ | [/cli](https://lingo.dev/cli) |
| **CI/CD** | દરેક પુશ પર સ્વયં અનુવાદ કમિટ અને PR બનાવે | [/ci](https://lingo.dev/ci) |
| **SDK** | રીઅલટાઇમ અનુવાદ (યૂઝર જનરેટેડ કન્ટેન્ટ માટે) | [/sdk](https://lingo.dev/sdk) |

ચાલો દરેકને વિગતવાર જોઈએ 👇

---

### ⚡️ Lingo.dev CLI

તમારા ટર્મિનલ પરથી જ કોડ અને કન્ટેન્ટ અનુવાદ કરો.

```bash
npx lingo.dev@latest run
```

તે દરેક સ્ટ્રિંગને ફિંગરપ્રિન્ટ કરે છે, પરિણામ કૅશ કરે છે, અને ફક્ત બદલાયેલા ભાગોને ફરી અનુવાદ કરે છે.

તે સેટઅપ કરવાના માટે [દસ્તાવેજો અનુસરો →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

સ્વચાલિત રીતે પરિપૂર્ણ અનુવાદ મોકલો.

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

તમારું રિપો હંમેશા હરિયાળું રાખે 🌿  
અને પ્રોડક્ટને બહુમુખી બનાવે — માનવીય હસ્તક્ષેપ વિના۔

[દસ્તાવેજો વાંચો →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ડાયનામિક કન્ટેન્ટ માટે તરત જ અનુવાદ મેળવો.

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
// પરિણામ: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

ચેટ, યુઝર ટિપ્પણીઓ અને રિયલટાઇમ પ્રવાહ માટે આદર્શ.

[દસ્તાવેજો વાંચો →](https://lingo.dev/sdk)

---

## 🤝 સમુદાય (Community)

અમે સમુદાય દ્વારા સંચાલિત છીએ અને યોગદાનને આવકારીએ છીએ!

- કોઈ વિચાર છે? [Issue ખોલો](https://github.com/lingodotdev/lingo.dev/issues)
- કંઈ સુધારવું છે? [PR મોકલો](https://github.com/lingodotdev/lingo.dev/pulls)
- મદદ જોઈએ? [Discord જોડાઓ](https://lingo.dev/go/discord)

## ⭐ સ્ટાર ઇતિહાસ

જો તમને અમારું કાર્ય ગમે છે, તો અમને ⭐ આપો અને અમને 4,000 સ્ટાર સુધી પહોંચવામાં મદદ કરો! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

---

## 🌐 અન્ય ભાષામાં વાંચો

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • **[ગુજરાતી](/readme/gu.md)**

તમારી ભાષા નથી દેખાતી? [`i18n.json`](./i18n.json) માં ઉમેરો અને PR ખોલો!
