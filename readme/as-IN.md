<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – স্থানীয়কৰণ অভিযান্ত্ৰিক প্লেটফৰ্ম"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev হৈছে স্থানীয়কৰণ ইঞ্জিনিয়াৰিং প্লেটফৰ্ম: অনুবাদৰ মান জুখিবলৈ, LLM
    ৰ সৈতে অনুবাদ কৰিবলৈ, আৰু স্থানীয় ভাষাভাষীসকলৰ সৈতে পৰীক্ষা-নিৰীক্ষা কৰিবলৈ
    শ্ৰেষ্ঠ উপায়।
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">দস্তাবেজসমূহ</a> •
  <a href="https://lingo.dev">প্লেটফৰ্ম</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt মাহৰ #১ DevTool"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="লাইচেন্স"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="শেষ প্ৰতিশ্ৰুতি"
    />
  </a>
</p>

---

## দলসমূহে Lingo.dev ত স্থানীয়কৰণ ইঞ্জিন নিৰ্মাণ কৰে

[স্থানীয়কৰণ ইঞ্জিন](https://lingo.dev/en/docs/platform/engines) হৈছে এটা স্থিতিশীল অনুবাদ API যিটো আপোনাৰ দলে কনফিগাৰ কৰে আৰু Lingo.dev য়ে চলায়। প্ৰতিটো সামগ্ৰী, প্ৰতিটো বিষয়বস্তুৰ প্ৰকাৰ বা প্ৰতিটো ব্ৰেণ্ডৰ বাবে এটা নিৰ্মাণ কৰক। ইঞ্জিনৰ জৰিয়তে প্ৰতিটো অনুৰোধে আপুনি ইয়াত কনফিগাৰ কৰা সকলো প্ৰয়োগ কৰে, অগ্ৰাধিকাৰৰ এক নিৰ্দিষ্ট ক্ৰমত:

| স্তৰ                                                                | আপুনি কি কনফিগাৰ কৰে                                                         | দস্তাবেজৰ পৰা                                                        |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [LLM মডেলসমূহ](https://lingo.dev/en/docs/platform/llm-models)       | কোনটো মডেলে প্ৰতিটো ভাষা যোৰ পৰিচালনা কৰে, ক্ৰমাংকিত ফলবেকৰ সৈতে             | ৪০০+ মডেল; সঁহাৰিয়ে চলা মডেলটো নাম দিয়ে                            |
| [ব্ৰেণ্ড কণ্ঠ](https://lingo.dev/en/docs/platform/brand-voices)     | প্ৰতিটো ভাষাত আপোনাৰ সামগ্ৰীয়ে কেনেদৰে কথা কয়, প্ৰতিটো অঞ্চলৰ বাবে এটা পাঠ | প্ৰতিটো বজাৰৰ বাবে সুৰ আৰু আনুষ্ঠানিকতা                              |
| [নিয়মসমূহ](https://lingo.dev/en/docs/platform/rules)               | এটা সাধাৰণ মডেলে হেৰুৱা ভাষিক পৰম্পৰাসমূহ                                    | স্পেনিছত বিশেষণৰ স্থিতি, শতাংশ চিহ্নৰ আগত এক স্থান                   |
| [শব্দকোষ](https://lingo.dev/en/docs/platform/glossaries)            | প্ৰতিটো অঞ্চলৰ বাবে সঠিক শব্দ মেপিং, অৰ্থৰ দ্বাৰা মিলোৱা                     | "911" য়ে ইউৰোপীয় বজাৰৰ বাবে "112" হৈ পৰে; সামগ্ৰীৰ নামসমূহ পাছ হয় |
| [AI পৰ্যালোচকসমূহ](https://lingo.dev/en/docs/platform/ai-reviewers) | প্ৰতিটো অনুবাদৰ পিছত চলা স্ক-ৰিং                                             | GEMBA স্ক'ৰ, BERTScore, শব্দকোষ সম্মতি                               |

শব্দকোষসমূহ, নিয়মছেট আৰু ব্ৰেণ্ড কণ্ঠসমূহ আপোনাৰ সংগঠনৰ, আৰু এটা ইঞ্জিনে সংযুক্তিৰ জৰিয়তে সেইবোৰ প্ৰয়োগ কৰে। এটা শব্দকোষে পাঁচটা ইঞ্জিন নিয়ন্ত্ৰণ কৰে, আৰু এটা সম্পাদনাই সকলো পাঁচটা পায়। লাইভ হোৱাৰ আগতে [Playground](https://lingo.dev/en/docs/platform/playground) ত এটা পৰিৱৰ্তন পৰীক্ষা কৰক: এটা কেঁচা মডেলৰ বিপৰীতে এটা ইঞ্জিন তুলনা কৰক, বা দুটা ইঞ্জিন কাষত কাষত। ইঞ্জিনসমূহ প্লেটফৰ্মত কনফিগাৰ কৰা হয়, য'ত স্থানীয়কৰণ দলে স্থানীয়কৰণ আন্তঃগাঁথনি চলায়।

## ক'ডৰ পৰা আপোনাৰ ইঞ্জিনসমূহত প্ৰৱেশ কৰক

এটা ৰিপ'জিটৰীত থকা সমল অনুবাদ কৰক। `lingo push` এ `.lingo/config.json` ত নামাংকিত ইঞ্জিনলৈ ফাইলসমূহ প্ৰেৰণ কৰে, আৰু `lingo pull` এ যিকোনো মেচিনৰ পৰা অনুবাদসমূহ পুনৰ লিখে:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

অথবা এটা ইঞ্জিনক ID ৰ দ্বাৰা নামাংকন কৰি পোনপটীয়াকৈ কল কৰক:

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.LINGO_API_KEY,
    "Content-Type": "application/json",
  },
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

|                                                                        |                                                                                                                                                                             |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | আপোনাৰ ক'ডিং এজেণ্টে এটা ইঞ্জিন সৃষ্টি কৰে, শব্দকোষ পদ যোগ কৰে, নিয়মসমূহ সুসংগত কৰে, আৰু দুটা ইঞ্জিনৰ তুলনা কৰে, সেই কথোপকথনৰ পৰা য'ত সমস্যাটো উত্থাপিত হৈছিল              |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | উৎস ফাইলসমূহ পুশ্ব কৰক, অনুবাদসমূহ পুল কৰক, টাৰ্মিনেল বা CI ৰ পৰা। আঠাৰটা ফৰ্মেট: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android আৰু Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | CLI ইনষ্টল কৰক আৰু `lingo push` ক GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, বা Node.js 22+ থকা যিকোনো ৰানাৰত এটা পদক্ষেপ হিচাপে চলাওক                              |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | এবাৰ ইনষ্টল কৰক আৰু ডিফল্ট ব্ৰাঞ্চলৈ প্ৰতিটো পুশ্বে এটা অনুবাদ পুল ৰিকুৱেষ্ট খোলে বা আপডেট কৰে। কোনো ৰানাৰ নাই, কোনো API কী চিক্ৰেট নাই, পৰিচালনা কৰিবলৈ কোনো লকফাইল নাই    |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | প্ৰতি ভাষা যোৰাৰ বাবে এটা চিঙ্ক্ৰ'নাছ কল, বা এটা এচিঙ্ক জব যিয়ে এটা ৰিকুৱেষ্ট বহুতো লোকেললৈ বিস্তাৰিত কৰে আৰু ফলাফলসমূহ আহি পোৱাৰ লগে লগে প্ৰদান কৰে                       |

[আপোনাৰ প্ৰথম স্থানীয়কৰণ ইঞ্জিন নিৰ্মাণ কৰক →](https://lingo.dev)
