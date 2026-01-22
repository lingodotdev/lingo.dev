---
"lingo.dev": patch
---

Exclude previous translations from LLM reference when --force flag is used. The localization engine now receives an empty object instead of existing translations, ensuring truly fresh translations are generated without influence from previous versions.
