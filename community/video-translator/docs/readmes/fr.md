# 🎬 Traduction de sous-titres vidéo en temps réel

Système qui traduit les sous-titres vidéo en temps réel à l'aide du SDK [`lingo.dev`](https://lingo.dev/). Conçu avec une architecture monorepo : frontend sur Vercel, serveur de traduction WebSocket sur Render.

## Énoncé du problème

Une entreprise alimentaire mondiale souhaite atteindre les marchés internationaux. Leur site web et contenu vidéo, incluant textes d'interface, contenu SEO et vidéos culinaires, doivent prendre en charge plusieurs langues.

Actuellement, tout le contenu vidéo est en anglais, et la traduction manuelle des sous-titres pour chaque vidéo est chronophage et coûteuse. L'entreprise recherche une solution basée sur l'IA qui peut :

- Traduire automatiquement l'interface utilisateur du site en plusieurs langues

- Générer et traduire des sous-titres vidéo en temps réel

- Assurer un contenu multilingue optimisé pour le référencement

L'objectif est de gagner du temps, réduire les coûts et offrir une expérience multilingue fluide sans élargir l'équipe de traduction.

![Capture d'écran lingo.video en hindi](desktop.png)

## Table des matières

- [Installation](#getting-started)
- [Démo lingo.video](https://lingo-video.vercel.app/)
- [Architecture et stack technique de traduction de sous-titres vidéo en temps réel](./docs/live-translation-architecture.md)
- [Impact et avantages pour les entreprises mondiales](#impact--benefits-for-global-companies)
- [Fonctionnalités](#features)
- [Défis de la traduction en temps réel et nos solutions](#challenges-with-real-time-translation--how-we-solve-them)
- [Prochaines étapes](./docs/what-is-next.md)
- [Auteur](#author)
- [Licence](#license)

## Mise en route

1. Cloner le dépôt
```
git clone https://github.com/ShubhamOulkar/lingo.video.git
cd lingo.video
```
2. Installer les dépendances
```
pnpm install
```
3. Obtenir une clé API lingo.dev depuis [`lingo.dev`](https://lingo.dev/)
4. Créer un fichier `.env` et y stocker `LINGODOTDEV_API_KEY`
5. Exécuter le frontend et le serveur websocket simultanément
```
pnpm dev
```

## Impact et avantages pour les entreprises mondiales

Ce système offre des avantages tangibles pour les organisations, particulièrement les entreprises alimentaires et de livraison mondiales :

- `Élimine la maintenance des fichiers VTT` : Plus besoin de créer ou stocker manuellement des fichiers de sous-titres .vtt pour chaque langue.

- `Réduit les coûts de base de données et de stockage` : Les sous-titres sont générés et traduits à la volée, les entreprises ne paient pas pour stocker plusieurs fichiers de langues.

- `Minimise la charge de travail des développeurs` : Aucun effort de développement supplémentaire n'est requis pour maintenir du contenu vidéo multilingue.

- `Atteindre les marchés rapidement` : Les vidéos peuvent être livrées en quelques jours au lieu de mois, accélérant la portée mondiale.

- `Support linguistique illimité` : La traduction pilotée par l'IA ouvre la porte à l'accès à n'importe quel pays du monde.

- `Concentration sur le produit, non la traduction` : Les équipes peuvent se concentrer sur l'amélioration du produit principal tandis que le système gère automatiquement le contenu multilingue.

## Fonctionnalités

- **Traduction de sous-titres en temps réel**  
  - Traduit les sous-titres vidéo à la volée à l'aide du SDK [`lingo.dev`](https://lingo.dev/en/sdk) et d'un serveur WebSocket.  
  - Pas besoin de maintenir des fichiers `.vtt` pour plusieurs langues.
  > Remarque : Ce dépôt inclut des [fichiers .vtt](./apps/next-app/public/subtitles/emotions.hi.vtt) pour les tests manuels de précision. Vous pouvez tester en cliquant sur `CC` et comparer avec la traduction en direct.

- **Traduction d'interface en React**  
  - L'interface React se met à jour automatiquement à l'aide du [`Compilateur Lingo`](https://lingo.dev/en/compiler) ⚡🤖.  
  - Compilation dynamique des langues sans codage en dur des traductions.  

- **Contenu multilingue optimisé pour le SEO**  
  - Génère automatiquement des balises meta et Open Graph (OG) à l'aide de [`Lingo CLI`](https://lingo.dev/en/cli).  
  - Entièrement automatisable via des pipelines CI/CD.
  > remarque : Vérifiez les cartes og pour le hindi [ici](https://opengraph.dev/panel?url=https%3A%2F%2Flingo-video.vercel.app%2Fhi) 

- **Efficacité en temps et coûts**  
  - Réduit l'effort des développeurs et élimine les traducteurs tiers.  
  - Livrez du contenu multilingue en **jours au lieu de mois**.  

- **Support linguistique illimité**  
  - La traduction pilotée par l'IA permet d'atteindre n'importe quel pays dans le monde.  
  - Ajoutez facilement de nouvelles langues sans travail manuel.  

- **Concentration sur le produit, non la traduction**  
  - Les équipes peuvent se concentrer sur l'amélioration du produit principal tandis que les traductions se font automatiquement.  

- **Évolutivité avec le volume de vidéos**  
  - Peut gérer un grand nombre de vidéos sans infrastructure ou maintenance supplémentaire.

- **Adaptation au thème système préféré de l'utilisateur** 
  - Le site web peut s'adapter automatiquement au thème clair ou sombre préféré de l'utilisateur.

## Défis de la traduction en temps réel et nos solutions

Les systèmes de traduction en temps réel font face à plusieurs défis techniques et opérationnels. Ce projet est conçu avec des solutions de qualité professionnelle pour minimiser la latence, réduire les coûts de traduction et assurer une précision constante pour les contenus vidéo à haut volume.

### ⚠️ Défis principaux

1. **Latence réseau** : La traduction en temps réel nécessite une communication WebSocket rapide. Toute instabilité du réseau peut retarder les mises à jour des sous-titres.

2. **Délai de génération des tokens LLM** : La qualité de traduction dépend de la vitesse de génération des tokens par le LLM. Une charge élevée ou des sous-titres volumineux peuvent augmenter le temps de réponse. Le SDK Lingo ne prend pas en charge le streaming.

3. **Coûts de traduction redondants** : De nombreux sous-titres répètent le même texte dans différentes vidéos. Sans optimisation, la même génération de tokens est facturée plusieurs fois.

4. **Problèmes de démarrage à froid** : Les déploiements serverless peuvent connaître des temps de démarrage lents, affectant la livraison des sous-titres en temps réel.

5. **Mise à l'échelle avec trafic élevé** : Plusieurs utilisateurs regardant des vidéos simultanément peuvent surcharger les serveurs de traduction ou de socket s'ils ne sont pas optimisés.

## Auteur

- [LinkedIn](www.linkedin.com/in/shubham-oulkar)
- [Frontend Mentor](https://www.frontendmentor.io/profile/ShubhamOulkar)
- [X](https://x.com/shubhuoulkar)

## Licence

Contenu soumis par [shubham oulkar](https://github.com/ShubhamOulkar) sous licence Creative Commons Attribution 4.0 International, comme indiqué dans le fichier [LICENSE](/LICENSE).

## 🌐 Readme dans d'autres langues

[हिंदी](./docs/hi.md) • [日本語](./docs/ja.md) • [Français](./docs/fr.md) • [Deutsch](./docs/de.md) • [Español](./docs/es.md)