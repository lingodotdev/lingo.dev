# @lingo.dev/\_logging

## 0.3.1

### Patch Changes

- [#1667](https://github.com/lingodotdev/lingo.dev/pull/1667) [`1a857bd`](https://github.com/lingodotdev/lingo.dev/commit/1a857bdf76d50afb3024a2437da5fd60e6721bb9) Thanks [@vrcprl](https://github.com/vrcprl)! - Upd NPM workflows

## 0.3.0

### Minor Changes

- [#1634](https://github.com/lingodotdev/lingo.dev/pull/1634) [`48fab66`](https://github.com/lingodotdev/lingo.dev/commit/48fab66b6806455d9faa1dcb169d4c61194e2144) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Pin all dependencies to exact versions to prevent supply chain attacks. Dependencies no longer use caret (^) or tilde (~) ranges, ensuring full control over version updates and requiring explicit review of all dependency changes.

## 0.2.0

### Minor Changes

- [#1226](https://github.com/lingodotdev/lingo.dev/pull/1226) [`bcdc11c`](https://github.com/lingodotdev/lingo.dev/commit/bcdc11c9d508e0156e289489365f0e6f85b13ba8) Thanks [@davidturnbull](https://github.com/davidturnbull)! - Add production-ready logging infrastructure with automatic log rotation and error resilience. Implements Pino-based logging with rotating file streams, smart directory detection, and graceful fallback handling to ensure CLI stability even when logging fails.
