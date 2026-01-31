<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    ⚡ Lingo.dev – otwartoźródłowy, wspierany przez AI zestaw narzędzi i18n do
    natychmiastowej lokalizacji z wykorzystaniem LLM.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/mcp">Lingo.dev MCP</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="Wydanie"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="Licencja"
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

## Poznaj Compiler 🆕

**Lingo.dev Compiler** to darmowe, otwartoźródłowe oprogramowanie pośredniczące (middleware), zaprojektowane, by każda aplikacja React mogła być wielojęzyczna już na etapie budowania – bez konieczności modyfikowania istniejących komponentów React.

> **Uwaga:** Jeśli korzystasz z poprzedniej wersji kompilatora (`@lingo.dev/_compiler`), przejdź na `@lingo.dev/compiler`. Stary kompilator jest przestarzały i zostanie usunięty w przyszłych wydaniach.

Zainstaluj raz:

```bash
npm install @lingo.dev/compiler
```

Włącz w swojej konfiguracji builda:

```ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr"],
    models: "lingo.dev",
  });
}
```

Uruchom `next build` i zobacz, jak pojawiają się paczki hiszpańskie i francuskie ✨

[Przeczytaj dokumentację →](https://lingo.dev/compiler), aby uzyskać pełny przewodnik, oraz [dołącz do naszego Discorda](https://lingo.dev/go/discord), by uzyskać pomoc przy konfiguracji.

---

### Co znajdziesz w tym repozytorium?

| Narzędzie    | TL;DR                                                                                  | Dokumentacja                            |
| ------------ | -------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Lokalizacja Reacta na etapie budowania                                                 | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Lokalizacja jednym poleceniem dla aplikacji web i mobilnych, JSON, YAML, markdown itd. | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Auto-commit tłumaczeń przy każdym pushu + tworzenie pull requestów w razie potrzeby    | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Tłumaczenie w czasie rzeczywistym dla treści generowanych przez użytkowników           | [/sdk](https://lingo.dev/sdk)           |

Poniżej znajdziesz szybkie podsumowanie dla każdego 👇

---

### ⚡️ Lingo.dev CLI

Tłumacz kod i treści bezpośrednio z terminala.

```bash
npx lingo.dev@latest run
```

Każdy ciąg znaków jest fingerprintowany, wyniki są cache’owane, a tłumaczone są tylko zmiany.

[Przejdź do dokumentacji →](https://lingo.dev/cli), aby dowiedzieć się, jak to skonfigurować.

---

### 🔄 Lingo.dev CI/CD

Wysyłaj idealne tłumaczenia automatycznie.

```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Twój repozytorium zawsze jest zielone, a produkt wielojęzyczny – bez ręcznych kroków.

[Przeczytaj dokumentację →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Błyskawiczne tłumaczenie na żądanie dla dynamicznych treści.

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: "your-api-key-here",
});

const content = {
  greeting: "Hello",
  farewell: "Goodbye",
  message: "Welcome to our platform",
};

const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
// Returns: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

Idealnie do czatów, komentarzy użytkowników i innych procesów w czasie rzeczywistym.

[Przeczytaj dokumentację →](https://lingo.dev/sdk)

---

## 🤝 Społeczność

Działamy dzięki społeczności i uwielbiamy Wasze wkłady!

- Masz pomysł? [Otwórz zgłoszenie](https://github.com/lingodotdev/lingo.dev/issues)
- Chcesz coś poprawić? [Wyślij PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Potrzebujesz pomocy? [Dołącz do naszego Discorda](https://lingo.dev/go/discord)

## ⭐ Historia gwiazdek

Jeśli podoba Ci się to, co robimy, daj nam ⭐ i pomóż osiągnąć 10 000 gwiazdek! 🌟

[

![Wykres historii gwiazdek](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme w innych językach

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

Nie widzisz swojego języka? Dodaj go do [`i18n.json`](./i18n.json) i otwórz PR!

**Format lokalizacji:** Używaj kodów [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale): `language[-Script][-REGION]`

- Język: ISO 639-1/2/3 małymi literami (`en`, `zh`, `bho`)
- Skrypt: ISO 15924 z wielkiej litery (`Hans`, `Hant`, `Latn`)
- Region: ISO 3166-1 alpha-2 wielkimi literami (`US`, `CN`, `IN`)
- Przykłady: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
