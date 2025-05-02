---
"@lingo.dev/_spec": minor
"lingo.dev": minor
---

Add support for Code Hike constructs in MDX loader

This change adds support for Code Hike custom constructs in the MDX loader chain, including:

- CH components (CH.Code, CH.Section, CH.Scrollycoding, CH.Spotlight, CH.Slideshow)
- Code blocks with annotations (focus, mark, withClass, link, from)
- !params syntax for parameter documentation

The implementation follows the same pattern as the existing code-placeholder loader, replacing Code Hike constructs with unique placeholders during translation to ensure they are preserved, and then restoring them afterward.

Configuration options are added to i18n.json to control which constructs should be preserved.
