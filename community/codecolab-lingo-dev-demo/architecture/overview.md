# Architecture Overview

This demo is based on an existing collaborative coding platform
built with React and Node.js.

Localization is layered on top without modifying core editor logic.

Key principles:
- Localization is opt-in
- User code is never translated
- Static UI text is handled separately from editor content

Lingo.dev fits into the system as a localization compiler and
translation engine.
