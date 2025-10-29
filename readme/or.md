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
    ⚡ Lingo.dev - ଓପନ-ସୋର୍ସ, AI-ସଂଚାଳିତ i18n ଟୁଲକିଟ୍ LLMs ସହିତ ତତ୍କାଳ ସ୍ଥାନୀୟକରଣ ପାଇଁ।
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev କମ୍ପାଇଲର</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="ରିଲିଜ୍"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="ଲାଇସେନ୍ସ"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="ଶେଷ କମିଟ୍"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="ମାସର #୧ DevTool" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="ସପ୍ତାହର #୧ ଉତ୍ପାଦ" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="ଦିନର #୨ ଉତ୍ପାଦ" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="Github ରେ ଟ୍ରେଣ୍ଡିଂ" />
  </a>
</p>

---

## କମ୍ପାଇଲର ସହ ଭେଟନ୍ତୁ 🆕

**Lingo.dev କମ୍ପାଇଲର** ଏକ ମୁକ୍ତ, ଓପନ-ସୋର୍ସ କମ୍ପାଇଲର ମିଡଲୱେର, ଯାହା ବିଦ୍ୟମାନ React କମ୍ପୋନେଣ୍ଟଗୁଡ଼ିକରେ କୌଣସି ପରିବର୍ତ୍ତନ ଆବଶ୍ୟକ ନକରି ବିଲ୍ଡ ସମୟରେ ଯେକୌଣସି React ଆପ୍‌କୁ ବହୁଭାଷୀ କରିବା ପାଇଁ ଡିଜାଇନ୍ କରାଯାଇଛି।

ଥରେ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ:

```bash
npm install lingo.dev
```

ଆପଣଙ୍କ ବିଲ୍ଡ କନଫିଗ୍‌ରେ ସକ୍ଷମ କରନ୍ତୁ:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ଚଲାନ୍ତୁ ଏବଂ ସ୍ପାନିଶ୍ ଓ ଫ୍ରେଞ୍ଚ ବଣ୍ଡଲଗୁଡ଼ିକ ପପ୍ ଆଉଟ୍ ଦେଖନ୍ତୁ ✨

ସମ୍ପୂର୍ଣ୍ଣ ଗାଇଡ୍ ପାଇଁ [ଡକ୍ୟୁମେଣ୍ଟେସନ୍ ପଢ଼ନ୍ତୁ →](https://lingo.dev/compiler), ଏବଂ ଆପଣଙ୍କ ସେଟଅପ୍‌ରେ ସହାୟତା ପାଇବା ପାଇଁ [ଆମ Discord ରେ ଯୋଗ ଦିଅନ୍ତୁ](https://lingo.dev/go/discord)।

---

### ଏହି ରିପୋରେ କ'ଣ ଅଛି?

| ଟୁଲ୍          | ସଂକ୍ଷିପ୍ତରେ                                                                    | ଡକ୍ୟୁମେଣ୍ଟେସନ୍                              |
| ------------ | ----------------------------------------------------------------------------- | ------------------------------------------ |
| **କମ୍ପାଇଲର** | ବିଲ୍ଡ-ଟାଇମ୍ React ସ୍ଥାନୀୟକରଣ                                                 | [/compiler](https://lingo.dev/compiler)     |
| **CLI**      | ୱେବ୍ ଓ ମୋବାଇଲ୍ ଆପ୍ସ, JSON, YAML, markdown ଏବଂ ଅଧିକ ପାଇଁ ଏକ-କମାଣ୍ଡ ସ୍ଥାନୀୟକରଣ | [/cli](https://lingo.dev/cli)               |
| **CI/CD**    | ପ୍ରତ୍ୟେକ ପୁଶ୍‌ରେ ଅଟୋ-କମିଟ୍ ଅନୁବାଦ + ଆବଶ୍ୟକ ହେଲେ ପୁଲ୍ ରିକ୍ୱେଷ୍ଟ ତିଆରି         | [/ci](https://lingo.dev/ci)                 |
| **SDK**      | ବ୍ୟବହାରକାରୀ-ସୃଷ୍ଟି ସାମଗ୍ରୀ ପାଇଁ ରିୟଲଟାଇମ୍ ଅନୁବାଦ                         | [/sdk](https://lingo.dev/sdk)               |

ତଳେ ପ୍ରତ୍ୟେକ ପାଇଁ ଦ୍ରୁତ ସୂଚନା ଦିଆଯାଇଛି 👇

---

### ⚡️ Lingo.dev CLI

ସିଧାସଳଖ ଆପଣଙ୍କ ଟର୍ମିନାଲରୁ କୋଡ୍ ଓ ବିଷୟବସ୍ତୁ ଅନୁବାଦ କରନ୍ତୁ।

```bash
npx lingo.dev@latest run
```

ଏହା ପ୍ରତ୍ୟେକ ଷ୍ଟ୍ରିଙ୍ଗର ଫିଙ୍ଗରପ୍ରିଣ୍ଟ ତିଆରି କରେ, ଫଳାଫଳଗୁଡ଼ିକୁ କ୍ୟାଶ୍ କରେ, ଏବଂ କେବଳ ପରିବର୍ତ୍ତିତ ଜିନିଷଗୁଡ଼ିକର ପୁନଃ ଅନୁବାଦ କରେ।

ଏହାକୁ କିପରି ସେଟ୍ ଅପ୍ କରିବେ ଜାଣିବା ପାଇଁ [ଡକ୍ୟୁମେଣ୍ଟେସନ୍ ଅନୁସରଣ କରନ୍ତୁ →](https://lingo.dev/cli)।

---]]>