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
    ⚡ Lingo.dev - ಓಪನ್-ಸೋರ್ಸ್, AI-ಸಕ್ರಿಯ i18n ಟೂಲ್‌ಕಿಟ್ LLMs ಬಳಸಿ ತ್ವರಿತ ಸ್ಥಳೀಯೀಕರಣಕ್ಕಾಗಿ.
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
      alt="ಕೊನೆಯ ಕಾಮಿಟ್"
    />
  </a>
</p>

---

## ಕಂಪೈಲರ್ ಅನ್ನು ಪರಿಚಯಿಸಿ 🆕

**Lingo.dev ಕಂಪೈಲರ್** ಉಚಿತ, ಓಪನ್-ಸೋರ್ಸ್ ಕಂಪೈಲರ್ ಮಿಡ್ಲ್‌ವೇರ್ ಆಗಿದ್ದು, ಯಾವುದೇ React ಕಾಂಪೊನೆಂಟ್‌ಗಳಲ್ಲಿ ಬದಲಾವಣೆಗಳನ್ನು ಮಾಡದೇ, ಬಿಲ್ಡ್ ಟೈಮ್‌ನಲ್ಲಿ ಯಾವುದೇ React ಅಪ್ಲಿಕೇಶನ್ ಅನ್ನು ಬಹುಭಾಷೆಗೊಳಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.

ಒಮ್ಮೆ ಸ್ಥಾಪಿಸಿ:

```bash
npm install lingo.dev

ನಿಮ್ಮ ಬಿಲ್ಡ್ ಕಾನ್ಫಿಗ್‌ನಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಿ:

 import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);


    'next build' ಅನ್ನು ಚಲಾಯಿಸಿ ಮತ್ತು ಸ್ಪ್ಯಾನಿಷ್ ಮತ್ತು ಫ್ರೆಂಚ್ ಬಂಡಲ್‌ಗಳು ಪ್ರकटವಾಗುವಂತೆ ನೋಡಿ ✨

ದಸ್ತಾವೇಜು ಓದಿ →(https://lingo.dev/compiler) ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿಗಾಗಿ, ಮತ್ತು ನಮ್ಮ Discord ಸೇರಿ ನಿಮ್ಮ ಸೆಟಪ್‌ನಲ್ಲಿ ಸಹಾಯ ಪಡೆಯಲು.

###ಈ ರೆಪೋದಲ್ಲಿ ಏನು ಇದೆ?

| ಟೂಲ್         | ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ                                                                                     | ದಸ್ತಾವೇಜು                               |
| ------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **ಕಂಪೈಲರ್**  | ಬಿಲ್ಡ್-ಟೈಮ್ React ಸ್ಥಳೀಯೀಕರಣ                                                                         | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ವೆಬ್ ಮತ್ತು ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳು, JSON, YAML, ಮಾರ್ಕ್‌ಡೌನ್ + ಮತ್ತಷ್ಟುಗಳಿಗೆ ಒಬ್ಬ ಕಮಾಂಡ್ ಸ್ಥಳೀಯೀಕರಣ     | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ಪ್ರತಿಯೊಂದು ಪುಶ್‌ನಲ್ಲಿ ಅನುವಾದಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕಾಮಿಟ್ ಮಾಡಿ + ಅಗತ್ಯವಿದ್ದರೆ ಪುಲ್ ರಿಕ್ವೆಸ್ಟ್ ರಚಿಸಿ   | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ಬಳಕೆದಾರರ ಸೃಷ್ಟಿಸಲಾದ ವಿಷಯಗಳಿಗೆ ರಿಯಲ್‌ಟೈಮ್ ಅನುವಾದ                                                      | [/sdk](https://lingo.dev/sdk)           |

ಪ್ರತಿಯೊಂದರ ತ್ವರಿತ ಪರಿಚಯ ಕೆಳಗಿನಂತೆ 👇

### ⚡️ Lingo.dev CLI

ನಿಮ್ಮ ಟರ್ಮಿನಲ್‌ನಿಂದ ನೇರವಾಗಿ ಕೋಡ್ ಮತ್ತು ವಿಷಯವನ್ನು ಅನುವಾದಿಸಿ.

bash
Copy code
npx lingo.dev@latest run
ಇದು ಪ್ರತಿಯೊಂದು ಸ್ಟ್ರಿಂಗ್ ಅನ್ನು ಫಿಂಗರ್‌ಪ್ರಿಂಟ್ ಮಾಡುತ್ತದೆ, ಫಲಿತಾಂಶಗಳನ್ನು ಕ್ಯಾಶ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ಬದಲಾಯಿಸಲಾದವು ಮಾತ್ರ ಪುನಃ ಅನುವಾದಿಸುತ್ತದೆ.

ದಸ್ತಾವೇಜು ಅನುಸರಿಸಿ →(https://lingo.dev/cli) to learn how to set it up. ಇದನ್ನು ಸೆಟಪ್ ಮಾಡುವ ವಿಧಾನವನ್ನು ತಿಳಿಯಲು

###🔄 Lingo.dev CI/CD
ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಂಪೂರ್ಣ ಅನುವಾದಗಳನ್ನು ಸಾಗಿಸಿ.

yaml
Copy code
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
ನಿಮ್ಮ ರೆಪೋ ಹಸಿರು ಇರುತ್ತದೆ ಮತ್ತು ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಕೈಯಿಂದ ಹಂತಗಳಿಲ್ಲದೆ ಬಹುಭಾಷೆಗೊಳಿಸುತ್ತದೆ.

[ದಸ್ತಾವೇಜು ಓದಿ] →(https://lingo.dev/ci)


###🧩 Lingo.dev SDK
ಡೈನಾಮಿಕ್ ವಿಷಯಗಳಿಗೆ ತಕ್ಷಣ ಪ್ರತಿಯೊಂದು ವಿನಂತಿಗೆ ಅನುವಾದ.

ts
Copy code
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
ಚಾಟ್, ಬಳಕೆದಾರರ ಕಾಮೆಂಟ್ಸ್ ಮತ್ತು ಇತರ ರಿಯಲ್-ಟೈಮ್ ಫ್ಲೋಗಳಿಗೆ ಅತ್ಯುತ್ತಮ.

[ದಸ್ತಾವೇಜು ಓದಿ →](https://lingo.dev/sdk)

## 🤝 ಸಮುದಾಯ
ನಾವು ಸಮುದಾಯ-ಚಾಲಿತ ಮತ್ತು ಕೊಡುಗೆಗಳನ್ನು ಮೆಚ್ಚುತ್ತೇವೆ!

ಒಂದು ಐಡಿಯಾ ಇದೆಯೆ? ಇಶ್ಯೂ ತೆರೆಯಿರಿ(https://github.com/lingodotdev/lingo.dev/issues)

ಏನಾದರೂ ಸರಿಪಡಿಸಲು ಬಯಸುತ್ತೀರಾ? PR ಕಳುಹಿಸಿ(https://github.com/lingodotdev/lingo.dev/pulls)

ಸಹಾಯ ಬೇಕೆ? ನಮ್ಮ Discord ಸೇರಿ(https://lingo.dev/go/discord)

## ⭐ ಸ್ಟಾರ್ ಇತಿಹಾಸ
ನೀವು ನಮ್ಮ ಕೆಲಸವನ್ನು ಇಷ್ಟಪಟ್ಟರೆ, ನಮಗೆ ಒಂದು ⭐ ನೀಡಿ ಮತ್ತು 4,000 ಸ್ಟಾರ್‌ಗೆ ತಲುಪಲು ಸಹಾಯಮಾಡಿ! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ಇತರ ಭಾಷೆಗಳ README
[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಕಾಣುತ್ತಿಲ್ಲವೆ? ಅದನ್ನು i18n.json ಗೆ ಸೇರಿಸಿ ಮತ್ತು PR ತೆರೆಯಿರಿ!

yaml

