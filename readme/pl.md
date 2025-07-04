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
    ⚡ Lingo.dev - otwartoźródłowe, wspierane przez AI narzędzie i18n do
    natychmiastowej lokalizacji z wykorzystaniem LLM.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
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
</p>

---

## Poznaj Compiler 🆕

**Lingo.dev Compiler** to darmowe, otwartoźródłowe oprogramowanie pośredniczące (middleware), zaprojektowane, aby uczynić każdą aplikację React wielojęzyczną na etapie budowania, bez konieczności wprowadzania zmian w istniejących komponentach React.

Zainstaluj raz:

```bash
npm install lingo.dev
```

Włącz w swojej konfiguracji budowania:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

Uruchom `next build` i zobacz, jak pojawiają się pakiety w języku hiszpańskim i francuskim ✨

[Przeczytaj dokumentację →](https://lingo.dev/compiler), aby uzyskać pełny przewodnik, oraz [Dołącz do naszego Discorda](https://lingo.dev/go/discord), aby uzyskać pomoc w konfiguracji.

---

### Co zawiera to repozytorium?

| Narzędzie    | TL;DR                                                                                                 | Dokumentacja                            |
| ------------ | ----------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Lokalizacja React na etapie budowania                                                                 | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Lokalizacja aplikacji webowych i mobilnych, JSON, YAML, markdown i więcej                             | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Automatyczne zatwierdzanie tłumaczeń przy każdym pushu + tworzenie pull requestów, jeśli to konieczne | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Tłumaczenie w czasie rzeczywistym dla treści generowanych przez użytkowników                          | [/sdk](https://lingo.dev/sdk)           |

Poniżej znajdziesz szybkie informacje o każdym z nich 👇

---

### ⚡️ Lingo.dev CLI

Tłumacz kod i treści bezpośrednio z terminala.

```bash
npx lingo.dev@latest run
```

Odciska każdy ciąg znaków, zapisuje wyniki w pamięci podręcznej i tłumaczy ponownie tylko to, co się zmieniło.

[Przejdź do dokumentacji →](https://lingo.dev/cli), aby dowiedzieć się, jak to skonfigurować.

---

### 🔄 Lingo.dev CI/CD

Automatyczne dostarczanie perfekcyjnych tłumaczeń.

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

Utrzymuje repozytorium w dobrym stanie i produkt wielojęzyczny bez ręcznych kroków.

[Przeczytaj dokumentację →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Natychmiastowe tłumaczenie na żądanie dla dynamicznych treści.

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

Idealne do czatów, komentarzy użytkowników i innych procesów w czasie rzeczywistym.

[Przeczytaj dokumentację →](https://lingo.dev/sdk)

---

## 🤝 Społeczność

Jesteśmy napędzani przez społeczność i uwielbiamy wkład innych!

- Masz pomysł? [Otwórz zgłoszenie](https://github.com/lingodotdev/lingo.dev/issues)
- Chcesz coś naprawić? [Wyślij PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Potrzebujesz pomocy? [Dołącz do naszego Discorda](https://lingo.dev/go/discord)

## ⭐ Historia gwiazdek

Jeśli podoba Ci się to, co robimy, daj nam ⭐ i pomóż nam osiągnąć 3 000 gwiazdek! 🌟

[

![Wykres historii gwiazdek](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme w innych językach

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Nie widzisz swojego języka? Dodaj go do [`i18n.json`](./i18n.json) i otwórz PR!
