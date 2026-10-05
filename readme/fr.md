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
    Lingo.dev est la plateforme d'ingénierie de localisation : le meilleur moyen
    de mesurer la qualité de traduction, traduire avec des LLM et relire avec
    des locuteurs natifs.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Documentation</a> •
  <a href="https://lingo.dev">Plateforme</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="DevTool n°1 du mois sur Product Hunt"
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
</p>

---

## Les équipes construisent des moteurs de localisation sur Lingo.dev

Un [moteur de localisation](https://lingo.dev/en/docs/platform/engines) est une API de traduction avec état que votre équipe configure et que Lingo.dev exécute. Créez-en un par produit, par type de contenu ou par marque. Chaque requête passant par un moteur applique tout ce que vous avez configuré, dans un ordre de priorité fixe :

| Couche                                                            | Ce que vous configurez                                                     | Depuis la documentation                                                                     |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [Modèles LLM](https://lingo.dev/en/docs/platform/llm-models)      | Quel modèle traite chaque paire de langues, avec des alternatives classées | Plus de 400 modèles ; la réponse indique le modèle qui a été exécuté                        |
| [Voix de marque](https://lingo.dev/en/docs/platform/brand-voices) | Comment votre produit s'exprime dans chaque langue, un texte par locale    | Ton et niveau de formalité par marché                                                       |
| [Règles](https://lingo.dev/en/docs/platform/rules)                | Les conventions linguistiques qu'un modèle générique manque                | Position des adjectifs en espagnol, espace avant les signes de pourcentage                  |
| [Glossaire](https://lingo.dev/en/docs/platform/glossaries)        | Correspondances exactes de termes par locale, associées par sens           | « 911 » devient « 112 » pour les marchés européens ; les noms de produits restent inchangés |
| [Réviseurs IA](https://lingo.dev/en/docs/platform/ai-reviewers)   | Notation qui s'exécute après chaque traduction                             | Scores GEMBA, BERTScore, conformité au glossaire                                            |

Les glossaires, ensembles de règles et voix de marque appartiennent à votre organisation, et un moteur les applique par rattachement. Un glossaire régit cinq moteurs, et une modification atteint les cinq. Testez un changement dans le [Playground](https://lingo.dev/en/docs/platform/playground) avant sa mise en production : comparez un moteur à un modèle brut, ou deux moteurs côte à côte. Les moteurs sont configurés sur la plateforme, où l'équipe de localisation gère l'infrastructure de localisation.

## Accédez à vos moteurs depuis le code

Traduisez le contenu d'un dépôt. `lingo push` envoie les fichiers au moteur nommé dans `.lingo/config.json`, et `lingo pull` récupère les traductions depuis n'importe quelle machine :

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Ou appelez un moteur directement en le nommant par son ID :

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.LINGO_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    engineId: "eng_abc123",
    sourceLocale: "en",
    targetLocale: "de",
    data: { greeting: "Hello, world!", cta: "Get started" },
  }),
});

const { data, model, usage } = await res.json();
// data:  { greeting: "Hallo, Welt!", cta: "Jetzt starten" }
// model: "anthropic/claude-sonnet-4.5"
// usage: { inputTokens: 2789, outputTokens: 861, cost: 0.023012 }
```

|                                                                        |                                                                                                                                                                                                          |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | Votre agent de codage crée un moteur, ajoute des termes au glossaire, ajuste les règles et compare deux moteurs, directement depuis la conversation où le problème est apparu                            |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | Envoyez les fichiers sources, récupérez les traductions, depuis un terminal ou depuis la CI. Dix-huit formats : JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, chaînes Android et Xcode, SubRip, PHP |
| [Lingo.dev en CI/CD](https://lingo.dev/en/docs/workflows)              | Installez la CLI et exécutez `lingo push` comme étape dans GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, ou tout exécuteur avec Node.js 22+                                                         |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Installez une seule fois et chaque push vers la branche par défaut ouvre ou met à jour une pull request de traduction. Pas d'exécuteur, pas de clé API secrète, pas de fichier de verrouillage à gérer   |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | Un appel synchrone par paire de langues, ou une tâche asynchrone qui distribue une requête vers plusieurs locales et délivre les résultats au fur et à mesure                                            |

[Créez votre premier moteur de localisation →](https://lingo.dev)
