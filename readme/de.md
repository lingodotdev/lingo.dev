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
    Lingo.dev - Open-Source-i18n-Toolkit für LLM-gestützte Lokalisierung
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Compiler</a>
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

| Tool                               | Anwendungsfall                                            | Schnellbefehl                      |
| ---------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | KI-gestützte i18n-Einrichtung für React-Apps              | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | Übersetzung von JSON-, YAML-, Markdown-, CSV-, PO-Dateien | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | Automatisierte Übersetzungs-Pipeline in GitHub Actions    | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | Laufzeit-Übersetzung für dynamische Inhalte               | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | Build-Time-React-Lokalisierung ohne i18n-Wrapper          | `withLingo()`-Plugin               |

---

### Lingo.dev MCP

Die Einrichtung von i18n in React-Apps ist notorisch fehleranfällig – selbst für erfahrene Entwickler. KI-Coding-Assistenten verschlimmern die Situation: Sie halluzinieren nicht existierende APIs, vergessen Middleware-Konfigurationen, brechen das Routing oder implementieren eine halbe Lösung, bevor sie den Faden verlieren. Das Problem ist, dass die i18n-Einrichtung eine präzise Abfolge koordinierter Änderungen über mehrere Dateien hinweg erfordert (Routing, Middleware, Komponenten, Konfiguration), und LLMs haben Schwierigkeiten, diesen Kontext aufrechtzuerhalten.

Lingo.dev MCP löst dies, indem es KI-Assistenten strukturierten Zugriff auf framework-spezifisches i18n-Wissen gibt. Anstatt zu raten, folgt Ihr Assistent verifizierten Implementierungsmustern für Next.js, React Router und TanStack Start.

**Unterstützte IDEs:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**Unterstützte Frameworks:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**Verwendung:**

Nach der Konfiguration des MCP-Servers in Ihrer IDE ([siehe Schnellstart-Anleitungen](https://lingo.dev/en/mcp)) fordern Sie Ihren Assistenten auf:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

Der Assistent wird:

1. Locale-basiertes Routing konfigurieren (z. B. `/en`, `/es`, `/pt-BR`)
2. Sprachwechsel-Komponenten einrichten
3. Automatische Locale-Erkennung implementieren
4. Notwendige Konfigurationsdateien generieren

**Hinweis:** KI-gestützte Code-Generierung ist nicht-deterministisch. Überprüfen Sie generierten Code vor dem Committen.

[Dokumentation lesen →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Übersetzungen synchron zu halten ist mühsam. Sie fügen einen neuen String hinzu, vergessen ihn zu übersetzen und liefern fehlerhafte UI an internationale Nutzer aus. Oder Sie senden JSON-Dateien an Übersetzer, warten tagelang und führen deren Arbeit dann manuell zusammen. Die Skalierung auf über 10 Sprachen bedeutet die Verwaltung hunderter Dateien, die ständig auseinanderdriften.

Lingo.dev CLI automatisiert dies. Richten Sie es auf Ihre Übersetzungsdateien aus, führen Sie einen Befehl aus, und jede Locale wird aktualisiert. Eine Lockfile verfolgt, was bereits übersetzt wurde, sodass Sie nur für neue oder geänderte Inhalte zahlen. Unterstützt JSON, YAML, CSV, PO-Dateien und Markdown.

**Einrichtung:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**Funktionsweise:**

1. Extrahiert übersetzbare Inhalte aus konfigurierten Dateien
2. Sendet Inhalte an LLM-Anbieter zur Übersetzung
3. Schreibt übersetzte Inhalte zurück ins Dateisystem
4. Erstellt `i18n.lock`-Datei zur Nachverfolgung abgeschlossener Übersetzungen (vermeidet redundante Verarbeitung)

**Konfiguration:**

Der Befehl `init` generiert eine `i18n.json`-Datei. Konfigurieren Sie Locales und Buckets:

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

Das Feld `provider` ist optional (Standard ist Lingo.dev Engine). Für benutzerdefinierte LLM-Anbieter:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**Unterstützte LLM-Anbieter:**

- Lingo.dev Engine (empfohlen)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[Dokumentation lesen →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

Übersetzungen sind das Feature, das immer "fast fertig" ist. Entwickler mergen Code, ohne die Locales zu aktualisieren. QA entdeckt fehlende Übersetzungen im Staging – oder schlimmer noch, Nutzer entdecken sie in der Produktion. Die Grundursache: Übersetzung ist ein manueller Schritt, der unter Termindruck leicht übersprungen wird.

Lingo.dev CI/CD macht Übersetzungen automatisch. Jeder Push löst die Übersetzung aus. Fehlende Strings werden ausgefüllt, bevor Code die Produktion erreicht. Keine Disziplin erforderlich – die Pipeline übernimmt das.

**Unterstützte Plattformen:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions-Einrichtung:**

Erstellen Sie `.github/workflows/translate.yml`:

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

**Einrichtungsanforderungen:**

1. Fügen Sie `LINGODOTDEV_API_KEY` zu den Repository-Secrets hinzu (Einstellungen > Secrets and variables > Actions)
2. Für PR-Workflows: Aktivieren Sie „Allow GitHub Actions to create and approve pull requests" unter Einstellungen > Actions > General

**Workflow-Optionen:**

Übersetzungen direkt committen:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Pull Requests mit Übersetzungen erstellen:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Verfügbare Eingaben:**

| Eingabe              | Standard                                       | Beschreibung                           |
| -------------------- | ---------------------------------------------- | -------------------------------------- |
| `api-key`            | (erforderlich)                                 | Lingo.dev API-Schlüssel                |
| `pull-request`       | `false`                                        | PR erstellen statt direkt zu committen |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Benutzerdefinierte Commit-Nachricht    |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Benutzerdefinierter PR-Titel           |
| `working-directory`  | `"."`                                          | Verzeichnis für Ausführung             |
| `parallel`           | `false`                                        | Parallele Verarbeitung aktivieren      |

[Dokumentation lesen →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

Statische Übersetzungsdateien funktionieren für UI-Labels, aber was ist mit nutzergenerierten Inhalten? Chat-Nachrichten, Produktbeschreibungen, Support-Tickets – Inhalte, die zur Build-Zeit nicht existieren, können nicht vorübersetzt werden. Sie müssen unübersetzte Texte anzeigen oder eine eigene Übersetzungs-Pipeline aufbauen.

Das Lingo.dev SDK übersetzt Inhalte zur Laufzeit. Übergeben Sie beliebigen Text, Objekte oder HTML und erhalten Sie eine lokalisierte Version zurück. Funktioniert für Echtzeit-Chat, dynamische Benachrichtigungen oder beliebige Inhalte, die nach dem Deployment eintreffen. Verfügbar für JavaScript, PHP, Python und Ruby.

**Installation:**

```bash
npm install lingo.dev
```

**Verwendung:**

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

**Verfügbare SDKs:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) – Web-Apps, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) – PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) – Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) – Rails

[Dokumentation lesen →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

Traditionelle i18n ist invasiv. Sie umschließen jeden String mit `t()`-Funktionen, erfinden Übersetzungsschlüssel (`home.hero.title.v2`), pflegen parallele JSON-Dateien und beobachten, wie Ihre Komponenten mit Lokalisierungs-Boilerplate aufgebläht werden. Es ist so mühsam, dass Teams die Internationalisierung hinauszögern, bis sie zu einem massiven Refactoring wird.

Lingo.dev Compiler eliminiert die Zeremonie. Schreiben Sie React-Komponenten mit einfachem englischem Text. Der Compiler erkennt übersetzbare Zeichenketten zur Build-Zeit und generiert automatisch lokalisierte Varianten. Keine Schlüssel, keine JSON-Dateien, keine Wrapper-Funktionen – nur React-Code, der zufällig in mehreren Sprachen funktioniert.

**Installation:**

```bash
pnpm install @lingo.dev/compiler
```

**Authentifizierung:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**Konfiguration (Next.js):**

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

**Konfiguration (Vite):**

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

**Provider-Setup:**

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

**Sprachwechsler:**

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

**Entwicklung:** `npm run dev` (verwendet Pseudoübersetzer, keine API-Aufrufe)

**Produktion:** Setzen Sie `usePseudotranslator: false`, dann `next build`

Committen Sie das `.lingo/`-Verzeichnis in die Versionskontrolle.

**Hauptmerkmale:**

- Keine Laufzeit-Performance-Kosten
- Keine Übersetzungsschlüssel oder JSON-Dateien
- Keine `t()`-Funktionen oder `<T>`-Wrapper-Komponenten
- Automatische Erkennung von übersetzbarem Text in JSX
- TypeScript-Unterstützung
- ICU MessageFormat für Plurale
- Manuelle Überschreibungen via `data-lingo-override`-Attribut
- Integriertes Übersetzungs-Editor-Widget

**Build-Modi:**

- `pseudotranslator`: Entwicklungsmodus mit Platzhalter-Übersetzungen (keine API-Kosten)
- `real`: Generierung tatsächlicher Übersetzungen mittels LLMs
- `cache-only`: Produktionsmodus mit vorgenerierten Übersetzungen aus CI (keine API-Aufrufe)

**Unterstützte Frameworks:**

- Next.js (App Router mit React Server Components)
- Vite + React (SPA und SSR)

Unterstützung weiterer Frameworks geplant.

[Dokumentation lesen →](https://lingo.dev/en/compiler)

---

## Mitwirken

Beiträge sind willkommen. Bitte befolgen Sie diese Richtlinien:

1. **Issues:** [Fehler melden oder Funktionen anfordern](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Änderungen einreichen](https://github.com/lingodotdev/lingo.dev/pulls)
   - Jeder PR erfordert ein Changeset: `pnpm new` (oder `pnpm new:empty` für Änderungen ohne Release)
   - Stellen Sie sicher, dass die Tests vor dem Einreichen bestehen
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

**Neue Sprache hinzufügen:**

1. Locale-Code zu [`i18n.json`](./i18n.json) im [BCP-47-Format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) hinzufügen
2. Pull Request einreichen

**BCP-47-Locale-Format:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (Kleinbuchstaben): `en`, `zh`, `bho`
- `Script`: ISO 15924 (Großschreibung am Anfang): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (Großbuchstaben): `US`, `CN`, `IN`
- Beispiele: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
