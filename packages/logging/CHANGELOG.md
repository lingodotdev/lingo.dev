# @lingo.dev/\_logging

## 0.3.3

### Patch Changes

- [#2164](https://github.com/lingodotdev/lingo.dev/pull/2164) [`79b1c8f`](https://github.com/lingodotdev/lingo.dev/commit/79b1c8f67af3bc0db95650dfb09bb71677e79c23) Thanks [@ohmoses](https://github.com/ohmoses)! - Added dependency overrides to patch vulnerabilities:
  - picomatch@>=4 <4.0.4: 4.0.4
  - qs@>=6.14.0 <6.14.1: 6.14.1
  - "@unhead/vue": ">=2.1.15 <3"
  - postcss@>=8 <8.5.10: 8.5.10
  - ajv@>=6 <6.14.0: 6.14.0
  - launch-editor@<2.14.1: 2.14.1
  - js-yaml@>=3 <3.15.0: 3.15.0
  - js-yaml@>=4 <4.2.0: 4.2.0
  - joi@>=18 <18.2.1: 18.2.1

## 0.3.2

### Patch Changes

- [#1749](https://github.com/lingodotdev/lingo.dev/pull/1749) [`5bc0c89`](https://github.com/lingodotdev/lingo.dev/commit/5bc0c8952d1bc01be7a2e7b49506f6a5f8f05a59) Thanks [@sumitsaurabh927](https://github.com/sumitsaurabh927)! - create a new space for community contributions like demo apps etc

## 0.3.1

### Patch Changes

- [#1667](https://github.com/lingodotdev/lingo.dev/pull/1667) [`1a857bd`](https://github.com/lingodotdev/lingo.dev/commit/1a857bdf76d50afb3024a2437da5fd60e6721bb9) Thanks [@vrcprl](https://github.com/vrcprl)! - Upd NPM workflows

## 0.3.0

### Minor Changes

- [#1634](https://github.com/lingodotdev/lingo.dev/pull/1634) [`48fab66`](https://github.com/lingodotdev/lingo.dev/commit/48fab66b6806455d9faa1dcb169d4c61194e2144) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Pin all dependencies to exact versions to prevent supply chain attacks. Dependencies no longer use caret (^) or tilde (~) ranges, ensuring full control over version updates and requiring explicit review of all dependency changes.

## 0.2.0

### Minor Changes

- [#1226](https://github.com/lingodotdev/lingo.dev/pull/1226) [`bcdc11c`](https://github.com/lingodotdev/lingo.dev/commit/bcdc11c9d508e0156e289489365f0e6f85b13ba8) Thanks [@davidturnbull](https://github.com/davidturnbull)! - Add production-ready logging infrastructure with automatic log rotation and error resilience. Implements Pino-based logging with rotating file streams, smart directory detection, and graceful fallback handling to ensure CLI stability even when logging fails.
