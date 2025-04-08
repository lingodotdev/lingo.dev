<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ CLI open-source propulsé par l'IA pour la localisation web et mobile.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">Documentation</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Contribuer</a> •
  <a href="#-github-action">Action GitHub</a> •
  <a href="#">Ajouter une étoile</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Publication" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Licence" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Dernier commit" />
  </a>
</p>

<br />

Lingo.dev est un CLI open-source communautaire pour la localisation d'applications web et mobiles propulsé par l'IA.

Lingo.dev est conçu pour produire instantanément des traductions authentiques, éliminant le travail manuel et les frais de gestion. Ainsi, les équipes réalisent des localisations précises 100 fois plus rapidement, déployant des fonctionnalités pour davantage d'utilisateurs satisfaits dans le monde entier. Il peut être utilisé avec votre propre LLM ou avec le moteur de localisation géré par Lingo.dev.

> **Anecdote peu connue :** Lingo.dev a débuté comme un petit projet lors d'un hackathon étudiant en 2023 ! Après de nombreuses itérations, nous avons été acceptés chez Y Combinator en 2024, et nous recrutons maintenant ! Intéressé par la création d'outils de localisation de nouvelle génération ? Envoyez votre CV à careers@lingo.dev ! 🚀

## 📑 Dans ce guide

- [Démarrage rapide](#-quickstart) - Commencez en quelques minutes
- [Mise en cache](#-caching-with-i18nlock) - Optimisez les mises à jour de traduction
- [Action GitHub](#-github-action) - Automatisez la localisation dans CI/CD
- [Fonctionnalités](#-supercharged-features) - Ce qui rend Lingo.dev puissant
- [Documentation](#-documentation) - Guides détaillés et références
- [Contribuer](#-contribute) - Rejoignez notre communauté

## 💫 Démarrage rapide

Le CLI Lingo.dev est conçu pour fonctionner à la fois avec votre propre LLM et avec le moteur de localisation géré par Lingo.dev, construit sur les derniers LLM à la pointe de la technologie (SOTA).

### Utilisation de votre propre LLM (BYOK ou Bring Your Own Key)

1. Créez un fichier de configuration `i18n.json` :

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "Vous traduisez du texte de {source} vers {target}."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Définissez votre clé API comme variable d'environnement :

```bash
export ANTHROPIC_API_KEY=votre_clé_api_anthropic

# ou pour OpenAI

export OPENAI_API_KEY=votre_clé_api_openai
```

3. Exécutez la localisation :

```bash
npx lingo.dev@latest i18n
```

### Utilisation de Lingo.dev Cloud

Souvent, les applications de niveau production nécessitent des fonctionnalités comme la mémoire de traduction, la prise en charge de glossaires et l'assurance qualité de localisation. Parfois, vous souhaitez qu'un expert choisisse pour vous le fournisseur et le modèle d'IA à utiliser, et qu'il mette à jour automatiquement le modèle lorsque de nouvelles versions sont disponibles. Lingo.dev est un moteur de localisation géré qui offre ces fonctionnalités :

1. Créez un fichier de configuration `i18n.json` (sans le nœud provider) :

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Authentifiez-vous avec Lingo.dev :

```bash
npx lingo.dev@latest auth --login
```

3. Exécutez la localisation :

```bash
npx lingo.dev@latest i18n
```

## 📖 Documentation

Pour des guides détaillés et des références d'API, consultez la [documentation](https://lingo.dev/go/docs).

## 🔒 Mise en cache avec `i18n.lock`

Lingo.dev utilise un fichier `i18n.lock` pour suivre les checksums du contenu, garantissant que seul le texte modifié est traduit. Cela améliore :

- ⚡️ **Vitesse** : Ignore le contenu déjà traduit
- 🔄 **Cohérence** : Évite les retraductions inutiles
- 💰 **Coût** : Pas de facturation pour les traductions répétées

## 🤖 Action GitHub

Lingo.dev propose une action GitHub pour automatiser la localisation dans votre pipeline CI/CD. Voici une configuration de base :

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Cette action exécute `lingo.dev i18n` à chaque push, maintenant automatiquement vos traductions à jour.

Pour le mode pull request et d'autres options de configuration, consultez notre [documentation sur l'action GitHub](https://docs.lingo.dev/setup/gha).

## ⚡️ Les superpouvoirs de Lingo.dev

- 🔥 **Intégration instantanée** : Fonctionne avec votre code en quelques minutes
- 🔄 **Automatisation CI/CD** : Configurez-le et oubliez-le
- 🌍 **Portée mondiale** : Déployez pour des utilisateurs partout
- 🧠 **Propulsé par l'IA** : Utilise les derniers modèles linguistiques pour des traductions naturelles
- 📊 **Format agnostique** : JSON, YAML, CSV, Markdown, Android, iOS et bien plus
- 🔍 **Diffs propres** : Préserve exactement la structure de vos fichiers
- ⚡️ **Ultra-rapide** : Traductions en secondes, pas en jours
- 🔄 **Toujours synchronisé** : Mises à jour automatiques lors des changements de contenu
- 🌟 **Qualité humaine** : Des traductions qui ne sonnent pas robotiques
- 👨‍💻 **Créé par des développeurs, pour des développeurs** : Nous l'utilisons nous-mêmes quotidiennement
- 📈 **Évolue avec vous** : Du projet personnel à l'échelle entreprise

## 🤝 Contribuer

Lingo.dev est piloté par la communauté, nous accueillons donc toutes les contributions !

Vous avez une idée pour une nouvelle fonctionnalité ? Créez une issue GitHub !

Vous souhaitez contribuer ? Créez une pull request !

## 🌐 Readme dans d'autres langues

- [English](https://github.com/lingodotdev/lingo.dev)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Chinese](/readme/zh-Hans.md)
- [Korean](/readme/ko.md)
- [Japanese](/readme/ja.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)
- [Hindi](/readme/hi.md)

Vous ne voyez pas votre langue ? Ajoutez simplement un nouveau code de langue au fichier [`i18n.json`](./i18n.json) et ouvrez une PR.
