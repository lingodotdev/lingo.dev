---
"lingo.dev": minor
"@lingo.dev/_sdk": minor
---

Add `lingo.dev run --estimate`: print the approximate cost of pending translations and exit without translating. The CLI computes the same change delta as a regular run, sends per-locale character counts to the new `/process/estimate` endpoint, and prints a per-locale cost breakdown. The SDK gains a matching `estimate()` method.
