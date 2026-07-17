---
"lingo.dev": patch
---

Fix Biome formatter silently skipping files when `biome.jsonc` uses a grit `plugins` entry (or any section the bundled Biome can't apply). Previously `applyConfiguration` threw on such keys, formatting was disabled for the whole file, and the project's configured quote style was dropped — files got committed reformatted to defaults on every run. The `plugins` key is now excluded before applying config, and any remaining unsupported/unknown section falls back to formatter-only settings so formatting still runs.
