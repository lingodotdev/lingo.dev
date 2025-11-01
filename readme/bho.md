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
    ⚡ Lingo.dev - खुला स्रोत, AI से चलित i18n टूलकिट जवन LLMs के साथ तुरन्त स्थानीयकरण खातिर बनावल गइल बा।
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev कंपाइलर</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="रिलीज़"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="लाइसेंस"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="आखिरी कमिट"
    />
  </a>
</p>

---

## कंपाइलर से मिलीं 🆕

**Lingo.dev कंपाइलर** एगो मुफ्त, खुला स्रोत कंपाइलर मिडलवेयर ह, जवन बिना React कंपोनेंट में बदलाव कइले बिल्ड टाइम पर रउआ के React ऐप के बहुभाषी बनावे में मदद करे ला।

इंस्टॉल करीं:

```bash
npm install lingo.dev
आपन बिल्ड कॉन्फिग में सक्षम करीं:

import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);


next build चलाईं आ देखीं कि स्पेनिश आ फ्रेंच बंडल अपने आप बन गइल बा ✨

पूरा दस्तावेज़ पढ़ीं →
 या हमरा Discord में जुड़ जाईं
 मदद खातिर।

एह रेपो में का बा?
टूल	छोट विवरण	दस्तावेज़
कंपाइलर	बिल्ड-टाइम पर React स्थानीयकरण	/compiler

CLI	वेब, मोबाइल ऐप, JSON, YAML, मार्कडाउन, वगैरह खातिर एक-कमांड स्थानीयकरण	/cli

CI/CD	हर पुश पर ट्रांसलेशन ऑटो कमिट करीं आ जरूरत पड़ल त PR बनाईं	/ci

SDK	रीयल-टाइम यूज़र जनरेटेड कंटेंट खातिर तुरन्त अनुवाद	/sdk
⚡️ Lingo.dev CLI

सीधा टर्मिनल से कोड आ कंटेंट के अनुवाद करीं:

npx lingo.dev@latest run


ई हर स्ट्रिंग के फिंगरप्रिंट बना के सिर्फ बदले वाला चीज़न के दुबारा अनुवाद करेला।

दस्तावेज़ देखीं →

🔄 Lingo.dev CI/CD

आपन अनुवाद आपे-आप भेजीं:

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


ई रउआ के रेपो के ताज़ा रखेला आ मैनुअल काम कम करेला।

पूरा गाइड पढ़ीं →

🧩 Lingo.dev SDK

डायनामिक कंटेंट खातिर तुरन्त अनुवाद:

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


चैट, यूज़र कमेंट आ रीयल-टाइम कंटेंट खातिर बढ़िया।

दस्तावेज़ पढ़ीं →

🤝 समुदाय

हम सब समुदाय द्वारा संचालित बानी आ योगदान स्वागत बा!

केहु विचार बा? इश्यू खोलल जाव

सुधार करे चाहत बानी? PR भेजीं

मदद चाहीं? Discord में जुड़ि जाईं

⭐ स्टार इतिहास

अगर रउआ के हमार काम पसंद आई, त एगो ⭐ दीं आ 3,000 स्टार तक पहुँचावे में मदद करीं! 🌟

[](https://www.star-history.com/#lingodotdev/lingo.dev&Date
)

🌐 बाकी भाषन में README

English
 • 中文
 • 日本語
 • 한국어
 • Español
 • Français
 • Русский
 • Українська
 • Deutsch
 • Italiano
 • العربية
 • עברית
 • हिन्दी
 • বাংলা
 • فارسی
 • भोजपुरी


---

You can **copy the above** and paste into your new translation file (e.g., `readme/bho.md`). After that, don’t forget to update the main `README.md` to include the Bhojpuri link:

```markdown
• [भोजपुरी](/readme/bho.md)