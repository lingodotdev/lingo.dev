<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – localization engineering platform" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev is the localization engineering platform: the best way to measure translation quality, translate with LLMs, and proofread with native speakers.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Docs</a> •
  <a href="https://lingo.dev">Platform</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Month" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last commit" /></a>
</p>

---

## As equipes criam engines de localização na Lingo.dev

Uma [engine de localização](https://lingo.dev/en/docs/platform/engines) é uma API de tradução com estado, configurada pela sua equipe e operada pela Lingo.dev. Crie uma por produto, por tipo de conteúdo ou por marca. Cada solicitação feita por uma engine aplica tudo o que você configurou nela, em uma ordem fixa de prioridade:

| Camada | O que você configura | Na documentação |
| --- | --- | --- |
| [Modelos de LLM](https://lingo.dev/en/docs/platform/llm-models) | Qual modelo atende cada par de idiomas, com fallbacks em ordem de prioridade | Mais de 400 modelos; a resposta informa qual modelo foi usado |
| [Voz da marca](https://lingo.dev/en/docs/platform/brand-voices) | Como seu produto se comunica em cada idioma, com um texto por idioma | Tom e nível de formalidade por mercado |
| [Regras](https://lingo.dev/en/docs/platform/rules) | As convenções linguísticas que um modelo genérico não capta | Posição do adjetivo em espanhol, espaço antes do sinal de porcentagem |
| [Glossário](https://lingo.dev/en/docs/platform/glossaries) | Mapeamentos exatos de termos por idioma, com correspondência por significado | "911" vira "112" nos mercados europeus; nomes de produto passam sem alteração |
| [Avaliadores de IA](https://lingo.dev/en/docs/platform/ai-reviewers) | Pontuação aplicada após cada tradução | Pontuações GEMBA, BERTScore, conformidade com o glossário |

Glossários, conjuntos de regras e vozes da marca pertencem à sua organização, e a engine os aplica por vínculo. Um único glossário pode governar cinco engines, e uma edição alcança todas as cinco. Teste uma mudança no [Playground](https://lingo.dev/en/docs/platform/playground) antes de ela entrar no ar: compare uma engine com um modelo puro ou duas engines lado a lado. As engines são configuradas na plataforma, onde a equipe de localização opera a infraestrutura de localização.

## Acesse suas engines no código

Traduza o conteúdo de um repositório. `lingo push` envia os arquivos para a engine definida em `.lingo/config.json`, e `lingo pull` grava as traduções de volta em qualquer máquina:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Ou chame uma engine diretamente, informando o ID:

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

| | |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Seu agente de código cria uma engine, adiciona termos ao glossário, ajusta regras e compara duas engines, tudo na conversa em que o problema apareceu |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Envie arquivos de origem e baixe traduções pelo terminal ou pelo CI. Dezoito formatos: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, strings de Android e Xcode, SubRip, PHP |
| [Lingo.dev em CI/CD](https://lingo.dev/en/docs/workflows) | Instale a CLI e execute `lingo push` como uma etapa no GitHub Actions, GitLab CI/CD, Bitbucket Pipelines ou em qualquer runner com Node.js 22+ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Instale uma vez, e cada push para a branch padrão abre ou atualiza uma pull request de tradução, ou faz as traduções chegarem como um commit na pull request que alterou a origem. Sem runner, sem segredo de Chaves de API, sem Lockfile para gerenciar |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Uma chamada síncrona por par de idiomas, ou um job assíncrono que distribui uma solicitação para vários idiomas e entrega os resultados conforme ficam prontos |

[Crie sua primeira engine de localização →](https://lingo.dev)
