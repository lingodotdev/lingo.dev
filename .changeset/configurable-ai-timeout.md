---
"@lingo.dev/compiler": patch
---

Let the AI request timeout be configured, and raise the default to 2 minutes.

The timeout for a single AI translation request was hardcoded at 60 seconds, which is not
enough when the build runs somewhere with slow network to the model, such as CI, or when a
chunk carries enough text that the model needs longer. The documented workaround was
patching the compiled file inside `node_modules`.

`aiTimeout` is now a plugin option, and the default is 120000. The request that times out is
not cancelled and is still billed, so a value that is too low costs money as well as build
time.
