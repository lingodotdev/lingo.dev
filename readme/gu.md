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
		⚡ Lingo.dev - ઓપન સોર્સ, AI-સક્ષમ i18n ટૂલકિટ, LLMs સાથે ઝડપી લોકલાઇઝેશન માટે.
	</strong>
</p>

<br />

<p align="center">
	<a href="https://lingo.dev/compiler">Lingo.dev કંપાઇલર</a> •
	<a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
	<a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
	<a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
	<a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
		<img
			src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
			alt="રિલીઝ"
		/>
	</a>
	<a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
		<img
			src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
			alt="લાઇસેન્સ"
		/>
	</a>
	<a href="https://github.com/lingodotdev/lingo.dev/commits/main">
		<img
			src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
			alt="આખરી કમીટ"
		/>
	</a>
</p>

---

## કંપાઇલર પર એક નજર 🆕

**Lingo.dev કંપાઇલર** એક મફત અને ઓપન-સોર્સ કંપાઇલર મિડલવેર છે જે બિલ્ડ-ટાઇમ પર કોઈ પણ React એપને બહુભાષી બનાવવાની ક્ષમતા આપે છે — તમારા React કોમ્પોનન્ટ્સમાં કોઈ ફેરફાર કર્યા વિના.

માત્ર ઇન્સ્ટોલ કરો:

```bash
npm install lingo.dev
```

તમારા બિલ્ડ કોન્ફિગરેશનમાં સક્રિય કરો:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
	sourceLocale: "en",
	targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ચલાવો અને સ્પેનિશ અને ફ્રેંચ બંડલ્સ આપોઆપ સર્જાય છે ✨

[ડોક્યુમેન્ટેશન વાંચો →](https://lingo.dev/compiler) સંપૂર્ણ માર્ગદર્શન માટે, અને [અમારા Discord માં જોડાઓ](https://lingo.dev/go/discord) સહાય માટે.

---

### આ રીપોમાં શું છે?

| ટૂલ         | સંક્ષિપ્ત વર્ણન                                                              | ડોક્યુમેન્ટેશન                               |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------------- |
| **કંપાઇલર** | બિલ્ડ-ટાઇમ React લોકલાઇઝેશન                                                   | [/compiler](https://lingo.dev/compiler)       |
| **CLI**     | વેબ અને મોબાઇલ એપ્સ, JSON, YAML, Markdown અને વધુ માટે એક-કમાન્ડ લોકલાઇઝેશન      | [/cli](https://lingo.dev/cli)                 |
| **CI/CD**   | દરેક પુશ પર અનુવાદો ઓટો-કમીટ કરો અને જરૂરી પુલ રિક્વેસ્ટ બનાવો                      | [/ci](https://lingo.dev/ci)                   |
| **SDK**     | વપરાશકર્તા-જનરેટેડ કન્ટેન્ટ માટે રીયલટાઇમ અનુવાદ                                   | [/sdk](https://lingo.dev/sdk)                 |

નીચે દરેક માટે ટૂંકકાળિન માર્ગદર્શન છે 👇

---

### ⚡️ Lingo.dev CLI

તમારા ટર્મિનલમાંથી સીધું કોડ અને કન્ટેન્ટ અનુવાદ કરો.

```bash
npx lingo.dev@latest run
```

આ ટૂલ દરેક સ્ટ્રિંગને ફિંગરપ્રિન્ટ કરે છે, પરિણામો કૅશ કરે છે અને માત્ર બદલાયેલા વસ્તુઓને જ પુનઃઅનુવાદે છે.

[ડોક્યુમેન્ટેશન →](https://lingo.dev/cli) સેટઅપ અને ઉપયોગ માટે.

---

### 🔄 Lingo.dev CI/CD

અનુવાદોને ઓટો-શિપ કરો.

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

આ રીતે તમારા રીપો અને ઉત્પાદન બંનેને બિલ્ટ-ઈન લોકલાઇઝેશન મળે છે, કોઈ મેન્યુઅલ હસ્તક્ષેપ વિના.

[ડોક્યુમેન્ટેશન વાંચો →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ડાયનેમિક કન્ટેન્ટ માટે ઇન્સ્ટન્ટ પ્રતિ-વિનંતી અનુવાદ.

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

ચેટ, ઉકેલ-ફોરમ, અને વપરાશકર્તા-જનરેટેડ એરિયાઓ માટે યોગ્ય.

[ડોક્યુમેન્ટેશન →](https://lingo.dev/sdk)

---

## 🤝 સમુદાય

અમે સમુદાય-સંચલિત પ્રોજેક્ટ છીએ અને યોગદાન歓迎 કરીએ છીએ!

- સૂચન છે? [ઇશ્યૂ ખોલો](https://github.com/lingodotdev/lingo.dev/issues)
- કોઈ સુધારો કરવો છે? [PR મોકલો](https://github.com/lingodotdev/lingo.dev/pulls)
- મદદ જોઈએ? [Discord માં જોડાઓ](https://lingo.dev/go/discord)

## ⭐ સ્ટાર ઇતિહાસ

જો તમને પ્રોજેક્ટ ગમે તો અમને એક ⭐ આપો અને અમારી રીપોને વધુ લોકો સુધી પહોંચવામાં મદદ કરો! 🌟

[

![સ્ટાર ઇતિહાસ ચાર્ટ](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 અન્ય ભાષાઓમાં રીડમી

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

તમારી ભાષા અહીં નથી? તેને `i18n.json` માં ઉમેરો અને PR મોકલો!

