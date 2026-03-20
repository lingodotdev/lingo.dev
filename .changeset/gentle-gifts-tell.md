---
"lingo.dev": patch
"@lingo.dev/_sdk": patch
---

SDK: Improved API error messages by parsing server JSON responses instead of using HTTP status text. Removed try/catch from whoami so network errors propagate instead of being silently treated as "not authenticated". Deduplicated error handling into shared helpers. Removed unused workflowId parameter.

CLI: Auth failures now show specific error messages (e.g., "Invalid API key" vs generic "Authentication failed").
