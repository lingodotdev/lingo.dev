<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – লোকালাইজেশন ইঞ্জিনিয়ারিং প্ল্যাটফর্ম" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev হলো লোকালাইজেশন ইঞ্জিনিয়ারিং প্ল্যাটফর্ম: অনুবাদের মান মাপা, LLMs দিয়ে অনুবাদ করা, আর নেটিভ ভাষাভাষীদের দিয়ে প্রুফরিড করানোর সেরা উপায়।</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">ডকস</a> •
  <a href="https://lingo.dev">প্ল্যাটফর্ম</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt-এর মাসের #1 DevTool" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="লাইসেন্স" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="সর্বশেষ কমিট" /></a>
</p>

---

## টিমগুলো Lingo.dev-এ লোকালাইজেশন ইঞ্জিন তৈরি করে

একটি [লোকালাইজেশন ইঞ্জিন](https://lingo.dev/en/docs/platform/engines) হলো একটি স্টেটফুল অনুবাদ API, যা আপনার টিম কনফিগার করে আর Lingo.dev চালায়। প্রতিটি প্রোডাক্ট, প্রতিটি কনটেন্ট টাইপ, বা প্রতিটি ব্র্যান্ডের জন্য আলাদা ইঞ্জিন বানান। একটি ইঞ্জিন দিয়ে যাওয়া প্রতিটি অনুরোধে আপনি সেখানে যা কনফিগার করেছেন, তা নির্দিষ্ট অগ্রাধিকার ক্রমে প্রয়োগ হয়:

| স্তর | আপনি কী কনফিগার করেন | ডকস থেকে |
| --- | --- | --- |
| [LLM মডেল](https://lingo.dev/en/docs/platform/llm-models) | র‌্যাঙ্ক করা বিকল্পসহ কোন ভাষা-যুগলে কোন মডেল কাজ করবে | ৪০০+ মডেল; কোন মডেল চালানো হয়েছে, তা রেসপন্সে দেখা যায় |
| [ব্র্যান্ডের ভাষাভঙ্গি](https://lingo.dev/en/docs/platform/brand-voices) | প্রতিটি ভাষায় আপনার প্রোডাক্ট কীভাবে কথা বলে, প্রতিটি লোকেলের জন্য আলাদা লেখা | প্রতিটি বাজার অনুযায়ী টোন ও আনুষ্ঠানিকতার মাত্রা |
| [নিয়ম](https://lingo.dev/en/docs/platform/rules) | ভাষার সেই রীতিনীতিগুলো, যা সাধারণ মডেল প্রায়ই ধরতে পারে না | স্প্যানিশে বিশেষণের অবস্থান, শতাংশ চিহ্নের আগে একটি স্পেস |
| [শব্দকোষ](https://lingo.dev/en/docs/platform/glossaries) | অর্থ মিলিয়ে, প্রতিটি লোকেলের জন্য নির্ভুল পরিভাষা মানচিত্র | ইউরোপীয় বাজারে "911" হয়ে যায় "112"; প্রোডাক্টের নাম অপরিবর্তিত থাকে |
| [AI রিভিউয়ার](https://lingo.dev/en/docs/platform/ai-reviewers) | প্রতিটি অনুবাদের পর চলা স্কোরিং | GEMBA স্কোর, BERTScore, শব্দকোষ মেনে চলা |

শব্দকোষ, নিয়মসেট আর ব্র্যান্ডের ভাষাভঙ্গি আপনার প্রতিষ্ঠানের সম্পদ, আর একটি ইঞ্জিন সংযুক্তির মাধ্যমে সেগুলো প্রয়োগ করে। একটি শব্দকোষ পাঁচটি ইঞ্জিন নিয়ন্ত্রণ করতে পারে, আর একবার সম্পাদনা করলেই তা পাঁচটিতেই পৌঁছে যায়। কোনো পরিবর্তন লাইভ হওয়ার আগে [Playground](https://lingo.dev/en/docs/platform/playground)-এ পরীক্ষা করে নিন: একটি ইঞ্জিনকে কাঁচা মডেলের সঙ্গে, বা দুটি ইঞ্জিনকে পাশাপাশি তুলনা করুন। ইঞ্জিনগুলো প্ল্যাটফর্মেই কনফিগার করা হয়, যেখানে লোকালাইজেশন টিম পুরো লোকালাইজেশন অবকাঠামো চালায়।

## কোড থেকেই আপনার ইঞ্জিনে পৌঁছান

একটি রিপোজিটরির কনটেন্ট অনুবাদ করুন। `lingo push` `.lingo/config.json`-এ নাম দেওয়া ইঞ্জিনে ফাইল পাঠায়, আর `lingo pull` যেকোনো মেশিন থেকে অনুবাদগুলো আবার লিখে আনে:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

অথবা, ID উল্লেখ করে সরাসরি একটি ইঞ্জিন কল করুন:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | আপনার কোডিং এজেন্ট একটি ইঞ্জিন তৈরি করে, শব্দকোষে পরিভাষা যোগ করে, নিয়ম ঠিক করে, আর যে কথোপকথনে সমস্যাটি ধরা পড়েছে সেখান থেকেই দুটি ইঞ্জিন তুলনা করে |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | টার্মিনাল থেকে বা CI থেকে সোর্স ফাইল push করুন, অনুবাদ pull করুন। আঠারোটি ফরম্যাট: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android এবং Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI ইনস্টল করুন এবং GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, বা Node.js 22+ থাকা যেকোনো রানারে একটি ধাপ হিসেবে `lingo push` চালান |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | একবার ইনস্টল করলেই, ডিফল্ট ব্রাঞ্চে প্রতিটি push একটি অনুবাদের pull request খুলে দেয় বা আপডেট করে, অথবা সোর্স বদলানো pull request-এই অনুবাদগুলো একটি commit হিসেবে যোগ হয়। কোনো রানার নয়, কোনো API key secret নয়, ব্যবস্থাপনার জন্য কোনো Lockfile নয় |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | প্রতিটি ভাষা-যুগলের জন্য একটি synchronous কল, অথবা একটি async কাজ যা একটি অনুরোধকে অনেক লোকেলে ছড়িয়ে দেয় এবং ফলাফল আসামাত্র পৌঁছে দেয় |

[আপনার প্রথম লোকালাইজেশন ইঞ্জিন তৈরি করুন →](https://lingo.dev)
