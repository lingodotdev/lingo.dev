<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ LLM을 활용한 즉각적인 현지화를 위한 AI 기반 오픈소스 i18n 툴킷.</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev 컴파일러</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
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

---

## 컴파일러 소개 🆕

**Lingo.dev 컴파일러**는 기존 React 컴포넌트를 변경하지 않고도 빌드 타임에 모든 React 앱을 다국어로 만들 수 있도록 설계된 무료 오픈소스 컴파일러 미들웨어입니다.

```bash
# install once
npm install lingo.dev

# next.config.js
import lingoCompiler from "lingo.dev/compiler";

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
});
```

`next build`를 실행하면 스페인어와 프랑스어 번들이 자동으로 생성됩니다 ✨

전체 가이드는 [문서 보기 →](https://lingo.dev/compiler)를 참조하세요.

---

### 이 저장소에는 무엇이 있나요?

| 도구         | 요약                                                                          | 문서                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **컴파일러** | 빌드 타임 React 현지화                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | 웹 및 모바일 앱, JSON, YAML, 마크다운 등을 위한 원커맨드 현지화 | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | 모든 푸시에서 자동 번역 커밋 및 필요시 풀 리퀘스트 생성        | [/ci](https://lingo.dev/ci)             |
| **SDK**      | 사용자 생성 콘텐츠를 위한 실시간 번역                                | [/sdk](https://lingo.dev/sdk)           |

각 도구에 대한 간략한 설명은 아래와 같습니다 👇

---

### ⚡️ Lingo.dev CLI

터미널에서 직접 코드와 콘텐츠를 번역하세요.

```bash
npx lingo.dev@latest i18n
```

모든 문자열에 지문을 생성하고 결과를 캐싱하며 변경된 부분만 다시 번역합니다.

[문서 보기 →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

완벽한 번역을 자동으로 배포하세요.

```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

수동 단계 없이 레포지토리를 그린 상태로 유지하고 제품을 다국어로 만들어 줍니다.

[문서 읽기 →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

동적 콘텐츠를 위한 즉각적인 요청별 번역.

```ts
import { translate } from "lingo.dev/sdk";

const text = await translate("Hello world", { to: "es" });
// → "¡Hola mundo!"
```

채팅, 사용자 댓글 및 기타 실시간 흐름에 완벽합니다.

[문서 읽기 →](https://lingo.dev/sdk)

---

## 🤝 커뮤니티

저희는 커뮤니티 중심이며 기여를 환영합니다!

- 아이디어가 있으신가요? [이슈 열기](https://github.com/lingodotdev/lingo.dev/issues)
- 무언가 수정하고 싶으신가요? [PR 보내기](https://github.com/lingodotdev/lingo.dev/pulls)
- 도움이 필요하신가요? [Discord에 참여하기](https://lingo.dev/go/discord)

## ⭐ 스타 히스토리

저희가 하는 일이 마음에 드신다면, ⭐을 주시고 3,000 스타 달성을 도와주세요! 🌟

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 다른 언어로 된 README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json)에 추가하고 PR을 열어주세요!

---

## 🤝 커뮤니티

저희는 커뮤니티 중심이며 기여를 환영합니다!

- 아이디어가 있으신가요? [이슈 열기](https://github.com/lingodotdev/lingo.dev/issues)
- 무언가 수정하고 싶으신가요? [PR 보내기](https://github.com/lingodotdev/lingo.dev/pulls)
- 도움이 필요하신가요? [Discord에 참여하기](https://lingo.dev/go/discord)

## ⭐ 스타 히스토리

저희가 하는 일이 마음에 드신다면, ⭐을 주시고 3,000 스타 달성을 도와주세요! 🌟

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 다른 언어로 된 README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json)에 추가하고 PR을 열어주세요!

---

## 🤝 커뮤니티

저희는 커뮤니티 중심이며 기여를 환영합니다!

- 아이디어가 있으신가요? [이슈 열기](https://github.com/lingodotdev/lingo.dev/issues)
- 무언가 수정하고 싶으신가요? [PR 보내기](https://github.com/lingodotdev/lingo.dev/pulls)
- 도움이 필요하신가요? [Discord에 참여하기](https://lingo.dev/go/discord)

## ⭐ 스타 히스토리

저희가 하는 일이 마음에 드신다면, ⭐을 주시고 3,000 스타 달성을 도와주세요! 🌟

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 다른 언어로 된 README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json)에 추가하고 PR을 열어주세요!

---

## 🤝 커뮤니티

저희는 커뮤니티 중심이며 기여를 환영합니다!

- 아이디어가 있으신가요? [이슈 열기](https://github.com/lingodotdev/lingo.dev/issues)
- 무언가 수정하고 싶으신가요? [PR 보내기](https://github.com/lingodotdev/lingo.dev/pulls)
- 도움이 필요하신가요? [Discord에 참여하기](https://lingo.dev/go/discord)

## ⭐ 스타 히스토리

저희가 하는 일이 마음에 드신다면, ⭐을 주시고 3,000 스타 달성을 도와주세요! 🌟

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 다른 언어로 된 README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json)에 추가하고 PR을 열어주세요!

---

## 🤝 커뮤니티

저희는 커뮤니티 중심이며 기여를 환영합니다!

- 아이디어가 있으신가요? [이슈 열기](https://github.com/lingodotdev/lingo.dev/issues)
- 무언가 수정하고 싶으신가요? [PR 보내기](https://github.com/lingodotdev/lingo.dev/pulls)
- 도움이 필요하신가요? [Discord에 참여하기](https://lingo.dev/go/discord)

## ⭐ 스타 히스토리

저희가 하는 일이 마음에 드신다면, ⭐을 주시고 3,000 스타 달성을 도와주세요! 🌟

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 다른 언어로 된 README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json)에 추가하고 PR을 열어주세요!

---

## 🤝 커뮤니티

저희는 커뮤니티 중심이며 기여를 환영합니다!

- 아이디어가 있으신가요? [이슈 열기](https://github.com/lingodotdev/lingo.dev/issues)
- 무언가 수정하고 싶으신가요? [PR 보내기](https://github.com/lingodotdev/lingo.dev/pulls)
- 도움이 필요하신가요? [Discord에 참여하기](https://lingo.dev/go/discord)

## ⭐ 스타 히스토리

저희가 하는 일이 마음에 드신다면, ⭐을 주시고 3,000 스타 달성을 도와주세요! 🌟

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 다른 언어로 된 README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json)에 추가하고 PR을 열어주세요!

---

## 🤝 커뮤니티

저희는 커뮤니티 중심이며 기여를 환영합니다!

- 아이디어가 있으신가요? [이슈 열기](https://github.com/lingodotdev/lingo.dev/issues)
- 무언가 수정하고 싶으신가요? [PR 보내기](https://github.com/lingodotdev/lingo.dev/pulls)
- 도움이 필요하신가요? [Discord에 참여하기](https://lingo.dev/go/discord)

## ⭐ 스타 히스토리

저희가 하는 일이 마음에 드신다면, ⭐을 주시고 3,000 스타 달성을 도와주세요! 🌟

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 다른 언어로 된 README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json)에 추가하고 PR을 열어주세요!

---

## 🤝 커뮤니티

저희는 커뮤니티 중심이며 기여를 환영합니다!

- 아이디어가 있으신가요? [이슈 열기](https://github.com/lingodotdev/lingo.dev/issues)
- 무언가 수정하고 싶으신가요? [PR 보내기](https://github.com/lingodotdev/lingo.dev/pulls)
- 도움이 필요하신가요? [Discord에 참여하기](https://lingo.dev/go/discord)

## ⭐ 스타 히스토리

저희가 하는 일이 마음에 드신다면, ⭐을 주시고 3,000 스타 달성을 도와주세요! 🌟

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 다른 언어로 된 README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json)에 추가하고 PR을 열어주세요!

---

## 🤝 커뮤니티

저희는 커뮤니티 중심이며 기여를 환영합니다!

- 아이디어가 있으신가요? [이슈 열기](https://github.com/lingodotdev/lingo.dev/issues)
- 무언가 수정하고 싶으신가요? [PR 보내기](https://github.com/lingodotdev/lingo.dev/pulls)
- 도움이 필요하신가요? [Discord에 참여하기](https://lingo.dev/go/discord)

## ⭐ 스타 히스토리

저희가 하는 일이 마음에 드신다면, ⭐을 주시고 3,000 스타 달성을 도와주세요! 🌟

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 다른 언어로 된 README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json)에 추가하고 PR을 열어주세요!

---

## 🤝 커뮤니티

저희는 커뮤니티 중심이며 기여를 환영합니다!

- 아이디어가 있으신가요? [이슈 열기](https://github.com/lingodotdev/lingo.dev/issues)
- 무언가 수정하고 싶으신가요? [PR 보내기](https://github.com/lingodotdev/lingo.dev/pulls)
- 도움이 필요하신가요? [Discord에 참여하기](https://lingo.dev/go/discord)

## ⭐ 스타 히스토리

저희가 하는 일이 마음에 드신다면, ⭐을 주시고 3,000 스타 달성을 도와주세요! 🌟

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 다른 언어로 된 README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json)에 추가하고 PR을 열어주세요!
