---
"@lingo.dev/_sdk": minor
"@lingo.dev": minor
---

Added support for AbortController to all public SDK methods, enabling consumers to cancel long-running operations using the standard AbortController API. Refactored internal methods to propagate AbortSignal and check for abortion between batch chunks. Updated fetch calls to use AbortSignal for network request cancellation.

Cleaned up the SDK package by removing non-essential files, including examples, custom tests, and development-only documentation files. Verified that all tests pass and the build is successful after changes.
