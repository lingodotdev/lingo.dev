---
"lingo.dev": patch
---

fix(mdx): preserve fenced code blocks with 4+ backtick fences

The MDX code-placeholder loader hard-coded a 3-backtick fence pattern, so a
fence of 4 or more backticks had only 3 of its closing backticks matched and
the rest orphaned — the close was emitted as ``` ``` ``` + a blank line + a
stray lone backtick, producing invalid MDX (e.g. a code block that swallowed
the following `</Accordion>`). Fences are now matched at their actual length,
with the closing fence allowed to be equal to or longer than the opening
(per CommonMark).
