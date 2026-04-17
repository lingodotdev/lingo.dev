<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – Lokalisierungs-Engineering-Plattform"
    />
  </a>
</p>

<p align="center">
  <strong>
    Open-Source-Tools für Lokalisierungs-Engineering. Verbinden Sie sich mit der
    Lingo.dev Lokalisierungs-Engineering-Plattform für konsistente, qualitativ
    hochwertige Übersetzungen.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">
    Lingo Compiler für React (Frühe Alpha-Version)
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

## Schnellstart

| Tool                                               | Funktionsweise                                              | Schnellbefehl                      |
| -------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | KI-gestützte i18n-Einrichtung für React-Apps                | Prompt: `Set up i18n`              |
| [**Lingo CLI**](#lingodev-cli)                     | Lokalisierung von JSON-, YAML-, Markdown-, CSV-, PO-Dateien | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | Kontinuierliche Lokalisierung in GitHub Actions             | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler für React**](#lingodev-compiler) | Build-Time-Lokalisierung für React ohne i18n-Wrapper        | `withLingo()` Plugin               |

### Lokalisierungs-Engines

Diese Tools verbinden sich mit [Lokalisierungs-Engines](https://lingo.dev) – zustandsbehafteten Übersetzungs-APIs, die Sie auf der Lingo.dev Lokalisierungs-Engineering-Plattform erstellen. Jede Engine speichert Glossare, Markenstimme und lokale Anweisungen über alle Anfragen hinweg und [reduziert Terminologiefehler um 16,6–44,6 %](https://lingo.dev/research/retrieval-augmented-localization). Oder [nutzen Sie Ihr eigenes LLM](#lingodev-cli).

---

### Lingo.dev MCP

Die Einrichtung von i18n in React-Apps ist fehleranfällig – selbst KI-Coding-Assistenten halluzinieren nicht existierende APIs und brechen das Routing. Lingo.dev MCP bietet KI-Assistenten strukturierten Zugriff auf Framework-spezifisches i18n-Wissen für Next.js, React Router und TanStack Start. Funktioniert mit Claude Code, Cursor, GitHub Copilot Agents und Codex.

[Zur Dokumentation →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Lokalisieren Sie JSON-, YAML-, Markdown-, CSV- und PO-Dateien mit einem einzigen Befehl. Eine Lockfile verfolgt bereits lokalisierte Inhalte – nur neue oder geänderte Inhalte werden verarbeitet. Standardmäßig wird Ihre Lokalisierungs-Engine auf Lingo.dev verwendet, oder Sie nutzen Ihr eigenes LLM (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[Dokumentation lesen →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

Kontinuierliche Lokalisierung in Ihrer Pipeline. Jeder Push löst die Lokalisierung aus – fehlende Strings werden ausgefüllt, bevor der Code in die Produktion gelangt. Unterstützt GitHub Actions, GitLab CI/CD und Bitbucket Pipelines.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[Dokumentation lesen →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

Rufen Sie Ihre Lokalisierungs-Engine direkt aus dem Backend-Code auf. Synchrone und asynchrone Lokalisierung mit Webhook-Zustellung, Fehler-Isolierung pro Locale und Echtzeit-Fortschritt via WebSocket.

[Dokumentation lesen →](https://lingo.dev/en/docs/api)

---

### Lingo Compiler für React (Frühe Alpha-Version)

Build-Time React-Lokalisierung ohne i18n-Wrapper. Schreiben Sie Komponenten mit reinem englischem Text – der Compiler erkennt übersetzbare Strings und generiert lokalisierte Varianten zur Build-Zeit. Keine Translation-Keys, keine JSON-Dateien, keine `t()`-Funktionen. Unterstützt Next.js (App Router) und Vite + React.

[Dokumentation lesen →](https://lingo.dev/en/docs/react/compiler)

---

## Mitwirken

Beiträge sind willkommen. Bitte beachten Sie diese Richtlinien:

1. **Issues:** [Fehler melden oder Features anfragen](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Änderungen einreichen](https://github.com/lingodotdev/lingo.dev/pulls)
   - Jeder PR benötigt ein Changeset: `pnpm new` (oder `pnpm new:empty` für Änderungen ohne Release)
   - Stellen Sie sicher, dass Tests erfolgreich durchlaufen, bevor Sie einreichen
3. **Entwicklung:** Dies ist ein pnpm + turborepo Monorepo
   - Abhängigkeiten installieren: `pnpm install`
   - Tests ausführen: `pnpm test`
   - Build erstellen: `pnpm build`

**Support:** [Discord-Community](https://lingo.dev/go/discord)

## Star-Verlauf

Wenn Sie Lingo.dev nützlich finden, geben Sie uns einen Stern und helfen Sie uns, 10.000 Sterne zu erreichen!

[

![Star-Verlaufsdiagramm](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Lokalisierte Dokumentation

**Verfügbare Übersetzungen:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Eine neue Sprache hinzufügen:**

1. Fügen Sie den Sprachcode zu [`i18n.json`](./i18n.json) im [BCP-47-Format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) hinzu
2. Reichen Sie einen Pull Request ein
