## Critical Questions & Concerns

### 1. Process Management & Lifecycle

**Concern:** Who starts/stops the translation server? When does it run?

**Questions:**

- Does the compiler start the server automatically when dev mode starts?

Ideally, yes.

- Does it run during builds as well?

We can run it during the build for conformity.

- How do we ensure the server is stopped when the dev server stops?

We could try to rely on the dev server's lifecycle. The process start from another process should be killed with the parent?

- What port does it run on? How do we handle port conflicts?

We should find a free port.

- If the user runs multiple projects, does each get its own server instance?

Yes

### 2. Client-Side Connection

**Concern:** How do client components know where the translation server is?

**Questions:**

- How does browser code discover the server URL and port?

We can wait until the server starts and we now the port and then pass it into the build as a global variable.

- What if port changes between builds?

We inject it during the build, so if the build is restarted we will update it?

---

### 3. Production Deployment

**Concern:** The separate server approach doesn't work in production

**Questions:**

- Is the separate server only for dev mode?

Kind of, we can use the same approach during the build. But once build the app doesn't need a server anymore.

---

### 4. Server Component Compatibility

**Concern:** Server components can't make HTTP requests to localhost

Why can't they, they can and doing this will make the architecture simpler because it will be the same for all the components.

---

### 5. Bundler-Specific Implementation

**Concern:** Different bundlers have different hooks and capabilities

**Vite:**

- Has `configureServer` hook to add middleware
- Middleware runs in-process with Vite dev server
- Easy to add `/api/translations/:locale` endpoint

**Next.js (Turbopack):**

- No plugin API for adding middleware/routes
- Users must manually create `app/api/translations/[locale]/route.ts`
- Route handler runs in same process as Next.js server

**Webpack:**

- Has `devServer.setupMiddlewares` hook
- Similar to Vite, can add middleware in-process

**Question:**
If Vite and Webpack can add middleware in-process, **why do we need a separate server?**

Because for next we have to ask users to create a route that will probably go into prod build if they are not careful. But we don't need it in the porduction.

---

### 8. Build Mode Concerns

**From Requirements:**

> "While the build is in progress, we should perform the translation and create files with translations."

**Questions:**

- Does the separate server also run during builds?

We can run it for uniformity.

- If yes, how do we coordinate with build process (Vite/Next.js/Webpack)?

We can start the server when the build starts and wait until it finishes in something like buildEnd?

---

### 9. Caching Strategy

**Concern:** Where does caching happen with separate server?

**Question:**

- Does separate server enable better caching somehow?

Kind of, we can save client components translations to disk, and we will have do less work during build and use cache.
We still keep the client translations in memory in the Context as well.

---

### 10. Error Handling & Debugging

**Question:**

- How do we surface translation server logs to user?

We can print them to the console.

- What if server crashes? How does user know?

We can print a message to the console and restart the server.

---

### 11. Security & Network Exposure

**Concern:** Separate server creates security surface

**Questions:**

- Do we bind to 0.0.0.0 or localhost?

Does it matter?

- How do we secure it (API keys? CORS rules?)

We do not have to, it's only local server.

- What if user is on corporate network with restrictions?

Does corporate network prohibits to use your local machine?

---

### 12. Webpack/Other Bundlers

**Concern:** Solution needs to work for all bundlers

**Current Support:**

- Vite: ✅ Has middleware (automatic)
- Next.js: ⚠️ Needs manual route file
- Webpack: ❓ Not fully explored

**Question:**

- Does Webpack have same issue as Next.js (needing manual setup)?

No idea, we need to investigate.

---

## Recommendations

### Question to User

**Before implementing separate server, please clarify:**

1. **Primary Goal:** Is the main problem avoiding manual route file creation in Next.js?
   Mostly yes

2. **Production Behavior:** How should production builds work?
   We bundle the translations during the build, so there is no need for a separate server when the app is running.

3. **Server Components:** Should server components also use the separate server?
   Why add HTTP overhead when filesystem access is available?

Because it's simpler to have the same approach for all components.

4. **Scope:** Is this for all bundlers or just Next.js?
   I was thinking for all bundlers to be consistent.
