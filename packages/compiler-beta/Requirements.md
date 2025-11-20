# Translation compiler requirements

## Overview of the process

### Dev mode

- When the app is started we should extract translatable text from the code and inject our translation functions.
- When the user changes the code, we should re-extract the text and update the translation functions.
- If a non source language is used (e.g. sources are in english, and user switches to the german) we want to start translations and update the app when they are ready.

### Build mode

- During build we need to extract all the translatable text from the code and inject our translation functions.
- While the build is in progress, we should perform the translation and create files with translations.
- When the build ends we should make sure that all the translations are in place.
- Ideally split translations into multiple chunks, according to the js chunks maybe.

In the end we should have a built app with all the translations in place.

## Problems of the current implementation

We want to avoid fetching translations if they are not needed. To achieve this, we need to ask for translations if they are missing.
We also want to cache the translations to avoid unnecessary requests, by default, the cache is on the user machine.
But client side components in the browser can't access the user machine to save the cache.

This can be solved by adding separate route/middleware on the user machine that can be called from the client and will serve the translations.
We can use Vite middleware and Next routeHandler to do this.

- The approaches differ for different bundlers
- We do not want to ask the user to add the extra route handlers to their app.

## Possible solution

Use a separate server that will serve the translations. It can be started by the compiler. Then client components can fetch the translations from the server.
