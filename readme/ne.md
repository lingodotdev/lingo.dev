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
    ⚡ Lingo.dev — खुला स्रोत, AI-चालित i18n टूलकिट जसले LLM प्रयोग गरेर तुरुन्तै स्थानीयकरण सम्भव बनाउँछ।
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
      alt="रिलिज"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="लाइसन्स"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="पछिल्लो कमिट"
    />
  </a>
</p>

---

## कम्पाइलरलाई चिनौं 🆕

**Lingo.dev Compiler** एक निशुल्क, खुला स्रोत कम्पाइलर मिडलवेयर हो,  
जसले कुनै पनि React कम्पोनेन्टहरू परिवर्तन नगरी बिल्ड समयमा तपाईंको React एपलाई बहुभाषिक बनाउन मद्दत गर्छ।

---

`next build` चलाउनुहोस् र Spanish र French बन्डलहरू हेर्नुहोस् ✨

पूरा गाइडका लागि [डोकुमेन्टेशन पढ्नुहोस् →](https://lingo.dev/compiler)


---

### ⚡️ Lingo.dev CLI

तपाईंको टर्मिनलबाट सिधै कोड र कन्टेन्ट अनुवाद गर्नुहोस्।

---CODE-PLACEHOLDER-a4836309dda7477e1ba399e340828247---

यसले हरेक स्ट्रिङको फिङ्गरप्रिन्ट सिर्जना गर्छ, परिणाम क्यास गर्छ,  
र केवल परिवर्तन भएका अंशहरू पुनः अनुवाद गर्छ।

[डोकुमेन्टेशन पढ्नुहोस् →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

स्वचालित रूपमा उत्कृष्ट अनुवाद प्रकाशित गर्नुहोस्।

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


म्यानुअल चरणहरू बिना नै तपाईंको रेपोजिटरी हरियो राख्छ
र तपाईंको उत्पादन बहुभाषिक बनाइराख्छ।

डोकुमेन्टेशन पढ्नुहोस् →

🧩 Lingo.dev SDK

डाइनामिक कन्टेन्टका लागि तुरुन्तै अनुरोध-प्रति-अनुवाद।

---CODE-PLACEHOLDER-c50e1e589a70e31dd2dde95be8da6ddf---

च्याट, प्रयोगकर्ता टिप्पणीहरू, र अन्य रियल-टाइम फ्लोका लागि उत्कृष्ट।

डोकुमेन्टेशन पढ्नुहोस् →

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
// परिणाम: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }

---

---

### 🌍 समुदाय

हाम्रो साथ सामेल हुनुहोस् — योगदान दिनुहोस्, अनुवाद गर्नुहोस्, वा नयाँ विचारहरू प्रस्ताव गर्नुहोस्!  
**Lingo.dev** लाई अझ राम्रो बनाउन तपाईंको सहभागिता महत्त्वपूर्ण छ 💡

[GitHub Discussions →](https://github.com/lingodotdev/lingo.dev/discussions)  
[Feature अनुरोध पठाउनुहोस् →](https://github.com/lingodotdev/lingo.dev/issues)

---

### ⭐ स्टार इतिहास

Lingo.dev कसरी बढ्दै गएको छ भनेर हेर्नुहोस्:

[![स्टार इतिहास चार्ट](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Timeline)](https://star-history.com/#lingodotdev/lingo.dev&Timeline)

---

### 🗣️ अन्य भाषाहरू

- 🇺🇸 [English](README.md)
- 🇮🇳 [Hindi](README.hi.md)
- 🇫🇷 [French](README.fr.md)
- 🇳🇵 **Nepali** ← तपाईं अहिले यहाँ हुनुहुन्छ 🎉

---

<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>
