<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ CLI open-source com tecnologia de IA para localização de web e mobile.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">Documentação</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Contribuir</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#">Favoritar o repositório</a>
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

Lingo.dev é uma CLI open-source orientada pela comunidade para localização de aplicativos web e mobile com tecnologia de IA.

Lingo.dev foi projetado para produzir traduções autênticas instantaneamente, eliminando trabalho manual e overhead de gerenciamento. Como resultado, as equipes realizam localização precisa 100x mais rápido, entregando recursos para mais usuários satisfeitos em todo o mundo. Pode ser utilizado com seu próprio LLM ou com o Motor de Localização gerenciado pelo Lingo.dev.

> **Fato pouco conhecido:** Lingo.dev começou como um pequeno projeto em um hackathon estudantil em 2023! Muitas iterações depois, fomos aceitos na Y Combinator em 2024, e agora estamos contratando! Interessado em construir as ferramentas de localização de próxima geração? Envie seu CV para careers@lingo.dev! 🚀

## 📑 Neste guia

- [Início rápido](#-quickstart) - Comece em minutos
- [Cache](#-caching-with-i18nlock) - Otimize atualizações de tradução
- [GitHub Action](#-github-action) - Automatize a localização em CI/CD
- [Recursos](#-supercharged-features) - O que torna o Lingo.dev poderoso
- [Documentação](#-documentation) - Guias detalhados e referências
- [Contribua](#-contribute) - Junte-se à nossa comunidade

## 💫 Início rápido

O CLI Lingo.dev foi projetado para funcionar tanto com seu próprio LLM quanto com o Motor de Localização gerenciado pelo Lingo.dev, construído sobre os mais recentes LLMs SOTA (estado da arte).

### Usando seu próprio LLM (BYOK ou Traga Sua Própria Chave)

1. Crie um arquivo de configuração `i18n.json`:

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "Você está traduzindo texto de {source} para {target}."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Configure sua chave de API como uma variável de ambiente:

```bash
export ANTHROPIC_API_KEY=sua_chave_api_anthropic

# ou para OpenAI

export OPENAI_API_KEY=sua_chave_api_openai
```

3. Execute a localização:

```bash
npx lingo.dev@latest i18n
```

### Usando o Lingo.dev Cloud

Frequentemente, aplicativos de nível de produção requerem recursos como memória de tradução, suporte a glossário e garantia de qualidade de localização. Além disso, às vezes, você quer que um especialista decida qual provedor e modelo de LLM usar, e que atualize o modelo automaticamente quando novos forem lançados. O Lingo.dev é um Mecanismo de Localização gerenciado que oferece esses recursos:

1. Crie um arquivo de configuração `i18n.json` (sem o nó provider):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Autentique-se com o Lingo.dev:

```bash
npx lingo.dev@latest auth --login
```

3. Execute a localização:

```bash
npx lingo.dev@latest i18n
```

## 📖 Documentação

Para guias detalhados e referências de API, visite a [documentação](https://lingo.dev/go/docs).

## 🔒 Cache com `i18n.lock`

O Lingo.dev usa um arquivo `i18n.lock` para rastrear checksums de conteúdo, garantindo que apenas o texto alterado seja traduzido. Isso melhora:

- ⚡️ **Velocidade**: Pula conteúdo já traduzido
- 🔄 **Consistência**: Previne retraduções desnecessárias
- 💰 **Custo**: Sem cobrança por traduções repetidas

## 🤖 GitHub Action

A Lingo.dev oferece uma GitHub Action para automatizar a localização em seu pipeline de CI/CD. Aqui está uma configuração básica:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Esta action executa `lingo.dev i18n` a cada push, mantendo suas traduções atualizadas automaticamente.

Para o modo de pull request e outras opções de configuração, visite nossa [documentação da GitHub Action](https://docs.lingo.dev/ci-action/gha).

## ⚡️ Superpoderes do Lingo.dev

- 🔥 **Integração instantânea**: Funciona com seu código em minutos
- 🔄 **Automação CI/CD**: Configure e esqueça
- 🌍 **Alcance global**: Entregue para usuários em todo lugar
- 🧠 **Alimentado por IA**: Usa os mais recentes modelos de linguagem para traduções naturais
- 📊 **Agnóstico de formato**: JSON, YAML, CSV, Markdown, Android, iOS e muitos mais
- 🔍 **Diffs limpos**: Preserva exatamente a estrutura do seu arquivo
- ⚡️ **Extremamente rápido**: Traduções em segundos, não dias
- 🔄 **Sempre sincronizado**: Atualiza automaticamente quando o conteúdo muda
- 🌟 **Qualidade humana**: Traduções que não parecem robóticas
- 👨‍💻 **Feito por devs, para devs**: Nós mesmos o usamos diariamente
- 📈 **Cresce com você**: De projeto pessoal à escala empresarial

## 🤝 Contribua

Lingo.dev é orientado pela comunidade, então recebemos todas as contribuições!

Tem uma ideia para um novo recurso? Crie uma issue no GitHub!

Quer contribuir? Crie um pull request!

## 🌐 Readme em outros idiomas

- [Inglês](https://github.com/lingodotdev/lingo.dev)
- [Espanhol](/readme/es.md)
- [Francês](/readme/fr.md)
- [Russo](/readme/ru.md)
- [Alemão](/readme/de.md)
- [Chinês](/readme/zh-Hans.md)
- [Coreano](/readme/ko.md)
- [Japonês](/readme/ja.md)
- [Italiano](/readme/it.md)
- [Árabe](/readme/ar.md)
- [Hindi](/readme/hi.md)
- [Bengali](/readme/bn.md)

Não vê seu idioma? Basta adicionar um novo código de idioma ao arquivo [`i18n.json`](./i18n.json) e abrir um PR.