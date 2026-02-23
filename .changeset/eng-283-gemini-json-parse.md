---
"lingo.dev": patch
---

fix: strip conversational preamble from LLM responses before JSON parsing

Some models (e.g. Gemini 2.5 Flash Lite) prepend filler text like "OK" to their responses, causing JSON.parse to fail. Now structurally extracts the outermost JSON object using indexOf/lastIndexOf before parsing, with jsonrepair as fallback.
