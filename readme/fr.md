<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ Boîte à outils i18n open-source propulsée par l'IA pour une localisation instantanée avec les LLM.</strong>
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
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Licence" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Dernier commit" />
  </a>
</p>

---

## Découvrez le Compiler 🆕

**Lingo.dev Compiler** est un middleware de compilation gratuit et open-source, conçu pour rendre n'importe quelle application React multilingue au moment de la compilation sans nécessiter de modifications des composants React existants.

```bash
# install once
npm install lingo.dev

# next.config.js
import lingoCompiler from "lingo.dev/compiler";

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
});
```

Exécutez `next build` et regardez les bundles en espagnol et en français apparaître ✨

[Consultez la documentation →](https://lingo.dev/compiler) pour le guide complet.

---

### Que contient ce dépôt ?

| Outil        | En bref                                                                        | Documentation                            |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | Localisation React au moment de la compilation                                 | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Localisation en une commande pour applications web et mobiles, JSON, YAML, markdown, + plus | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Auto-commit des traductions à chaque push + création de pull requests si nécessaire | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Traduction en temps réel pour le contenu généré par les utilisateurs           | [/sdk](https://lingo.dev/sdk)           |

Voici un aperçu rapide de chacun 👇

---

### ⚡️ Lingo.dev CLI

Traduisez le code et le contenu directement depuis votre terminal.

```bash
npx lingo.dev@latest i18n
```

Il crée une empreinte digitale de chaque chaîne, met en cache les résultats et ne retraduit que ce qui a changé.

[Consultez la documentation →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

Livrez automatiquement des traductions parfaites.

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

Maintient votre dépôt au vert et votre produit multilingue sans les étapes manuelles.

[Lire la documentation →](https://lingo.dev/ci)

---

### 🧩 SDK Lingo.dev

Traduction instantanée par requête pour le contenu dynamique.

```ts
import { translate } from "lingo.dev/sdk";

const text = await translate("Hello world", { to: "es" });
// → "¡Hola mundo!"
```

Parfait pour les chats, les commentaires utilisateurs et autres flux en temps réel.

[Lire la documentation →](https://lingo.dev/sdk)

---

## 🤝 Communauté

Nous sommes orientés communauté et adorons les contributions !

- Vous avez une idée ? [Ouvrez un ticket](https://github.com/lingodotdev/lingo.dev/issues)
- Vous voulez corriger quelque chose ? [Envoyez une PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Besoin d'aide ? [Rejoignez notre Discord](https://lingo.dev/go/discord)

## ⭐ Historique des étoiles

Si vous aimez ce que nous faisons, donnez-nous une ⭐ et aidez-nous à atteindre 3 000 étoiles ! 🌟

[

![Graphique d'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dans d'autres langues

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Vous ne voyez pas votre langue ? Ajoutez-la à [`i18n.json`](./i18n.json) et ouvrez une PR !

---

## 🤝 Communauté

Nous sommes orientés communauté et adorons les contributions !

- Vous avez une idée ? [Ouvrez un ticket](https://github.com/lingodotdev/lingo.dev/issues)
- Vous voulez corriger quelque chose ? [Envoyez une PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Besoin d'aide ? [Rejoignez notre Discord](https://lingo.dev/go/discord)

## ⭐ Historique des étoiles

Si vous aimez ce que nous faisons, donnez-nous une ⭐ et aidez-nous à atteindre 3 000 étoiles ! 🌟

[

![Graphique d'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dans d'autres langues

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Vous ne voyez pas votre langue ? Ajoutez-la à [`i18n.json`](./i18n.json) et ouvrez une PR !

---

## 🤝 Communauté

Nous sommes orientés communauté et adorons les contributions !

- Vous avez une idée ? [Ouvrez un ticket](https://github.com/lingodotdev/lingo.dev/issues)
- Vous voulez corriger quelque chose ? [Envoyez une PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Besoin d'aide ? [Rejoignez notre Discord](https://lingo.dev/go/discord)

## ⭐ Historique des étoiles

Si vous aimez ce que nous faisons, donnez-nous une ⭐ et aidez-nous à atteindre 3 000 étoiles ! 🌟

[

![Graphique d'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dans d'autres langues

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Vous ne voyez pas votre langue ? Ajoutez-la à [`i18n.json`](./i18n.json) et ouvrez une PR !

---

## 🤝 Communauté

Nous sommes orientés communauté et adorons les contributions !

- Vous avez une idée ? [Ouvrez un ticket](https://github.com/lingodotdev/lingo.dev/issues)
- Vous voulez corriger quelque chose ? [Envoyez une PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Besoin d'aide ? [Rejoignez notre Discord](https://lingo.dev/go/discord)

## ⭐ Historique des étoiles

Si vous aimez ce que nous faisons, donnez-nous une ⭐ et aidez-nous à atteindre 3 000 étoiles ! 🌟

[

![Graphique d'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dans d'autres langues

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Vous ne voyez pas votre langue ? Ajoutez-la à [`i18n.json`](./i18n.json) et ouvrez une PR !

---

## 🤝 Communauté

Nous sommes orientés communauté et adorons les contributions !

- Vous avez une idée ? [Ouvrez un ticket](https://github.com/lingodotdev/lingo.dev/issues)
- Vous voulez corriger quelque chose ? [Envoyez une PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Besoin d'aide ? [Rejoignez notre Discord](https://lingo.dev/go/discord)

## ⭐ Historique des étoiles

Si vous aimez ce que nous faisons, donnez-nous une ⭐ et aidez-nous à atteindre 3 000 étoiles ! 🌟

[

![Graphique d'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dans d'autres langues

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Vous ne voyez pas votre langue ? Ajoutez-la à [`i18n.json`](./i18n.json) et ouvrez une PR !

---

## 🤝 Communauté

Nous sommes orientés communauté et adorons les contributions !

- Vous avez une idée ? [Ouvrez un ticket](https://github.com/lingodotdev/lingo.dev/issues)
- Vous voulez corriger quelque chose ? [Envoyez une PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Besoin d'aide ? [Rejoignez notre Discord](https://lingo.dev/go/discord)

## ⭐ Historique des étoiles

Si vous aimez ce que nous faisons, donnez-nous une ⭐ et aidez-nous à atteindre 3 000 étoiles ! 🌟

[

![Graphique d'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dans d'autres langues

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Vous ne voyez pas votre langue ? Ajoutez-la à [`i18n.json`](./i18n.json) et ouvrez une PR !

---

## 🤝 Communauté

Nous sommes orientés communauté et adorons les contributions !

- Vous avez une idée ? [Ouvrez un ticket](https://github.com/lingodotdev/lingo.dev/issues)
- Vous voulez corriger quelque chose ? [Envoyez une PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Besoin d'aide ? [Rejoignez notre Discord](https://lingo.dev/go/discord)

## ⭐ Historique des étoiles

Si vous aimez ce que nous faisons, donnez-nous une ⭐ et aidez-nous à atteindre 3 000 étoiles ! 🌟

[

![Graphique d'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dans d'autres langues

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Vous ne voyez pas votre langue ? Ajoutez-la à [`i18n.json`](./i18n.json) et ouvrez une PR !

---

## 🤝 Communauté

Nous sommes orientés communauté et adorons les contributions !

- Vous avez une idée ? [Ouvrez un ticket](https://github.com/lingodotdev/lingo.dev/issues)
- Vous voulez corriger quelque chose ? [Envoyez une PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Besoin d'aide ? [Rejoignez notre Discord](https://lingo.dev/go/discord)

## ⭐ Historique des étoiles

Si vous aimez ce que nous faisons, donnez-nous une ⭐ et aidez-nous à atteindre 3 000 étoiles ! 🌟

[

![Graphique d'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dans d'autres langues

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Vous ne voyez pas votre langue ? Ajoutez-la à [`i18n.json`](./i18n.json) et ouvrez une PR !

---

## 🤝 Communauté

Nous sommes orientés communauté et adorons les contributions !

- Vous avez une idée ? [Ouvrez un ticket](https://github.com/lingodotdev/lingo.dev/issues)
- Vous voulez corriger quelque chose ? [Envoyez une PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Besoin d'aide ? [Rejoignez notre Discord](https://lingo.dev/go/discord)

## ⭐ Historique des étoiles

Si vous aimez ce que nous faisons, donnez-nous une ⭐ et aidez-nous à atteindre 3 000 étoiles ! 🌟

[

![Graphique d'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dans d'autres langues

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Vous ne voyez pas votre langue ? Ajoutez-la à [`i18n.json`](./i18n.json) et ouvrez une PR !

---

## 🤝 Communauté

Nous sommes orientés communauté et adorons les contributions !

- Vous avez une idée ? [Ouvrez un ticket](https://github.com/lingodotdev/lingo.dev/issues)
- Vous voulez corriger quelque chose ? [Envoyez une PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Besoin d'aide ? [Rejoignez notre Discord](https://lingo.dev/go/discord)

## ⭐ Historique des étoiles

Si vous aimez ce que nous faisons, donnez-nous une ⭐ et aidez-nous à atteindre 3 000 étoiles ! 🌟

[

![Graphique d'historique des étoiles](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dans d'autres langues

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Vous ne voyez pas votre langue ? Ajoutez-la à [`i18n.json`](./i18n.json) et ouvrez une PR !
