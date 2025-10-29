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
    ⚡ Lingo.dev - ಓಪನ್-ಸೋರ್ಸ್, LLM ಗಳೊಂದಿಗೆ ತ್ವರಿತ ಸ್ಥಳೀಕರಣಕ್ಕಾಗಿ AI-ಚಾಲಿತ i18n ಟೂಲ್‌ಕಿಟ್.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev ಕಂಪೈಲರ್</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="ರಿಲೀಸ್"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="ಲೈಸೆನ್ಸ್"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="ಕೊನೆಯ ಕಮಿಟ್"
    />
  </a>
</p>

---

## ಕಂಪೈಲರ್ ಅನ್ನು ಭೇಟಿ ಮಾಡಿ 🆕

**Lingo.dev ಕಂಪೈಲರ್** ಒಂದು ಉಚಿತ, ಓಪನ್-ಸೋರ್ಸ್ ಕಂಪೈಲರ್ ಮಿಡಲ್‌ವೇರ್ ಆಗಿದ್ದು, ಈಗಿರುವ React ಕಾಂಪೊನೆಂಟ್‌ಗಳಲ್ಲಿ ಯಾವುದೇ ಬದಲಾವಣೆ ಮಾಡಬೇಕಾಗದೆ, build ಸಮಯದಲ್ಲೇ ಯಾವುದೇ React ಅಪ್ಲಿಕೇಶನ್ ಅನ್ನು ಬಹುಭಾಷೀಯವಾಗಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.

ಒಮ್ಮೆ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ:   

```bash
npm install lingo.dev
```

ನಿಮ್ಮ ಬಿಲ್ಡ್ ಕಾನ್ಫಿಗ್‌ನಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಿ:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ಅನ್ನು ರನ್ ಮಾಡಿ ಮತ್ತು ಸ್ಪ್ಯಾನಿಷ್ ಮತ್ತು ಫ್ರೆಂಚ್ ಬಂಡಲ್‌ಗಳು ಕಾಣಿಸಿಕೊಳ್ಳುವುದನ್ನು ನೋಡಿ ✨

[ಡಾಕ್ಯುಮೆಂಟ್ ಓದಿ →](https://lingo.dev/compiler) ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ, ಮತ್ತು [ನಮ್ಮ Discord‌ ಗೆ ಸೇರಿ](https://lingo.dev/go/discord) ನಿಮ್ಮ ಸೆಟಪ್‌ಗೆ ಸಹಾಯ ಪಡೆಯಲು.

---

### ಈ ರೆಪೊಸಿಟರಿಯಲ್ಲಿ ಏನಿದೆ?

| ಉಪಕರಣಗಳು         | ಸಂಕ್ಷಿಪ್ತ ಸಾರಾಂಶ                                                             | ಡಾಕ್ಯುಮೆಂಟ್ಗಳು                               |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| **ಕಂಪೈಲರ್** | build-ಟೈಮ್ React ಸ್ಥಳೀಕರಣ                                                  | [/ಕಂಪೈಲರ್](https://lingo.dev/compiler) |
| **CLI**     | ವೆಬ್ ಮತ್ತು ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳು, JSON, YAML, Markdown ಹಾಗೂ ಇನ್ನಿತರಗಳಿಗಾಗಿ ಒಂದು ಕಮಾಂಡ್‌ನಲ್ಲಿ ಸ್ಥಳೀಕರಣ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | ಪ್ರತಿ ಪುಷ್‌ನಲ್ಲಿಯೂ ಅನುವಾದಗಳನ್ನು ಆಟೋ-ಕಮಿಟ್   ಮಾಡಿ + ಅಗತ್ಯವಿದ್ದರೆ ಪುಲ್ ರಿಕ್ವೆಸ್ಟ್ ರಚಿಸಿ     | [/ci](https://lingo.dev/ci)             |
| **SDK**     | ಬಳಕೆದಾರರ ರಚಿಸಿದ ವಿಷಯದ ರಿಯಲ್‌ಟೈಮ್ ಅನುವಾದ                               | [/sdk](https://lingo.dev/sdk)           |

ಕೆಳಗಿನವು ಪ್ರತಿ ಒಂದರ ತ್ವರಿತ ಅವಲೋಕನವಾಗಿದೆ 👇
  
---

### ⚡️ Lingo.dev CLI

ನಿಮ್ಮ ಟರ್ಮಿನಲ್‌ನಿಂದಲೇ ಕೋಡ್ ಮತ್ತು ವಿಷಯವನ್ನು ನೇರವಾಗಿ ಅನುವಾದಿಸಿ.

```bash
npx lingo.dev@latest run
```

ಇದು ಪ್ರತಿಯೊಂದು ಸ್ಟ್ರಿಂಗ್‌ಗೆ ಫಿಂಗರ್‌ಪ್ರಿಂಟ್ ಸೃಷ್ಟಿಸುತ್ತದೆ, ಫಲಿತಾಂಶಗಳನ್ನು ಕ್ಯಾಶ್ ಮಾಡುತ್ತದೆ, ಮತ್ತು ಬದಲಾದ ಭಾಗಗಳನ್ನು ಮಾತ್ರ ಮರು ಅನುವಾದಿಸುತ್ತದೆ.

[ಡಾಕ್ಯುಮೆಂಟ್ ಅನ್ನು ಅನುಸರಿಸಿ →](https://lingo.dev/cli) ಹೊಂದಿಸುವುದು ಹೇಗೆ ಎಂದು ತಿಳಿಯಲು.

---

### 🔄 Lingo.dev CI/CD

ಪರಿಪೂರ್ಣ ಅನುವಾದಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ರವಾನಿಸಿ.

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

ನಿಮ್ಮ ರೆಪೊವನ್ನು ಹಸಿರಾಗಿರಿಸುತ್ತದೆ ಮತ್ತು ಕೈಯಾರೆ ಮಾಡುವ ಹಂತಗಳಿಲ್ಲದೆ ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಬಹುಭಾಷೀಯವಾಗಿರಿಸುತ್ತದೆ.

[ಡಾಕ್ಯುಮೆಂಟ್ ಓದಿ →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ಡೈನಾಮಿಕ್ ವಿಷಯಕ್ಕಾಗಿ ತಕ್ಷಣದ ಪ್ರತಿ-ವಿನಂತಿ ಅನುವಾದ.

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

ಚಾಟ್, ಬಳಕೆದಾರರ ಕಾಮೆಂಟ್‌ಗಳು ಮತ್ತು ಇತರ ರಿಯಲ್‌ಟೈಮ್ ಪ್ರಕ್ರಿಯೆಗಳಿಗಾಗಿ ಪರಿಪೂರ್ಣವಾಗಿದೆ.

[ಡಾಕ್ಯುಮೆಂಟ್ ಓದಿ →](https://lingo.dev/sdk)

---

## 🤝 ಸಮುದಾಯ

ನಾವು ಸಮುದಾಯದ ಮೂಲಕ ಚಲಿಸಲ್ಪಡುವ ಪ್ರಾಜೆಕ್ಟ್ ಆಗಿದ್ದು, ಕೊಡುಗೆಗಳನ್ನು ಹೃತ್ಪೂರ್ವಕವಾಗಿ ಸ್ವಾಗತಿಸುತ್ತೇವೆ!

- ಏನಾದರೂ ಆಲೋಚನೆ ಇದೆಯೆ? [ಒಂದು ಇಶ್ಯೂ ತೆರೆಯಿರಿ](https://github.com/lingodotdev/lingo.dev/issues)
- ಏನಾದರೂ ಸರಿಪಡಿಸಲು ಬಯಸುವಿರಾ? [ಒಂದು PR ಕಳುಹಿಸಿ](https://github.com/lingodotdev/lingo.dev/pulls)
- ಸಹಾಯ ಬೇಕೇ? [ನಮ್ಮ Discord‌ ಗೆ ಸೇರಿ](https://lingo.dev/go/discord)

## ⭐ ಸ್ಟಾರ್ ಇತಿಹಾಸ

ನಾವು ಮಾಡುತ್ತಿರುವ ಕೆಲಸ ನಿಮಗೆ ಇಷ್ಟವಾದರೆ, ನಮಗೆ ಒಂದು ⭐ ನೀಡಿ ಮತ್ತು 4,000 ನಕ್ಷತ್ರಗಳನ್ನು ತಲುಪಲು ಸಹಕರಿಸಿ! 🌟

[

![ಸ್ಟಾರ್ ಇತಿಹಾಸದ ಚಾರ್ಟ್](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ಇತರೆ ಭಾಷೆಗಳಲ್ಲಿನ README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [ಕನ್ನಡ](/readme/kn.md)

ನಿಮ್ಮ ಭಾಷೆ ಕಾಣಿಸುತ್ತಿಲ್ಲವೇ? ಅದನ್ನು [`i18n.json`](./i18n.json) ಫೈಲ್‌ಗೆ ಸೇರಿಸಿ ಮತ್ತು ಒಂದು PR ತೆರೆಯಿರಿ!