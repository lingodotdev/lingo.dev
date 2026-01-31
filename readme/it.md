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
    ⚡ Lingo.dev - toolkit i18n open-source e basato su AI per la localizzazione
    istantanea con LLM.
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
      alt="Github trending"
    />
  </a>
</p>

---

## Scopri il Compiler 🆕

**Lingo.dev Compiler** è un middleware di compilazione gratuito e open-source, progettato per rendere multilingue qualsiasi app React in fase di build senza richiedere modifiche ai componenti React esistenti.

> **Nota:** se stai utilizzando il compilatore legacy (`@lingo.dev/_compiler`), ti preghiamo di migrare a `@lingo.dev/compiler`. Il compilatore legacy è deprecato e verrà rimosso in una versione futura.

Installa una volta:

```bash
npm install @lingo.dev/compiler
```

Abilita nella tua configurazione di build:

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

Esegui `next build` e guarda apparire i bundle in spagnolo e francese ✨

[Leggi la documentazione →](https://lingo.dev/compiler) per la guida completa e [Unisciti al nostro Discord](https://lingo.dev/go/discord) per ricevere aiuto con la tua configurazione.

---

### Cosa contiene questa repository?

| Strumento    | In breve                                                                                  | Documentazione                          |
| ------------ | ----------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Localizzazione React in fase di build                                                     | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Localizzazione con un solo comando per app web e mobile, JSON, YAML, markdown e altro     | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Commit automatico delle traduzioni ad ogni push + creazione di pull request se necessario | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Traduzione in tempo reale per contenuti generati dagli utenti                             | [/sdk](https://lingo.dev/sdk)           |

Di seguito i punti chiave per ciascuno 👇

---

### ⚡️ Lingo.dev CLI

Traduci codice e contenuti direttamente dal tuo terminale.

```bash
npx lingo.dev@latest run
```

Crea un'impronta digitale di ogni stringa, memorizza i risultati in cache e ritraduce solo ciò che è cambiato.

[Segui la documentazione →](https://lingo.dev/cli) per scoprire come configurarlo.

---

### 🔄 Lingo.dev CI/CD

Distribuisci traduzioni perfette automaticamente.

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

Mantiene la tua repository pulita e il tuo prodotto multilingue senza passaggi manuali.

[Leggi la documentazione →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Traduzione istantanea per richiesta per contenuti dinamici.

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

Perfetto per chat, commenti degli utenti e altri flussi in tempo reale.

[Leggi la documentazione →](https://lingo.dev/sdk)

---

## 🤝 Community

Siamo guidati dalla community e amiamo i contributi!

- Hai un'idea? [Apri una issue](https://github.com/lingodotdev/lingo.dev/issues)
- Vuoi correggere qualcosa? [Invia una PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Hai bisogno di aiuto? [Unisciti al nostro Discord](https://lingo.dev/go/discord)

## ⭐ Cronologia delle stelle

Se ti piace quello che facciamo, dacci una ⭐ e aiutaci a raggiungere 10.000 stelle! 🌟

[

![Grafico cronologia stelle](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme in altre lingue

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

Non vedi la tua lingua? Aggiungila a [`i18n.json`](./i18n.json) e apri una PR!

**Formato locale:** Usa i codici [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale): `language[-Script][-REGION]`

- Lingua: ISO 639-1/2/3 minuscolo (`en`, `zh`, `bho`)
- Script: ISO 15924 maiuscolo iniziale (`Hans`, `Hant`, `Latn`)
- Regione: ISO 3166-1 alpha-2 maiuscolo (`US`, `CN`, `IN`)
- Esempi: `en`, `pt-BR`, `zh-Hans`, {/_ INLINE_CODE_PLACEHOLDER_6e553bb40a655db7be211ded60744c98 _/)
