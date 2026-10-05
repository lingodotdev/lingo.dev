<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – plataforma de engenharia de localização" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev é a plataforma de engenharia de localização: a melhor forma de medir a qualidade da tradução, traduzir com LLMs e revisar com falantes nativos.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Docs</a> •
  <a href="https://lingo.dev">Plataforma</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool do mês" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Licença" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Último commit" /></a>
</p>

---

## Equipes criam engines de localização na Lingo.dev

Um(a) [engine de localização](https://lingo.dev/en/docs/platform/engines) é uma API de tradução com estado que sua equipe configura e a Lingo.dev executa. Crie uma para cada produto, tipo de conteúdo ou marca. Toda solicitação que passa por um engine aplica tudo o que você configurou nele, em uma ordem fixa de precedência:

| Camada | O que você configura | Na documentação |
| --- | --- | --- |
| [Modelos de LLM](https://lingo.dev/en/docs/platform/llm-models) | Qual modelo atende cada par de idiomas, com fallbacks em ordem de prioridade | Mais de 400 modelos; a resposta informa qual modelo foi usado |
| [Voz da marca](https://lingo.dev/en/docs/platform/brand-voices) | Como seu produto se expressa em cada idioma, com um texto por idioma | Tom e formalidade para cada mercado |
| [Regras](https://lingo.dev/en/docs/platform/rules) | As convenções linguísticas que um modelo genérico deixa passar | Posição do adjetivo em espanhol, espaço antes do símbolo de porcentagem |
| [Glossário](https://lingo.dev/en/docs/platform/glossaries) | Mapeamentos exatos de termos por idioma, identificados por significado | "911" vira "112" nos mercados europeus; nomes de produtos passam sem alteração |
| [Avaliadores de IA](https://lingo.dev/en/docs/platform/ai-reviewers) | Pontuação executada após cada tradução | Pontuações GEMBA, BERTScore, conformidade com o glossário |

Glossários, conjuntos de regras e vozes da marca pertencem à sua organização, e um engine os aplica por associação. Um único glossário pode governar cinco engines, e uma única edição chega aos cinco. Teste uma mudança no [Playground](https://lingo.dev/en/docs/platform/playground) antes de ela entrar em produção: compare um engine com um modelo bruto, ou dois engines lado a lado. Os engines são configurados na plataforma, onde a equipe de localização opera a infraestrutura de localização.

## Acesse seus engines pelo código

Traduza o conteúdo de um repositório. `lingo push` envia os arquivos para o engine indicado em `.lingo/config.json`, e `lingo pull` grava as traduções de volta de qualquer máquina:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Ou chame um engine diretamente, informando o ID:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Seu agente de código cria um engine, adiciona termos ao glossário, ajusta regras e compara dois engines, tudo a partir da conversa em que o problema surgiu |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Envie arquivos-fonte e traga as traduções de volta pelo terminal ou pela CI. Dezoito formatos: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, strings de Android e Xcode, SubRip, PHP |
| [Lingo.dev em CI/CD](https://lingo.dev/en/docs/workflows) | Instale a CLI e execute `lingo push` como uma etapa no GitHub Actions, GitLab CI/CD, Bitbucket Pipelines ou em qualquer runner com Node.js 22+ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Instale uma vez e cada push para a branch padrão abre ou atualiza um pull request de tradução, ou faz as traduções chegarem como um commit no pull request que alterou a fonte. Sem runner, sem segredo de Chaves de API, sem Lockfile para gerenciar |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Uma chamada síncrona por par de idiomas, ou um job assíncrono que distribui uma solicitação para vários idiomas e entrega os resultados conforme ficam prontos |

[Crie seu primeiro engine de localização →](https://lingo.dev)
