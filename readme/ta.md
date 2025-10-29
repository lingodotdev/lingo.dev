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
    ⚡ Lingo.dev - திறந்த மூல, AI-இயங்கும் i18n கருவித்தொகுப்பு, LLM-களுடன் உடனடி உள்ளூர்மயமாக்கலுக்காக.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev கம்பைலர்</a> •
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
      alt="கடைசி கமிட்"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 மாத டெவ்டூல்"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 வார தயாரிப்பு"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 நாள் தயாரிப்பு"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github டிரெண்டிங்"
    />
  </a>
</p>

---

## கம்பைலரை சந்திக்கவும் 🆕

**Lingo.dev கம்பைலர்** ஒரு இலவச, திறந்த மூல கம்பைலர் மிடில்வேர் ஆகும், இது ஏற்கனவே உள்ள React கூறுகளில் எந்த மாற்றமும் தேவையில்லாமல் எந்த React பயன்பாட்டையும் பில்ட் நேரத்தில் பல மொழி பயன்பாடாக மாற்ற வடிவமைக்கப்பட்டுள்ளது.

ஒருமுறை நிறுவுங்கள்:

```bash
npm install lingo.dev
```

உங்கள் பில்ட் கான்ஃபிகில் இயக்கவும்:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ஐ இயக்குங்கள் மற்றும் ஸ்பானிஷ் மற்றும் பிரெஞ்சு பண்டில்கள் வெளிவருவதைப் பாருங்கள் ✨

முழு வழிகாட்டிக்காக [ஆவணங்களைப் படியுங்கள் →](https://lingo.dev/compiler), மற்றும் உங்கள் அமைவில் உதவி பெற [எங்கள் Discord-இல் சேரவும்](https://lingo.dev/go/discord).

---

### இந்த repo-வில் என்ன இருக்கிறது?

| கருவி        | TL;DR                                                                          | ஆவணங்கள                                |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **கம்பைலர்**  | பில்ட்-நேர React உள்ளூர்மயமாக்கல்                                            | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | வெப் மற்றும் மொபைல் பயன்பாடுகள், JSON, YAML, markdown மற்றும் பலவற்றிற்கான ஒரு-கட்டளை உள்ளூர்மயமாக்கல் | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ஒவ்வொரு push-இலும் தானியங்கி-கமிட் மொழிபெயர்ப்புகள் + தேவைப்பட்டால் pull request-களை உருவாக்கவும் | [/ci](https://lingo.dev/ci)             |
| **SDK**      | பயனர்-உருவாக்கிய உள்ளடக்கத்திற்கான நேரடி மொழிபெயர்ப்பு                      | [/sdk](https://lingo.dev/sdk)           |

ஒவ்வொன்றிற்கும் விரைவான முன்னோட்டங்கள் கீழே உள்ளன 👇

---

### ⚡️ Lingo.dev CLI

உங்கள் டெர்மினலிலிருந்து நேரடியாக குறியீடு மற்றும் உள்ளடக்கத்தை மொழிபெயர்க்கவும்.

```bash
npx lingo.dev@latest run
```

இது ஒவ்வொரு சரத்தையும் ஃபிங்கர்பிரிண்ட் செய்கிறது, முடிவுகளைத் தேக்கி வைக்கிறது, மற்றும் மாறியதை மட்டுமே மீண்டும் மொழிபெயர்க்கிறது.

அதை எவ்வாறு அமைப்பது என்பதை அறிய [ஆவணங்களைப் பின்பற்றவும் →](https://lingo.dev/cli).

---

### 🔄 Lingo.dev CI/CD

சரியான மொழிபெயர்ப்புகளை தானாகவே அனுப்பவும்.

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

கையேடு படிகளின்றி உங்கள் repo-ஐ பசுமையாகவும் உங்கள் தயாரிப்பை பல மொழியாகவும் வைத்திருக்கிறது.

[ஆவணங்களைப் படியுங்கள் →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

டைனமிக் உள்ளடக்கத்திற்கான உடனடி ஒன்று-request மொழிபெயர்ப்பு.

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
// திரும்பப் பெறுகிறது: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

சாட், பயனர் கருத்துகள் மற்றும் பிற நிகழ்நேர ப்ளோக்களுக்கு சரியானது.

[ஆவணங்களைப் படியுங்கள் →](https://lingo.dev/sdk)

---

## 🤝 சமூகம்

நாங்கள் சமூக-உந்துதல் பெற்றவர்கள் மற்றும் பங்களிப்புகளை விரும்புகிறோம்!

- ஒரு யோசனை உள்ளதா? [ஒரு issue-ஐ திறக்கவும்](https://github.com/lingodotdev/lingo.dev/issues)
- ஏதாவது சரிசெய்ய விரும்புகிறீர்களா? [PR அனுப்பவும்](https://github.com/lingodotdev/lingo.dev/pulls)
- உதவி தேவையா? [எங்கள் Discord-இல் சேரவும்](https://lingo.dev/go/discord)

## ⭐ நட்சத்திர வரலாறு

நாங்கள் செய்வது உங்களுக்குப் பிடித்திருந்தால், எங்களுக்கு ⭐ கொடுத்து 4,000 நட்சத்திரங்களை அடைய எங்களுக்கு உதவுங்கள்! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 மற்ற மொழிகளில் Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [தமிழ்](/readme/ta.md)

உங்கள் மொழி தெரியவில்லையா? அதை [`i18n.json`](./i18n.json)-இல் சேர்த்து PR திறக்கவும்!
