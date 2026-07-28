---
"lingo.dev": patch
---

fix(cli): parse model responses that break JSON around a quoted placeholder

A source string of `"Attach '{title}'?"` becomes `„{title}" anhängen?` in German:
the language's word order moves the ICU placeholder to the front of the sentence
and its typography wraps it in quotes. Models emit those quotes unescaped, so the
JSON string closes early and the placeholder's `{` lands where a value belongs;
some responses instead drop the value's opening quote entirely. `jsonrepair` gives
up on both (`Unexpected character "{"` and `Colon expected at position N`) and the
whole file fails to translate. German took the brunt of it — the same run
translated every other locale fine, so it looked locale-specific, and it was
deterministic across retries.

`parseModelResponse` gains a last-resort repair pass that escapes quotes sitting
inside a string rather than terminating it (a quote only closes the string when
the next non-whitespace character could legally follow one), and treats a
placeholder in a value position as the start of a string rather than an object.
Extraction now also prefers the first brace that actually opens an object, so a
preamble like `Hier ist die Übersetzung für {title}:` no longer becomes the start
of the response.

The pass runs only after `jsonrepair` itself has failed, so responses that
already parse — or that `jsonrepair` repairs — are untouched, and a genuine
nested object or a `"Zeit: {time}"` value is left alone. The nested
stringified-`data` path goes through the same repair.
