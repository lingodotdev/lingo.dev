---
"lingo.dev": minor
---

Add watch mode to CLI for automatic retranslation on file changes

This release introduces a new watch mode feature that automatically triggers retranslation when changes are detected in source files:

- **New `--watch` flag**: Enables file watching mode that monitors source files for changes
- **New `--debounce` flag**: Configurable debounce delay (default: 20 seconds) to prevent excessive retranslations
- **Intelligent file pattern detection**: Automatically determines which files to watch based on i18n.json bucket configurations
- **Graceful error handling**: Robust error recovery and process management
- **Background operation**: Non-blocking watch mode with proper cleanup on exit (Ctrl+C)

**Usage:**
```bash
# Enable watch mode with default 20-second debounce
lingo.dev run --watch

# Enable watch mode with custom debounce timing
lingo.dev run --watch --debounce 5000

# Combine with other flags
lingo.dev run --watch --target-locale es --bucket json
```

**Technical Implementation:**
- Uses `chokidar` for robust cross-platform file watching
- Integrates seamlessly with existing CLI pipeline (setup → plan → execute)
- Maintains full compatibility with all existing CLI options and workflows
- Includes comprehensive documentation in `WATCH_MODE.md`

This feature significantly improves developer experience by eliminating the need to manually retrigger translations during development.
