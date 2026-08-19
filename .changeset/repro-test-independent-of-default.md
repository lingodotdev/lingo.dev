---
"@lingo.dev/compiler": patch
---

Pin the timeout repro test to its own deadline instead of the package default, so raising the
default does not break it.
