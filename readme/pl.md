<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – platforma inżynierii lokalizacji"
    />
  </a>
</p>

<p align="center">
  <strong>
    Narzędzia inżynierii lokalizacji o otwartym kodzie źródłowym. Połącz się z
    platformą Lingo.dev, aby uzyskać spójne tłumaczenia najwyższej jakości.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">
    Lingo Compiler dla React (Wczesna wersja alfa)
  </a>
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
      alt="Ostatni commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool miesiąca"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 Produkt tygodnia"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Produkt dnia"
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

## Szybki start

| Narzędzie                                          | Do czego służy                                           | Szybkie polecenie                  |
| -------------------------------------------------- | -------------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | Konfiguracja i18n dla aplikacji React z asystą AI        | Prompt: `Set up i18n`              |
| [**Lingo CLI**](#lingodev-cli)                     | Lokalizacja plików JSON, YAML, markdown, CSV, PO         | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | Ciągła lokalizacja w GitHub Actions                      | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler dla React**](#lingodev-compiler) | Lokalizacja React w czasie kompilacji bez wrapperów i18n | `withLingo()` wtyczka              |

### Silniki lokalizacji

Te narzędzia łączą się z [silnikami lokalizacji](https://lingo.dev) – stanowymi API tłumaczeń, które tworzysz na platformie Lingo.dev. Każdy silnik przechowuje glosariusze, ton marki i instrukcje dla poszczególnych lokalizacji w każdym żądaniu, [redukując błędy terminologiczne o 16,6–44,6%](https://lingo.dev/research/retrieval-augmented-localization). Możesz też [użyć własnego LLM](#lingodev-cli).

---

### Lingo.dev MCP

Konfiguracja i18n w aplikacjach React jest podatna na błędy – nawet asystenci AI generują nieistniejące API i psują routing. Lingo.dev MCP zapewnia asystentom AI ustrukturyzowany dostęp do wiedzy o i18n dla Next.js, React Router i TanStack Start. Działa z Claude Code, Cursor, GitHub Copilot Agents i Codex.

[Przeczytaj dokumentację →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Lokalizuj pliki JSON, YAML, markdown, CSV i PO jednym poleceniem. Lockfile śledzi, co zostało już przetłumaczone – przetwarzana jest tylko nowa lub zmieniona treść. Domyślnie łączy się z Twoim silnikiem lokalizacji na Lingo.dev, możesz też użyć własnego LLM (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[Przeczytaj dokumentację →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

Ciągła lokalizacja w Twoim pipeline. Każde wysłanie kodu uruchamia lokalizację – brakujące ciągi są uzupełniane, zanim kod trafi do produkcji. Wspiera GitHub Actions, GitLab CI/CD i Bitbucket Pipelines.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[Przeczytaj dokumentację →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

Wywołuj swój silnik lokalizacyjny bezpośrednio z kodu backendu. Synchroniczna i asynchroniczna lokalizacja z dostarczaniem przez webhook, izolacja błędów dla poszczególnych lokalizacji oraz postęp w czasie rzeczywistym przez WebSocket.

[Przeczytaj dokumentację →](https://lingo.dev/en/docs/api)

---

### Lingo Compiler dla React (Wczesna alpha)

Lokalizacja React w czasie budowania bez wrapperów i18n. Pisz komponenty z czystym angielskim tekstem – kompilator wykrywa ciągi do przetłumaczenia i generuje zlokalizowane warianty podczas budowania. Bez kluczy tłumaczeń, bez plików JSON, bez funkcji `t()`. Wspiera Next.js (App Router) oraz Vite + React.

[Przeczytaj dokumentację →](https://lingo.dev/en/docs/react/compiler)

---

## Wkład w projekt

Wkład w projekt jest mile widziany. Prosimy o przestrzeganie następujących wytycznych:

1. **Zgłoszenia:** [Zgłaszaj błędy lub proponuj funkcje](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requesty:** [Przesyłaj zmiany](https://github.com/lingodotdev/lingo.dev/pulls)
   - Każdy PR wymaga zestawu zmian: `pnpm new` (lub `pnpm new:empty` dla zmian nie objętych wydaniem)
   - Upewnij się, że testy przechodzą przed przesłaniem
3. **Rozwój:** To jest monorepo pnpm + turborepo
   - Zainstaluj zależności: `pnpm install`
   - Uruchom testy: `pnpm test`
   - Zbuduj: `pnpm build`

**Wsparcie:** [Społeczność Discord](https://lingo.dev/go/discord)

## Historia gwiazdek

Jeśli uważasz Lingo.dev za przydatne, daj nam gwiazdkę i pomóż nam osiągnąć 10 000 gwiazdek!

[

![Wykres historii gwiazdek](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Zlokalizowana dokumentacja

**Dostępne tłumaczenia:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Dodawanie nowego języka:**

1. Dodaj kod lokalizacji do [`i18n.json`](./i18n.json) używając [formatu BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Prześlij pull request
