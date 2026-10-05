<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev — 로컬라이제이션 엔지니어링 플랫폼" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev는 번역 품질 측정부터 LLM 번역, 원어민 교정까지 지원하는 로컬라이제이션 엔지니어링 플랫폼입니다.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">문서</a> •
  <a href="https://lingo.dev">플랫폼</a> •
  <a href="https://lingo.dev/go/discord">디스코드</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt 이달의 DevTool 1위" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="라이선스" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="최근 커밋" /></a>
</p>

---

## 팀은 Lingo.dev에서 로컬라이제이션 엔진을 구축합니다

[로컬라이제이션 엔진](https://lingo.dev/en/docs/platform/engines)은 팀이 구성하고 Lingo.dev가 실행하는 상태 저장형 번역 API입니다. 제품별로, 콘텐츠 유형별로, 또는 브랜드별로 각각 만들 수 있습니다. 엔진을 거치는 모든 요청에는 그 엔진에 설정한 내용이 고정된 우선순위에 따라 순서대로 적용됩니다:

| 레이어 | 설정 항목 | 문서 기준 |
| --- | --- | --- |
| [LLM 모델](https://lingo.dev/en/docs/platform/llm-models) | 각 언어 쌍을 어떤 모델이 처리할지, 우선순위가 매겨진 대체 모델까지 설정 | 400개 이상의 모델 지원, 응답에는 실제로 실행된 모델 이름이 표시됩니다 |
| [브랜드 보이스](https://lingo.dev/en/docs/platform/brand-voices) | 각 언어에서 제품이 어떤 말투로 말할지, 로캘별 텍스트 하나로 설정 | 시장별 톤과 격식 수준 |
| [규칙](https://lingo.dev/en/docs/platform/rules) | 범용 모델이 놓치기 쉬운 언어 규칙 | 스페인어 형용사 위치, 퍼센트 기호 앞 공백 |
| [용어집](https://lingo.dev/en/docs/platform/glossaries) | 의미를 기준으로 매칭되는 로캘별 정확한 용어 매핑 | 유럽 시장에서는 "911"이 "112"로 바뀌고, 제품명은 그대로 유지됩니다 |
| [AI 평가자](https://lingo.dev/en/docs/platform/ai-reviewers) | 모든 번역 후에 실행되는 점수 평가 | GEMBA 점수, BERTScore, 용어집 준수 여부 |

용어집, 규칙 세트, 브랜드 보이스는 조직 단위로 관리되며, 엔진은 이를 연결해 적용합니다. 하나의 용어집으로 다섯 개 엔진을 제어할 수 있고, 한 번 수정하면 다섯 곳 모두에 반영됩니다. 변경 사항을 실제 적용 전에 [Playground](https://lingo.dev/en/docs/platform/playground)에서 테스트해 보세요. 엔진과 원시 모델을 비교하거나, 두 엔진을 나란히 비교할 수 있습니다. 엔진 설정은 플랫폼에서 관리되며, 로컬라이제이션 팀은 그곳에서 로컬라이제이션 인프라를 운영합니다.

## 코드에서 엔진 사용하기

저장소의 콘텐츠를 번역하세요. `lingo push`는 `.lingo/config.json`에 지정된 엔진으로 파일을 보내고, `lingo pull`은 어떤 환경에서든 번역 결과를 다시 가져옵니다:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

또는 ID를 지정해 엔진을 직접 호출할 수도 있습니다:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | 문제가 드러난 바로 그 대화 안에서 코딩 에이전트가 엔진을 만들고, 용어집 항목을 추가하고, 규칙을 조정하고, 두 엔진을 비교합니다 |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | 터미널이나 CI에서 소스 파일을 푸시하고 번역을 가져오세요. JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android 및 Xcode 문자열, SubRip, PHP 등 18가지 형식을 지원합니다 |
| [CI/CD에서 사용하는 Lingo.dev](https://lingo.dev/en/docs/workflows) | CLI를 설치한 뒤 GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, 또는 Node.js 22+를 실행할 수 있는 모든 러너에서 `lingo push`를 단계로 실행하세요 |
| [Lingo.dev GitHub 앱](https://lingo.dev/en/docs/workflows/github-app) | 한 번 설치해 두면 기본 브랜치로 푸시할 때마다 번역용 풀 리퀘스트가 열리거나 업데이트됩니다. 또는 소스를 변경한 풀 리퀘스트에 번역이 커밋으로 반영됩니다. 러너도, API 키 비밀값도, 관리할 Lockfile도 필요 없습니다 |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | 언어 쌍마다 동기 호출 한 번으로 처리하거나, 하나의 요청을 여러 로캘로 확장해 결과가 도착하는 대로 전달하는 비동기 작업으로 실행할 수 있습니다 |

[첫 번째 로컬라이제이션 엔진 만들기 →](https://lingo.dev)
