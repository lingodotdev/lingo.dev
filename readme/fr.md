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
    Lingo.dev - Boîte à outils i18n open-source pour la localisation assistée
    par LLM
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Compilateur</a>
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
      alt="Licence"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Dernier commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool du mois"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool de la semaine"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 produit du jour"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Tendances GitHub"
    />
  </a>
</p>

---

## Démarrage rapide

| Outil                                 | Cas d'usage                                                       | Commande rapide                    |
| ------------------------------------- | ----------------------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)              | Configuration i18n assistée par IA pour apps React                | Prompt : `Set up i18n`             |
| [**CLI**](#lingodev-cli)              | Traduction de fichiers JSON, YAML, markdown, CSV, PO              | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)           | Pipeline de traduction automatisé dans GitHub Actions             | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)              | Traduction à l'exécution pour contenu dynamique                   | `npm install lingo.dev`            |
| [**Compilateur**](#lingodev-compiler) | Localisation React au moment de la compilation sans wrappers i18n | Plugin `withLingo()`               |

---

### Lingo.dev MCP

Serveur Model Context Protocol qui permet aux assistants de codage IA de configurer l'infrastructure i18n dans les applications React via des prompts en langage naturel.

**IDE pris en charge :**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**Frameworks pris en charge :**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**Utilisation :**

Après avoir configuré le serveur MCP dans votre IDE ([voir les guides de démarrage rapide](https://lingo.dev/en/mcp)), demandez à votre assistant :

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

L'assistant va :

1. Configurer le routage basé sur les locales (par ex. `/en`, `/es`, `/pt-BR`)
2. Mettre en place les composants de changement de langue
3. Implémenter la détection automatique de la locale
4. Générer les fichiers de configuration nécessaires

**Remarque :** la génération de code assistée par IA est non déterministe. Vérifiez le code généré avant de le valider.

[Lire la documentation →](https://lingo.dev/en/mcp)

---

### CLI Lingo.dev

CLI open source pour traduire des applications et du contenu avec l'IA. Prend en charge tous les formats standards de l'industrie, notamment JSON, YAML, CSV, fichiers PO et markdown.

**Installation :**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**Fonctionnement :**

1. Extrait le contenu traduisible des fichiers configurés
2. Envoie le contenu au fournisseur LLM pour traduction
3. Écrit le contenu traduit dans le système de fichiers
4. Crée un fichier `i18n.lock` pour suivre les traductions terminées (évite le traitement redondant)

**Configuration :**

La commande `init` génère un fichier `i18n.json`. Configurez les locales et les buckets :

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

Le champ `provider` est optionnel (par défaut Lingo.dev Engine). Pour les fournisseurs LLM personnalisés :

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**Fournisseurs LLM pris en charge :**

- Lingo.dev Engine (recommandé)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[Lire la documentation →](https://lingo.dev/en/cli)

---

### CI/CD Lingo.dev

Workflows de traduction automatisés pour les pipelines CI/CD. Empêche les traductions incomplètes d'atteindre la production.

**Plateformes prises en charge :**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**Configuration GitHub Actions :**

Créez `.github/workflows/translate.yml` :

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

**Prérequis de configuration :**

1. Ajoutez `LINGODOTDEV_API_KEY` aux secrets du dépôt (Paramètres > Secrets et variables > Actions)
2. Pour les workflows de PR : activez « Autoriser GitHub Actions à créer et approuver des pull requests » dans Paramètres > Actions > Général

**Options de workflow :**

Commiter les traductions directement :

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Créer des pull requests avec les traductions :

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Entrées disponibles :**

| Entrée               | Par défaut                                     | Description                                  |
| -------------------- | ---------------------------------------------- | -------------------------------------------- |
| `api-key`            | (requis)                                       | Clé API Lingo.dev                            |
| `pull-request`       | `false`                                        | Créer une PR au lieu de commiter directement |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Message de commit personnalisé               |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Titre de PR personnalisé                     |
| `working-directory`  | `"."`                                          | Répertoire dans lequel exécuter              |
| `parallel`           | `false`                                        | Activer le traitement parallèle              |

[Lire la documentation →](https://lingo.dev/en/ci/github)

---

### SDK Lingo.dev

Bibliothèque de traduction runtime pour le contenu dynamique. Disponible pour JavaScript, PHP, Python et Ruby.

**Installation :**

```bash
npm install lingo.dev
```

**Utilisation :**

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

**SDK disponibles :**

- [SDK JavaScript](https://lingo.dev/en/sdk/javascript) - applications web, Node.js
- [SDK PHP](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [SDK Python](https://lingo.dev/en/sdk/python) - Django, Flask
- [SDK Ruby](https://lingo.dev/en/sdk/ruby) - Rails

[Lire la documentation →](https://lingo.dev/en/sdk)

---

### Compilateur Lingo.dev

Système de traduction au moment de la compilation qui rend les applications React multilingues sans modifier les composants. Fonctionne pendant la compilation plutôt qu'à l'exécution.

**Installation :**

```bash
pnpm install @lingo.dev/compiler
```

**Authentification :**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**Configuration (Next.js) :**

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

**Configuration (Vite) :**

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

**Configuration du provider :**

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

**Sélecteur de langue :**

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

**Développement :** `npm run dev` (utilise le pseudotraducteur, aucun appel API)

**Production :** Définir `usePseudotranslator: false`, puis `next build`

Commiter le répertoire `.lingo/` dans le contrôle de version.

**Fonctionnalités clés :**

- Aucun coût de performance à l'exécution
- Pas de clés de traduction ni de fichiers JSON
- Pas de fonctions `t()` ni de composants wrapper `<T>`
- Détection automatique du texte traduisible dans JSX
- Support TypeScript
- ICU MessageFormat pour les pluriels
- Remplacements manuels via l'attribut `data-lingo-override`
- Widget d'éditeur de traduction intégré

**Modes de compilation :**

- `pseudotranslator` : mode développement avec traductions de substitution (aucun coût API)
- `real` : génération de traductions réelles à l'aide de LLM
- `cache-only` : mode production utilisant les traductions pré-générées depuis la CI (aucun appel API)

**Frameworks supportés :**

- Next.js (App Router avec React Server Components)
- Vite + React (SPA et SSR)

Support de frameworks supplémentaires prévu.

[Lire la documentation →](https://lingo.dev/en/compiler)

---

## Contribuer

Les contributions sont les bienvenues. Veuillez suivre ces directives :

1. **Issues :** [Signaler des bugs ou demander des fonctionnalités](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests :** [Soumettre des modifications](https://github.com/lingodotdev/lingo.dev/pulls)
   - Chaque PR nécessite un changeset : `pnpm new` (ou `pnpm new:empty` pour les modifications sans release)
   - Assurez-vous que les tests passent avant de soumettre
3. **Développement :** Il s'agit d'un monorepo pnpm + turborepo
   - Installer les dépendances : `pnpm install`
   - Exécuter les tests : `pnpm test`
   - Build : `pnpm build`

**Support :** [Communauté Discord](https://lingo.dev/go/discord)

## Historique des étoiles

Si vous trouvez Lingo.dev utile, donnez-nous une étoile et aidez-nous à atteindre 10 000 étoiles !

[

![Graphique de l'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Documentation localisée

**Traductions disponibles :**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Ajouter une nouvelle langue :**

1. Ajouter le code de locale à [`i18n.json`](./i18n.json) en utilisant le [format BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Soumettre une pull request

**Format de locale BCP-47 :** `language[-Script][-REGION]`

- `language` : ISO 639-1/2/3 (minuscules) : `en`, `zh`, `bho`
- `Script` : ISO 15924 (casse de titre) : `Hans`, `Hant`, `Latn`
- `REGION` : ISO 3166-1 alpha-2 (majuscules) : `US`, `CN`, `IN`
- Exemples : `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
