<![CDATA[<p align="center">
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
    ⚡ Lingo.dev - खुला-स्रोत, AI-संचालित i18n टुलकिट LLMs को साथमा तत्काल स्थानीयकरणको लागि।
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev कम्पाइलर</a> •
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
      alt="लाइसेन्स"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="अन्तिम कमिट"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="मासको #१ DevTool" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="हप्ताको #१ उत्पादन" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="दिनको #२ उत्पादन" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="Github मा ट्रेन्डिङ" />
  </a>
</p>

---

## कम्पाइलरसँग भेट्नुहोस् 🆕

**Lingo.dev कम्पाइलर** एक निःशुल्क, खुला-स्रोत कम्पाइलर मिडलवेयर हो, जुन कुनै पनि React एपलाई बिल्ड समयमा बहुभाषी बनाउन डिजाइन गरिएको छ, विद्यमान React कम्पोनेन्टहरूमा कुनै परिवर्तन गर्न आवश्यक छैन।

एक पटक स्थापना गर्नुहोस्:

```bash
npm install lingo.dev
```

तपाईंको बिल्ड कन्फिगमा सक्षम गर्नुहोस्:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चलाउनुहोस् र स्पेनिश र फ्रेन्च बन्डलहरू पप आउट हेर्नुहोस् ✨

पूर्ण गाइडको लागि [डकुमेन्टेसन पढ्नुहोस् →](https://lingo.dev/compiler), र तपाईंको सेटअपमा मद्दत प्राप्त गर्न [हाम्रो Discord मा सामेल हुनुहोस्](https://lingo.dev/go/discord)।

---

### यो रिपोमा के-के छ?

| टुल          | संक्षिप्तमा                                                                  | डकुमेन्टेसन                               |
| ------------ | --------------------------------------------------------------------------- | ----------------------------------------- |
| **कम्पाइलर** | बिल्ड-टाइम React स्थानीयकरण                                                | [/compiler](https://lingo.dev/compiler)    |
| **CLI**      | वेब र मोबाइल एप्स, JSON, YAML, markdown र अन्यको लागि एक-कमान्ड स्थानीयकरण | [/cli](https://lingo.dev/cli)              |
| **CI/CD**    | हरेक पुशमा अटो-कमिट अनुवाद + आवश्यक भएमा पुल रिक्वेस्ट सिर्जना            | [/ci](https://lingo.dev/ci)                |
| **SDK**      | प्रयोगकर्ता-सिर्जित सामग्रीको लागि रियलटाइम अनुवाद                        | [/sdk](https://lingo.dev/sdk)              |

तल प्रत्येकको लागि द्रुत जानकारी छ 👇

---

### ⚡️ Lingo.dev CLI

सिधै तपाईंको टर्मिनलबाट कोड र सामग्री अनुवाद गर्नुहोस्।

```bash
npx lingo.dev@latest run
```

यसले हरेक स्ट्रिङको फिंगरप्रिन्ट बनाउँछ, नतिजाहरू क्यास गर्छ, र केवल परिवर्तन भएका कुराहरूको मात्र पुन: अनुवाद गर्छ।

यसलाई कसरी सेटअप गर्ने भन्ने जान्न [डकुमेन्टेसन पछ्याउनुहोस् →](https://lingo.dev/cli)।

---]]>