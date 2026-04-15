<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – ප්‍රාදේශීයකරණ ඉංජිනේරු වේදිකාව"
    />
  </a>
</p>

<p align="center">
  <strong>
    විවෘත මූලාශ්‍ර ප්‍රාදේශීයකරණ ඉංජිනේරු මෙවලම්. ස්ථාවර, උසස් තත්ත්වයේ පරිවර්තන
    සඳහා Lingo.dev ප්‍රාදේශීයකරණ ඉංජිනේරු වේදිකාවට සම්බන්ධ වන්න.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler for React (මුල් අල්ෆා)</a>
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

## ඉක්මන් ආරම්භය

| මෙවලම                                              | කරන දේ                                                  | ඉක්මන් විධානය                      |
| -------------------------------------------------- | ------------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React යෙදුම් සඳහා AI-සහායක i18n පිහිටුවීම               | විමසුම: `Set up i18n`              |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO ගොනු ප්‍රාදේශීයකරණය කරන්න | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions හි අඛණ්ඩ ප්‍රාදේශීයකරණය                  | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n wrapper නොමැතිව React ප්‍රාදේශීයකරණය සාදන්න        | `withLingo()` plugin               |

### ප්‍රාදේශීයකරණ එන්ජින්

මෙම මෙවලම් [ප්‍රාදේශීයකරණ එන්ජින්](https://lingo.dev) වෙත සම්බන්ධ වේ – ඔබ Lingo.dev ප්‍රාදේශීයකරණ ඉංජිනේරු වේදිකාවේ නිර්මාණය කරන තත්ත්ව පරිවර්තන API. සෑම එන්ජිමක්ම සෑම ඉල්ලීමක්ම හරහා වචන මාලා, සන්නාම හඬ, සහ ප්‍රාදේශික උපදෙස් පවත්වා ගෙන යන අතර, [පාරිභාෂික දෝෂ 16.6–44.6% අඩු කරයි](https://lingo.dev/research/retrieval-augmented-localization). නැතහොත් [ඔබේම LLM ගෙන එන්න](#lingodev-cli).

---

### Lingo.dev MCP

React යෙදුම් වල i18n පිහිටුවීම දෝෂ සහිතයි – AI කේතන සහායකයන් පවා නොපවතින API මායාවන් සහ මාර්ගගත කිරීම බිඳ දමයි. Lingo.dev MCP Next.js, React Router, සහ TanStack Start සඳහා රාමු-විශේෂිත i18n දැනුමට AI සහායකයන්ට ව්‍යුහගත ප්‍රවේශය ලබා දෙයි. Claude Code, Cursor, GitHub Copilot Agents, සහ Codex සමඟ ක්‍රියා කරයි.

[ලේඛන කියවන්න →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

එක් විධානයකින් JSON, YAML, markdown, CSV, සහ PO ගොනු ප්‍රාදේශීයකරණය කරන්න. දැනටමත් ප්‍රාදේශීයකරණය කර ඇති දේ lockfile එකක් නිරීක්ෂණය කරයි – නව හෝ වෙනස් වූ අන්තර්ගතය පමණක් සැකසේ. Lingo.dev හි ඔබේ ප්‍රාදේශීයකරණ එන්ජිමට පෙරනිමි වේ, නැතහොත් ඔබේම LLM ගෙන එන්න (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[ලේඛන කියවන්න →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

ඔබේ නල මාර්ගයේ අඛණ්ඩ දේශීයකරණය. සෑම push එකකම දේශීයකරණය ක්‍රියාත්මක වේ – අතුරුදහන් වූ පෙළ කේතය නිෂ්පාදනයට ළඟා වීමට පෙර පුරවනු ලැබේ. GitHub Actions, GitLab CI/CD සහ Bitbucket Pipelines සඳහා සහාය දක්වයි.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[ලේඛන කියවන්න →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

backend කේතයෙන් සෘජුවම ඔබේ දේශීයකරණ එන්ජිම අමතන්න. webhook බෙදාහැරීම සමඟ සමමුහුර්ත සහ අසමමුහුර්ත දේශීයකරණය, එක් එක් ප්‍රදේශයට අසමත්වීම් හුදකලා කිරීම සහ WebSocket හරහා තත්‍ය කාලීන ප්‍රගතිය.

[ලේඛන කියවන්න →](https://lingo.dev/en/docs/api)

---

### React සඳහා Lingo Compiler (මුල් alpha)

i18n wrappers නොමැතිව build-කාලීන React දේශීයකරණය. සරල ඉංග්‍රීසි පෙළ සමඟ components ලියන්න – compiler විසින් පරිවර්තනය කළ හැකි පෙළ හඳුනාගෙන build කාලයේදී දේශීයකරණය කළ ප්‍රභේද ජනනය කරයි. පරිවර්තන යතුරු නැත, JSON ගොනු නැත, `t()` ශ්‍රිත නැත. Next.js (App Router) සහ Vite + React සඳහා සහාය දක්වයි.

[ලේඛන කියවන්න →](https://lingo.dev/en/docs/react/compiler)

---

## දායක වීම

දායකත්වය සාදරයෙන් පිළිගනිමු. කරුණාකර මෙම මාර්ගෝපදේශ අනුගමනය කරන්න:

1. **ගැටළු:** [දෝෂ වාර්තා කරන්න හෝ විශේෂාංග ඉල්ලන්න](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [වෙනස්කම් ඉදිරිපත් කරන්න](https://github.com/lingodotdev/lingo.dev/pulls)
   - සෑම PR එකකටම changeset එකක් අවශ්‍යයි: `pnpm new` (හෝ නිකුතු නොවන වෙනස්කම් සඳහා `pnpm new:empty`)
   - ඉදිරිපත් කිරීමට පෙර පරීක්ෂණ සාර්ථක වන බව සහතික කරන්න
3. **සංවර්ධනය:** මෙය pnpm + turborepo monorepo එකකි
   - පරායත්තතා ස්ථාපනය කරන්න: `pnpm install`
   - පරීක්ෂණ ධාවනය කරන්න: `pnpm test`
   - Build කරන්න: `pnpm build`

**සහාය:** [Discord ප්‍රජාව](https://lingo.dev/go/discord)

## තරු ඉතිහාසය

Lingo.dev ප්‍රයෝජනවත් නම්, අපට තරුවක් දී තරු 10,000ක් කරා ළඟා වීමට අපට උදව් කරන්න!

[

![තරු ඉතිහාස සටහන](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## ස්ථානීයකරණය කළ ලේඛන

**පවතින පරිවර්තන:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**නව භාෂාවක් එකතු කිරීම:**

1. [BCP-47 ආකෘතිය](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) භාවිතා කරමින් [`i18n.json`](./i18n.json) හි ස්ථාන කේතය එක් කරන්න
2. Pull request එකක් යොමු කරන්න
