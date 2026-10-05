<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – স্থানীয়করণ ইঞ্জিনিয়ারিং প্ল্যাটফর্ম"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev হল লোকালাইজেশন ইঞ্জিনিয়ারিং প্ল্যাটফর্ম: অনুবাদের গুণমান পরিমাপ
    করার, LLM দিয়ে অনুবাদ করার এবং নেটিভ স্পিকারদের সাথে প্রুফরিড করার সেরা
    উপায়।
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">ডকুমেন্টেশন</a> •
  <a href="https://lingo.dev">প্ল্যাটফর্ম</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt-এ মাসের #1 DevTool"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="লাইসেন্স"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="সর্বশেষ কমিট"
    />
  </a>
</p>

---

## টিমরা Lingo.dev-এ লোকালাইজেশন ইঞ্জিন তৈরি করে

একটি [লোকালাইজেশন ইঞ্জিন](https://lingo.dev/en/docs/platform/engines) হল একটি স্টেটফুল ট্রান্সলেশন API যা আপনার টিম কনফিগার করে এবং Lingo.dev চালায়। প্রতিটি পণ্য, প্রতিটি কন্টেন্ট টাইপ বা প্রতিটি ব্র্যান্ডের জন্য একটি করে তৈরি করুন। একটি ইঞ্জিনের মাধ্যমে প্রতিটি রিকোয়েস্ট আপনার কনফিগার করা সবকিছু প্রয়োগ করে, একটি নির্দিষ্ট অগ্রাধিকারের ক্রমে:

| লেয়ার                                                             | আপনি কী কনফিগার করেন                                               | ডকুমেন্টেশন থেকে                                                        |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| [LLM মডেল](https://lingo.dev/en/docs/platform/llm-models)          | কোন মডেল প্রতিটি ভাষা জোড়া পরিচালনা করে, র‍্যাঙ্কড ফলবাক সহ       | ৪০০+ মডেল; রেসপন্স যে মডেলটি চলেছে তার নাম দেয়                         |
| [ব্র্যান্ড ভয়েস](https://lingo.dev/en/docs/platform/brand-voices) | আপনার পণ্য প্রতিটি ভাষায় কীভাবে কথা বলে, প্রতি লোকেলে একটি টেক্সট | প্রতিটি বাজারে টোন এবং আনুষ্ঠানিকতা                                     |
| [নিয়ম](https://lingo.dev/en/docs/platform/rules)                  | ভাষাগত রীতি যা একটি জেনেরিক মডেল মিস করে                           | স্প্যানিশে বিশেষণের অবস্থান, শতাংশ চিহ্নের আগে একটি স্পেস               |
| [শব্দকোষ](https://lingo.dev/en/docs/platform/glossaries)           | প্রতি লোকেলে সুনির্দিষ্ট শব্দ ম্যাপিং, অর্থ অনুযায়ী মিলানো        | "911" ইউরোপীয় বাজারের জন্য "112" হয়ে যায়; পণ্যের নাম অপরিবর্তিত থাকে |
| [AI রিভিউয়ার](https://lingo.dev/en/docs/platform/ai-reviewers)    | প্রতিটি অনুবাদের পরে চলে এমন স্কোরিং                               | GEMBA স্কোর, BERTScore, শব্দকোষ সম্মতি                                  |

শব্দকোষ, রুলসেট এবং ব্র্যান্ড ভয়েস আপনার সংস্থার অন্তর্গত, এবং একটি ইঞ্জিন সেগুলো সংযুক্তির মাধ্যমে প্রয়োগ করে। একটি শব্দকোষ পাঁচটি ইঞ্জিন পরিচালনা করে এবং একটি সম্পাদনা পাঁচটিতেই পৌঁছায়। লাইভ হওয়ার আগে [Playground](https://lingo.dev/en/docs/platform/playground)-এ একটি পরিবর্তন পরীক্ষা করুন: একটি র মডেলের বিপরীতে একটি ইঞ্জিন তুলনা করুন, অথবা পাশাপাশি দুটি ইঞ্জিন। ইঞ্জিনগুলো প্ল্যাটফর্মে কনফিগার করা হয়, যেখানে লোকালাইজেশন টিম লোকালাইজেশন অবকাঠামো পরিচালনা করে।

## কোড থেকে আপনার ইঞ্জিনগুলিতে পৌঁছান

একটি রিপোজিটরিতে কন্টেন্ট অনুবাদ করুন। `lingo push` ফাইলগুলি `.lingo/config.json`-এ উল্লিখিত ইঞ্জিনে পাঠায়, এবং `lingo pull` যেকোনো মেশিন থেকে অনুবাদ ফিরিয়ে লেখে:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

অথবা সরাসরি একটি ইঞ্জিন কল করুন, ID দিয়ে নামকরণ করে:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | আপনার কোডিং এজেন্ট একটি ইঞ্জিন তৈরি করে, শব্দকোষের শর্তাবলী যোগ করে, নিয়মগুলি সুনির্দিষ্ট করে এবং দুটি ইঞ্জিনের তুলনা করে, যেখানে সমস্যা দেখা দিয়েছে সেই কথোপকথন থেকেই    |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | টার্মিনাল বা CI থেকে সোর্স ফাইল পুশ করুন, অনুবাদ পুল করুন। আঠারোটি ফরম্যাট: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android এবং Xcode স্ট্রিংস, SubRip, PHP      |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | CLI ইনস্টল করুন এবং GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, অথবা Node.js 22+ সহ যেকোনো রানারে একটি ধাপ হিসেবে `lingo push` চালান                                 |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | একবার ইনস্টল করুন এবং ডিফল্ট ব্রাঞ্চে প্রতিটি পুশ একটি অনুবাদ পুল রিকোয়েস্ট খোলে বা আপডেট করে। কোনো রানার নেই, কোনো API কী সিক্রেট নেই, পরিচালনা করার জন্য কোনো লকফাইল নেই |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | প্রতিটি ভাষা জোড়ার জন্য একটি সিঙ্ক্রোনাস কল, অথবা একটি অ্যাসিঙ্ক জব যা একটি অনুরোধকে অনেক লোকেলে ছড়িয়ে দেয় এবং ফলাফল পাওয়ার সাথে সাথে সরবরাহ করে                       |

[আপনার প্রথম লোকালাইজেশন ইঞ্জিন তৈরি করুন →](https://lingo.dev)
