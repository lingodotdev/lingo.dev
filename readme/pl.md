<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev – Otwarty toolkit i18n do lokalizacji wspieranej przez LLM
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Kompilator</a>
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

| Narzędzie                            | Zastosowanie                                              | Szybka komenda                     |
| ------------------------------------ | --------------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)             | Asystowane przez AI wdrożenie i18n dla aplikacji React    | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)             | Tłumaczenie plików JSON, YAML, markdown, CSV, PO          | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)          | Automatyczny pipeline tłumaczeń w GitHub Actions          | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)             | Tłumaczenie w czasie rzeczywistym dla dynamicznych treści | `npm install lingo.dev`            |
| [**Kompilator**](#lingodev-compiler) | Lokalizacja React na etapie budowania bez wrapperów i18n  | `withLingo()` plugin               |

---

### Lingo.dev MCP

Konfigurowanie i18n w aplikacjach React jest notorycznie podatne na błędy – nawet dla doświadczonych developerów. Asystenci AI tylko pogarszają sprawę: "halucynują" nieistniejące API, pomijają konfiguracje middleware, psują routing lub wdrażają połowiczne rozwiązania, po czym gubią kontekst. Problem polega na tym, że wdrożenie i18n wymaga precyzyjnej sekwencji skoordynowanych zmian w wielu plikach (routing, middleware, komponenty, konfiguracja), a LLM-y mają trudność z utrzymaniem takiego kontekstu.

Lingo.dev MCP rozwiązuje ten problem, zapewniając asystentom AI ustrukturyzowany dostęp do wiedzy o i18n specyficznej dla frameworków. Zamiast zgadywać, Twój asystent podąża za zweryfikowanymi wzorcami implementacji dla Next.js, React Router i TanStack Start.

**Obsługiwane IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**Obsługiwane frameworki:**

- Next.js (App Router i Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**Użycie:**

Po skonfigurowaniu serwera MCP w swoim IDE ([zobacz przewodniki szybkiego startu](https://lingo.dev/en/mcp)), poproś asystenta:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

Asystent wykona następujące kroki:

1. Skonfiguruje routing oparty na lokalizacji (np. `/en`, `/es`, `/pt-BR`)
2. Skonfiguruje komponenty do przełączania języka
3. Wdroży automatyczne wykrywanie lokalizacji
4. Wygeneruje niezbędne pliki konfiguracyjne

**Uwaga:** Generowanie kodu przez AI jest niedeterministyczne. Przejrzyj wygenerowany kod przed zatwierdzeniem.

[Przeczytaj dokumentację →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Utrzymywanie tłumaczeń w synchronizacji jest żmudne. Dodajesz nowy string, zapominasz go przetłumaczyć, a do użytkowników międzynarodowych trafia uszkodzony interfejs. Albo wysyłasz pliki JSON tłumaczom, czekasz kilka dni, a potem ręcznie scalasz ich pracę. Skalowanie do 10+ języków oznacza zarządzanie setkami plików, które stale się rozjeżdżają.

Lingo.dev CLI automatyzuje ten proces. Wskaż pliki tłumaczeń, uruchom jedno polecenie i każda lokalizacja zostanie zaktualizowana. Plik lockfile śledzi, co już zostało przetłumaczone, więc płacisz tylko za nowe lub zmienione treści. Obsługuje pliki JSON, YAML, CSV, PO oraz markdown.

**Konfiguracja:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**Jak to działa:**

1. Ekstrahuje treści do tłumaczenia z skonfigurowanych plików
2. Wysyła treści do dostawcy LLM w celu tłumaczenia
3. Zapisuje przetłumaczone treści z powrotem do systemu plików
4. Tworzy plik `i18n.lock` do śledzenia ukończonych tłumaczeń (eliminuje zbędne przetwarzanie)

**Konfiguracja:**

Polecenie `init` generuje plik `i18n.json`. Skonfiguruj lokalizacje i buckety:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
```

Pole `provider` jest opcjonalne (domyślnie Lingo.dev Engine). Dla niestandardowych dostawców LLM:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**Obsługiwani dostawcy LLM:**

- Lingo.dev Engine (zalecane)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[Przeczytaj dokumentację →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

Tłumaczenia to funkcja, która zawsze jest "prawie gotowa". Inżynierowie scalają kod bez aktualizacji lokalizacji. QA wykrywa brakujące tłumaczenia na etapie stagingu – albo, co gorsza, użytkownicy zauważają je w produkcji. Główna przyczyna: tłumaczenie to ręczny krok, który łatwo pominąć pod presją czasu.

Lingo.dev CI/CD automatyzuje tłumaczenia. Każdy push uruchamia proces tłumaczenia. Brakujące ciągi są uzupełniane zanim kod trafi na produkcję. Nie wymaga dyscypliny – pipeline zajmuje się tym automatycznie.

**Obsługiwane platformy:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**Konfiguracja GitHub Actions:**

Utwórz plik `.github/workflows/translate.yml`:

```yaml
name: Translate
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lingo.dev
        uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**Wymagania wstępne:**

1. Dodaj `LINGODOTDEV_API_KEY` do sekcji secrets repozytorium (Ustawienia > Secrets and variables > Actions)
2. Dla workflow PR: Włącz "Zezwól GitHub Actions na tworzenie i zatwierdzanie pull requestów" w Ustawienia > Actions > General

**Opcje workflow:**

Zatwierdzaj tłumaczenia bezpośrednio:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Twórz pull requesty z tłumaczeniami:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Dostępne wejścia:**

| Wejście              | Domyślna wartość                               | Opis                                          |
| -------------------- | ---------------------------------------------- | --------------------------------------------- |
| `api-key`            | (wymagane)                                     | Klucz API Lingo.dev                           |
| `pull-request`       | `false`                                        | Tworzy PR zamiast bezpośredniego commitowania |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Niestandardowa wiadomość commita              |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Niestandardowy tytuł PR                       |
| `working-directory`  | `"."`                                          | Katalog, w którym uruchomić                   |
| `parallel`           | `false`                                        | Włącz przetwarzanie równoległe                |

[Przeczytaj dokumentację →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

Statyczne pliki tłumaczeń sprawdzają się dla etykiet UI, ale co z treściami generowanymi przez użytkowników? Wiadomości na czacie, opisy produktów, zgłoszenia do supportu – treści, które nie istnieją w momencie budowania aplikacji, nie mogą być przetłumaczone z wyprzedzeniem. Pozostaje wyświetlanie nieprzetłumaczonego tekstu lub budowa własnego pipeline'u tłumaczeń.

Lingo.dev SDK tłumaczy treści w czasie rzeczywistym. Przekaż dowolny tekst, obiekt lub HTML i otrzymaj zlokalizowaną wersję. Działa dla czatów na żywo, dynamicznych powiadomień czy dowolnych treści pojawiających się po wdrożeniu. Dostępny dla JavaScript, PHP, Pythona i Ruby.

**Instalacja:**

```bash
npm install lingo.dev
```

**Użycie:**

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate objects (preserves structure)
const translated = await lingoDotDev.localizeObject(
  { greeting: "Hello", farewell: "Goodbye" },
  { sourceLocale: "en", targetLocale: "es" },
);
// { greeting: "Hola", farewell: "Adiós" }

// Translate text
const text = await lingoDotDev.localizeText("Hello!", {
  sourceLocale: "en",
  targetLocale: "fr",
});

// Translate to multiple languages at once
const results = await lingoDotDev.batchLocalizeText("Hello!", {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
});

// Translate chat (preserves speaker names)
const chat = await lingoDotDev.localizeChat(
  [{ name: "Alice", text: "Hello!" }],
  { sourceLocale: "en", targetLocale: "es" },
);

// Translate HTML (preserves markup)
const html = await lingoDotDev.localizeHtml("<h1>Welcome</h1>", {
  sourceLocale: "en",
  targetLocale: "de",
});

// Detect language
const locale = await lingoDotDev.recognizeLocale("Bonjour le monde");
// "fr"
```

**Dostępne SDK:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) – aplikacje webowe, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) – PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) – Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) – Rails

[Przeczytaj dokumentację →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

Tradycyjne i18n jest inwazyjne. Każdy string opakowujesz w funkcje `t()`, wymyślasz klucze tłumaczeń (`home.hero.title.v2`), utrzymujesz równoległe pliki JSON i obserwujesz, jak komponenty puchną od boilerplate'u lokalizacyjnego. To tak żmudne, że zespoły odwlekają internacjonalizację, aż staje się to ogromnym refaktoringiem.

Kompilator Lingo.dev eliminuje zbędną złożoność. Pisz komponenty React z tekstem w prostym angielskim. Kompilator wykrywa teksty do tłumaczenia podczas budowania i automatycznie generuje ich zlokalizowane warianty. Bez kluczy, plików JSON, funkcji wrapperów – po prostu kod React, który działa w wielu językach.

**Instalacja:**

```bash
pnpm install @lingo.dev/compiler
```

**Uwierzytelnianie:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**Konfiguracja (Next.js):**

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    models: "lingo.dev",
    dev: { usePseudotranslator: true },
  });
}
```

**Konfiguracja (Vite):**

```ts
// vite.config.ts
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      models: "lingo.dev",
      dev: { usePseudotranslator: true },
    }),
    react(),
  ],
});
```

**Konfiguracja providera:**

```tsx
// app/layout.tsx (Next.js)
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }) {
  return (
    <LingoProvider>
      <html>
        <body>{children}</body>
      </html>
    </LingoProvider>
  );
}
```

**Przełącznik języka:**

```tsx
import { useLocale, setLocale } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**Development:** `npm run dev` (używa pseudotranslatora, bez wywołań API)

**Production:** Ustaw `usePseudotranslator: false`, następnie `next build`

Dodaj katalog `.lingo/` do kontroli wersji.

**Kluczowe funkcje:**

- Brak kosztów wydajności w runtime
- Bez kluczy tłumaczeń i plików JSON
- Bez funkcji `t()` ani wrapperów `<T>`
- Automatyczne wykrywanie tekstów do tłumaczenia w JSX
- Wsparcie dla TypeScript
- ICU MessageFormat dla liczby mnogiej
- Ręczne nadpisywanie przez atrybut `data-lingo-override`
- Wbudowany edytor tłumaczeń

**Tryby budowania:**

- `pseudotranslator`: Tryb deweloperski z tłumaczeniami zastępczymi (bez kosztów API)
- `real`: Generowanie rzeczywistych tłumaczeń przy użyciu LLM
- `cache-only`: Tryb produkcyjny z użyciem wygenerowanych tłumaczeń z CI (bez wywołań API)

**Obsługiwane frameworki:**

- Next.js (App Router z React Server Components)
- Vite + React (SPA i SSR)

Planowane wsparcie dla kolejnych frameworków.

[Przeczytaj dokumentację →](https://lingo.dev/en/compiler)

---

## Współtworzenie

Zapraszamy do współpracy. Prosimy o przestrzeganie poniższych wytycznych:

1. **Zgłoszenia:** [Zgłaszaj błędy lub prośby o funkcje](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requesty:** [Przesyłaj zmiany](https://github.com/lingodotdev/lingo.dev/pulls)
   - Każdy PR wymaga changesetu: `pnpm new` (lub `pnpm new:empty` dla zmian niewydaniowych)
   - Przed wysłaniem upewnij się, że testy przechodzą poprawnie
3. **Development:** To monorepo pnpm + turborepo
   - Instalacja zależności: `pnpm install`
   - Uruchamianie testów: `pnpm test`
   - Budowanie: `pnpm build`

**Wsparcie:** [Społeczność Discord](https://lingo.dev/go/discord)

## Historia gwiazdek

Jeśli Lingo.dev jest dla Ciebie przydatne, daj nam gwiazdkę i pomóż osiągnąć 10 000 gwiazdek!

[

![Wykres historii gwiazdek](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Zlokalizowana dokumentacja

**Dostępne tłumaczenia:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Dodawanie nowego języka:**

1. Dodaj kod języka do [`i18n.json`](./i18n.json) używając [formatu BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Prześlij pull request

**Format lokalizacji BCP-47:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (małe litery): `en`, `zh`, `bho`
- `Script`: ISO 15924 (wielka litera na początku): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (wielkie litery): `US`, `CN`, `IN`
- Przykłady: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
