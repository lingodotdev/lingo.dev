<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - Open-Source, KI-gestütztes i18n-Toolkit für sofortige Lokalisierung mit LLMs.</strong>
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
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Lizenz" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Letzter Commit" />
  </a>
</p>

---

## Entdecken Sie den Compiler 🆕

**Lingo.dev Compiler** ist eine kostenlose, Open-Source-Compiler-Middleware, die entwickelt wurde, um jede React-Anwendung zur Build-Zeit mehrsprachig zu machen, ohne dass Änderungen an den bestehenden React-Komponenten erforderlich sind.

Einmalige Installation:

```bash
npm install lingo.dev
```

In Ihrer Build-Konfiguration aktivieren:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

Führen Sie `next build` aus und beobachten Sie, wie spanische und französische Bundles erscheinen ✨

[Lesen Sie die Dokumentation →](https://lingo.dev/compiler) für die vollständige Anleitung und [treten Sie unserem Discord bei](https://lingo.dev/go/discord), um Hilfe bei Ihrer Einrichtung zu erhalten.

---

### Was beinhaltet dieses Repository?

| Tool         | Kurzfassung                                                                   | Dokumentation                           |
| ------------ | ----------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Build-time React-Lokalisierung                                               | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Ein-Befehl-Lokalisierung für Web- und Mobile-Apps, JSON, YAML, Markdown + mehr | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Auto-Commit von Übersetzungen bei jedem Push + Erstellung von Pull Requests bei Bedarf | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Echtzeit-Übersetzung für nutzergenerierte Inhalte                           | [/sdk](https://lingo.dev/sdk)           |

Hier sind die wichtigsten Punkte für jedes Tool 👇

---

### ⚡️ Lingo.dev CLI

Übersetzen Sie Code & Inhalte direkt von Ihrem Terminal aus.

```bash
npx lingo.dev@latest run
```

Es erstellt Fingerabdrücke jedes Strings, speichert Ergebnisse im Cache und übersetzt nur, was sich geändert hat.

[Folgen Sie der Dokumentation →](https://lingo.dev/cli), um zu erfahren, wie Sie es einrichten können.

---

### 🔄 Lingo.dev CI/CD

Liefern Sie automatisch perfekte Übersetzungen.

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

Hält Ihr Repository grün und Ihr Produkt mehrsprachig ohne manuelle Schritte.

[Lesen Sie die Dokumentation →](https://lingo.dev/ci)

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

Perfekt für Chat, Benutzerkommentare und andere Echtzeit-Workflows.

[Dokumentation lesen →](https://lingo.dev/sdk)

---

## 🤝 Community

Wir sind community-orientiert und schätzen Beiträge!

- Eine Idee? [Issue erstellen](https://github.com/lingodotdev/lingo.dev/issues)
- Möchten Sie etwas verbessern? [PR senden](https://github.com/lingodotdev/lingo.dev/pulls)
- Brauchen Sie Hilfe? [Discord beitreten](https://lingo.dev/go/discord)

## ⭐ Star-Verlauf

Wenn Ihnen gefällt, was wir tun, geben Sie uns einen ⭐ und helfen Sie uns, 3.000 Stars zu erreichen! 🌟

[

![Star-Verlauf Diagramm](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme in anderen Sprachen

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Ihre Sprache nicht dabei? Fügen Sie sie zu [`i18n.json`](./i18n.json) hinzu und öffnen Sie einen PR!
