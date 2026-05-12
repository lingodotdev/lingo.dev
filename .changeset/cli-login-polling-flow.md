---
"lingo.dev": minor
---

Fix `lingo.dev login` on Safari and other browsers that block mixed-content requests to `localhost`.

The login command now uses a polling-based device flow: the CLI registers a session with the API, opens the browser to confirm it, then polls until the user grants access. The previous flow opened a local Express server and asked the web page to `POST` the API key to `http://localhost:<port>`, which Safari blocks because the page is served over HTTPS. The `express` and `cors` dependencies are no longer needed and have been removed.
