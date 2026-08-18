---
"@lingo.dev/compiler": patch
---

Keep translations that completed before a run failed.

When a translation run threw partway through, every entry that had already come back was
discarded: the cache write sits after an early `return` in the `catch`, and the chunk loop
had no inner `try`, so a failure on one chunk took the earlier chunks with it. Those entries
were already generated and billed, and because the next build derives its work list from
what is missing from the cache, the identical strings were submitted and paid for again on
every subsequent build.

Failed runs now persist what completed. The failure is still reported and the build still
fails, so the only change in behaviour is that already-paid work survives.
