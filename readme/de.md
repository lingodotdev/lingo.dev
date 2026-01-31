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
    ⚡ Lingo.dev - Open-Source, KI-gestütztes i18n-Toolkit für sofortige
    Lokalisierung mit LLMs.
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
      alt="Release"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="Lizenz"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Letzter Commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool des Monats"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool der Woche"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Produkt des Tages"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github Trending"
    />
  </a>
</p>

---

## Der Compiler ist da 🆕

**Lingo.dev Compiler** ist eine kostenlose Open-Source-Compiler-Middleware, die jede React-App zur Build-Zeit mehrsprachig macht, ohne dass Änderungen an bestehenden React-Komponenten erforderlich sind.

> **Hinweis:** Falls du den Legacy-Compiler (`@lingo.dev/_compiler`) verwendest, migriere bitte zu `@lingo.dev/compiler`. Der Legacy-Compiler ist veraltet und wird in einer zukünftigen Version entfernt.

Einmalig installieren:

```bash
npm install @lingo.dev/compiler
```

In deiner Build-Konfiguration aktivieren:

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

Führe `next build` aus und sieh zu, wie spanische und französische Bundles entstehen ✨

[Lies die Dokumentation →](https://lingo.dev/compiler) für die vollständige Anleitung und [tritt unserem Discord bei](https://lingo.dev/go/discord), um Hilfe bei deinem Setup zu erhalten.

---

### Was ist in diesem Repo enthalten?

| Tool         | Kurzbeschreibung                                                                       | Dokumentation                           |
| ------------ | -------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | React-Lokalisierung zur Build-Zeit                                                     | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Ein-Befehl-Lokalisierung für Web- und Mobile-Apps, JSON, YAML, Markdown und mehr       | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Auto-Commit von Übersetzungen bei jedem Push + Erstellung von Pull Requests bei Bedarf | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Echtzeit-Übersetzung für nutzergenerierte Inhalte                                      | [/sdk](https://lingo.dev/sdk)           |

Hier sind die wichtigsten Punkte im Überblick 👇

---

### ⚡️ Lingo.dev CLI

Übersetze Code und Inhalte direkt aus deinem Terminal.

```bash
npx lingo.dev@latest run
```

Es erstellt für jeden String einen Fingerprint, cached die Ergebnisse und übersetzt nur das, was sich geändert hat.

[Folge der Dokumentation →](https://lingo.dev/cli), um zu erfahren, wie du es einrichtest.

---

### 🔄 Lingo.dev CI/CD

Liefere perfekte Übersetzungen automatisch aus.

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

Hält dein Repository grün und dein Produkt mehrsprachig ohne manuelle Schritte.

[Lies die Dokumentation →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Sofortige Übersetzung pro Anfrage für dynamische Inhalte.

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

Perfekt für Chat, Nutzerkommentare und andere Echtzeit-Abläufe.

[Lies die Dokumentation →](https://lingo.dev/sdk)

---

## 🤝 Community

Wir sind community-getrieben und lieben Beiträge!

- Du hast eine Idee? [Öffne ein Issue](https://github.com/lingodotdev/lingo.dev/issues)
- Du möchtest etwas beheben? [Sende einen PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Du brauchst Hilfe? [Tritt unserem Discord bei](https://lingo.dev/go/discord)

## ⭐ Star-Verlauf

Wenn dir gefällt, was wir tun, gib uns einen ⭐ und hilf uns, 10.000 Sterne zu erreichen! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme in anderen Sprachen

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

Ihre Sprache ist nicht dabei? Fügen Sie sie zu [`i18n.json`](./i18n.json) hinzu und öffnen Sie einen PR!

**Locale-Format:** Verwenden Sie [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)-Codes: `language[-Script][-REGION]`

- Sprache: ISO 639-1/2/3 Kleinbuchstaben (`en`, `zh`, `bho`)
- Schrift: ISO 15924 Großschreibung am Anfang (`Hans`, `Hant`, `Latn`)
- Region: ISO 3166-1 alpha-2 Großbuchstaben (`US`, `CN`, `IN`)
- Beispiele: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
