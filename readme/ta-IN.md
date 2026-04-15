<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – உள்ளூர்மயமாக்கல் பொறியியல் தளம்"
    />
  </a>
</p>

<p align="center">
  <strong>
    திறந்த மூல உள்ளூர்மயமாக்கல் பொறியியல் கருவிகள். நிலையான, தரமான
    மொழிபெயர்ப்புகளுக்கு Lingo.dev உள்ளூர்மயமாக்கல் பொறியியல் தளத்துடன்
    இணைக்கவும்.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler for React (ஆரம்ப ஆல்பா)</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="வெளியீடு"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="உரிமம்"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="கடைசி commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 மாத DevTool"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 வார தயாரிப்பு"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 நாள் தயாரிப்பு"
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

## விரைவு தொடக்கம்

| கருவி                                              | இது என்ன செய்கிறது                                         | விரைவு கட்டளை                      |
| -------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React செயலிகளுக்கு AI-உதவி i18n அமைப்பு                    | Prompt: `Set up i18n`              |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO கோப்புகளை உள்ளூர்மயமாக்குதல் | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions-ல் தொடர் உள்ளூர்மயமாக்கல்                   | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n wrappers இல்லாமல் build-time React உள்ளூர்மயமாக்கல்   | `withLingo()` plugin               |

### உள்ளூர்மயமாக்கல் இயந்திரங்கள்

இந்த கருவிகள் [உள்ளூர்மயமாக்கல் இயந்திரங்களுடன்](https://lingo.dev) இணைகின்றன – Lingo.dev உள்ளூர்மயமாக்கல் பொறியியல் தளத்தில் நீங்கள் உருவாக்கும் நிலையான மொழிபெயர்ப்பு APIகள். ஒவ்வொரு இயந்திரமும் சொற்களஞ்சியங்கள், பிராண்ட் குரல் மற்றும் ஒவ்வொரு மொழிக்குமான வழிமுறைகளை ஒவ்வொரு கோரிக்கையிலும் தக்கவைக்கிறது, [சொற்களஞ்சிய பிழைகளை 16.6–44.6% குறைக்கிறது](https://lingo.dev/research/retrieval-augmented-localization). அல்லது [உங்கள் சொந்த LLM-ஐ கொண்டு வாருங்கள்](#lingodev-cli).

---

### Lingo.dev MCP

React செயலிகளில் i18n அமைப்பது பிழை-ஏற்படக்கூடியது – AI குறியீட்டு உதவியாளர்கள் கூட இல்லாத APIகளை கற்பனை செய்து திசைவிகளை உடைக்கின்றன. Lingo.dev MCP ஆனது Next.js, React Router மற்றும் TanStack Start-க்கான கட்டமைப்பு-குறிப்பிட்ட i18n அறிவுக்கான கட்டமைக்கப்பட்ட அணுகலை AI உதவியாளர்களுக்கு வழங்குகிறது. Claude Code, Cursor, GitHub Copilot Agents மற்றும் Codex உடன் இயங்குகிறது.

[ஆவணங்களைப் படிக்கவும் →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

ஒரே கட்டளையில் JSON, YAML, markdown, CSV மற்றும் PO கோப்புகளை உள்ளூர்மயமாக்குங்கள். ஏற்கனவே உள்ளூர்மயமாக்கப்பட்டதை ஒரு lockfile கண்காணிக்கிறது – புதிய அல்லது மாற்றப்பட்ட உள்ளடக்கம் மட்டுமே செயலாக்கப்படுகிறது. Lingo.dev-ல் உள்ள உங்கள் உள்ளூர்மயமாக்கல் இயந்திரத்துக்கு இயல்புநிலையாக உள்ளது, அல்லது உங்கள் சொந்த LLM-ஐ (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama) கொண்டு வாருங்கள்.

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[ஆவணங்களைப் படிக்க →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

உங்கள் பைப்லைனில் தொடர்ச்சியான மொழிமாற்றம். ஒவ்வொரு புஷ்ஷும் மொழிமாற்றத்தைத் தூண்டுகிறது – குறியீடு உற்பத்தியை அடையும் முன் காணாமல் போன சரங்கள் நிரப்பப்படுகின்றன. GitHub Actions, GitLab CI/CD மற்றும் Bitbucket Pipelines ஆகியவற்றை ஆதரிக்கிறது.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[ஆவணங்களைப் படிக்க →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

பேக்எண்ட் குறியீட்டில் இருந்து நேரடியாக உங்கள் மொழிமாற்ற இயந்திரத்தை அழைக்கவும். வெப்ஹூக் விநியோகத்துடன் ஒத்திசைவு மற்றும் async மொழிமாற்றம், ஒவ்வொரு லோகேலுக்கும் தோல்வி தனிமைப்படுத்தல், மற்றும் WebSocket வழியாக நேரடி முன்னேற்றம்.

[ஆவணங்களைப் படிக்க →](https://lingo.dev/en/docs/api)

---

### React க்கான Lingo கம்பைலர் (ஆரம்ப ஆல்ஃபா)

i18n ரேப்பர்கள் இல்லாமல் பில்ட்-டைம் React மொழிமாற்றம். தெளிவான ஆங்கில உரையுடன் கூறுகளை எழுதுங்கள் – கம்பைலர் மொழிபெயர்க்கக்கூடிய சரங்களைக் கண்டறிந்து, பில்ட் நேரத்தில் மொழிமாற்றப்பட்ட மாறுபாடுகளை உருவாக்குகிறது. மொழிபெயர்ப்பு விசைகள் இல்லை, JSON கோப்புகள் இல்லை, `t()` செயல்பாடுகள் இல்லை. Next.js (App Router) மற்றும் Vite + React ஆகியவற்றை ஆதரிக்கிறது.

[ஆவணங்களைப் படிக்க →](https://lingo.dev/en/docs/react/compiler)

---

## பங்களிப்பு

பங்களிப்புகள் வரவேற்கப்படுகின்றன. தயவுசெய்து இந்த வழிகாட்டுதல்களைப் பின்பற்றவும்:

1. **சிக்கல்கள்:** [பிழைகளைப் புகாரளிக்க அல்லது அம்சங்களைக் கோரவும்](https://github.com/lingodotdev/lingo.dev/issues)
2. **புல் ரிக்வெஸ்ட்கள்:** [மாற்றங்களைச் சமர்ப்பிக்கவும்](https://github.com/lingodotdev/lingo.dev/pulls)
   - ஒவ்வொரு PR க்கும் ஒரு சேஞ்ச்செட் தேவை: `pnpm new` (அல்லது வெளியீடு அல்லாத மாற்றங்களுக்கு `pnpm new:empty`)
   - சமர்ப்பிப்பதற்கு முன் சோதனைகள் தேர்ச்சி பெறுவதை உறுதிசெய்யவும்
3. **மேம்பாடு:** இது ஒரு pnpm + turborepo மோனோரெப்போ
   - சார்புகளை நிறுவவும்: `pnpm install`
   - சோதனைகளை இயக்கவும்: `pnpm test`
   - உருவாக்கவும்: `pnpm build`

**ஆதரவு:** [Discord சமூகம்](https://lingo.dev/go/discord)

## நட்சத்திர வரலாறு

Lingo.dev பயனுள்ளதாக இருந்தால், எங்களுக்கு ஒரு நட்சத்திரம் கொடுத்து 10,000 நட்சத்திரங்களை அடைய எங்களுக்கு உதவவும்!

[

![நட்சத்திர வரலாற்று விளக்கப்படம்](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## உள்ளூர்மயமாக்கப்பட்ட ஆவணங்கள்

**கிடைக்கும் மொழிபெயர்ப்புகள்:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**புதிய மொழியைச் சேர்ப்பது:**

1. [BCP-47 வடிவம்](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) பயன்படுத்தி [`i18n.json`](./i18n.json) இல் மொழிக் குறியீட்டைச் சேர்க்கவும்
2. புல் ரிக்வெஸ்ட் சமர்ப்பிக்கவும்