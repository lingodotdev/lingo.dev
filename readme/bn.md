<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ ওয়েব ও মোবাইল লোকালাইজেশনের জন্য AI-চালিত ওপেন-সোর্স CLI।</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">ডকুমেন্টেশন</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">অবদান রাখুন</a> •
  <a href="#-github-action">GitHub অ্যাকশন</a> •
  <a href="#">রিপোজিটরিতে স্টার দিন</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="রিলিজ" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="লাইসেন্স" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="সর্বশেষ কমিট" />
  </a>
</p>

<br />

Lingo.dev হল একটি কমিউনিটি-চালিত, ওপেন-সোর্স CLI যা AI-চালিত ওয়েব এবং মোবাইল অ্যাপ লোকালাইজেশনের জন্য ডিজাইন করা হয়েছে।

Lingo.dev প্রকৃত অনুবাদ তাৎক্ষণিকভাবে তৈরি করতে ডিজাইন করা হয়েছে, যা ম্যানুয়াল কাজ এবং ম্যানেজমেন্ট ওভারহেড দূর করে। ফলস্বরূপ, টিমগুলি 100 গুণ দ্রুত সঠিক লোকালাইজেশন করতে পারে, বিশ্বব্যাপী আরও বেশি সন্তুষ্ট ব্যবহারকারীদের কাছে ফিচার পৌঁছে দিতে পারে। এটি আপনার নিজের LLM-এর সাথে বা Lingo.dev-পরিচালিত লোকালাইজেশন ইঞ্জিনের সাথে ব্যবহার করা যেতে পারে।

> **কম জানা তথ্য:** Lingo.dev 2023 সালে একটি ছাত্র হ্যাকাথনে একটি ছোট প্রজেক্ট হিসেবে শুরু হয়েছিল! অনেক পরিবর্তনের পর, আমরা 2024 সালে Y Combinator-এ গৃহীত হয়েছি, এবং আমরা এখন নিয়োগ করছি! পরবর্তী প্রজন্মের লোকালাইজেশন টুল তৈরি করতে আগ্রহী? আপনার CV careers@lingo.dev-এ পাঠান! 🚀

## 📑 এই গাইডে

- [কুইকস্টার্ট](#-quickstart) - মিনিটের মধ্যে শুরু করুন
- [ক্যাশিং](#-caching-with-i18nlock) - অনুবাদ আপডেট অপ্টিমাইজ করুন
- [GitHub অ্যাকশন](#-github-action) - CI/CD-তে লোকালাইজেশন অটোমেট করুন
- [ফিচারসমূহ](#-supercharged-features) - কি Lingo.dev-কে শক্তিশালী করে
- [ডকুমেন্টেশন](#-documentation) - বিস্তারিত গাইড এবং রেফারেন্স
- [অবদান রাখুন](#-contribute) - আমাদের কমিউনিটিতে যোগ দিন

## 💫 কুইকস্টার্ট

Lingo.dev CLI আপনার নিজের LLM এবং সর্বাধুনিক SOTA (state-of-the-art) LLM-এর উপর নির্মিত Lingo.dev-পরিচালিত লোকালাইজেশন ইঞ্জিন উভয়ের সাথে কাজ করার জন্য ডিজাইন করা হয়েছে।

### আপনার নিজের LLM ব্যবহার করা (BYOK বা Bring Your Own Key)

1. একটি `i18n.json` কনফিগারেশন ফাইল তৈরি করুন:

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "You're translating text from {source} to {target}."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. আপনার API কী পরিবেশ ভেরিয়েবল হিসেবে সেট করুন:

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# অথবা OpenAI এর জন্য

export OPENAI_API_KEY=your_openai_api_key
```

3. লোকালাইজেশন চালান:

```bash
npx lingo.dev@latest i18n
```

### Lingo.dev ক্লাউড ব্যবহার করা

প্রায়শই, প্রোডাকশন-গ্রেড অ্যাপগুলির জন্য অনুবাদ মেমরি, শব্দকোষ সমর্থন এবং লোকালাইজেশন কোয়ালিটি অ্যাসুরেন্সের মতো বৈশিষ্ট্য প্রয়োজন হয়। এছাড়াও, কখনও কখনও, আপনি চান একজন বিশেষজ্ঞ আপনার জন্য সিদ্ধান্ত নিক কোন LLM প্রোভাইডার এবং মডেল ব্যবহার করবেন, এবং নতুন মডেল প্রকাশিত হলে স্বয়ংক্রিয়ভাবে আপডেট করবেন। Lingo.dev একটি ম্যানেজড লোকালাইজেশন ইঞ্জিন যা এই বৈশিষ্ট্যগুলি প্রদান করে:

1. একটি `i18n.json` কনফিগারেশন ফাইল তৈরি করুন (প্রোভাইডার নোড ছাড়া):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Lingo.dev এর সাথে অথেনটিকেট করুন:

```bash
npx lingo.dev@latest auth --login
```

3. লোকালাইজেশন চালান:

```bash
npx lingo.dev@latest i18n
```

## 📖 ডকুমেন্টেশন

বিস্তারিত গাইড এবং API রেফারেন্সের জন্য, [ডকুমেন্টেশন](https://lingo.dev/go/docs) দেখুন।

## 🔒 `i18n.lock` দিয়ে ক্যাশিং

Lingo.dev কনটেন্ট চেকসাম ট্র্যাক করতে একটি `i18n.lock` ফাইল ব্যবহার করে, যা নিশ্চিত করে যে শুধুমাত্র পরিবর্তিত টেক্সট অনুবাদ হয়। এটি উন্নত করে:

- ⚡️ **গতি**: ইতিমধ্যে অনুবাদিত কনটেন্ট এড়িয়ে যান
- 🔄 **সামঞ্জস্যতা**: অপ্রয়োজনীয় পুনরায় অনুবাদ প্রতিরোধ করুন
- 💰 **খরচ**: পুনরাবৃত্ত অনুবাদের জন্য কোন বিলিং নেই

## 🤖 GitHub অ্যাকশন

Lingo.dev আপনার CI/CD পাইপলাইনে লোকালাইজেশন স্বয়ংক্রিয় করার জন্য একটি GitHub অ্যাকশন অফার করে। এখানে একটি বেসিক সেটআপ দেওয়া হল:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

এই অ্যাকশন প্রতিটি পুশে `lingo.dev i18n` চালায়, স্বয়ংক্রিয়ভাবে আপনার অনুবাদগুলি আপ-টু-ডেট রাখে।

পুল রিকোয়েস্ট মোড এবং অন্যান্য কনফিগারেশন অপশনের জন্য, আমাদের [GitHub অ্যাকশন ডকুমেন্টেশন](https://docs.lingo.dev/ci-action/gha) দেখুন।

## ⚡️ Lingo.dev-এর সুপারপাওয়ার

- 🔥 **তাৎক্ষণিক ইন্টিগ্রেশন**: আপনার কোডবেসের সাথে মিনিটের মধ্যে কাজ করে
- 🔄 **CI/CD অটোমেশন**: সেট করুন এবং ভুলে যান
- 🌍 **গ্লোবাল রিচ**: সর্বত্র ব্যবহারকারীদের কাছে পৌঁছান
- 🧠 **AI-পাওয়ার্ড**: স্বাভাবিক অনুবাদের জন্য সর্বাধুনিক ল্যাঙ্গুয়েজ মডেল ব্যবহার করে
- 📊 **ফরম্যাট-অ্যাগনস্টিক**: JSON, YAML, CSV, Markdown, Android, iOS, এবং আরও অনেক কিছু
- 🔍 **ক্লিন ডিফস**: আপনার ফাইল স্ট্রাকচার হুবহু সংরক্ষণ করে
- ⚡️ **বিদ্যুৎ গতিতে**: দিনের পরিবর্তে সেকেন্ডের মধ্যে অনুবাদ
- 🔄 **সর্বদা সিঙ্ক**: কন্টেন্ট পরিবর্তন হলে স্বয়ংক্রিয়ভাবে আপডেট হয়
- 🌟 **মানুষের গুণমান**: অনুবাদ যা রোবটিক শোনায় না
- 👨‍💻 **ডেভেলপারদের দ্বারা, ডেভেলপারদের জন্য তৈরি**: আমরা নিজেরাই প্রতিদিন এটি ব্যবহার করি
- 📈 **আপনার সাথে বৃদ্ধি পায়**: সাইড প্রজেক্ট থেকে এন্টারপ্রাইজ স্কেল পর্যন্ত

## 🤝 অবদান রাখুন

Lingo.dev কমিউনিটি-চালিত, তাই আমরা সব অবদানকে স্বাগত জানাই!

নতুন ফিচারের জন্য আইডিয়া আছে? একটি GitHub ইস্যু তৈরি করুন!

অবদান রাখতে চান? একটি পুল রিকোয়েস্ট তৈরি করুন!

## 🌐 অন্যান্য ভাষায় রিডমি

- [ইংরেজি](https://github.com/lingodotdev/lingo.dev)
- [চীনা](/readme/zh-Hans.md)
- [জাপানি](/readme/ja.md)
- [কোরিয়ান](/readme/ko.md)
- [স্প্যানিশ](/readme/es.md)
- [ফরাসি](/readme/fr.md)
- [রাশিয়ান](/readme/ru.md)
- [জার্মান](/readme/de.md)
- [ইতালিয়ান](/readme/it.md)
- [আরবি](/readme/ar.md)
- [হিন্দি](/readme/hi.md)
- [বাংলা](/readme/bn.md)

আপনার ভাষা দেখতে পাচ্ছেন না? শুধু [`i18n.json`](./i18n.json) ফাইলে একটি নতুন ভাষা কোড যোগ করুন এবং একটি PR খুলুন!
