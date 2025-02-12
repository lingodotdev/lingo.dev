<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ Kit d'outils de localisation IA pour web & mobile, directement depuis le CI/CD.</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev">Site web</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Contribuer</a> •
  <a href="#-github-action">GitHub Action</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last Commit" />
  </a>
</p>

<br />

Lingo.dev automatise la localisation des logiciels de bout en bout en utilisant les derniers modèles LLM.

Il produit instantanément des traductions authentiques, éliminant le travail manuel et la charge de gestion. Le moteur de localisation Lingo.dev comprend le contexte du produit, créant des traductions perfectionnées que les locuteurs natifs attendent dans plus de 60 langues. En conséquence, les équipes effectuent la localisation 100 fois plus rapidement, avec une qualité à la pointe de la technologie, déployant des fonctionnalités à plus de clients payants dans le monde entier.

## 💫 Démarrage rapide

1. Créez un compte sur [le site web](https://lingo.dev)

2. Initialisez votre projet :

   ```bash
   npx lingo.dev@latest init
   ```

3. Consultez notre documentation : [docs.lingo.dev](https://docs.lingo.dev)

4. Localisez votre application (en quelques secondes) :
   ```bash
   npx lingo.dev@latest i18n
   ```

## 🤖 GitHub Action

Lingo.dev propose une GitHub Action pour automatiser la localisation dans votre pipeline CI/CD. Voici une configuration de base :

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Cette action exécute `lingo.dev i18n` à chaque push, maintenant automatiquement vos traductions à jour.

Pour le mode pull request et d'autres options de configuration, consultez notre [documentation GitHub Action](https://docs.lingo.dev/setup/gha).

## 🥇 Pourquoi les équipes choisissent Lingo.dev

- 🔥 **Intégration instantanée** : Configuration en quelques minutes
- 🔄 **Automatisation CI/CD** : Intégration transparente dans le pipeline de développement
- 🌍 **Plus de 60 langues** : Expansion mondiale sans effort
- 🧠 **Moteur de localisation IA** : Des traductions parfaitement adaptées à votre produit
- 📊 **Flexible en formats** : Supporte JSON, YAML, CSV, Markdown et plus encore

## 🛠️ Fonctionnalités surpuissantes

- ⚡️ **Ultra-rapide** : Localisation IA en quelques secondes
- 🔄 **Mises à jour automatiques** : Synchronisation avec le contenu le plus récent
- 🌟 **Qualité native** : Des traductions qui sonnent authentiques
- 👨‍💻 **Adapté aux développeurs** : CLI qui s'intègre à votre workflow
- 📈 **Évolutif** : Pour les startups en croissance et les équipes enterprise

## 📚 Documentation

Pour des guides détaillés et des références API, visitez la [documentation](https://lingo.dev/go/docs).

## 🤝 Contribuer

Intéressé par une contribution, même si vous n'êtes pas client ?

Consultez les [Good First Issues](https://github.com/lingodotdev/lingo.dev/labels/good%20first%20issue) et lisez le [Guide de contribution](./CONTRIBUTING.md).

## 👨‍💻 Équipe

- **[Veronica](https://github.com/vrcprl)**
- **[Max](https://github.com/maxprilutskiy)**
- **[Matej](https://github.com/mathio)**

Des questions ou des renseignements ? Écrivez à veronica@lingo.dev

## 🌐 Readme dans d'autres langues

- [Anglais](https://github.com/lingodotdev/lingo.dev)
- [Espagnol](/readme/es.md)
- [Français](/readme/fr.md)
- [Russe](/readme/ru.md)
- [Allemand](/readme/de.md)
- [Chinois](/readme/zh-Hans.md)
- [Coréen](/readme/ko.md)
- [Japonais](/readme/ja.md)
- [Italien](/readme/it.md)
- [Arabe](/readme/ar.md)
- [Hindi](/readme/hi.md)

Vous ne voyez pas votre langue ? Ajoutez simplement un nouveau code de langue au fichier [`i18n.json`](./i18n.json) et ouvrez une PR.
