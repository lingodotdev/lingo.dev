<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – स्थानीयकरण इंजीनियरिंग मंच"
    />
  </a>
</p>

<p align="center">
  <strong>
    ओपन-सोर्स स्थानीयकरण इंजीनियरिंग औजार। लगातार आ गुणवत्ता वाला अनुवाद खातिर
    Lingo.dev स्थानीयकरण इंजीनियरिंग मंच से जुड़ल जाव।
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">React खातिर Lingo Compiler (शुरुआती अल्फा)</a>
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

## तुरंत शुरुआत

| औजार                                               | ई का करेला                                               | झटपट कमांड                         |
| -------------------------------------------------- | -------------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React ऐप्स खातिर AI-सहायता प्राप्त i18n सेटअप            | प्रॉम्प्ट: `Set up i18n`           |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO फाइल सभ के स्थानीयकरण करीं | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions में निरंतर स्थानीयकरण                     | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n रैपर बिना बिल्ड-टाइम React स्थानीयकरण               | `withLingo()` प्लगइन               |

### स्थानीयकरण इंजन सभ

ई औजार सभ [स्थानीयकरण इंजन सभ](https://lingo.dev) से जुड़ेला – स्टेटफुल अनुवाद APIs जवन रउआ Lingo.dev स्थानीयकरण इंजीनियरिंग मंच प बनावल। हर इंजन हर अनुरोध में शब्दावली, ब्रांड आवाज आ प्रति-लोकेल निर्देश सभ के बनवले रखेला, [शब्दावली त्रुटि सभ के 16.6–44.6% तक कम करेला](https://lingo.dev/research/retrieval-augmented-localization)। या [अपना LLM लावल जाव](#lingodev-cli)।

---

### Lingo.dev MCP

React ऐप्स में i18n सेटअप करे में त्रुटि होखे के संभावना बा – AI कोडिंग सहायक तक गैर-मौजूद APIs के भ्रम में पड़ जाला आ राउटिंग तोड़ देला। Lingo.dev MCP Next.js, React Router आ TanStack Start खातिर फ्रेमवर्क-विशिष्ट i18n ज्ञान तक AI सहायक सभ के संरचित पहुंच देला। Claude Code, Cursor, GitHub Copilot Agents आ Codex के साथे काम करेला।

[दस्तावेज पढ़ीं →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

एक कमांड में JSON, YAML, markdown, CSV आ PO फाइल सभ के स्थानीयकरण करीं। एगो लॉकफाइल ट्रैक करेला कि का पहिले से स्थानीयकृत बा – बस नया भा बदलल सामग्री के प्रोसेस कइल जाला। Lingo.dev प रउआ स्थानीयकरण इंजन के डिफॉल्ट मानेला, भा अपना LLM लावल जाव (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama)।

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[दस्तावेज पढ़ीं →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

रउरा पाइपलाइन में निरंतर स्थानीयकरण। हर पुश से स्थानीयकरण शुरू हो जाला – कोड प्रोडक्शन में पहुँचे से पहिले खाली स्ट्रिंग भर दिहल जाला। GitHub Actions, GitLab CI/CD आ Bitbucket Pipelines के समर्थन करेला।

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[दस्तावेज पढ़ीं →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

बैकएंड कोड से सीधे रउरा स्थानीयकरण इंजन के कॉल करीं। Webhook डिलीवरी, प्रति लोकेल विफलता अलगाव आ WebSocket के माध्यम से रियल-टाइम प्रगति के साथे सिंक्रोनस आ async स्थानीयकरण।

[दस्तावेज पढ़ीं →](https://lingo.dev/en/docs/api)

---

### React खातिर Lingo Compiler (शुरुआती अल्फा)

i18n रैपर के बिना बिल्ड-टाइम React स्थानीयकरण। सादा अंग्रेजी पाठ के साथ कंपोनेंट लिखीं – कंपाइलर अनुवाद योग्य स्ट्रिंग के पहचान के बिल्ड टाइम पर स्थानीयकृत संस्करण बनावेला। ना अनुवाद कुंजी, ना JSON फाइल, ना `t()` फंक्शन। Next.js (App Router) आ Vite + React के समर्थन करेला।

[दस्तावेज पढ़ीं →](https://lingo.dev/en/docs/react/compiler)

---

## योगदान

योगदान के स्वागत बा। कृपया एह दिशानिर्देशन के पालन करीं:

1. **समस्या:** [बग रिपोर्ट करीं भा सुविधा अनुरोध करीं](https://github.com/lingodotdev/lingo.dev/issues)
2. **पुल अनुरोध:** [बदलाव सबमिट करीं](https://github.com/lingodotdev/lingo.dev/pulls)
   - हर PR खातिर चेंजसेट जरूरी बा: `pnpm new` (भा गैर-रिलीज बदलाव खातिर `pnpm new:empty`)
   - सबमिट करे से पहिले सुनिश्चित करीं कि टेस्ट पास हो जाव
3. **विकास:** ई एगो pnpm + turborepo मोनोरेपो बा
   - निर्भरता इंस्टॉल करीं: `pnpm install`
   - टेस्ट चलाईं: `pnpm test`
   - बिल्ड करीं: `pnpm build`

**समर्थन:** [Discord समुदाय](https://lingo.dev/go/discord)

## स्टार इतिहास

अगर Lingo.dev रउरा काम के लागत बा त हमनी के एगो स्टार दीं आ 10,000 स्टार तक पहुँचे में मदद करीं!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## स्थानीयकृत दस्तावेज़ीकरण

**उपलब्ध अनुवाद:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

\*\*नया भाषा जोड़ल:

1. [BCP-47 फॉर्मेट](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) के इस्तेमाल से [`i18n.json`](./i18n.json) में लोकेल कोड जोड़ीं
2. पुल रिक्वेस्ट सबमिट करीं
