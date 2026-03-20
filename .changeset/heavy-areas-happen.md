---
"lingo.dev": patch
---

Fixed a bug where the CI pull request flow would ignore the existing translation branch and start from scratch, which could produce duplicate PRs when the original was merged during a concurrent run.
