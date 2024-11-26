<p align="center">
  <a href="https://replexica.com">
    <img src="/content/banner.dark.png" width="100%" alt="Replexica" />
  </a>
</p>

<p align="center">
  <strong>⚡️ Localisation IA de pointe pour web & mobile, directement depuis le CI/CD.</strong>
</p>

<br />

<p align="center">
  <a href="https://replexica.com">Site web</a> •
  <a href="https://github.com/replexica/replexica/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Contribuer</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#-localization-compiler-experimental">Compilateur de localisation</a>
</p>

<p align="center">
  <a href="https://github.com/replexica/replexica/actions/workflows/release.yml">
    <img src="https://github.com/replexica/replexica/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/replexica/replexica/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/replexica/replexica" alt="License" />
  </a>
  <a href="https://github.com/replexica/replexica/commits/main">
    <img src="https://img.shields.io/github/last-commit/replexica/replexica" alt="Last Commit" />
  </a>
</p>

<br />

Replexica IA automatise la localisation des logiciels de bout en bout.

Elle produit instantanément des traductions authentiques, éliminant le travail manuel et la charge de gestion. Le moteur de localisation Replexica comprend le contexte du produit, créant des traductions perfectionnées que les locuteurs natifs attendent dans plus de 60 langues. En conséquence, les équipes réalisent la localisation 100 fois plus rapidement, avec une qualité de pointe, déployant des fonctionnalités à davantage de clients payants dans le monde entier.

## 💫 Démarrage rapide

1. **Demandez l'accès** : [contactez-nous](https://replexica.com/go/call) pour devenir client.

2. Une fois approuvé, initialisez votre projet :
   ```bash
   npx replexica@latest init
   ```

3. Localisez votre contenu :
   ```bash
   npx replexica@latest i18n
   ```

## 🤖 GitHub Action

Replexica propose une GitHub Action pour automatiser la localisation dans votre pipeline CI/CD. Voici une configuration de base :

```yaml
- uses: replexica/replexica@main
  with:
    api-key: ${{ secrets.REPLEXICA_API_KEY }}
```

Cette action exécute `replexica i18n` à chaque push, maintenant automatiquement vos traductions à jour.

Pour le mode pull request et d'autres options de configuration, consultez notre [documentation GitHub Action](https://docs.replexica.com/setup/gha).

## 🧪 Compilateur de localisation (expérimental)

Ce dépôt contient également notre nouvelle expérimentation : un compilateur de localisation JS/React.

Il permet aux équipes de développement de faire de la localisation frontend **sans extraire les chaînes dans des fichiers de traduction**. Les équipes peuvent obtenir une interface multilingue avec une seule ligne de code. Il fonctionne au moment de la compilation, utilise la manipulation d'arbre de syntaxe abstraite (AST) et la génération de code.

Vous pouvez voir la démo [ici](https://x.com/MaxPrilutskiy/status/1781011350136734055).

Si vous souhaitez expérimenter le compilateur par vous-même, assurez-vous d'abord de faire `git checkout 6c6d59e8aa27836fd608f9258ea4dea82961120f`.

## 🥇 Pourquoi les équipes choisissent Replexica

- 🔥 **Intégration instantanée** : Configuration en quelques minutes
- 🔄 **Automatisation CI/CD** : Intégration transparente au pipeline de dev
- 🌍 **Plus de 60 langues** : Expansion mondiale sans effort
- 🧠 **Moteur de localisation IA** : Des traductions parfaitement adaptées à votre produit
- 📊 **Flexible en formats** : Supporte JSON, YAML, CSV, Markdown et plus

## 🛠️ Fonctionnalités surpuissantes

- ⚡️ **Ultra-rapide** : Localisation IA en quelques secondes
- 🔄 **Mises à jour auto** : Synchronisation avec le contenu le plus récent
- 🌟 **Qualité native** : Des traductions qui sonnent authentique
- 👨‍💻 **Dev-friendly** : CLI qui s'intègre à votre workflow
- 📈 **Scalable** : Pour startups en croissance et équipes enterprise

## 📚 Documentation

Pour des guides détaillés et des références API, visitez la [documentation](https://replexica.com/go/docs).

## 🤝 Contribuer

Intéressé à contribuer, même si vous n'êtes pas client ?

Consultez les [Good First Issues](https://github.com/replexica/replexica/labels/good%20first%20issue) et lisez le [Guide de contribution](./CONTRIBUTING.md).

## 🧠 Équipe

- **[Veronica](https://github.com/vrcprl)**
- **[Max](https://github.com/maxprilutskiy)**

Des questions ou des demandes ? Écrivez à veronica@replexica.com

## 🌐 Readme dans d'autres langues

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

Vous ne voyez pas votre langue ? Ajoutez simplement un nouveau code de langue au fichier [`i18n.json`](./i18n.json) et ouvrez une PR.
