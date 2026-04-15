<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – स्थानिकीकरण अभियांत्रिकी प्लॅटफॉर्म"
    />
  </a>
</p>

<p align="center">
  <strong>
    ओपन-सोर्स स्थानिकीकरण अभियांत्रिकी साधने. सुसंगत, उच्च दर्जाच्या
    अनुवादांसाठी Lingo.dev स्थानिकीकरण अभियांत्रिकी प्लॅटफॉर्मशी कनेक्ट करा.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler for React (अर्ली अल्फा)</a>
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

## द्रुत प्रारंभ

| साधन                                               | ते काय करते                                          | द्रुत कमांड                        |
| -------------------------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React अॅप्ससाठी AI-सहाय्यित i18n सेटअप               | प्रॉम्प्ट: `Set up i18n`           |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO फाइल्स स्थानिकीकृत करा | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions मध्ये सतत स्थानिकीकरण                 | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n रॅपर्सशिवाय बिल्ड-टाइम React स्थानिकीकरण        | `withLingo()` प्लगइन               |

### स्थानिकीकरण इंजिने

ही साधने [स्थानिकीकरण इंजिने](https://lingo.dev) शी कनेक्ट होतात – Lingo.dev स्थानिकीकरण अभियांत्रिकी प्लॅटफॉर्मवर तुम्ही तयार करता अशा स्टेटफुल ट्रान्सलेशन API. प्रत्येक इंजिन शब्दावली, ब्रँड व्हॉइस आणि प्रति-लोकेल सूचना प्रत्येक विनंतीमध्ये टिकवून ठेवते, [टर्मिनोलॉजी त्रुटी 16.6–44.6% कमी करते](https://lingo.dev/research/retrieval-augmented-localization). किंवा [स्वतःचे LLM आणा](#lingodev-cli).

---

### Lingo.dev MCP

React अॅप्समध्ये i18n सेटअप करणे त्रुटीप्रवण आहे – AI कोडिंग असिस्टंट्ससुद्धा अस्तित्वात नसलेले API हॅल्युसिनेट करतात आणि राउटिंग खराब करतात. Lingo.dev MCP AI असिस्टंट्सना Next.js, React Router आणि TanStack Start साठी फ्रेमवर्क-विशिष्ट i18n ज्ञानाचा स्ट्रक्चर्ड अॅक्सेस देते. Claude Code, Cursor, GitHub Copilot Agents आणि Codex सोबत कार्य करते.

[डॉक्स वाचा →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

एका कमांडमध्ये JSON, YAML, markdown, CSV आणि PO फाइल्स स्थानिकीकृत करा. लॉकफाइल आधीच काय स्थानिकीकृत झाले आहे त्याचा मागोवा ठेवते – फक्त नवीन किंवा बदललेली सामग्री प्रक्रिया केली जाते. Lingo.dev वरील तुमच्या स्थानिकीकरण इंजिनला डिफॉल्ट करते, किंवा स्वतःचे LLM आणा (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[दस्तऐवज वाचा →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

तुमच्या पाइपलाइनमध्ये सतत स्थानिकीकरण. प्रत्येक पुशवर स्थानिकीकरण सुरू होते – कोड प्रोडक्शनमध्ये पोहोचण्यापूर्वी गहाळ स्ट्रिंग्स भरल्या जातात. GitHub Actions, GitLab CI/CD आणि Bitbucket Pipelines ला समर्थन देते.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[दस्तऐवज वाचा →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

बॅकएंड कोडमधून थेट तुमचे स्थानिकीकरण इंजिन कॉल करा. वेबहुक वितरणासह सिंक्रोनस आणि async स्थानिकीकरण, प्रत्येक लोकेलसाठी त्रुटी विलगीकरण आणि WebSocket द्वारे रिअल-टाइम प्रगती.

[दस्तऐवज वाचा →](https://lingo.dev/en/docs/api)

---

### React साठी Lingo Compiler (अर्ली अल्फा)

i18n रॅपर्सशिवाय बिल्ड-टाइम React स्थानिकीकरण. सरळ इंग्रजी मजकुरासह कॉम्पोनेंट्स लिहा – कंपाइलर अनुवादयोग्य स्ट्रिंग्स शोधतो आणि बिल्ड टाइमवर स्थानिकीकृत प्रकार तयार करतो. अनुवाद की नाहीत, JSON फाइल्स नाहीत, `t()` फंक्शन्स नाहीत. Next.js (App Router) आणि Vite + React ला समर्थन देते.

[दस्तऐवज वाचा →](https://lingo.dev/en/docs/react/compiler)

---

## योगदान

योगदानाचे स्वागत आहे. कृपया या मार्गदर्शक तत्त्वांचे पालन करा:

1. **समस्या:** [बग रिपोर्ट करा किंवा वैशिष्ट्ये विनंती करा](https://github.com/lingodotdev/lingo.dev/issues)
2. **पुल रिक्वेस्ट:** [बदल सबमिट करा](https://github.com/lingodotdev/lingo.dev/pulls)
   - प्रत्येक PR साठी चेंजसेट आवश्यक आहे: `pnpm new` (किंवा नॉन-रिलीज बदलांसाठी `pnpm new:empty`)
   - सबमिट करण्यापूर्वी चाचण्या पास होत असल्याची खात्री करा
3. **डेव्हलपमेंट:** हे एक pnpm + turborepo मोनोरेपो आहे
   - डिपेंडन्सी इन्स्टॉल करा: `pnpm install`
   - चाचण्या चालवा: `pnpm test`
   - बिल्ड: `pnpm build`

**समर्थन:** [Discord समुदाय](https://lingo.dev/go/discord)

## स्टार इतिहास

Lingo.dev उपयुक्त वाटल्यास, आम्हाला स्टार द्या आणि 10,000 स्टार गाठण्यात मदत करा!

[

![स्टार हिस्ट्री चार्ट](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## स्थानिकीकृत दस्तऐवजीकरण

**उपलब्ध भाषांतरे:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**नवीन भाषा जोडणे:**

1. [BCP-47 स्वरूप](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) वापरून [`i18n.json`](./i18n.json) मध्ये लोकेल कोड जोडा
2. पुल रिक्वेस्ट सबमिट करा
