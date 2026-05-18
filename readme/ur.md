<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – لوکلائزیشن انجینئرنگ پلیٹ فارم"
    />
  </a>
</p>

<p align="center">
  <strong>
    اوپن سورس لوکلائزیشن انجینئرنگ ٹولز۔ مستقل، معیاری تراجم کے لیے Lingo.dev
    لوکلائزیشن انجینئرنگ پلیٹ فارم سے منسلک ہوں۔
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler for React (ابتدائی الفا)</a>
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

## فوری آغاز

| ٹول                                                | یہ کیا کرتا ہے                                       | فوری کمانڈ                         |
| -------------------------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React ایپس کے لیے AI کی مدد سے i18n سیٹ اپ           | پرامپٹ: `Set up i18n`              |
| [**Lingo CLI**](#lingodev-cli)                     | JSON، YAML، markdown، CSV، PO فائلوں کو لوکلائز کریں | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions میں مسلسل لوکلائزیشن                  | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n ریپرز کے بغیر بلڈ ٹائم React لوکلائزیشن         | `withLingo()` پلگ ان               |

### لوکلائزیشن انجنز

یہ ٹولز [لوکلائزیشن انجنز](https://lingo.dev) سے منسلک ہوتے ہیں – اسٹیٹ فل ترجمہ APIs جو آپ Lingo.dev لوکلائزیشن انجینئرنگ پلیٹ فارم پر بناتے ہیں۔ ہر انجن ہر درخواست میں لغات، برانڈ وائس، اور فی لوکیل ہدایات کو محفوظ رکھتا ہے، [اصطلاحات کی غلطیوں کو 16.6–44.6% تک کم کرتا ہے](https://lingo.dev/research/retrieval-augmented-localization)۔ یا [اپنا LLM لائیں](#lingodev-cli)۔

---

### Lingo.dev MCP

React ایپس میں i18n سیٹ اپ کرنا غلطیوں کا شکار ہے – یہاں تک کہ AI کوڈنگ اسسٹنٹس بھی غیر موجود APIs کا خیالی تصور کرتے ہیں اور روٹنگ کو توڑ دیتے ہیں۔ Lingo.dev MCP، AI اسسٹنٹس کو Next.js، React Router، اور TanStack Start کے لیے فریم ورک کے مطابق i18n علم تک منظم رسائی فراہم کرتا ہے۔ Claude Code، Cursor، GitHub Copilot Agents، اور Codex کے ساتھ کام کرتا ہے۔

[دستاویزات پڑھیں →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

ایک کمانڈ میں JSON، YAML، markdown، CSV، اور PO فائلوں کو لوکلائز کریں۔ ایک لاک فائل ٹریک کرتی ہے کہ پہلے سے کیا لوکلائز ہو چکا ہے – صرف نئے یا تبدیل شدہ مواد پر کارروائی ہوتی ہے۔ Lingo.dev پر آپ کے لوکلائزیشن انجن کو ڈیفالٹ کرتا ہے، یا اپنا LLM لائیں (OpenAI، Anthropic، Google، Mistral، OpenRouter، Ollama)۔

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[دستاویزات پڑھیں ←](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

آپ کی پائپ لائن میں مسلسل لوکلائزیشن۔ ہر push لوکلائزیشن کو متحرک کرتا ہے – کوڈ کے پروڈکشن تک پہنچنے سے پہلے غائب strings بھر دی جاتی ہیں۔ GitHub Actions، GitLab CI/CD، اور Bitbucket Pipelines کو سپورٹ کرتا ہے۔

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[دستاویزات پڑھیں ←](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

اپنے لوکلائزیشن انجن کو براہ راست backend کوڈ سے کال کریں۔ webhook ڈیلیوری کے ساتھ Synchronous اور async لوکلائزیشن، ہر locale کے لیے failure isolation، اور WebSocket کے ذریعے real-time پیشرفت۔

[دستاویزات پڑھیں ←](https://lingo.dev/en/docs/api)

---

### Lingo Compiler for React (ابتدائی alpha)

i18n wrappers کے بغیر build-time React لوکلائزیشن۔ سادہ انگریزی متن کے ساتھ components لکھیں – compiler قابل ترجمہ strings کو شناخت کرتا ہے اور build time پر localized variants تیار کرتا ہے۔ نہ translation keys، نہ JSON فائلیں، نہ `t()` functions۔ Next.js (App Router) اور Vite + React کو سپورٹ کرتا ہے۔

[دستاویزات پڑھیں ←](https://lingo.dev/en/docs/react/compiler)

---

## تعاون

تعاون کا خیرمقدم ہے۔ براہ کرم ان رہنما خطوط پر عمل کریں:

1. **Issues:** [bugs کی اطلاع دیں یا features کی درخواست کریں](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [تبدیلیاں جمع کروائیں](https://github.com/lingodotdev/lingo.dev/pulls)
   - ہر PR کے لیے changeset ضروری ہے: `pnpm new` (یا non-release تبدیلیوں کے لیے `pnpm new:empty`)
   - جمع کروانے سے پہلے یقینی بنائیں کہ tests پاس ہو رہے ہیں
3. **Development:** یہ pnpm + turborepo monorepo ہے
   - dependencies انسٹال کریں: `pnpm install`
   - tests چلائیں: `pnpm test`
   - Build کریں: `pnpm build`

**سپورٹ:** [Discord کمیونٹی](https://lingo.dev/go/discord)

## Star History

اگر آپ کو Lingo.dev مفید لگے، ہمیں ایک star دیں اور 10,000 stars تک پہنچنے میں ہماری مدد کریں!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## مقامی دستاویزات

**دستیاب ترجمے:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**نئی زبان شامل کرنا:**

1. [`i18n.json`](./i18n.json) میں [BCP-47 فارمیٹ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) استعمال کرتے ہوئے لوکیل کوڈ شامل کریں
2. پل ریکوئسٹ جمع کروائیں
