<p align="center">
  <a href="https://replexica.com">
    <img src="/content/banner.dark.png" width="100%" alt="Replexica" />
  </a>
</p>

<p align="center">
  <strong>⚡️ KI-gestützte Lokalisierung auf dem neuesten Stand der Technik für Web & Mobile, direkt aus der CI/CD-Pipeline.</strong>
</p>

<br />

<p align="center">
  <a href="https://replexica.com">Website</a> •
  <a href="https://github.com/replexica/replexica/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Mitmachen</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#-localization-compiler-experimental">Lokalisierungs-Compiler</a>
</p>

<p align="center">
  <a href="https://github.com/replexica/replexica/actions/workflows/release.yml">
    <img src="https://github.com/replexica/replexica/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/replexica/replexica/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/replexica/replexica" alt="Lizenz" />
  </a>
  <a href="https://github.com/replexica/replexica/commits/main">
    <img src="https://img.shields.io/github/last-commit/replexica/replexica" alt="Letzter Commit" />
  </a>
</p>

<br />

Replexica KI automatisiert die Software-Lokalisierung von Anfang bis Ende.

Es erstellt sofort authentische Übersetzungen und eliminiert manuelle Arbeit und Verwaltungsaufwand. Die Replexica Lokalisierungs-Engine versteht den Produktkontext und erstellt perfekte Übersetzungen, die Muttersprachler in über 60 Sprachen erwarten. Teams können dadurch 100-mal schneller lokalisieren, mit modernster Qualität, und Features an mehr zahlende Kunden weltweit ausliefern.

## 💫 Schnellstart

1. **Zugang anfordern**: [Sprechen Sie mit uns](https://replexica.com/go/call), um Kunde zu werden.

2. Nach der Freigabe initialisieren Sie Ihr Projekt:
   ```bash
   npx replexica@latest init
   ```

3. Lokalisieren Sie Ihre Inhalte:
   ```bash
   npx replexica@latest i18n
   ```

## 🤖 GitHub Action

Replexica bietet eine GitHub Action zur Automatisierung der Lokalisierung in Ihrer CI/CD-Pipeline. Hier ist eine grundlegende Einrichtung:

```yaml
- uses: replexica/replexica@main
  with:
    api-key: ${{ secrets.REPLEXICA_API_KEY }}
```

Diese Action führt bei jedem Push `replexica i18n` aus und hält Ihre Übersetzungen automatisch auf dem neuesten Stand.

Für den Pull-Request-Modus und weitere Konfigurationsoptionen besuchen Sie unsere [GitHub Action Dokumentation](https://docs.replexica.com/setup/gha).

## 🧪 Lokalisierungs-Compiler (experimentell)

Dieses Repository enthält auch unser neues Experiment: einen JS/React-Lokalisierungs-Compiler.

Damit können Entwicklerteams Frontend-Lokalisierung durchführen, **ohne Strings in Übersetzungsdateien zu extrahieren**. Teams können mit nur einer Codezeile mehrsprachiges Frontend erstellen. Es arbeitet zur Build-Zeit und nutzt Abstract Syntax Tree (AST)-Manipulation und Code-Generierung.

Die Demo können Sie [hier](https://x.com/MaxPrilutskiy/status/1781011350136734055) sehen.

## 🥇 Warum Teams Replexica wählen

- 🔥 **Sofortige Integration**: In Minuten eingerichtet
- 🔄 **CI/CD-Automatisierung**: Nahtlose Integration in die Entwicklungs-Pipeline
- 🌍 **60+ Sprachen**: Mühelose globale Expansion
- 🧠 **KI-Lokalisierungs-Engine**: Übersetzungen, die wirklich zu Ihrem Produkt passen
- 📊 **Format-Flexibel**: Unterstützt JSON, YAML, CSV, Markdown und mehr

## 🛠️ Leistungsstarke Features

- ⚡️ **Blitzschnell**: KI-Lokalisierung in Sekunden
- 🔄 **Auto-Updates**: Synchronisiert mit den neuesten Inhalten
- 🌟 **Muttersprachliche Qualität**: Authentisch klingende Übersetzungen
- 👨‍💻 **Entwicklerfreundlich**: CLI, das sich in Ihren Workflow integriert
- 📈 **Skalierbar**: Für wachsende Startups und Enterprise-Teams

## 📚 Dokumentation

Ausführliche Anleitungen und API-Referenzen findest du in der [Dokumentation](https://replexica.com/go/docs).

## 🤝 Mitmachen

Interessiert am Mitwirken, auch wenn du kein Kunde bist?

Schau dir die [Good First Issues](https://github.com/replexica/replexica/labels/good%20first%20issue) an und lies den [Leitfaden zum Mitwirken](./CONTRIBUTING.md).

## 🧠 Team

- **[Veronica](https://github.com/vrcprl)**
- **[Max](https://github.com/maxprilutskiy)**

Fragen oder Anliegen? Schreib eine E-Mail an veronica@replexica.com

## 🌐 Readme in anderen Sprachen

- [English](https://github.com/replexica/replexica)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Chinese](/readme/zh-Hans.md)
- [Korean](/readme/ko.md)
- [Japanese](/readme/ja.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)

Deine Sprache ist nicht dabei? Füge einfach einen neuen Sprachcode zur [`i18n.json`](./i18n.json) Datei hinzu und erstelle einen PR.
