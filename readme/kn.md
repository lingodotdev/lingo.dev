<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ಮುಕ್ತ-ಆದಾರ (open-source), AI ಶಕ್ತಿಯ i18n ಉಪಕರಣಸಂಚಯ (toolkit) — LLMಗಳ ಮೂಲಕ ತಕ್ಷಣದ ಸ್ಥಳೀಯೀಕರಣಕ್ಕಾಗಿ.</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

---

## Compiler ಪರಿಚಯ 🆕

**Lingo.dev Compiler** ಒಂದು ಉಚಿತ, ಮುಕ್ತ-ಆದಾರ (open-source) ಕಂಪೈಲರ್ ಮಿಡ್‌ಲ್‌ವೇರ್ ಆಗಿದ್ದು, React ಆಪ್‌ಗಳನ್ನು ನಿರ್ಮಾಣ ಸಮಯದಲ್ಲೇ ಬಹುಭಾಷಾವಂತರಾಗಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ — ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ React ಘಟಕಗಳಲ್ಲಿ ಯಾವುದೇ ಬದಲಾವಣೆಗಳ ಅಗತ್ಯವಿಲ್ಲ.

ಒಮ್ಮೆ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ:

```bash
npm install lingo.dev

ನಿಮ್ಮ build ಸಂರಚನೆಯಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಿ:

import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);

next build ನಡಿಸಿ ಮತ್ತು ಸ್ಪ್ಯಾನಿಷ್ ಮತ್ತು ಫ್ರೆಂಚ್ ಬಂಡಲ್‌ಗಳು ಹೇಗೆ ಸಿದ್ಧವಾಗುತ್ತವೆ ನೋಡಿ ✨

ಪೂರ್ಣ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ದಾಖಲೆಗಳನ್ನು ಓದಿ →
 ಮತ್ತು ಸಹಾಯ ಬೇಕಾದರೆ ನಮ್ಮ Discord ಸೇರಿ

 ಈ ರೆಪೊದಲ್ಲಿ ಏನಿದೆ?

 | ಉಪಕರಣ        | ಸಾರಾಂಶ                                                                                                   | ದಾಖಲೆಗಳು                                |
| ------------ | -------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | React ನಿರ್ಮಾಣ ಸಮಯದ ಸ್ಥಳೀಯೀಕರಣ                                                                            | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ವೆಬ್ ಮತ್ತು ಮೊಬೈಲ್ ಆಪ್‌ಗಳು, JSON, YAML, markdown ಮುಂತಾದವುಗಳ ಒಮ್ಮೆ ಕ್ಲಿಕ್ ಸ್ಥಳೀಯೀಕರಣ                       | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ಪ್ರತಿಯೊಂದು push ನಲ್ಲೂ ಅನುವಾದಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ commit ಮಾಡುತ್ತದೆ, ಅಗತ್ಯವಿದ್ದರೆ pull request ರಚಿಸುತ್ತದೆ | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ಬಳಕೆದಾರರ ಸೃಷ್ಟಿಸಿದ ವಿಷಯದ ನೇರ (real-time) ಅನುವಾದ                                                          | [/sdk](https://lingo.dev/sdk)           |

⚡️ Lingo.dev CLI

ನೇರವಾಗಿ ನಿಮ್ಮ ಟರ್ಮಿನಲ್‌ನಿಂದ ಕೋಡ್ ಮತ್ತು ವಿಷಯವನ್ನು ಅನುವಾದಿಸಿ:
npx lingo.dev@latest run

ಇದು ಪ್ರತಿಯೊಂದು ಸ್ಟ್ರಿಂಗ್‌ಗೆ ಗುರುತು (fingerprint) ನೀಡುತ್ತದೆ, ಫಲಿತಾಂಶಗಳನ್ನು cache ಮಾಡುತ್ತದೆ ಮತ್ತು ಬದಲಾಗಿದ ಭಾಗಗಳನ್ನು ಮಾತ್ರ ಪುನಃ ಅನುವಾದಿಸುತ್ತದೆ.

ದಾಖಲೆಗಳನ್ನು ಅನುಸರಿಸಿ →

🔄 Lingo.dev CI/CD

ಪರಿಪೂರ್ಣ ಅನುವಾದಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಶಿಪ್ ಮಾಡಿ.
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

ಹಸ್ತಚಾಲಿತ ಹೆಜ್ಜೆಗಳಿಲ್ಲದೆ ನಿಮ್ಮ ರೆಪೊವನ್ನು ಹಸಿರಾಗಿರಿಸಿ ಮತ್ತು ಉತ್ಪನ್ನವನ್ನು ಬಹುಭಾಷಾವಂತಗೊಳಿಸಿ.

ದಾಖಲೆಗಳನ್ನು ಓದಿ →

🧩 Lingo.dev SDK

ಚುರುಕಾದ ವಿಷಯದ ತಕ್ಷಣದ (per-request) ಅನುವಾದ.

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

ಚಾಟ್, ಬಳಕೆದಾರ ಕಾಮೆಂಟ್‌ಗಳು ಮತ್ತು ಇತರ ನೇರ ಸಂವಹನಗಳಿಗಾಗಿ ಪರಿಪೂರ್ಣ.

ದಾಖಲೆಗಳನ್ನು ಓದಿ →

🤝 ಸಮುದಾಯ

ನಾವು ಸಮುದಾಯ ಆಧಾರಿತವಾಗಿದ್ದು ಕೊಡುಗೆಗಳನ್ನು ಸ್ವಾಗತಿಸುತ್ತೇವೆ!

ಹೊಸ ಕಲ್ಪನೆ ಇದೆಯೇ? Issue ತೆರೆಯಿರಿ

ಏನನ್ನಾದರೂ ಸರಿಪಡಿಸಬೇಕೇ? PR ಕಳುಹಿಸಿ

ಸಹಾಯ ಬೇಕೇ? ನಮ್ಮ Discord ಸೇರಿ

[![ನಕ್ಷತ್ರ ಇತಿಹಾಸ ಚಾರ್ಟ್](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ಬೇರೆ ಭಾಷೆಗಳಲ್ಲಿ README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

ನಿಮ್ಮ ಭಾಷೆ ಕಾಣಿಸುತ್ತಿಲ್ಲವೇ? ಅದನ್ನು [`i18n.json`](./i18n.json) ಗೆ ಸೇರಿಸಿ ಮತ್ತು ಒಂದು PR ತೆರೆಯಿರಿ!

