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

Serwer Model Context Protocol, który umożliwia asystentom AI konfigurowanie infrastruktury i18n w aplikacjach React za pomocą promptów w języku naturalnym.

**Wspierane IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**Wspierane frameworki:**

- Next.js (App Router i Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**Użycie:**

Po skonfigurowaniu serwera MCP w swoim IDE ([zobacz przewodniki szybkiego startu](https://lingo.dev/en/mcp)), poproś asystenta:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

Asystent wykona następujące czynności:

1. Skonfiguruje routing oparty na lokalizacji (np. `/en`, `/es`, `/pt-BR`)
2. Utworzy komponenty do przełączania języka
3. Zaimplementuje automatyczne wykrywanie lokalizacji
4. Wygeneruje niezbędne pliki konfiguracyjne

**Uwaga:** Generowanie kodu wspomagane przez AI jest niedeterministyczne. Przejrzyj wygenerowany kod przed zatwierdzeniem.

[Przeczytaj dokumentację →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Open-source CLI do tłumaczenia aplikacji i treści z wykorzystaniem AI. Obsługuje wszystkie standardowe formaty branżowe, w tym JSON, YAML, CSV, pliki PO oraz markdown.

**Konfiguracja:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**Jak to działa:**

1. Ekstrahuje treści do tłumaczenia z wybranych plików
2. Wysyła treści do dostawcy LLM w celu tłumaczenia
3. Zapisuje przetłumaczone treści z powrotem do systemu plików
4. Tworzy plik `i18n.lock` do śledzenia ukończonych tłumaczeń (zapobiega ponownemu przetwarzaniu)

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

Zautomatyzowane procesy tłumaczenia dla pipeline'ów CI/CD. Zapobiega przedostawaniu się nieukończonych tłumaczeń do produkcji.

**Obsługiwane platformy:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**Konfiguracja GitHub Actions:**

Utwórz `.github/workflows/translate.yml`:

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

**Wymagania dotyczące konfiguracji:**

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

**Dostępne parametry wejściowe:**

| Parametr             | Domyślna wartość                               | Opis                                         |
| -------------------- | ---------------------------------------------- | -------------------------------------------- |
| `api-key`            | (wymagane)                                     | Klucz API Lingo.dev                          |
| `pull-request`       | `false`                                        | Twórz PR zamiast bezpośredniego commitowania |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Niestandardowa wiadomość commita             |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Niestandardowy tytuł PR                      |
| `working-directory`  | `"."`                                          | Katalog do uruchomienia                      |
| `parallel`           | `false`                                        | Włącz przetwarzanie równoległe               |

[Przeczytaj dokumentację →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

Biblioteka tłumaczeń runtime do dynamicznych treści. Dostępna dla JavaScript, PHP, Pythona i Ruby.

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

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - aplikacje webowe, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[Przeczytaj dokumentację →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

System tłumaczeń na etapie budowania, który umożliwia wielojęzyczność aplikacji React bez modyfikowania komponentów. Działa podczas budowania, a nie w czasie wykonywania.

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

**Development:** `npm run dev` (używa pseudotranslatora, brak wywołań API)

**Production:** Ustaw `usePseudotranslator: false`, następnie `next build`

Dodaj katalog `.lingo/` do kontroli wersji.

**Kluczowe funkcje:**

- Brak kosztów wydajnościowych w czasie wykonywania
- Brak kluczy tłumaczeń ani plików JSON
- Brak funkcji `t()` ani komponentów wrapper `<T>`
- Automatyczne wykrywanie tekstów do tłumaczenia w JSX
- Wsparcie dla TypeScript
- ICU MessageFormat dla liczby mnogiej
- Ręczne nadpisywanie przez atrybut `data-lingo-override`
- Wbudowany edytor tłumaczeń

**Tryby budowania:**

- `pseudotranslator`: Tryb deweloperski z tłumaczeniami zastępczymi (brak kosztów API)
- `real`: Generowanie rzeczywistych tłumaczeń przy użyciu LLM
- `cache-only`: Tryb produkcyjny z użyciem wygenerowanych tłumaczeń z CI (brak wywołań API)

**Obsługiwane frameworki:**

- Next.js (App Router z React Server Components)
- Vite + React (SPA i SSR)

Planowane jest wsparcie dla kolejnych frameworków.

[Przeczytaj dokumentację →](https://lingo.dev/en/compiler)

---

## Współtworzenie

Zapraszamy do współpracy. Prosimy o przestrzeganie poniższych wytycznych:

1. **Zgłoszenia:** [Zgłaszaj błędy lub prośby o nowe funkcje](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requesty:** [Przesyłaj zmiany](https://github.com/lingodotdev/lingo.dev/pulls)
   - Każdy PR wymaga changeset: `pnpm new` (lub `pnpm new:empty` dla zmian niewydaniowych)
   - Przed wysłaniem upewnij się, że testy przechodzą poprawnie
3. **Development:** To monorepo pnpm + turborepo
   - Instalacja zależności: `pnpm install`
   - Uruchamianie testów: `pnpm test`
   - Budowanie: `pnpm build`

**Wsparcie:** [Społeczność na Discordzie](https://lingo.dev/go/discord)

## Historia gwiazdek

Jeśli Lingo.dev jest dla Ciebie przydatne, daj nam gwiazdkę i pomóż osiągnąć 10 000 gwiazdek!

[

![Wykres historii gwiazdek](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Zlokalizowana dokumentacja

**Dostępne tłumaczenia:**

[Angielski](https://github.com/lingodotdev/lingo.dev) • [Chiński](/readme/zh-Hans.md) • [Japoński](/readme/ja.md) • [Koreański](/readme/ko.md) • [Hiszpański](/readme/es.md) • [Francuski](/readme/fr.md) • [Rosyjski](/readme/ru.md) • [Ukraiński](/readme/uk-UA.md) • [Niemiecki](/readme/de.md) • [Włoski](/readme/it.md) • [Arabski](/readme/ar.md) • [Hebrajski](/readme/he.md) • [Hindi](/readme/hi.md) • [Portugalski (Brazylia)](/readme/pt-BR.md) • [Bengalski](/readme/bn.md) • [Perski](/readme/fa.md) • [Polski](/readme/pl.md) • [Turecki](/readme/tr.md) • [Urdu](/readme/ur.md) • [Bhojpuri](/readme/bho.md) • [Asamski](/readme/as-IN.md) • [Gudżarati](/readme/gu-IN.md) • [Marathi](/readme/mr-IN.md) • [Orija](/readme/or-IN.md) • [Pendżabski](/readme/pa-IN.md) • [Syngaleski](/readme/si-LK.md) • [Tamilski](/readme/ta-IN.md) • [Telugu](/readme/te-IN.md)

**Dodawanie nowego języka:**

1. Dodaj kod języka do [`i18n.json`](./i18n.json) używając [formatu BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Wyślij pull request

**Format lokalizacji BCP-47:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (małe litery): `en`, `zh`, `bho`
- `Script`: ISO 15924 (wielka litera na początku): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (wielkie litery): `US`, `CN`, `IN`
- Przykłady: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
