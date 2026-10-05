<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – localization engineering platform" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev is the localization engineering platform: the best way to measure translation quality, translate with LLMs, and proofread with native speakers.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Docs</a> •
  <a href="https://lingo.dev">Platform</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Month" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last commit" /></a>
</p>

---

## टीमें Lingo.dev पर localization engine बनाती हैं

[localization engine](https://lingo.dev/en/docs/platform/engines) एक stateful translation API है, जिसे आपकी टीम कॉन्फ़िगर करती है और Lingo.dev चलाता है। हर प्रोडक्ट, हर content type, या हर brand के लिए अलग engine बनाएँ। किसी engine से गुजरने वाला हर अनुरोध उसमें की गई आपकी सभी कॉन्फ़िगरेशन को तय प्राथमिकता क्रम में लागू करता है:

| लेयर | आप क्या कॉन्फ़िगर करते हैं | डॉक्स के अनुसार |
| --- | --- | --- |
| [LLM models](https://lingo.dev/en/docs/platform/llm-models) | हर language pair को कौन-सा model संभालेगा, ranked fallbacks के साथ | 400+ models; response में उस model का नाम आता है जो चला |
| [Brand voice](https://lingo.dev/en/docs/platform/brand-voices) | हर भाषा में आपका प्रोडक्ट कैसे बोलेगा, हर locale के लिए एक टेक्स्ट | हर market के लिए tone और formality |
| [Rules](https://lingo.dev/en/docs/platform/rules) | वे भाषाई परंपराएँ जो एक generic model अक्सर नहीं पकड़ पाता | स्पैनिश में adjective की position, percentage sign से पहले space |
| [Glossary](https://lingo.dev/en/docs/platform/glossaries) | हर locale के लिए सटीक term mappings, अर्थ के आधार पर matched | यूरोपीय markets में "911", "112" बन जाता है; product names जैसे-के-तैसे रहते हैं |
| [AI reviewers](https://lingo.dev/en/docs/platform/ai-reviewers) | हर translation के बाद चलने वाली scoring | GEMBA scores, BERTScore, glossary compliance |

Glossary, rulesets, और brand voices आपकी organization के होते हैं, और engine उन्हें attachment के ज़रिए लागू करता है। एक glossary पाँच engines को नियंत्रित कर सकती है, और एक edit सभी पाँचों तक पहुँच जाता है। कोई बदलाव live होने से पहले उसे [Playground](https://lingo.dev/en/docs/platform/playground) में test करें: किसी engine की तुलना raw model से करें, या दो engines को साथ-साथ compare करें। Engines platform पर कॉन्फ़िगर होते हैं, जहाँ localization टीम localization infrastructure चलाती है।

## कोड से अपने engines तक पहुँचें

किसी repository के content का अनुवाद करें। `lingo push` फ़ाइलों को `.lingo/config.json` में दिए गए engine पर भेजता है, और `lingo pull` किसी भी machine से translations वापस लिख देता है:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

या किसी engine को सीधे call करें, उसकी ID देकर:

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: { "X-API-Key": process.env.LINGO_API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({
    engineId: "eng_abc123",
    sourceLocale: "en",
    targetLocale: "de",
    data: { greeting: "Hello, world!", cta: "Get started" },
  }),
});

const { data, model, usage } = await res.json();
// data:  { greeting: "Hallo, Welt!", cta: "Jetzt starten" }
// model: "anthropic/claude-sonnet-4.5"
// usage: { inputTokens: 2789, outputTokens: 861, cost: 0.023012 }
```

| | |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | आपका coding agent उसी conversation से, जहाँ समस्या सामने आई, engine बनाता है, glossary terms जोड़ता है, rules tune करता है, और दो engines की तुलना करता है |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | टर्मिनल या CI से source files push करें और translations pull करें। अठारह formats: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android और Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI install करें और GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, या Node.js 22+ वाले किसी भी runner में `lingo push` को एक step के तौर पर चलाएँ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | एक बार install करें, फिर default branch पर हर push translation pull request खोलता है या उसे update करता है। या फिर translations उसी pull request में commit के रूप में आ जाती हैं, जिसमें source बदला गया था। manage करने के लिए न runner चाहिए, न API key secret, न Lockfile |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | हर language pair के लिए एक synchronous call, या एक async job जो एक request को कई locales तक फैलाती है और नतीजे मिलते ही पहुँचा देती है |

[अपना पहला localization engine बनाएँ →](https://lingo.dev)
