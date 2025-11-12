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
		⚡ Lingo.dev - اوپن سورس i18n ٽول ڪٽ، AI سان هلندڙ، جيڪو LLMs ذريعي فوري لوڪلائيزيشن مهيا ڪري ٿو.
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
			alt="Last commit"
		/>
	</a>
	<a href="https://lingo.dev/en">
		<img
			src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
			alt="Product Hunt"
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

## Compiler سان تعارف 🆕

**Lingo.dev Compiler** هڪ مفت، اوپن سورس compiler-middleware آهي، جيڪو ڪنهن به React ايپ کي build وقت تي گهڻ ٻولين وارو بڻائي ٿو بغير موجوده React جزن (components) ۾ تبديلي آڻڻ جي.

هڪ ڀيرو انسٽال ڪريو:

```bash
npm install lingo.dev
```

پنهنجي build ڪنفيگ ۾ فعال ڪريو:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
	sourceLocale: "en",
	targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` هلائي ڏسو — اسپئنيش ۽ فرينچ bundles پاڻمرادو جنريٽ ٿي ويندا ✨

[مڪمل دستاويز پڙهو →](https://lingo.dev/compiler) ۽ ترتيب بابت مدد لاءِ [اسان جي Discord ۾ شامل ٿيو](https://lingo.dev/go/discord).

---

### هن رپو ۾ ڇا آهي؟

| اوزار       | خلاصو                                                                                         | دستاويز                                |
| ---------- | -------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | build وقت تي React لوڪلائيزيشن                                                              | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | هڪ ڪمانڊ سان ويب ۽ موبائل ايپس، JSON، YAML، markdown ۽ وڌيڪ لاءِ ترجمو                      | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | هر push تي ترجمن کي پاڻمرادو commit ڪريو + گهربل هجي ته pull requests بڻايو                | [/ci](https://lingo.dev/ci)             |
| **SDK**      | يوزر-جنيريٽيڊ مواد لاءِ ريئل ٽائيم ترجمو                                                     | [/sdk](https://lingo.dev/sdk)           |

هيٺ هر ٽول جا مختصر اهم نقطا ڏنل آهن 👇

---

### ⚡️ Lingo.dev CLI

پنھنجي ٽرمينل مان سڌو ڪوڊ ۽ مواد ترجمو ڪريو.

```bash
npx lingo.dev@latest run
```

هي هر اسٽرنگ جو fingerprint ٺاهي ٿو، نتيجا cache ڪري ٿو، ۽ فقط تبديل ٿيل حصن کي ئي ٻيهر ترجمو ڪري ٿو.

[دستاويز ڏسو →](https://lingo.dev/cli) ته سيٽ اپ ڪيئن ڪجي.

---

### 🔄 Lingo.dev CI/CD

ترجمن کي خودڪار طريقي سان شپ ڪريو.

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

توھان جو رپو هميشه جديد ۽ گھڻ ٻولين وارو رهندو بغير دستي مرحلن جي.

[دستاويز پڙهو →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ڊائنامڪ مواد لاءِ في-ريڪويسٽ فوري ترجمو.

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

چيٽ، يوزر ڪمينٽ يا ٻيا ريئل ٽائيم فلو لاءِ بهترين.

[دستاويز پڙهو →](https://lingo.dev/sdk)

---

## 🤝 ڪميونٽي

اسان ڪميونٽي هدايت سان هلون ٿا ۽ تعاون پسند ڪيو وڃي ٿو!

- ڪا خيال؟ [issue کوليو](https://github.com/lingodotdev/lingo.dev/issues)
- ڪا خرابي درست ڪرڻي آهي؟ [PR موڪليو](https://github.com/lingodotdev/lingo.dev/pulls)
- مدد گهرجي؟ [Discord ۾ شامل ٿيو](https://lingo.dev/go/discord)

## ⭐ اسٽار تاريخ

جيڪڏهن توھان کي اسان جو ڪم پسند اچي ٿو ته اسان کي هڪ ⭐ ڏيو ۽ 4,000 اسٽار تائين پهچڻ ۾ مدد ڪريو! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme ٻين ٻولين ۾

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [سنڌي](/readme/sd.md)

نه ٿا ڏسو پنھنجو ٻوليون؟ [`i18n.json`](./i18n.json) ۾ شامل ڪريو ۽ هڪ PR موڪليو!
