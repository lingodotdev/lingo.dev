<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – plateforme d'ingénierie de localisation"
    />
  </a>
</p>

<p align="center">
  <strong>
    Outils d'ingénierie de localisation open-source. Connectez-vous à la
    plateforme d'ingénierie de localisation Lingo.dev pour des traductions
    cohérentes et de qualité.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">API Lingo</a> •
  <a href="#lingodev-mcp">MCP React Lingo</a> •
  <a href="#lingodev-cli">CLI Lingo</a> •
  <a href="#lingodev-cicd">Action GitHub Lingo</a> •
  <a href="#lingodev-compiler">
    Compilateur Lingo pour React (Alpha préliminaire)
  </a>
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

| Outil                                                  | Ce qu'il fait                                                     | Commande rapide                    |
| ------------------------------------------------------ | ----------------------------------------------------------------- | ---------------------------------- |
| [**MCP React Lingo**](#lingodev-mcp)                   | Configuration i18n assistée par IA pour apps React                | Invite : `Set up i18n`             |
| [**CLI Lingo**](#lingodev-cli)                         | Localise fichiers JSON, YAML, markdown, CSV, PO                   | `npx lingo.dev@latest run`         |
| [**Action GitHub Lingo**](#lingodev-cicd)              | Localisation continue dans GitHub Actions                         | `uses: lingodotdev/lingo.dev@main` |
| [**Compilateur Lingo pour React**](#lingodev-compiler) | Localisation React au moment de la compilation sans wrappers i18n | Plugin `withLingo()`               |

### Moteurs de localisation

Ces outils se connectent à des [moteurs de localisation](https://lingo.dev) – des API de traduction avec état que vous créez sur la plateforme d'ingénierie de localisation Lingo.dev. Chaque moteur conserve les glossaires, la voix de marque et les instructions par locale à travers chaque requête, [réduisant les erreurs terminologiques de 16,6 à 44,6 %](https://lingo.dev/research/retrieval-augmented-localization). Ou [apportez votre propre LLM](#lingodev-cli).

---

### MCP Lingo.dev

Configurer l'i18n dans les applications React est source d'erreurs – même les assistants de codage IA hallucinent des API inexistantes et cassent le routage. Le MCP Lingo.dev donne aux assistants IA un accès structuré aux connaissances i18n spécifiques aux frameworks pour Next.js, React Router et TanStack Start. Fonctionne avec Claude Code, Cursor, GitHub Copilot Agents et Codex.

[Consultez la documentation →](https://lingo.dev/en/mcp)

---

### CLI Lingo.dev

Localisez des fichiers JSON, YAML, markdown, CSV et PO en une seule commande. Un fichier de verrouillage suit ce qui est déjà localisé – seul le contenu nouveau ou modifié est traité. Par défaut, utilise votre moteur de localisation sur Lingo.dev, ou apportez votre propre LLM (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[Consulter la documentation →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

Localisation continue dans votre pipeline. Chaque push déclenche la localisation – les chaînes manquantes sont complétées avant que le code n'atteigne la production. Compatible avec GitHub Actions, GitLab CI/CD et Bitbucket Pipelines.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[Consulter la documentation →](https://lingo.dev/en/docs/integrations)

---

### API Lingo.dev

Appelez votre moteur de localisation directement depuis le code backend. Localisation synchrone et asynchrone avec livraison par webhook, isolation des échecs par locale et progression en temps réel via WebSocket.

[Consulter la documentation →](https://lingo.dev/en/docs/api)

---

### Lingo Compiler pour React (Alpha précoce)

Localisation React au moment de la compilation sans wrappers i18n. Écrivez vos composants avec du texte en anglais simple – le compilateur détecte les chaînes traduisibles et génère les variantes localisées au moment de la compilation. Aucune clé de traduction, aucun fichier JSON, aucune fonction `t()`. Compatible avec Next.js (App Router) et Vite + React.

[Consulter la documentation →](https://lingo.dev/en/docs/react/compiler)

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
   - Compiler : `pnpm build`

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

1. Ajoutez le code de locale à [`i18n.json`](./i18n.json) en utilisant le [format BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Soumettez une pull request
