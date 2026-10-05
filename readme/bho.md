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

## टीम Lingo.dev पर लोकलाइजेशन इंजन बनावेली

[लोकलाइजेशन इंजन](https://lingo.dev/en/docs/platform/engines) एगो stateful translation API ह, जवन रउआ टीम configure करेले आ Lingo.dev चलावेले। एकरा के रउआ हर product, हर content type, चाहे हर brand खातिर अलग-अलग बना सकत बानी। इंजन से जाए वाला हर request पर, ओह में रउआ जे कुछ configure कइले बानी, ऊ सभ तय precedence order में लागू होला:

| लेयर | रउआ का configure करेनी | डॉक्स से |
| --- | --- | --- |
| [LLM models](https://lingo.dev/en/docs/platform/llm-models) | कवन model हर language pair सँभाले ला, ranked fallbacks के साथ | 400+ models; response में ओह model के नाम होला जे चलल |
| [Brand voice](https://lingo.dev/en/docs/platform/brand-voices) | हर भाषा में रउआ product कइसे बोलेला, हर locale खातिर एगो text | हर market खातिर tone आ formality |
| [Rules](https://lingo.dev/en/docs/platform/rules) | ओह linguistic conventions सभ, जवन generic model से छूट जाला | Spanish में adjective के जगह, percentage sign से पहिले एगो space |
| [Glossary](https://lingo.dev/en/docs/platform/glossaries) | हर locale खातिर exact term mappings, meaning के हिसाब से match कइल | "911" यूरोपीय markets खातिर "112" बन जाला; product names जइसन बा वइसहीं रहेला |
| [AI reviewers](https://lingo.dev/en/docs/platform/ai-reviewers) | हर translation के बाद चले वाला scoring | GEMBA scores, BERTScore, glossary compliance |

Glossary, rulesets, आ Brand voice रउआ organization के हिस्सा ह, आ इंजन ओह सभ के attachment के जरिए लागू करे ला। एगो Glossary पाँच गो इंजन सभ के चला सकेला, आ एगो edit सब पाँचो में पहुँच जाला। बदलाव live जाए से पहिले [Playground](https://lingo.dev/en/docs/platform/playground) में test करीं: एगो इंजन के raw model से compare करीं, चाहे दू गो इंजन के side by side। इंजन platform पर configure होलें, जहाँ localization team localization infrastructure चलावेले।

## Code से अपना इंजन तक पहुँचीं

कवनो repository में मौजूद content के translate करीं। `lingo push` files के `.lingo/config.json` में बतावल इंजन पर भेजेला, आ `lingo pull` कवनो machine से translations वापस लिख देला:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

चाहें इंजन के सीधा call करीं, ID से नाम बताके:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | रउआ coding agent उहे conversation से, जहाँ problem सामने आइल, एगो इंजन बनावे ला, Glossary terms जोड़े ला, rules tune करे ला, आ दू गो इंजन के compare करे ला |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Source files push करीं, translations pull करीं—terminal से या CI से। अठारह formats: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android आ Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI install करीं आ `lingo push` के GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, या Node.js 22+ वाला कवनो runner में step के रूप में चलाईं |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | एक बेर install करीं, आ default branch पर हर push एगो translation pull request खोलेला या update करे ला, चाहे translations ओही pull request में commit बन के आ जाली जे source बदलले रहे। ना runner, ना API key secret, ना manage करे खातिर Lockfile |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | हर language pair खातिर एगो synchronous call, चाहे एगो async job, जे एगो request के कई locales में भेज देला आ results आवतहीं पहुँचा देला |

[अपना पहिला लोकलाइजेशन इंजन बनाईं →](https://lingo.dev)
