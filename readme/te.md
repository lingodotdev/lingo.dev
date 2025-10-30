
````markdown
<p align="center">
	<a href="https://lingo.dev">
		<img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
	</a>
</p>

<p align="center">
	<strong>⚡ Lingo.dev - ఓపెన్ సోర్స్, AI శక్తి గల i18n టూల్‌కిట్ — తక్షణఎ రీకి లొకలైజేషన్ కోసం LLMలను ఉపయోగిస్తుంది.</strong>
</p>

<br />

<p align="center">
	<a href="https://lingo.dev/compiler">Lingo.dev కంపైలర్</a> •
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

## కంపైలర్‌ను పరిచయం 🆕

**Lingo.dev కంపైలర్** ఒక ఉచిత, ఓపెన్-సోర్స్ కంపైలర్ మిడిల్వేర్ — సమయానుకూలంగా ఏ React యాప్‌ను బిల్డ్ టైంలో బహుభాషాగతంగా మార్చేలా రూపొందించబడింది, మరియు ఉన్న React కంపొనెంట్లలో మార్పులు చేయాల్సిన అవసరం లేదు.

ఒకసారి ఇన్‌‌స్టాల్ చేయండి:

```bash
npm install lingo.dev
```

మీ బిల్డ్ కాన్ఫిగ్‌లో ఎనేబుల్ చేయండి:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
	sourceLocale: "en",
	targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` నడిపించి స్పానిష్ మరియు ఫ్రెంచ్ బండిల్స్ తయారవుతున్నాయని చూడండి ✨

[పూర్తి గైడ్ కోసం డాక్స్ చదవండి →](https://lingo.dev/compiler), మరియు సెటప్ కోసం సహాయం కావాలంటే [మా Discordలో చేరండి](https://lingo.dev/go/discord).

---

### ఈ రిపోలో ఏమి ఉందో?

| టూల్         | సారాంశం                                                                        | డాక్స్                                  |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | బిల్డ్-టైమ్ React లోకలైజేషన్                                                    | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ఒకే కమాండ్‌తో వెబ్ మరియు మొబైల్ యాప్స్, JSON, YAML, మార్క్‌డౌన్ మరియు మరిన్ని అనువదించండి | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ప్రతీ push పై ఆటో-కమిట్ చేయు అనువాదాలు + అవసరమైతే pull request సృష్టిస్తుంది        | [/ci](https://lingo.dev/ci)             |
| **SDK**      | రియల్-టైమ్ అనువాదం యూజర్-జనరేటెడ్ కంటెంట్ కోసం                                | [/sdk](https://lingo.dev/sdk)           |

క్రింది భాగాలు త్వరిత గమనికలు 👇

---

### ⚡️ Lingo.dev CLI

మీ టెర్మినల్ నుండినే కోడ్ & కంటెంట్ అనువదించండి.

```bash
npx lingo.dev@latest run
```

ఇది ప్రతి స్ట్రింగ్‌కు ఫింగర్ప్రింట్ చేస్తుంది, ఫలితాలు క్యాష్ చేస్తుంది, మరియు మార్పు వచ్చినదే మాత్రమే మళ్లీ అనువదిస్తుంది.

[సెట్టప్ ఎలా చేయాలో డాక్స్ ఫాలో చెయ్యండి →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

సరిగ్గా అనువదించబడిన ట్రాన్స్లేషన్స్‌ను ఆటోమేటిక్‌గా షిప్ చేయండి.

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

మీ రిపోను గ్రీన్ గా ఉంచి, మానవీయ దశలు లేకుండా మీ ఉత్పత్తిని బహుభాషా చేయండి.

[డాక్స్ చదవండి →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

డైనమిక్ కంటెంట్ కోసం తక్షణానువాదం (per-request).

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

చాట్, యూజర్ వ్యాఖ్యలు మరియు ఇతర రియల్-టైమ్ ఫ్లోస్‌ల కోసం ఇది చక్కటి పరిష్కారం.

[డాక్స్ చదవండి →](https://lingo.dev/sdk)

---

## 🤝 కమ్యూనిటీ

మేము కమ్యూనిటీ-డ్రైవన్ మరియు కాంట్రిబ్యూషన్లను చాలా ఆహ్వానిస్తున్నాము!

- మీ వద్ద ఐడియా ఉందా? [ఐష్యూ ఓపెన్ చేయండి](https://github.com/lingodotdev/lingo.dev/issues)
- సరిచేయాలనుకుంటున్నారా? [PR పంపండి](https://github.com/lingodotdev/lingo.dev/pulls)
- సహాయం కావాలా? [మా Discordలో చేరండి](https://lingo.dev/go/discord)

## ⭐ స్టార్ హిస్టరీ

మాకు పని నచ్చితే, మాకు ⭐ ఇవ్వండి మరియు మాకు 4,000 స్టార్‌లు చేరేందుకు సహాయపడండి! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ఇతర భాషల్లో రీడ్‌మీ

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

మీ భాష కనిపించట్లేదా? దయచేసి `i18n.json` లో మీ భాషను జోడించి PR పోస్ట్ చేయండి!

````
