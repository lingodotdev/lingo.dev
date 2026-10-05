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

## টিমগুলো Lingo.dev-এ localization engine তৈরি করে

একটি [localization engine](https://lingo.dev/en/docs/platform/engines) হলো একটি stateful translation API, যা আপনার টিম কনফিগার করে আর Lingo.dev চালায়। প্রতি প্রোডাক্ট, প্রতি কনটেন্ট টাইপ, বা প্রতি ব্র্যান্ডের জন্য আলাদা engine তৈরি করুন। কোনো engine দিয়ে যাওয়া প্রতিটি অনুরোধে, সেখানে আপনার করা সব কনফিগারেশন একটি নির্দিষ্ট অগ্রাধিকারক্রমে প্রয়োগ হয়:

| স্তর | আপনি কী কনফিগার করেন | ডকস থেকে |
| --- | --- | --- |
| [LLM models](https://lingo.dev/en/docs/platform/llm-models) | প্রতিটি ভাষা-জোড়ার জন্য কোন মডেল কাজ করবে, সঙ্গে র‌্যাঙ্ক করা fallback | 400+ মডেল; রেসপন্সে কোন মডেল চলেছে তার নাম থাকে |
| [Brand voice](https://lingo.dev/en/docs/platform/brand-voices) | প্রতিটি ভাষায় আপনার প্রোডাক্ট কীভাবে কথা বলবে, প্রতি locale-এর জন্য আলাদা টেক্সট | প্রতিটি বাজারের জন্য টোন ও আনুষ্ঠানিকতার মাত্রা |
| [Rules](https://lingo.dev/en/docs/platform/rules) | যেসব ভাষাগত রীতি সাধারণ মডেলের চোখ এড়িয়ে যায় | স্প্যানিশে adjective-এর অবস্থান, percentage sign-এর আগে একটি স্পেস |
| [Glossary](https://lingo.dev/en/docs/platform/glossaries) | অর্থ মিলিয়ে প্রতি locale-এর জন্য নির্ভুল term mapping | ইউরোপীয় বাজারে "911" বদলে "112" হয়; প্রোডাক্টের নাম অপরিবর্তিত থাকে |
| [AI reviewers](https://lingo.dev/en/docs/platform/ai-reviewers) | প্রতিটি অনুবাদের পর চলা scoring | GEMBA স্কোর, BERTScore, glossary compliance |

Glossary, ruleset, আর brand voice আপনার organization-এর সম্পদ, আর একটি engine attachment-এর মাধ্যমে সেগুলো প্রয়োগ করে। একটি glossary পাঁচটি engine নিয়ন্ত্রণ করতে পারে, আর একটি edit-ই পাঁচটিতেই পৌঁছে যায়। কোনো পরিবর্তন live হওয়ার আগে [Playground](https://lingo.dev/en/docs/platform/playground)-এ পরীক্ষা করুন: একটি engine-কে raw model-এর সঙ্গে, বা দুটি engine-কে পাশাপাশি তুলনা করুন। engine-গুলো প্ল্যাটফর্মেই কনফিগার করা হয়, যেখানে localization টিম localization infrastructure চালায়।

## কোড থেকেই আপনার engine-এ পৌঁছান

একটি repository-এর কনটেন্ট অনুবাদ করুন। `lingo push` `.lingo/config.json`-এ নাম দেওয়া engine-এ ফাইল পাঠায়, আর `lingo pull` যেকোনো machine থেকে অনুবাদগুলো ফিরিয়ে আনে:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

অথবা ID দিয়ে নাম উল্লেখ করে সরাসরি একটি engine কল করুন:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | যে কথোপকথনে সমস্যা ধরা পড়েছে, সেখান থেকেই আপনার coding agent একটি engine তৈরি করে, glossary term যোগ করে, rules fine-tune করে, আর দুটি engine তুলনা করে |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | terminal বা CI থেকে source file push করুন, translation pull করুন। 18টি format: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android এবং Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI ইনস্টল করুন এবং GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, বা Node.js 22+ থাকা যেকোনো runner-এ একটি ধাপ হিসেবে `lingo push` চালান |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | একবার ইনস্টল করুন, তারপর default branch-এ প্রতিটি push একটি translation pull request খুলবে বা আপডেট করবে, অথবা source বদলানো pull request-এ translations একটি commit হিসেবে যোগ হবে। কোনো runner লাগবে না, কোনো API key secret লাগবে না, manage করার জন্য কোনো lockfile-ও লাগবে না |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | প্রতি ভাষা-জোড়ার জন্য একটি synchronous call, অথবা একটি async job, যা একটি অনুরোধকে অনেক locale-এ ছড়িয়ে দেয় এবং ফলাফল এলেই পৌঁছে দেয় |

[আপনার প্রথম localization engine তৈরি করুন →](https://lingo.dev)
