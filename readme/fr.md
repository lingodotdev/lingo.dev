<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – plateforme d’ingénierie de la localisation" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev est la plateforme d’ingénierie de la localisation : la meilleure façon de mesurer la qualité des traductions, de traduire avec des LLM et de faire relire par des natifs.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Docs</a> •
  <a href="https://lingo.dev">Plateforme</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt n° 1 des DevTools du mois" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Licence" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Dernier commit" /></a>
</p>

---

## Les équipes créent des moteurs de localisation sur Lingo.dev

Un [moteur de localisation](https://lingo.dev/en/docs/platform/engines) est une API de traduction avec état, configurée par votre équipe et exécutée par Lingo.dev. Créez-en un par produit, par type de contenu ou par marque. Chaque requête envoyée à un moteur applique tout ce que vous y avez configuré, selon un ordre de priorité fixe :

| Couche | Ce que vous configurez | Dans la documentation |
| --- | --- | --- |
| [Modèles LLM](https://lingo.dev/en/docs/platform/llm-models) | Le modèle attribué à chaque paire de langues, avec des solutions de repli classées par ordre de priorité | Plus de 400 modèles ; la réponse indique lequel a été utilisé |
| [Voix de marque](https://lingo.dev/en/docs/platform/brand-voices) | La manière dont votre produit s’exprime dans chaque langue, avec un texte par langue | Ton et niveau de formalité selon le marché |
| [Règles](https://lingo.dev/en/docs/platform/rules) | Les conventions linguistiques qu’un modèle générique ne capte pas | La place de l’adjectif en espagnol, une espace avant les signes de pourcentage |
| [Glossaire](https://lingo.dev/en/docs/platform/glossaries) | Des correspondances terminologiques exactes par langue, mises en relation selon le sens | « 911 » devient « 112 » pour les marchés européens ; les noms de produits passent tels quels |
| [Évaluateurs IA](https://lingo.dev/en/docs/platform/ai-reviewers) | Une évaluation lancée après chaque traduction | Scores GEMBA, BERTScore, conformité au glossaire |

Les glossaires, jeux de règles et voix de marque appartiennent à votre organisation, et un moteur les applique selon ce qui lui est rattaché. Un même glossaire peut piloter cinq moteurs, et une seule modification se répercute sur les cinq. Testez un changement dans le [Playground](https://lingo.dev/en/docs/platform/playground) avant sa mise en production : comparez un moteur à un modèle brut, ou deux moteurs côte à côte. Les moteurs se configurent sur la plateforme, là où l’équipe de localisation pilote toute l’infrastructure de localisation.

## Accédez à vos moteurs depuis le code

Traduisez le contenu d’un dépôt. `lingo push` envoie les fichiers au moteur indiqué dans `.lingo/config.json`, et `lingo pull` réécrit les traductions depuis n’importe quelle machine :

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Ou appelez directement un moteur en indiquant son ID :

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: { "X-API-Key": process.env.LINGO_API_KEY, "Content-Type": "application/json" },
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

|| |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Votre agent de code crée un moteur, ajoute des termes au glossaire, affine les règles et compare deux moteurs, depuis la conversation où le problème est apparu |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Envoyez les fichiers source et récupérez les traductions depuis un terminal ou via CI. Dix-huit formats : JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, chaînes Android et Xcode, SubRip, PHP |
| [Lingo.dev dans CI/CD](https://lingo.dev/en/docs/workflows) | Installez la CLI et exécutez `lingo push` comme étape dans GitHub Actions, GitLab CI/CD, Bitbucket Pipelines ou n’importe quel runner avec Node.js 22+ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Installez-la une seule fois, puis chaque push sur la branche par défaut ouvre ou met à jour une pull request de traduction, ou ajoute les traductions sous forme de commit dans la pull request qui a modifié la source. Aucun runner, aucun secret de clé API, aucun Lockfile à gérer |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Un appel synchrone par paire de langues, ou une tâche asynchrone qui diffuse une requête vers de nombreuses langues et livre les résultats au fur et à mesure |

[Créez votre premier moteur de localisation →](https://lingo.dev)
