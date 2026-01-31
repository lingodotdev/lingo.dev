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

AI 코딩 어시스턴트가 자연어 프롬프트를 통해 React 애플리케이션에서 i18n 인프라를 설정할 수 있도록 하는 Model Context Protocol 서버입니다.

**지원되는 IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**지원되는 프레임워크:**

- Next.js (App Router 및 Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**사용법:**

IDE에서 MCP 서버를 구성한 후([빠른 시작 가이드 참조](https://lingo.dev/en/mcp)), 어시스턴트에게 다음과 같이 요청하세요:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

어시스턴트는 다음을 수행합니다:

1. 로케일 기반 라우팅 구성(예: `/en`, `/es`, `/pt-BR`)
2. 언어 전환 컴포넌트 설정
3. 자동 로케일 감지 구현
4. 필요한 구성 파일 생성

**참고:** AI 기반 코드 생성은 비결정적입니다. 커밋하기 전에 생성된 코드를 검토하세요.

[문서 읽기 →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI를 사용하여 앱과 콘텐츠를 번역하는 오픈소스 CLI입니다. JSON, YAML, CSV, PO 파일, 마크다운을 포함한 모든 업계 표준 형식을 지원합니다.

**설정:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**작동 방식:**

1. 구성된 파일에서 번역 가능한 콘텐츠 추출
2. 번역을 위해 LLM 제공업체로 콘텐츠 전송
3. 번역된 콘텐츠를 파일 시스템에 다시 작성
4. 완료된 번역을 추적하기 위해 `i18n.lock` 파일 생성(중복 처리 방지)

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

`provider` 필드는 선택 사항입니다(기본값은 Lingo.dev Engine). 커스텀 LLM 제공업체의 경우:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**지원되는 LLM 제공업체:**

- Lingo.dev Engine(권장)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[문서 읽기 →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD 파이프라인을 위한 자동화된 번역 워크플로우입니다. 불완전한 번역이 프로덕션에 도달하는 것을 방지합니다.

**지원 플랫폼:**

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

1. 저장소 시크릿에 `LINGODOTDEV_API_KEY` 추가 (Settings > Secrets and variables > Actions)
2. PR 워크플로우의 경우: Settings > Actions > General에서 "Allow GitHub Actions to create and approve pull requests" 활성화

**워크플로우 옵션:**

번역을 직접 커밋:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

번역과 함께 풀 리퀘스트 생성:

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

동적 콘텐츠를 위한 런타임 번역 라이브러리. JavaScript, PHP, Python, Ruby에서 사용 가능.

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

### Lingo.dev 컴파일러

컴포넌트를 수정하지 않고 React 앱을 다국어로 만드는 빌드 타임 번역 시스템입니다. 런타임이 아닌 빌드 중에 작동합니다.

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

**프로바이더 설정:**

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
- 번역 키나 JSON 파일 불필요
- `t()` 함수나 `<T>` 래퍼 컴포넌트 불필요
- JSX 내 번역 가능한 텍스트 자동 감지
- TypeScript 지원
- 복수형을 위한 ICU MessageFormat
- `data-lingo-override` 속성을 통한 수동 재정의
- 내장 번역 편집기 위젯

**빌드 모드:**

- `pseudotranslator`: 플레이스홀더 번역을 사용하는 개발 모드 (API 비용 없음)
- `real`: LLM을 사용하여 실제 번역 생성
- `cache-only`: CI에서 미리 생성된 번역을 사용하는 프로덕션 모드 (API 호출 없음)

**지원 프레임워크:**

- Next.js (React Server Components를 사용하는 App Router)
- Vite + React (SPA 및 SSR)

추가 프레임워크 지원이 계획되어 있습니다.

[문서 읽기 →](https://lingo.dev/en/compiler)

---

## 기여하기

기여를 환영합니다. 다음 가이드라인을 따라주세요:

1. **이슈:** [버그 신고 또는 기능 요청](https://github.com/lingodotdev/lingo.dev/issues)
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

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

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
