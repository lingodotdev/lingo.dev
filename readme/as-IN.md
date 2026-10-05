<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – স্থানীয়কৰণ অভিযান্ত্ৰিকী প্লেটফৰ্ম" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev হৈছে স্থানীয়কৰণ অভিযান্ত্ৰিকী প্লেটফৰ্ম: অনুবাদৰ মান জোখা, LLM-ৰ সহায়ত অনুবাদ কৰা, আৰু স্থানীয় ভাষাভাষীৰ দ্বাৰা প্ৰুফৰিড কৰোৱাৰ সৰ্বোত্তম উপায়।</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">ডকছ</a> •
  <a href="https://lingo.dev">প্লেটফৰ্ম</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt-ৰ মাহটোৰ #1 DevTool" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="অনুজ্ঞাপত্ৰ" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="শেহতীয়া commit" /></a>
</p>

---

## দলসমূহে Lingo.dev-ত স্থানীয়কৰণ ইঞ্জিন তৈয়াৰ কৰে

এটা [স্থানীয়কৰণ ইঞ্জিন](https://lingo.dev/en/docs/platform/engines) হৈছে এটা অৱস্থাসচেতন অনুবাদ API, যিটো আপোনাৰ দলে বিন্যাস কৰে আৰু Lingo.dev-এ চলায়। প্ৰতিটো পণ্যৰ বাবে, প্ৰতিটো বিষয়বস্তুৰ ধৰণৰ বাবে, বা প্ৰতিটো ব্ৰেণ্ডৰ বাবে এটাকৈ ইঞ্জিন তৈয়াৰ কৰক। এটা ইঞ্জিনৰ জৰিয়তে যোৱা প্ৰতিটো অনুৰোধত, আপুনি তাত বিন্যাস কৰা সকলো বস্তু এটা স্থিৰ অগ্ৰাধিকাৰ ক্ৰম অনুসৰি প্ৰয়োগ হয়:

| স্তৰ | আপুনি কি বিন্যাস কৰে | ডকছৰ পৰা |
| --- | --- | --- |
| [LLM মডেলসমূহ](https://lingo.dev/en/docs/platform/llm-models) | প্ৰতিটো ভাষা-যুগল কোনটো মডেলে সামলায়, ক্ৰমবদ্ধ fallback-সহ | ৪০০+ টা মডেল; সঁহাৰিয়ে চলা মডেলটোৰ নাম দেখুৱায় |
| [ব্ৰেণ্ডৰ ভাষাশৈলী](https://lingo.dev/en/docs/platform/brand-voices) | প্ৰতিটো ভাষাত আপোনাৰ পণ্যই কেনেকৈ কথা কয়, প্ৰতিটো লোকেলৰ বাবে এটাকৈ লিখনি | প্ৰতিটো বজাৰৰ বাবে সুৰ আৰু আনুষ্ঠানিকতাৰ মাত্রা |
| [নিয়মসমূহ](https://lingo.dev/en/docs/platform/rules) | সাধাৰণ মডেলে সাধাৰণতে এৰি যোৱা ভাষাগত ৰীতি-নীতি | স্পেনিছত বিশেষণৰ স্থান, শতাংশ চিহ্নৰ আগতে এডাল খালী ঠাই |
| [শব্দকোষ](https://lingo.dev/en/docs/platform/glossaries) | অৰ্থ মিলাই, প্ৰতিটো লোকেলৰ বাবে সঠিক পৰিভাষাৰ মেপিং | "911" ইউৰোপীয় বজাৰত "112" হয়; পণ্যৰ নাম যিদৰে আছে তেনেদৰেই যায় |
| [AI সমীক্ষকসমূহ](https://lingo.dev/en/docs/platform/ai-reviewers) | প্ৰতিটো অনুবাদৰ পিছত চলা স্ক'ৰিং | GEMBA স্ক'ৰ, BERTScore, শব্দকোষ মান্যতা |

শব্দকোষ, নিয়মসমষ্টি, আৰু ব্ৰেণ্ডৰ ভাষাশৈলী আপোনাৰ সংস্থাৰ অন্তৰ্গত, আৰু এটা ইঞ্জিনে সংযোজনৰ জৰিয়তে সেইবোৰ প্ৰয়োগ কৰে। এটা শব্দকোষে পাঁচটা ইঞ্জিন চলাব পাৰে, আৰু এটা সম্পাদনাই পাঁচোটাতেই পৌঁছে। পৰিবৰ্তন লাইভ হোৱাৰ আগতে [Playground](https://lingo.dev/en/docs/platform/playground)-ত পৰীক্ষা কৰি চাওক: এটা ইঞ্জিনক এটা কেঁচা মডেলৰ সৈতে তুলনা কৰক, বা দুটা ইঞ্জিনক কাষে-কাষে ৰাখি তুলনা কৰক। ইঞ্জিনসমূহ প্লেটফৰ্মতেই বিন্যাস কৰা হয়, য'ত স্থানীয়কৰণ দলে স্থানীয়কৰণ আন্তঃগাঁথনি চলায়।

## ক'ডৰ পৰা আপোনাৰ ইঞ্জিনসমূহ ব্যৱহাৰ কৰক

এটা repository-ত থকা বিষয়বস্তু অনুবাদ কৰক। `lingo push`-এ `.lingo/config.json`-ত উল্লেখ কৰা ইঞ্জিনলৈ ফাইলসমূহ পঠায়, আৰু `lingo pull`-এ যিকোনো মেচিনৰ পৰা অনুবাদসমূহ উভতাই লিখে:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

অথবা ID দি এটা ইঞ্জিনক পোনপটীয়াকৈ কল কৰক:

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

|| |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | আপোনাৰ coding agent-এ সমস্যা য'ত ধৰা পৰিছিল, সেই কথোপকথনৰ পৰাই এটা ইঞ্জিন তৈয়াৰ কৰে, শব্দকোষত শব্দ যোগ কৰে, নিয়মসমূহ সূক্ষ্মভাৱে মিলায়, আৰু দুটা ইঞ্জিনৰ তুলনা কৰে |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | উৎস ফাইলসমূহ push কৰক, অনুবাদসমূহ pull কৰক—টাৰ্মিনেলৰ পৰা বা CI-ৰ পৰা। ১৮টা বিন্যাস: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android আৰু Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI সংস্থাপন কৰক আৰু GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, বা Node.js 22+ থকা যিকোনো runner-ত এটা ধাপ হিচাপে `lingo push` চলাওক |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | এবাৰ সংস্থাপন কৰক, আৰু default branch-লৈ হোৱা প্ৰতিটো push-এ এটা translation pull request খোলে বা আপডেট কৰে, অথবা উৎস সলনি কৰা pull request-ত অনুবাদসমূহ commit হিচাপে জমা হয়। runner নাই, API key secret নাই, আৰু সামলাবলগীয়া Lockfile নাই |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | প্ৰতিটো ভাষা-যুগলৰ বাবে এটা synchronous কল, অথবা এটা async কাম যিয়ে এটা অনুৰোধ বহু লোকেললৈ পঠিয়ায় আৰু ফলাফল আহি পোৱাৰ লগে লগে দিয়ে |

[আপোনাৰ প্ৰথম স্থানীয়কৰণ ইঞ্জিন তৈয়াৰ কৰক →](https://lingo.dev)
