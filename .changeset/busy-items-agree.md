---
---

Move community examples out of the monorepo into a dedicated repository (lingodotdev/lingo.dev-community). The `community/` directory contained standalone example apps that are not part of any published package, the build, or CI; relocating them keeps the product repo focused and reduces its dependency security surface. No runtime changes — no release.
