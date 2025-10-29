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
    ⚡ Lingo.dev - திறந்த மூல, AI இயக்கப்படும் i18n கருவி தொகுப்பு, LLMs மூலம் விரைவான உள்ளூர் மொழிபெயர்ப்பிற்காக.
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
      alt="வெளியீடு"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="உரிமம்"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="கடைசி Commit"
    />
  </a>
</p>

---

## கம்பைலரை சந்திக்கவும்🆕

**Lingo.dev Compiler** என்பது ஒரு இலவச, திறந்த மூல மிடில்வேர் ஆகும், இது React கூறுகளில் எந்த மாற்றமும் செய்யாமல், எந்த React பயன்பாட்டையும் கட்டுமான நேரத்தில் பன்மொழியாக்குவதற்காக வடிவமைக்கப்பட்டுள்ளது.

ஒருமுறை நிறுவவும்:

```bash
npm install lingo.dev
```

உங்கள் build config-இல் இயக்கவும்:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);

```

`next build` ஐ இயக்கி, ஸ்பானிஷ் மற்றும் பிரெஞ்ச் பண்டில்களை தோன்றும் போது காணுங்கள் ✨

[முழு வழிகாட்டிக்காக ஆவணத்தைப் படிக்கவும் →](https://lingo.dev/compiler)
, [மற்றும் எங்கள் Discord-இல் சேரவும்](https://lingo.dev/go/discord) 
 உங்கள் அமைப்பிற்கு உதவி பெற.

---

### இந்த Repositoryயில் என்ன உள்ளது?

| கருவி | சுருக்கமான விளக்கம் | ஆவணம் |
| ------ | ------------------- | ------- |
| **Compiler** | Build-time React பன்மொழியாக்கம் | [/compiler](https://lingo.dev/compiler) |
| **CLI** | Web மற்றும் Mobile Apps, JSON, YAML, Markdown, + பலவற்றிற்கு ஒரே கட்டளையில் மொழிபெயர்ப்பு | [/cli](https://lingo.dev/cli) |
| **CI/CD** | ஒவ்வொரு push-இலும் மொழிபெயர்ப்புகளை auto-commit செய்யவும் + தேவையெனில் Pull Request உருவாக்கவும் | [/ci](https://lingo.dev/ci) |
| **SDK** | பயனர் உருவாக்கிய உள்ளடக்கத்திற்கு நேரடி நேரத்தில் மொழிபெயர்ப்பு | [/sdk](https://lingo.dev/sdk) |

ஒவ்வொன்றிற்குமான விரைவான பார்வை கீழே 👇

---

### ⚡️ Lingo.dev CLI

உங்கள் Terminal-இல் நேரடியாக குறியீடுகள் மற்றும் உள்ளடக்கங்களை மொழிபெயர்க்கவும்.

```bash
npx lingo.dev@latest run
```

இது ஒவ்வொரு string-க்கும் ஒரு fingerprint உருவாக்கி, முடிவுகளை cache செய்கிறது மற்றும் மாற்றப்பட்டவற்றை மட்டுமே மறுபெயர்க்கிறது.

அதை அமைப்பது எப்படி என்பதை அறிய [ஆவணத்தைப் பின்பற்றவும் →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

தானியங்கி முறையில் சிறந்த மொழிபெயர்ப்புகளை வெளியிடவும்.

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
இது உங்கள் Repositoryயை பசுமையாகவும், உங்கள் தயாரிப்பை கையேடு படிகளில்லாமல் பன்மொழியாகவும் வைத்திருக்கிறது.

[ஆவணத்தைப் படிக்கவும் →](https://lingo.dev/en/ci)

---

### 🧩 Lingo.dev SDK

மாறும் உள்ளடக்கத்திற்கான உடனடி கோரிக்கை அடிப்படையிலான மொழிபெயர்ப்பு.

```js
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
அரட்டைகள், பயனர் கருத்துகள் மற்றும் பிற நேரடி ஒளி ஓட்டங்களுக்கான சிறந்த தேர்வு.

[ஆவணத்தைப் படிக்கவும் →](https://lingo.dev/sdk)

### 🤝 சமூகத்தைப் பற்றி

நாம் சமூக வழிநடத்தலில் இயங்குகிறோம் மற்றும் பங்களிப்புகளை விரும்புகிறோம்!

யோசனை இருக்கிறதா? [ஒரு Issue திறக்கவும்](https://github.com/lingodotdev/lingo.dev/issues)

ஏதேனும் சரி செய்ய விரும்புகிறீர்களா? [ஒரு PR அனுப்பவும்](https://github.com/lingodotdev/lingo.dev/pulls)

உதவி தேவைப்படுகிறதா? [எங்கள் Discord-இல் சேரவும்](https://lingo.dev/go/discord)

### ⭐ நட்சத்திர வரலாறு

எங்கள் பணியை நீங்கள் விரும்பினால், எங்களுக்கு ஒரு ⭐ கொடுத்து 3,000 நட்சத்திரங்களை அடைய உதவுங்கள்! 🌟


![நட்சத்திர வரலாறு வரைபடம்](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

(https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 பிற மொழிகளில் README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)• [தமிழ்](/readme/ta.md) 

உங்கள் மொழி காணவில்லையா? அதை [`i18n.json`](./i18n.json) இல் சேர்த்து ஒரு PR திறக்கவும்!
