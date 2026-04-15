<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – स्थानीयकरण इंजीनियरिंग प्लेटफ़ॉर्म"
    />
  </a>
</p>

<p align="center">
  <strong>
    ओपन-सोर्स स्थानीयकरण इंजीनियरिंग टूल्स। सुसंगत, गुणवत्तापूर्ण अनुवादों के
    लिए Lingo.dev स्थानीयकरण इंजीनियरिंग प्लेटफ़ॉर्म से कनेक्ट करें।
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">React के लिए Lingo Compiler (प्रारंभिक अल्फा)</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="Release"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="License"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Last Commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Month"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Week"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Product of the Day"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github trending"
    />
  </a>
</p>

---

## त्वरित शुरुआत

| टूल                                                | यह क्या करता है                                     | त्वरित कमांड                       |
| -------------------------------------------------- | --------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React ऐप्स के लिए AI-सहायता प्राप्त i18n सेटअप      | प्रॉम्प्ट: `Set up i18n`           |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO फ़ाइलों का स्थानीयकरण | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions में निरंतर स्थानीयकरण                | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n रैपर्स के बिना बिल्ड-टाइम React स्थानीयकरण     | `withLingo()` प्लगइन               |

### स्थानीयकरण इंजन

ये टूल्स [स्थानीयकरण इंजनों](https://lingo.dev) से कनेक्ट होते हैं – स्टेटफुल अनुवाद API जो आप Lingo.dev स्थानीयकरण इंजीनियरिंग प्लेटफ़ॉर्म पर बनाते हैं। प्रत्येक इंजन हर अनुरोध में शब्दावली, ब्रांड वॉइस, और प्रति-लोकेल निर्देशों को बनाए रखता है, [शब्दावली त्रुटियों को 16.6–44.6% तक कम करता है](https://lingo.dev/research/retrieval-augmented-localization)। या [अपना खुद का LLM लाएं](#lingodev-cli)।

---

### Lingo.dev MCP

React ऐप्स में i18n सेटअप करना त्रुटि-प्रवण है – यहां तक कि AI कोडिंग सहायक भी गैर-मौजूद API का भ्रम पैदा करते हैं और राउटिंग तोड़ देते हैं। Lingo.dev MCP, AI सहायकों को Next.js, React Router, और TanStack Start के लिए फ्रेमवर्क-विशिष्ट i18n ज्ञान तक संरचित पहुंच देता है। Claude Code, Cursor, GitHub Copilot Agents, और Codex के साथ काम करता है।

[डॉक्स पढ़ें →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

एक कमांड में JSON, YAML, markdown, CSV, और PO फ़ाइलों का स्थानीयकरण करें। एक लॉकफ़ाइल ट्रैक करती है कि पहले से क्या स्थानीयकृत है – केवल नई या बदली हुई सामग्री ही प्रोसेस होती है। Lingo.dev पर आपके स्थानीयकरण इंजन को डिफ़ॉल्ट करता है, या अपना खुद का LLM लाएं (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama)।

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[दस्तावेज़ पढ़ें →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

आपकी पाइपलाइन में निरंतर स्थानीयकरण। प्रत्येक पुश स्थानीयकरण को ट्रिगर करता है – कोड के प्रोडक्शन तक पहुंचने से पहले गायब स्ट्रिंग्स भर दी जाती हैं। GitHub Actions, GitLab CI/CD, और Bitbucket Pipelines का समर्थन करता है।

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[दस्तावेज़ पढ़ें →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

बैकएंड कोड से सीधे अपने स्थानीयकरण इंजन को कॉल करें। वेबहुक डिलीवरी के साथ सिंक्रोनस और एसिंक स्थानीयकरण, प्रति लोकेल फेलियर आइसोलेशन, और WebSocket के माध्यम से रियल-टाइम प्रगति।

[दस्तावेज़ पढ़ें →](https://lingo.dev/en/docs/api)

---

### React के लिए Lingo Compiler (अर्ली अल्फा)

i18n रैपर्स के बिना बिल्ड-टाइम React स्थानीयकरण। सादे अंग्रेज़ी टेक्स्ट के साथ कंपोनेंट लिखें – कंपाइलर अनुवाद योग्य स्ट्रिंग्स का पता लगाता है और बिल्ड टाइम पर स्थानीयकृत वेरिएंट जेनरेट करता है। न अनुवाद कीज़, न JSON फ़ाइलें, न `t()` फ़ंक्शन। Next.js (App Router) और Vite + React का समर्थन करता है।

[दस्तावेज़ पढ़ें →](https://lingo.dev/en/docs/react/compiler)

---

## योगदान

योगदान का स्वागत है। कृपया इन दिशानिर्देशों का पालन करें:

1. **इश्यूज़:** [बग रिपोर्ट करें या फ़ीचर का अनुरोध करें](https://github.com/lingodotdev/lingo.dev/issues)
2. **पुल रिक्वेस्ट:** [परिवर्तन सबमिट करें](https://github.com/lingodotdev/lingo.dev/pulls)
   - प्रत्येक PR के लिए चेंजसेट आवश्यक है: `pnpm new` (या नॉन-रिलीज़ परिवर्तनों के लिए `pnpm new:empty`)
   - सबमिट करने से पहले सुनिश्चित करें कि टेस्ट पास हो जाएं
3. **डेवलपमेंट:** यह एक pnpm + turborepo मोनोरेपो है
   - डिपेंडेंसीज़ इंस्टॉल करें: `pnpm install`
   - टेस्ट चलाएं: `pnpm test`
   - बिल्ड करें: `pnpm build`

**सहायता:** [Discord कम्युनिटी](https://lingo.dev/go/discord)

## स्टार हिस्ट्री

यदि आपको Lingo.dev उपयोगी लगता है, तो हमें स्टार दें और 10,000 स्टार तक पहुंचने में हमारी मदद करें!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## स्थानीयकृत दस्तावेज़ीकरण

**उपलब्ध अनुवाद:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**नई भाषा जोड़ना:**

1. [BCP-47 प्रारूप](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) का उपयोग करके [`i18n.json`](./i18n.json) में लोकेल कोड जोड़ें
2. पुल रिक्वेस्ट सबमिट करें
