---
"@lingo.dev/_sdk": patch
---

SDK PostHog events now attach the `organization` group when the API reports the
key's organization, so SDK activity shows up in org-level analytics. No behavior
change for API keys whose server does not return an organization id.
