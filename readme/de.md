<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ KI-gestützte Open-Source-CLI für Web- & Mobile-Lokalisierung.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">Dokumentation</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Mitwirken</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#">Repository mit Stern versehen</a>
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

<br />

Lingo.dev ist eine community-getriebene, Open-Source-CLI für KI-gestützte Web- und Mobile-App-Lokalisierung.

Lingo.dev wurde entwickelt, um authentische Übersetzungen sofort zu erstellen und dabei manuelle Arbeit und Verwaltungsaufwand zu eliminieren. Dadurch führen Teams präzise Lokalisierungen 100-mal schneller durch und liefern Features an mehr zufriedene Nutzer weltweit. Es kann mit Ihrem eigenen LLM oder mit der von Lingo.dev verwalteten Lokalisierungs-Engine verwendet werden.

> **Wenig bekannte Tatsache:** Lingo.dev begann 2023 als kleines Projekt bei einem Studenten-Hackathon! Nach vielen Iterationen wurden wir 2024 in Y Combinator aufgenommen, und wir stellen jetzt ein! Interessiert daran, die nächste Generation von Lokalisierungstools zu entwickeln? Senden Sie Ihren Lebenslauf an careers@lingo.dev! 🚀

## 📑 In diesem Leitfaden

- [Schnellstart](#-quickstart) - In Minuten loslegen
- [Caching](#-caching-with-i18nlock) - Übersetzungsaktualisierungen optimieren
- [GitHub Action](#-github-action) - Lokalisierung in CI/CD automatisieren
- [Funktionen](#-supercharged-features) - Was Lingo.dev leistungsstark macht
- [Dokumentation](#-documentation) - Detaillierte Anleitungen und Referenzen
- [Mitwirken](#-contribute) - Treten Sie unserer Community bei

## 💫 Schnellstart

Die Lingo.dev CLI ist so konzipiert, dass sie sowohl mit Ihrem eigenen LLM als auch mit der von Lingo.dev verwalteten Lokalisierungs-Engine funktioniert, die auf den neuesten SOTA (State-of-the-Art) LLMs basiert.

### Verwendung Ihres eigenen LLM (BYOK oder Bring Your Own Key)

1. Erstellen Sie eine `i18n.json` Konfigurationsdatei:

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "You're translating text from {source} to {target}."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Setzen Sie Ihren API-Schlüssel als Umgebungsvariable:

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# oder für OpenAI

export OPENAI_API_KEY=your_openai_api_key
```

3. Führen Sie die Lokalisierung aus:

```bash
npx lingo.dev@latest i18n
```

### Verwendung von Lingo.dev Cloud

Produktionsreife Anwendungen benötigen oft Funktionen wie Translation Memory, Glossar-Unterstützung und Qualitätssicherung bei der Lokalisierung. Manchmal möchten Sie auch, dass ein Experte für Sie entscheidet, welcher LLM-Anbieter und welches Modell zu verwenden ist, und das Modell automatisch aktualisiert, wenn neue Versionen veröffentlicht werden. Lingo.dev ist eine verwaltete Lokalisierungs-Engine, die diese Funktionen bietet:

1. Erstellen Sie eine `i18n.json` Konfigurationsdatei (ohne Provider-Knoten):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Authentifizieren Sie sich bei Lingo.dev:

```bash
npx lingo.dev@latest auth --login
```

3. Führen Sie die Lokalisierung aus:

```bash
npx lingo.dev@latest i18n
```

## 📖 Dokumentation

Für detaillierte Anleitungen und API-Referenzen besuchen Sie die [Dokumentation](https://lingo.dev/go/docs).

## 🔒 Caching mit `i18n.lock`

Lingo.dev verwendet eine `i18n.lock`-Datei, um Inhalts-Prüfsummen zu verfolgen und sicherzustellen, dass nur geänderte Texte übersetzt werden. Dies verbessert:

- ⚡️ **Geschwindigkeit**: Bereits übersetzte Inhalte werden übersprungen
- 🔄 **Konsistenz**: Verhindert unnötige Neuübersetzungen
- 💰 **Kosten**: Keine Abrechnung für wiederholte Übersetzungen

## 🤖 GitHub Action

Lingo.dev bietet eine GitHub Action zur Automatisierung der Lokalisierung in Ihrer CI/CD-Pipeline. Hier ist eine grundlegende Einrichtung:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Diese Action führt `lingo.dev i18n` bei jedem Push aus und hält Ihre Übersetzungen automatisch aktuell.

Für den Pull-Request-Modus und weitere Konfigurationsoptionen besuchen Sie unsere [GitHub Action Dokumentation](https://docs.lingo.dev/ci-action/gha).

## ⚡️ Lingo.devs Superkräfte

- 🔥 **Sofortige Integration**: Funktioniert in Minuten mit Ihrem Codebase
- 🔄 **CI/CD-Automatisierung**: Einrichten und vergessen
- 🌍 **Globale Reichweite**: Liefern Sie an Nutzer überall
- 🧠 **KI-gestützt**: Nutzt neueste Sprachmodelle für natürliche Übersetzungen
- 📊 **Format-unabhängig**: JSON, YAML, CSV, Markdown, Android, iOS und viele mehr
- 🔍 **Saubere Diffs**: Bewahrt Ihre Dateistruktur exakt
- ⚡️ **Blitzschnell**: Übersetzungen in Sekunden, nicht Tagen
- 🔄 **Immer synchronisiert**: Aktualisiert automatisch bei Inhaltsänderungen
- 🌟 **Menschliche Qualität**: Übersetzungen, die nicht roboterhaft klingen
- 👨‍💻 **Von Entwicklern für Entwickler**: Wir nutzen es selbst täglich
- 📈 **Wächst mit Ihnen**: Vom Nebenprojekt bis zum Unternehmensmaßstab

## 🤝 Mitwirken

Lingo.dev ist gemeinschaftsgetrieben, daher begrüßen wir alle Beiträge!

Haben Sie eine Idee für eine neue Funktion? Erstellen Sie ein GitHub Issue!

Möchten Sie beitragen? Erstellen Sie einen Pull Request!

## 🌐 Readme in anderen Sprachen

- [English](https://github.com/lingodotdev/lingo.dev)
- [Chinesisch](/readme/zh-Hans.md)
- [Japanisch](/readme/ja.md)
- [Koreanisch](/readme/ko.md)
- [Spanisch](/readme/es.md)
- [Französisch](/readme/fr.md)
- [Russisch](/readme/ru.md)
- [Deutsch](/readme/de.md)
- [Italienisch](/readme/it.md)
- [Arabisch](/readme/ar.md)
- [Hindi](/readme/hi.md)
- [Bengalisch](/readme/bn.md)

Sehen Sie Ihre Sprache nicht? Fügen Sie einfach einen neuen Sprachcode zur Datei [`i18n.json`](./i18n.json) hinzu und eröffnen Sie einen PR!
