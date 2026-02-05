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
    Lingo.dev - Toolkit i18n open-source per la localizzazione basata su LLM
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
      alt="Licenza"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Ultimo commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool del mese"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool della settimana"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 prodotto del giorno"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Trending su Github"
    />
  </a>
</p>

---

## Quick start

| Tool                               | Caso d'uso                                             | Comando rapido                     |
| ---------------------------------- | ------------------------------------------------------ | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | Setup i18n assistito da AI per app React               | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | Traduzione di file JSON, YAML, markdown, CSV, PO       | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | Pipeline di traduzione automatizzata in GitHub Actions | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | Traduzione runtime per contenuti dinamici              | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | Localizzazione React a build-time senza wrapper i18n   | Plugin `withLingo()`               |

---

### Lingo.dev MCP

Configurare l'i18n nelle app React è notoriamente soggetto a errori, anche per sviluppatori esperti. Gli assistenti di codifica AI peggiorano la situazione: allucinano API inesistenti, dimenticano configurazioni middleware, rompono il routing o implementano metà soluzione prima di perdersi. Il problema è che la configurazione i18n richiede una sequenza precisa di modifiche coordinate su più file (routing, middleware, componenti, configurazione) e gli LLM faticano a mantenere quel contesto.

Lingo.dev MCP risolve questo problema fornendo agli assistenti AI accesso strutturato alla conoscenza i18n specifica per framework. Invece di indovinare, il tuo assistente segue pattern di implementazione verificati per Next.js, React Router e TanStack Start.

**IDE supportati:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**Framework supportati:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**Utilizzo:**

Dopo aver configurato il server MCP nel tuo IDE ([vedi guide rapide](https://lingo.dev/en/mcp)), richiedi al tuo assistente:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

L'assistente:

1. Configurerà il routing basato su locale (es. `/en`, `/es`, `/pt-BR`)
2. Configurerà i componenti per il cambio lingua
3. Implementerà il rilevamento automatico del locale
4. Genererà i file di configurazione necessari

**Nota:** la generazione di codice assistita da AI è non deterministica. Rivedi il codice generato prima di committare.

[Leggi la documentazione →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Mantenere le traduzioni sincronizzate è tedioso. Aggiungi una nuova stringa, dimentichi di tradurla, rilasci un'interfaccia rotta agli utenti internazionali. Oppure invii file JSON ai traduttori, aspetti giorni, poi unisci manualmente il loro lavoro. Scalare a oltre 10 lingue significa gestire centinaia di file che costantemente vanno fuori sincronia.

Lingo.dev CLI automatizza questo processo. Puntalo ai tuoi file di traduzione, esegui un comando e ogni locale si aggiorna. Un lockfile traccia ciò che è già tradotto, quindi paghi solo per contenuti nuovi o modificati. Supporta file JSON, YAML, CSV, PO e markdown.

**Setup:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**Come funziona:**

1. Estrae i contenuti traducibili dai file configurati
2. Invia i contenuti al provider LLM per la traduzione
3. Scrive i contenuti tradotti nel filesystem
4. Crea il file `i18n.lock` per tracciare le traduzioni completate (evita elaborazioni ridondanti)

**Configurazione:**

Il comando `init` genera un file `i18n.json`. Configura le locale e i bucket:

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

Il campo `provider` è facoltativo (predefinito: Lingo.dev Engine). Per provider LLM personalizzati:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**Provider LLM supportati:**

- Lingo.dev Engine (consigliato)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[Leggi la documentazione →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

Le traduzioni sono la funzionalità che è sempre "quasi pronta". Gli sviluppatori fanno il merge del codice senza aggiornare le locale. Il QA scopre le traduzioni mancanti in staging - o peggio, gli utenti le scoprono in produzione. La causa principale: la traduzione è un passaggio manuale facile da saltare sotto la pressione delle scadenze.

Lingo.dev CI/CD rende le traduzioni automatiche. Ogni push attiva la traduzione. Le stringhe mancanti vengono completate prima che il codice raggiunga la produzione. Non serve disciplina - la pipeline se ne occupa.

**Piattaforme supportate:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**Setup GitHub Actions:**

Crea `.github/workflows/translate.yml`:

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

**Requisiti di setup:**

1. Aggiungi `LINGODOTDEV_API_KEY` ai secret del repository (Settings > Secrets and variables > Actions)
2. Per i workflow PR: Abilita "Allow GitHub Actions to create and approve pull requests" in Settings > Actions > General

**Opzioni workflow:**

Committa le traduzioni direttamente:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Crea pull request con le traduzioni:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Input disponibili:**

| Input                | Default                                        | Descrizione                               |
| -------------------- | ---------------------------------------------- | ----------------------------------------- |
| `api-key`            | (obbligatorio)                                 | Chiave API Lingo.dev                      |
| `pull-request`       | `false`                                        | Crea PR invece di committare direttamente |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Messaggio di commit personalizzato        |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Titolo PR personalizzato                  |
| `working-directory`  | `"."`                                          | Directory in cui eseguire                 |
| `parallel`           | `false`                                        | Abilita elaborazione parallela            |

[Leggi la documentazione →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

I file di traduzione statici funzionano per le etichette UI, ma cosa succede con i contenuti generati dagli utenti? Messaggi di chat, descrizioni di prodotti, ticket di supporto - contenuti che non esistono al momento della build non possono essere pre-tradotti. Rimani bloccato mostrando testo non tradotto o costruendo una pipeline di traduzione personalizzata.

Lingo.dev SDK traduce i contenuti a runtime. Passa qualsiasi testo, oggetto o HTML e ottieni una versione localizzata. Funziona per chat in tempo reale, notifiche dinamiche o qualsiasi contenuto che arriva dopo il deployment. Disponibile per JavaScript, PHP, Python e Ruby.

**Installazione:**

```bash
npm install lingo.dev
```

**Utilizzo:**

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

**SDK disponibili:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - App web, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[Leggi la documentazione →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

L'i18n tradizionale è invasivo. Avvolgi ogni stringa in funzioni `t()`, inventi chiavi di traduzione (`home.hero.title.v2`), mantieni file JSON paralleli e guardi i tuoi componenti gonfiarsi con boilerplate di localizzazione. È così tedioso che i team ritardano l'internazionalizzazione finché non diventa un refactoring massiccio.

Lingo.dev Compiler elimina le cerimonie. Scrivi componenti React con testo in inglese semplice. Il compiler rileva le stringhe traducibili al momento della build e genera automaticamente le varianti localizzate. Niente chiavi, niente file JSON, niente funzioni wrapper - solo codice React che funziona in più lingue.

**Installazione:**

```bash
pnpm install @lingo.dev/compiler
```

**Autenticazione:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**Configurazione (Next.js):**

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

**Configurazione (Vite):**

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

**Setup del provider:**

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

**Selettore lingua:**

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

**Sviluppo:** `npm run dev` (utilizza pseudotranslator, nessuna chiamata API)

**Produzione:** Imposta `usePseudotranslator: false`, quindi `next build`

Committa la directory `.lingo/` nel version control.

**Caratteristiche principali:**

- Nessun costo di performance a runtime
- Nessuna chiave di traduzione o file JSON
- Nessuna funzione `t()` o componente wrapper `<T>`
- Rilevamento automatico del testo traducibile in JSX
- Supporto TypeScript
- ICU MessageFormat per i plurali
- Override manuali tramite attributo `data-lingo-override`
- Widget editor di traduzione integrato

**Modalità di build:**

- `pseudotranslator`: Modalità sviluppo con traduzioni placeholder (nessun costo API)
- `real`: Genera traduzioni reali utilizzando LLM
- `cache-only`: Modalità produzione utilizzando traduzioni pre-generate da CI (nessuna chiamata API)

**Framework supportati:**

- Next.js (App Router con React Server Components)
- Vite + React (SPA e SSR)

Supporto per framework aggiuntivi in programma.

[Leggi la documentazione →](https://lingo.dev/en/compiler)

---

## Contribuire

I contributi sono benvenuti. Si prega di seguire queste linee guida:

1. **Issue:** [Segnala bug o richiedi funzionalità](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull request:** [Invia modifiche](https://github.com/lingodotdev/lingo.dev/pulls)
   - Ogni PR richiede un changeset: `pnpm new` (o `pnpm new:empty` per modifiche che non richiedono rilascio)
   - Assicurati che i test passino prima di inviare
3. **Sviluppo:** Questo è un monorepo pnpm + turborepo
   - Installa le dipendenze: `pnpm install`
   - Esegui i test: `pnpm test`
   - Build: `pnpm build`

**Supporto:** [Community Discord](https://lingo.dev/go/discord)

## Cronologia stelle

Se trovi Lingo.dev utile, lasciaci una stella e aiutaci a raggiungere 10.000 stelle!

[

![Grafico cronologia stelle](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Documentazione localizzata

**Traduzioni disponibili:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Aggiungere una nuova lingua:**

1. Aggiungi il codice locale a [`i18n.json`](./i18n.json) utilizzando il [formato BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Invia una pull request

**Formato locale BCP-47:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (minuscolo): `en`, `zh`, `bho`
- `Script`: ISO 15924 (maiuscolo iniziale): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (maiuscolo): `US`, `CN`, `IN`
- Esempi: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
