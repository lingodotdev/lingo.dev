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

## দলসমূহে Lingo.dev-ত localization engine নিৰ্মাণ কৰে

এটা [localization engine](https://lingo.dev/en/docs/platform/engines) হৈছে এটা stateful translation API, যিটো আপোনাৰ দলে configure কৰে আৰু Lingo.dev-এ চলায়। প্ৰতিটো product, content type, বা brand-ৰ বাবে বেলেগ engine বনাব পাৰে। engine-ৰ মাজেৰে যোৱা প্ৰতিটো request-ত আপুনি তাত configure কৰা সকলো বস্তু এটা নিৰ্দিষ্ট precedence ক্ৰমত প্ৰয়োগ হয়:

| স্তৰ | আপুনি কি configure কৰে | docs-ৰ পৰা |
| --- | --- | --- |
| [LLM models](https://lingo.dev/en/docs/platform/llm-models) | ranked fallback-সহ প্ৰতিটো language pair কোন model-এ handle কৰিব | 400+টা model; response-ত কোন model চলিছিল তাৰ নাম থাকে |
| [Brand voice](https://lingo.dev/en/docs/platform/brand-voices) | প্ৰতিটো language-ত আপোনাৰ product-এ কেনেদৰে কথা কয়, locale-পিছু এটা text | বজাৰভেদে tone আৰু formality |
| [Rules](https://lingo.dev/en/docs/platform/rules) | সাধাৰণ model-এ ধৰা নপৰা ভাষাগত নিয়মসমূহ | Spanish-ত adjective-ৰ স্থান, percentage sign-ৰ আগত এটা space |
| [Glossary](https://lingo.dev/en/docs/platform/glossaries) | locale-পিছু অৰ্থ অনুসৰি মিলোৱা নিৰ্দিষ্ট term mapping | ইউৰোপীয় বজাৰৰ বাবে "911" "112" হয়; product name-সমূহ সলনি নোহোৱাকৈ থাকে |
| [AI reviewers](https://lingo.dev/en/docs/platform/ai-reviewers) | প্ৰতিটো translation-ৰ পাছত চলা scoring | GEMBA scores, BERTScore, glossary compliance |

Glossary, ruleset, আৰু brand voice আপোনাৰ organization-ৰ অধীনত থাকে, আৰু engine-এ attachment-ৰ জৰিয়তে সেইবোৰ প্ৰয়োগ কৰে। এটা glossary-এ পাঁচটা engine নিয়ন্ত্ৰণ কৰিব পাৰে, আৰু এটা edit-ৰ প্ৰভাৱ পাঁচোটাতেই পৰে। live হোৱাৰ আগতে [Playground](https://lingo.dev/en/docs/platform/playground)-ত সলনি test কৰক: এটা engine-ক এটা raw model-ৰ সৈতে তুলনা কৰক, বা দুটা engine কাষে কাষে মিলাই চাওক। engine-সমূহ platform-ত configure কৰা হয়, য'ত localization team-এ localization infrastructure চলায়।

## code-ৰ পৰা আপোনাৰ engine-সমূহলৈ পৌঁছক

এটা repository-ত থকা content translate কৰক। `lingo push`-এ `.lingo/config.json`-ত নাম দিয়া engine-লৈ file-সমূহ পঠিয়ায়, আৰু `lingo pull`-এ যিকোনো machine-ৰ পৰা translation-সমূহ উভতাই আনে:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

নাইবা, ID-ৰে চিনাকি কৰি engine-ক পোনপটীয়াকৈ call কৰক:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | সমস্যা যি কথোপকথনত ধৰা পৰে, সেই কথোপকথনৰ পৰাই আপোনাৰ coding agent-এ এটা engine সৃষ্টি কৰিব পাৰে, glossary term যোগ কৰিব পাৰে, rules tune কৰিব পাৰে, আৰু দুটা engine তুলনা কৰিব পাৰে |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | terminal-ৰ পৰা বা CI-ৰ পৰা source file push কৰক, translation pull কৰক। মুঠ ১৮টা format: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android আৰু Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI install কৰক আৰু GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, বা Node.js 22+ থকা যিকোনো runner-ত এটা step হিচাপে `lingo push` চলাওক |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | এবাৰ install কৰক, আৰু default branch-লৈ হোৱা প্ৰতিটো push-এ এটা translation pull request খোলে বা update কৰে, নাইবা translation-সমূহ source সলনি কৰা pull request-ত commit হিচাপে যোগ হয়। runner নাই, API key secret নাই, manage কৰিবলগীয়া Lockfile নাই |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | প্ৰতিটো language pair-ৰ বাবে এটা synchronous call, অথবা এটা async job যিয়ে এটা request বহুতো locale-লৈ পঠিয়ায় আৰু ফলাফল আহি থাকোঁতেই ডেলিভাৰ কৰে |

[আপোনাৰ প্ৰথম localization engine নিৰ্মাণ কৰক →](https://lingo.dev)
