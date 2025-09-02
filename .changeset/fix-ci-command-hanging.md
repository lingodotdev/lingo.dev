---
"lingo.dev": patch
---

Fix CI command hanging due to process.exit calls

- Remove PostHog shutdown() call that was causing process to hang
- Replace process.exit() with proper exception throwing in i18n and run commands
- Upgrade posthog-node from 5.5.1 to 5.8.1 for better stability
- This fixes the CI command integration where process.exit() was terminating the parent process instead of returning control