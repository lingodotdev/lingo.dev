<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ 웹 및 모바일 현지화를 위한 AI 기반 오픈소스 CLI.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">문서</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">기여하기</a> •
  <a href="#-github-action">GitHub 액션</a> •
  <a href="#">저장소에 스타 주기</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="릴리스" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="라이선스" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="마지막 커밋" />
  </a>
</p>

<br />

Lingo.dev는 AI 기반 웹 및 모바일 앱 현지화를 위한 커뮤니티 주도 오픈소스 CLI입니다.

Lingo.dev는 수작업과 관리 오버헤드를 제거하여 즉시 정확한 번역을 생성하도록 설계되었습니다. 결과적으로 팀은 100배 빠르게 정확한 현지화를 수행하여 전 세계 더 많은 사용자에게 기능을 제공할 수 있습니다. 자체 LLM 또는 Lingo.dev에서 관리하는 현지화 엔진과 함께 사용할 수 있습니다.

> **잘 알려지지 않은 사실:** Lingo.dev는 2023년 학생 해커톤에서 작은 프로젝트로 시작되었습니다! 여러 번의 반복 끝에 2024년 Y Combinator에 합격했으며, 현재 채용 중입니다! 차세대 현지화 도구 구축에 관심이 있으신가요? 이력서를 careers@lingo.dev로 보내주세요! 🚀

## 📑 이 가이드에서

- [빠른 시작](#-quickstart) - 몇 분 안에 시작하기
- [캐싱](#-caching-with-i18nlock) - 번역 업데이트 최적화
- [GitHub 액션](#-github-action) - CI/CD에서 현지화 자동화
- [기능](#-supercharged-features) - Lingo.dev의 강력한 기능
- [문서](#-documentation) - 상세 가이드 및 참조
- [기여하기](#-contribute) - 커뮤니티 참여하기

## 💫 빠른 시작

Lingo.dev CLI는 자체 LLM과 최신 SOTA(최첨단) LLM을 기반으로 구축된 Lingo.dev 관리형 현지화 엔진 모두와 함께 작동하도록 설계되었습니다.

### 자체 LLM 사용하기 (BYOK 또는 Bring Your Own Key)

1. `i18n.json` 설정 파일 생성하기:

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "You're translating text from {source} to {target}."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. API 키를 환경 변수로 설정하기:

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# 또는 OpenAI의 경우

export OPENAI_API_KEY=your_openai_api_key
```

3. 현지화 실행하기:

```bash
npx lingo.dev@latest i18n
```

### Lingo.dev 클라우드 사용하기

대부분의 경우, 프로덕션급 앱에는 번역 메모리, 용어집 지원, 현지화 품질 보증과 같은 기능이 필요합니다. 또한 때로는 어떤 LLM 제공자와 모델을 사용할지 전문가가 결정하고, 새로운 모델이 출시될 때 자동으로 업데이트하기를 원할 수 있습니다. Lingo.dev는 이러한 기능을 제공하는 관리형 현지화 엔진입니다:

1. `i18n.json` 설정 파일 생성하기(provider 노드 없이):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Lingo.dev로 인증하기:

```bash
npx lingo.dev@latest auth --login
```

3. 현지화 실행하기:

```bash
npx lingo.dev@latest i18n
```

## 📖 문서

자세한 가이드와 API 참조는 [문서](https://lingo.dev/go/docs)를 방문하세요.

## 🔒 `i18n.lock`을 사용한 캐싱

Lingo.dev는 `i18n.lock` 파일을 사용하여 콘텐츠 체크섬을 추적하고, 변경된 텍스트만 번역되도록 보장합니다. 이는 다음과 같은 이점이 있습니다:

- ⚡️ **속도**: 이미 번역된 콘텐츠 건너뛰기
- 🔄 **일관성**: 불필요한 재번역 방지
- 💰 **비용**: 반복 번역에 대한 요금 부과 없음

## 🤖 GitHub Action

Lingo.dev는 CI/CD 파이프라인에서 현지화를 자동화하는 GitHub Action을 제공합니다. 기본 설정은 다음과 같습니다:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

이 액션은 모든 푸시에서 `lingo.dev i18n`을 실행하여 번역을 자동으로 최신 상태로 유지합니다.

풀 리퀘스트 모드 및 기타 구성 옵션에 대해서는 [GitHub Action 문서](https://docs.lingo.dev/ci-action/gha)를 참조하세요.

## ⚡️ Lingo.dev의 특별한 기능

- 🔥 **즉시 통합**: 몇 분 안에 코드베이스와 연동 가능
- 🔄 **CI/CD 자동화**: 설정 후 신경 쓸 필요 없음
- 🌍 **글로벌 도달**: 전 세계 사용자에게 배포
- 🧠 **AI 기반**: 자연스러운 번역을 위한 최신 언어 모델 사용
- 📊 **형식 무관**: JSON, YAML, CSV, Markdown, Android, iOS 등 다양한 형식 지원
- 🔍 **깔끔한 차이점**: 파일 구조를 정확히 보존
- ⚡️ **초고속**: 몇 초 만에 번역 완료
- 🔄 **항상 동기화**: 콘텐츠 변경 시 자동 업데이트
- 🌟 **사람 수준의 품질**: 기계적이지 않은 자연스러운 번역
- 👨‍💻 **개발자가 개발자를 위해 만든**: 우리도 매일 사용합니다
- 📈 **함께 성장**: 사이드 프로젝트부터 기업 규모까지 확장 가능

## 🤝 기여하기

Lingo.dev는 커뮤니티 중심으로 운영되므로 모든 기여를 환영합니다!

새로운 기능에 대한 아이디어가 있으신가요? GitHub 이슈를 생성해주세요!

기여하고 싶으신가요? 풀 리퀘스트를 만들어주세요!

## 🌐 다른 언어로 된 README

- [English](https://github.com/lingodotdev/lingo.dev)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Chinese](/readme/zh-Hans.md)
- [Korean](/readme/ko.md)
- [Japanese](/readme/ja.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)
- [Hindi](/readme/hi.md)
- [Bengali](/readme/bn.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json) 파일에 새 언어 코드를 추가하고 PR을 열어주세요.
