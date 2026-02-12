<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev - LLM 기반 현지화를 위한 오픈소스 i18n 툴킷</strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">컴파일러</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="릴리스"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="라이선스"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="최근 커밋"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 이달의 개발 도구 1위"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 이주의 제품 1위"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 오늘의 제품 2위"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github 트렌딩"
    />
  </a>
</p>

---

## 빠른 시작

| 도구                               | 사용 사례                                   | 빠른 명령어                        |
| ---------------------------------- | ------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React 앱을 위한 AI 지원 i18n 설정           | 프롬프트: `Set up i18n`            |
| [**CLI**](#lingodev-cli)           | JSON, YAML, 마크다운, CSV, PO 파일 번역     | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions에서 자동화된 번역 파이프라인 | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | 동적 콘텐츠를 위한 런타임 번역              | `npm install lingo.dev`            |
| [**컴파일러**](#lingodev-compiler) | i18n 래퍼 없이 빌드 타임 React 현지화       | `withLingo()` 플러그인             |

---

### Lingo.dev MCP

React 앱에서 i18n을 설정하는 것은 경험 많은 개발자에게도 오류가 발생하기 쉬운 것으로 악명 높습니다. AI 코딩 어시스턴트는 이를 더 악화시킵니다. 존재하지 않는 API를 환각하고, 미들웨어 구성을 잊고, 라우팅을 망가뜨리거나, 길을 잃기 전에 절반의 솔루션만 구현합니다. 문제는 i18n 설정이 여러 파일(라우팅, 미들웨어, 컴포넌트, 구성)에 걸쳐 정확한 순서의 조정된 변경을 요구하는데, LLM이 그 컨텍스트를 유지하는 데 어려움을 겪는다는 것입니다.

Lingo.dev MCP는 AI 어시스턴트에게 프레임워크별 i18n 지식에 대한 구조화된 액세스를 제공하여 이 문제를 해결합니다. 추측하는 대신, 어시스턴트는 Next.js, React Router, TanStack Start에 대해 검증된 구현 패턴을 따릅니다.

**지원 IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**지원 프레임워크:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**사용법:**

IDE에서 MCP 서버를 구성한 후([빠른 시작 가이드 참조](https://lingo.dev/en/mcp)), 어시스턴트에게 다음과 같이 프롬프트하세요:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

어시스턴트는 다음을 수행합니다:

1. 로케일 기반 라우팅 구성 (예: `/en`, `/es`, `/pt-BR`)
2. 언어 전환 컴포넌트 설정
3. 자동 로케일 감지 구현
4. 필요한 구성 파일 생성

**참고:** AI 지원 코드 생성은 비결정적입니다. 커밋하기 전에 생성된 코드를 검토하세요.

[문서 읽기 →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

번역을 동기화 상태로 유지하는 것은 지루한 작업입니다. 새 문자열을 추가하고, 번역을 잊고, 국제 사용자에게 망가진 UI를 배포합니다. 또는 번역가에게 JSON 파일을 보내고, 며칠을 기다린 다음, 그들의 작업을 수동으로 다시 병합합니다. 10개 이상의 언어로 확장한다는 것은 지속적으로 동기화가 어긋나는 수백 개의 파일을 관리한다는 의미입니다.

Lingo.dev CLI는 이를 자동화합니다. 번역 파일을 가리키고, 하나의 명령을 실행하면 모든 로케일이 업데이트됩니다. 잠금 파일이 이미 번역된 내용을 추적하므로 새롭거나 변경된 콘텐츠에 대해서만 비용을 지불합니다. JSON, YAML, CSV, PO 파일 및 마크다운을 지원합니다.

**설정:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**작동 방식:**

1. 구성된 파일에서 번역 가능한 콘텐츠 추출
2. 번역을 위해 LLM 제공자에게 콘텐츠 전송
3. 번역된 콘텐츠를 파일 시스템에 다시 작성
4. 완료된 번역을 추적하기 위해 `i18n.lock` 파일 생성 (중복 처리 방지)

**구성:**

`init` 명령은 `i18n.json` 파일을 생성합니다. 로케일과 버킷을 구성하세요:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
```

`provider` 필드는 선택 사항입니다 (기본값은 Lingo.dev Engine). 사용자 정의 LLM 제공자의 경우:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**지원되는 LLM 제공자:**

- Lingo.dev Engine (권장)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[문서 읽기 →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

번역은 항상 "거의 완료된" 기능입니다. 엔지니어들은 로케일을 업데이트하지 않고 코드를 병합합니다. QA는 스테이징에서 누락된 번역을 발견하거나, 더 나쁜 경우 사용자가 프로덕션에서 발견합니다. 근본 원인: 번역은 마감 압박 속에서 쉽게 건너뛸 수 있는 수동 단계입니다.

Lingo.dev CI/CD는 번역을 자동화합니다. 모든 푸시가 번역을 트리거합니다. 누락된 문자열은 코드가 프로덕션에 도달하기 전에 채워집니다. 규율이 필요 없습니다 - 파이프라인이 처리합니다.

**지원되는 플랫폼:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions 설정:**

`.github/workflows/translate.yml` 생성:

```yaml
name: Translate
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lingo.dev
        uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**설정 요구사항:**

1. 리포지토리 시크릿에 `LINGODOTDEV_API_KEY` 추가 (Settings > Secrets and variables > Actions)
2. PR 워크플로우의 경우: Settings > Actions > General에서 "Allow GitHub Actions to create and approve pull requests" 활성화

**워크플로우 옵션:**

번역을 직접 커밋:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

번역이 포함된 풀 리퀘스트 생성:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**사용 가능한 입력:**

| 입력                 | 기본값                                         | 설명                    |
| -------------------- | ---------------------------------------------- | ----------------------- |
| `api-key`            | (필수)                                         | Lingo.dev API 키        |
| `pull-request`       | `false`                                        | 직접 커밋 대신 PR 생성  |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | 사용자 정의 커밋 메시지 |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | 사용자 정의 PR 제목     |
| `working-directory`  | `"."`                                          | 실행할 디렉토리         |
| `parallel`           | `false`                                        | 병렬 처리 활성화        |

[문서 읽기 →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

정적 번역 파일은 UI 레이블에는 적합하지만 사용자 생성 콘텐츠는 어떻게 할까요? 채팅 메시지, 제품 설명, 지원 티켓 등 빌드 시점에 존재하지 않는 콘텐츠는 사전 번역할 수 없습니다. 번역되지 않은 텍스트를 표시하거나 사용자 정의 번역 파이프라인을 구축해야 합니다.

Lingo.dev SDK는 런타임에 콘텐츠를 번역합니다. 텍스트, 객체 또는 HTML을 전달하면 현지화된 버전을 받습니다. 실시간 채팅, 동적 알림 또는 배포 후 도착하는 모든 콘텐츠에 사용할 수 있습니다. JavaScript, PHP, Python, Ruby에서 사용 가능합니다.

**설치:**

```bash
npm install lingo.dev
```

**사용법:**

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate objects (preserves structure)
const translated = await lingoDotDev.localizeObject(
  { greeting: "Hello", farewell: "Goodbye" },
  { sourceLocale: "en", targetLocale: "es" },
);
// { greeting: "Hola", farewell: "Adiós" }

// Translate text
const text = await lingoDotDev.localizeText("Hello!", {
  sourceLocale: "en",
  targetLocale: "fr",
});

// Translate to multiple languages at once
const results = await lingoDotDev.batchLocalizeText("Hello!", {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
});

// Translate chat (preserves speaker names)
const chat = await lingoDotDev.localizeChat(
  [{ name: "Alice", text: "Hello!" }],
  { sourceLocale: "en", targetLocale: "es" },
);

// Translate HTML (preserves markup)
const html = await lingoDotDev.localizeHtml("<h1>Welcome</h1>", {
  sourceLocale: "en",
  targetLocale: "de",
});

// Detect language
const locale = await lingoDotDev.recognizeLocale("Bonjour le monde");
// "fr"
```

**사용 가능한 SDK:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - 웹 앱, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[문서 읽기 →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

기존 i18n은 침습적입니다. 모든 문자열을 `t()` 함수로 래핑하고, 번역 키를 만들고(`home.hero.title.v2`), 병렬 JSON 파일을 유지 관리하며, 현지화 보일러플레이트로 컴포넌트가 비대해지는 것을 지켜봐야 합니다. 너무 지루해서 팀들은 국제화를 대규모 리팩토링이 될 때까지 미루게 됩니다.

Lingo.dev Compiler는 복잡한 절차를 제거합니다. 일반 영어 텍스트로 React 컴포넌트를 작성하세요. 컴파일러는 빌드 시점에 번역 가능한 문자열을 감지하고 자동으로 현지화된 변형을 생성합니다. 키도, JSON 파일도, 래퍼 함수도 필요 없습니다 - 그저 여러 언어로 작동하는 React 코드일 뿐입니다.

**설치:**

```bash
pnpm install @lingo.dev/compiler
```

**인증:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**구성 (Next.js):**

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    models: "lingo.dev",
    dev: { usePseudotranslator: true },
  });
}
```

**구성 (Vite):**

```ts
// vite.config.ts
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      models: "lingo.dev",
      dev: { usePseudotranslator: true },
    }),
    react(),
  ],
});
```

**Provider 설정:**

```tsx
// app/layout.tsx (Next.js)
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }) {
  return (
    <LingoProvider>
      <html>
        <body>{children}</body>
      </html>
    </LingoProvider>
  );
}
```

**언어 전환기:**

```tsx
import { useLocale, setLocale } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**개발:** `npm run dev` (의사 번역기 사용, API 호출 없음)

**프로덕션:** `usePseudotranslator: false`를 설정한 후 `next build` 실행

`.lingo/` 디렉토리를 버전 관리에 커밋하세요.

**주요 기능:**

- 런타임 성능 비용 제로
- 번역 키 또는 JSON 파일 불필요
- `t()` 함수 또는 `<T>` 래퍼 컴포넌트 불필요
- JSX 내 번역 가능한 텍스트 자동 감지
- TypeScript 지원
- 복수형을 위한 ICU MessageFormat
- `data-lingo-override` 속성을 통한 수동 재정의
- 내장 번역 편집기 위젯

**빌드 모드:**

- `pseudotranslator`: 플레이스홀더 번역을 사용하는 개발 모드 (API 비용 없음)
- `real`: LLM을 사용하여 실제 번역 생성
- `cache-only`: CI에서 사전 생성된 번역을 사용하는 프로덕션 모드 (API 호출 없음)

**지원 프레임워크:**

- Next.js (React Server Components를 사용하는 App Router)
- Vite + React (SPA 및 SSR)

추가 프레임워크 지원이 계획되어 있습니다.

[문서 읽기 →](https://lingo.dev/en/compiler)

---

## 기여하기

기여를 환영합니다. 다음 가이드라인을 따라주세요:

1. **이슈:** [버그 보고 또는 기능 요청](https://github.com/lingodotdev/lingo.dev/issues)
2. **풀 리퀘스트:** [변경 사항 제출](https://github.com/lingodotdev/lingo.dev/pulls)
   - 모든 PR에는 changeset이 필요합니다: `pnpm new` (또는 릴리스하지 않는 변경 사항의 경우 `pnpm new:empty`)
   - 제출 전에 테스트가 통과하는지 확인하세요
3. **개발:** pnpm + turborepo 모노레포입니다
   - 의존성 설치: `pnpm install`
   - 테스트 실행: `pnpm test`
   - 빌드: `pnpm build`

**지원:** [Discord 커뮤니티](https://lingo.dev/go/discord)

## 스타 히스토리

Lingo.dev가 유용하다면 스타를 주시고 10,000개의 스타를 달성할 수 있도록 도와주세요!

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 현지화된 문서

**사용 가능한 번역:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**새 언어 추가:**

1. [BCP-47 형식](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)을 사용하여 [`i18n.json`](./i18n.json)에 로케일 코드를 추가하세요
2. 풀 리퀘스트를 제출하세요

**BCP-47 로케일 형식:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (소문자): `en`, `zh`, `bho`
- `Script`: ISO 15924 (첫 글자 대문자): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (대문자): `US`, `CN`, `IN`
- 예시: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
