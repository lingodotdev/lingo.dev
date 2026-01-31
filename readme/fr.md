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
    ⚡ Lingo.dev - boîte à outils i18n open-source et alimentée par l'IA pour
    une localisation instantanée avec les LLM.
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

## Découvrez le Compiler 🆕

**Lingo.dev Compiler** est un middleware de compilation gratuit et open-source, conçu pour rendre n'importe quelle application React multilingue au moment de la compilation sans nécessiter de modifications des composants React existants.

> **Remarque :** Si vous utilisez le compilateur historique (`@lingo.dev/_compiler`), veuillez migrer vers `@lingo.dev/compiler`. Le compilateur historique est obsolète et sera supprimé dans une version future.

Installez une seule fois :

```bash
npm install @lingo.dev/compiler
```

Activez dans votre configuration de build :

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

Exécutez `next build` et regardez les bundles espagnols et français apparaître ✨

[Consultez la documentation →](https://lingo.dev/compiler) pour le guide complet, et [rejoignez notre Discord](https://lingo.dev/go/discord) pour obtenir de l'aide avec votre configuration.

---

### Que contient ce dépôt ?

| Outil        | En bref                                                                                    | Documentation                           |
| ------------ | ------------------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | Localisation React au moment du build                                                      | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Localisation en une commande pour applications web et mobiles, JSON, YAML, markdown, etc.  | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Commit automatique des traductions à chaque push + création de pull requests si nécessaire | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Traduction en temps réel pour le contenu généré par les utilisateurs                       | [/sdk](https://lingo.dev/sdk)           |

Voici les points essentiels pour chacun 👇

---

### ⚡️ Lingo.dev CLI

Traduisez le code et le contenu directement depuis votre terminal.

```bash
npx lingo.dev@latest run
```

Il empreinte chaque chaîne, met en cache les résultats et ne retraduit que ce qui a changé.

[Suivez la documentation →](https://lingo.dev/cli) pour apprendre à le configurer.

---

### 🔄 Lingo.dev CI/CD

Livrez des traductions parfaites automatiquement.

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

Garde votre dépôt au vert et votre produit multilingue sans les étapes manuelles.

[Consultez la documentation →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Traduction instantanée par requête pour le contenu dynamique.

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

Parfait pour le chat, les commentaires utilisateurs et autres flux en temps réel.

[Lire la documentation →](https://lingo.dev/sdk)

---

## 🤝 Communauté

Nous sommes portés par la communauté et adorons les contributions !

- Vous avez une idée ? [Ouvrez une issue](https://github.com/lingodotdev/lingo.dev/issues)
- Vous voulez corriger quelque chose ? [Envoyez une PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Besoin d'aide ? [Rejoignez notre Discord](https://lingo.dev/go/discord)

## ⭐ Historique des étoiles

Si vous aimez ce que nous faisons, donnez-nous une ⭐ et aidez-nous à atteindre 10 000 étoiles ! 🌟

[

![Graphique de l'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dans d'autres langues

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

Vous ne voyez pas votre langue ? Ajoutez-la à [`i18n.json`](./i18n.json) et ouvrez une PR !

**Format de locale :** utilisez les codes [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) : `language[-Script][-REGION]`

- Langue : ISO 639-1/2/3 en minuscules (`en`, `zh`, `bho`)
- Script : ISO 15924 en casse de titre (`Hans`, `Hant`, `Latn`)
- Région : ISO 3166-1 alpha-2 en majuscules (`US`, `CN`, `IN`)
- Exemples : `en`, `pt-BR`, `zh-Hans`, {/_ INLINE_CODE_PLACEHOLDER_6e553bb40a655db7be211ded60744c98 _/
