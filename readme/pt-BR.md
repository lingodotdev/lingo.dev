<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – plataforma de engenharia de localização"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev é a plataforma de engenharia de localização: a melhor forma de
    medir a qualidade da tradução, traduzir com LLMs e revisar com falantes
    nativos.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Documentação</a> •
  <a href="https://lingo.dev">Plataforma</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool do Mês"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="Licença"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Último commit"
    />
  </a>
</p>

---

## Equipes constroem motores de localização no Lingo.dev

Um [motor de localização](https://lingo.dev/en/docs/platform/engines) é uma API de tradução com estado que sua equipe configura e o Lingo.dev executa. Crie um por produto, por tipo de conteúdo ou por marca. Cada solicitação através de um motor aplica tudo o que você configurou nele, em uma ordem fixa de precedência:

| Camada                                                             | O que você configura                                                        | Da documentação                                                          |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [Modelos LLM](https://lingo.dev/en/docs/platform/llm-models)       | Qual modelo processa cada par de idiomas, com fallbacks classificados       | Mais de 400 modelos; a resposta nomeia o modelo que foi executado        |
| [Voz da marca](https://lingo.dev/en/docs/platform/brand-voices)    | Como seu produto se comunica em cada idioma, um texto por localidade        | Tom e formalidade por mercado                                            |
| [Regras](https://lingo.dev/en/docs/platform/rules)                 | As convenções linguísticas que um modelo genérico perde                     | Posição de adjetivos em espanhol, espaço antes de sinais de porcentagem  |
| [Glossário](https://lingo.dev/en/docs/platform/glossaries)         | Mapeamentos exatos de termos por localidade, correspondidos por significado | "911" se torna "112" para mercados europeus; nomes de produtos não mudam |
| [Revisores de IA](https://lingo.dev/en/docs/platform/ai-reviewers) | Pontuação executada após cada tradução                                      | Pontuações GEMBA, BERTScore, conformidade com glossário                  |

Glossários, conjuntos de regras e vozes de marca pertencem à sua organização, e um motor os aplica por anexação. Um glossário governa cinco motores, e uma edição alcança todos os cinco. Teste uma alteração no [Playground](https://lingo.dev/en/docs/platform/playground) antes de entrar em produção: compare um motor contra um modelo bruto, ou dois motores lado a lado. Os motores são configurados na plataforma, onde a equipe de localização gerencia a infraestrutura de localização.

## Acesse seus mecanismos via código

Traduza o conteúdo de um repositório. `lingo push` envia os arquivos para o mecanismo especificado em `.lingo/config.json`, e `lingo pull` grava as traduções de volta de qualquer máquina:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Ou chame um mecanismo diretamente, identificando-o pelo ID:

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

|                                                                           |                                                                                                                                                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                            | Seu agente de codificação cria um mecanismo, adiciona termos de glossário, ajusta regras e compara dois mecanismos, diretamente da conversa onde o problema surgiu              |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                            | Envie arquivos de origem, receba traduções, de um terminal ou via CI. Dezoito formatos: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, strings Android e Xcode, SubRip, PHP |
| [Lingo.dev em CI/CD](https://lingo.dev/en/docs/workflows)                 | Instale a CLI e execute `lingo push` como uma etapa no GitHub Actions, GitLab CI/CD, Bitbucket Pipelines ou qualquer executor com Node.js 22+                                   |
| [App GitHub do Lingo.dev](https://lingo.dev/en/docs/workflows/github-app) | Instale uma vez e cada push para o branch padrão abre ou atualiza um pull request de tradução. Sem executor, sem chave de API secreta, sem lockfile para gerenciar              |
| [API do Lingo.dev](https://lingo.dev/en/docs/api)                         | Uma chamada síncrona por par de idiomas, ou um job assíncrono que distribui uma solicitação para vários locais e entrega resultados conforme são concluídos                     |

[Crie seu primeiro mecanismo de localização →](https://lingo.dev)
