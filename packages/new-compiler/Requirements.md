## Requirements

1. The core thing is DX. We want compiler to work as seamless as possible.
2. It should work at least with turbopack (since it's next default bundler), webpack and vite.
3. HMR should work, whenever we update the code the state of the app should be kept as it owuld be without the compiler.
4. There should be a way to override the translations
5. We should be able to translate the attributes, the most obvious ones are alt and aria-label, aria-description and
   such, but we may also add a way to translate other string attributes too.
6. We should keep translations calls to the minimum.
7. We start with react, but it would be nice to apply the same approach to other frameworks. Like vue and astro. So the
   system should be flexible.
8. The translations should be possible to commit in the repo, so we can version them. Maybe we can also consider
   conforming to the existing standard?

## Overall architecture

Given that we still may want translations in the dev mode, but we want to keep them to minimum and do not interfere with
the development flow, we may consider the following approach:

1. Do not translate the text unless explicitly requested.
2. Allow using pseudolocalization for even more simple checks. It shows which part of the UI can be translated by
   compiler, and also using varying width of the text highlights part of the interface not ready for varying languages.

This leads us to the question, how to lazily request the translations in the dev mode.
Let's work with the SPA apps as an example (since SSR apps may have more options).
Both currently rendered components and the locale are client side.
Cache for translations is stored in the filesystem in the project.
So the way to receive a request from the browser to the host that will get the translations and store the cache.

The most straightforward way to do this is to use the usual web server. App will send a request for translations when needed,
server components can do the same. This adds a bit of latency but keeps the code uniform.

With this approach we get couple more questions:

- How to start the server
- How to make the client aware about server's address
- How to batch the calls, both client and server side.

How to start the server
While it sounds simple, it's not that simple if you don't want to create any external scripts.
We have at least three environments:

- Next turbopack: no startup hooks.
- Next webpack: there is compiler.hooks.watchRun. Well, watchRun runs on every script compilation during hot reload.
- Vite: buildStart.

So next with turbopack is the most complex case.

It shows which part of the UI can be translated by
compiler - can be done easier? Add some colors
