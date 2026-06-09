---
"@lingo.dev/_sdk": patch
---

Retry localization requests on transient failures. `localizeChunk` now retries on 5xx responses and network errors using exponential backoff with full jitter, controlled by the new `maxRetries` (default 3) and `retryDelayMs` (default 500) engine options
