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
    ⚡ Lingo.dev - ಓಪನ್-ಸೋರ್ಸ್, AI-ಚಾಲಿತ i18n ಟೂಲ್‌ಕಿಟ್ ಇದು LLM ಗಳನ್ನು ಬಳಸಿಕೊಂಡು
    ತತ್‌ಕ್ಷಣ ಸ್ಥಳೀಕರಣವನ್ನು ಸಾಧ್ಯಗೊಳಿಸುತ್ತದೆ.
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
      alt="ಬಿಡುಗಡೆ"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="ಪರವಾನಗಿ"
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

## ಕಂಪೈಲರ್ ಅನ್ನು ಪರಿಚಯಿಸಿಕೊಳ್ಳಿ 🆕

**Lingo.dev ಕಂಪೈಲರ್** ಒಂದು ಉಚಿತ, ಓಪನ್-ಸೋರ್ಸ್ ಕಂಪೈಲರ್ ಮಿಡಲ್‌ವೇರ್ ಆಗಿದೆ, ಇದು ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ React ಘಟಕಗಳಿಗೆ ಯಾವುದೇ ಬದಲಾವಣೆಗಳ ಅಗತ್ಯವಿಲ್ಲದೆ ಬಿಲ್ಡ್ ಸಮಯದಲ್ಲಿ ಯಾವುದೇ React ಅಪ್ಲಿಕೇಶನ್ ಅನ್ನು ಬಹುಭಾಷಾ ಮಾಡಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.

---CODE-PLACEHOLDER-f159f7253d409892d00e70ee045902a5---

`next build` ಚಲಾಯಿಸಿ ಮತ್ತು ಸ್ಪ್ಯಾನಿಷ್ ಮತ್ತು ಫ್ರೆಂಚ್ ಬಂಡಲ್‌ಗಳು ಹೊರಬರುವುದನ್ನು ನೋಡಿ ✨

ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿಗಾಗಿ [ದಾಖಲೀಕರಣವನ್ನು ಓದಿ →](https://lingo.dev/compiler).

---

### ಈ ರೆಪೊಸಿಟರಿಯಲ್ಲಿ ಏನಿದೆ?

| ಸಾಧನ         | ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ                                                                      | ದಾಖಲೀಕರಣ                               |
| ------------- | ------------------------------------------------------------------------------------ | --------------------------------------- |
| **ಕಂಪೈಲರ್**   | ಬಿಲ್ಡ್-ಟೈಮ್ React ಸ್ಥಳೀಕರಣ                                                        | [/compiler](https://lingo.dev/compiler) |
| **CLI**       | ವೆಬ್ ಮತ್ತು ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳು, JSON, YAML, ಮಾರ್ಕ್‌ಡೌನ್, + ಇನ್ನಷ್ಟುಗಾಗಿ ಒಂದು-ಆಜ್ಞೆ ಸ್ಥಳೀಕರಣ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**     | ಪ್ರತಿ ಪುಶ್‌ನಲ್ಲಿ ಸ್ವಯಂ-ಕಮಿಟ್ ಅನುವಾದಗಳು + ಅಗತ್ಯವಿದ್ದರೆ ಪುಲ್ ರಿಕ್ವೆಸ್ಟ್‌ಗಳನ್ನು ರಚಿಸಿ            | [/ci](https://lingo.dev/ci)             |
| **SDK**       | ಬಳಕೆದಾರ-ರಚಿತ ವಿಷಯಕ್ಕಾಗಿ ನೈಜ ಸಮಯದ ಅನುವಾದ                                          | [/sdk](https://lingo.dev/sdk)           |

ಪ್ರತಿಯೊಂದರ ತ್ವರಿತ ಹಿಟ್‌ಗಳು ಕೆಳಗಿವೆ 👇

---

### ⚡️ Lingo.dev CLI

ನಿಮ್ಮ ಟರ್ಮಿನಲ್‌ನಿಂದ ನೇರವಾಗಿ ಕೋಡ್ ಮತ್ತು ವಿಷಯವನ್ನು ಅನುವಾದಿಸಿ.

---CODE-PLACEHOLDER-a4836309dda7477e1ba399e340828247---

ಇದು ಪ್ರತಿ ಸ್ಟ್ರಿಂಗ್‌ನ ಫಿಂಗರ್‌ಪ್ರಿಂಟ್ ಮಾಡುತ್ತದೆ, ಫಲಿತಾಂಶಗಳನ್ನು ಕ್ಯಾಶ್ ಮಾಡುತ್ತದೆ, ಮತ್ತು ಬದಲಾದ ಭಾಗಗಳನ್ನು ಮಾತ್ರ ಮರು-ಅನುವಾದಿಸುತ್ತದೆ.

[ದಾಖಲೀಕರಣವನ್ನು ಓದಿ →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

ಪರಿಪೂರ್ಣ ಅನುವಾದಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪ್ರಕಟಿಸಿ.

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

ಹಸ್ತಚಾಲಿತ ಹಂತಗಳಿಲ್ಲದೆ ನಿಮ್ಮ ರೆಪೊವನ್ನು ಹಸಿರು ಮತ್ತು ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಬಹುಭಾಷಾ ಇರಿಸುತ್ತದೆ.

[ದಾಖಲೀಕರಣವನ್ನು ಓದಿ →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ಡೈನಾಮಿಕ್ ವಿಷಯಕ್ಕಾಗಿ ತತ್‌ಕ್ಷಣ ಪ್ರತಿ-ವಿನಂತಿ ಅನುವಾದ.

---CODE-PLACEHOLDER-c50e1e589a70e31dd2dde95be8da6ddf---

ಚಾಟ್, ಬಳಕೆದಾರ ಕಾಮೆಂಟ್‌ಗಳು ಮತ್ತು ಇತರ ನೈಜ-ಸಮಯದ ಹರಿವುಗಳಿಗೆ ಪರಿಪೂರ್ಣ.

[ದಾಖಲೀಕರಣವನ್ನು ಓದಿ →](https://lingo.dev/sdk)

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

## 🤝 ಸಮುದಾಯ

ನಾವು ಸಮುದಾಯ-ಚಾಲಿತರು ಮತ್ತು ಕೊಡುಗೆಗಳನ್ನು ಪ್ರೀತಿಸುತ್ತೇವೆ!

- ಒಂದು ಆಲೋಚನೆ ಇದೆಯೇ? [ಒಂದು ಸಮಸ್ಯೆಯನ್ನು ತೆರೆಯಿರಿ](https://github.com/lingodotdev/lingo.dev/issues)
- ಏನನ್ನಾದರೂ ಸರಿಪಡಿಸಲು ಬಯಸುವಿರಾ? [ಒಂದು PR ಕಳುಹಿಸಿ](https://github.com/lingodotdev/lingo.dev/pulls)
- ಸಹಾಯ ಬೇಕೇ? [ನಮ್ಮ Discord ಗೆ ಸೇರಿ](https://lingo.dev/go/discord)

## ⭐ ಸ್ಟಾರ್ ಇತಿಹಾಸ

ನಾವು ಮಾಡುತ್ತಿರುವುದು ನಿಮಗೆ ಇಷ್ಟವಾದರೆ, ನಮಗೆ ಒಂದು ⭐ ನೀಡಿ ಮತ್ತು 4,000 ಸ್ಟಾರ್‌ಗಳನ್ನು ತಲುಪಲು ಸಹಾಯ ಮಾಡಿ! 🌟

[

![ಸ್ಟಾರ್ ಇತಿಹಾಸ ಚಾರ್ಟ್](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ಇತರ ಭಾಷೆಗಳಲ್ಲಿ ರೀಡ್‌ಮಿ

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [ಕನ್ನಡ](/readme/kn.md)

ನಿಮ್ಮ ಭಾಷೆ ಕಾಣುತ್ತಿಲ್ಲವೇ? ಅದನ್ನು [`i18n.json`](./i18n.json) ಗೆ ಸೇರಿಸಿ ಮತ್ತು ಒಂದು PR ತೆರೆಯಿರಿ!