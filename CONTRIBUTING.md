# CONTRIBUTING.md

Thank you for contributing to Lingo.dev! We're an exciting open source project and we'd love to have you contribute!

Here's some resources and guidance to help you get started:

1. [Getting Started](#getting-started)
2. [Issues](#issues)
3. [Pull Requests](#pull-requests)
4. [Release Process](#release-process)

## Getting Started

Here's how to get the project running locally:

### Prerequisites

- **Node.js**: Make sure you have Node.js version 18 or higher installed.
- **pnpm**: You can install using this command `npm install -g pnpm` or by following [this guide](https://pnpm.io/installation)
- **AI API Key**:
  Currently, Groq, Google, and Mistral are supported.
  - **GROQ API Key**: You can get one by signing up at [Groq](https://console.groq.com/)
  - **GOOGLE API Key**: You can get one in the [Google AI Studio](https://aistudio.google.com/apikey)
  - **MISTRAL API Key**: You can get one by signing up at [Mistral AI](https://console.mistral.ai)

### Setup

To set up the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/lingodotdev/lingo.dev
cd lingo.dev
pnpm install
```

Next, configure an AI API key. You can configure a key in two different ways:

**Option A: User-wide (Recommended for development):**

Run one of the following commands that corresponds with the AI provider you want to use in a terminal window. Replace `<your-api-key>` with your actual API key. You can configure Groq, Google, or Mistral.

Groq:

```bash
npx lingo.dev@latest config set llm.groqApiKey <your-api-key>
```

Google:

```bash
npx lingo.dev@latest config set llm.googleApiKey <your-api-key>
```

Mistral:

```bash
npx lingo.dev@latest config set llm.mistralApiKey <your-api-key>
```

This will store the key in your system's user configuration, allowing you to build the project without needing to set it up in each demo directory.

**Option B: Project-wide (Alternative):**

Run the following command in a terminal window. Replace `<your-api-key>` with your actual API key:

Groq:

```bash
# Create .env files in demo directories
echo "GROQ_API_KEY=<your-api-key>" > demo/react-router-app/.env
echo "GROQ_API_KEY=<your-api-key>" > demo/next-app/.env
echo "GROQ_API_KEY=<your-api-key>" > demo/vite-project/.env
```

Google:

```bash
echo "GOOGLE_API_KEY=<your-api-key>" > demo/react-router-app/.env
echo "GOOGLE_API_KEY=<your-api-key>" > demo/next-app/.env
echo "GOOGLE_API_KEY=<your-api-key>" > demo/vite-project/.env
```

Mistral:

```bash
echo "MISTRAL_API_KEY=<your-api-key>" > demo/react-router-app/.env
echo "MISTRAL_API_KEY=<your-api-key>" > demo/next-app/.env
echo "MISTRAL_API_KEY=<your-api-key>" > demo/vite-project/.env
```

This will create `.env` files in each demo directory with your AI API key set as an environment variable.

_Note:_ When loading LLM API keys (including Groq, Google, and Mistral), the Lingo.dev Compiler checks the following sources in order of priority:

1. Environment variables (via `process.env`)
2. Environment files (`.env`, `.env.local`, `.env.development`)
3. Lingo.dev configuration

Next, you can run the project using the following commands:

```bash
# start the build process
pnpm turbo build

# in terminal window 1 - watch for CLI code changes
cd packages/cli
pnpm run dev

# in terminal window 2 - test the CLI
cd packages/cli
pnpm lingo.dev --help # this command will use the current cli code + demo config from ./package/i18n.json
```

Feel free to ask questions on our [Discord server](https://lingo.dev/go/discord)!

## Adding a New LLM Provider

Want to add support for a new LLM provider to Lingo.dev? Here's a checklist to help you get started:

1. **Add Your Dependency**

   - Install the relevant SDK/package for your provider in the necessary `package.json` (usually `cli` and/or `compiler`). Lingo.dev uses the [AI SDK](https://ai-sdk.dev) and its [providers](https://ai-sdk.dev/providers/ai-sdk-providers), so check first to make sure the AI SDK supports your provider.

2. **Update the Config Schema**

   - Edit [`packages/spec/src/config.ts`](./packages/spec/src/config.ts) and update the list of allowed provider `id` values to include your new provider.

3. **Provider Details**

   - Add your provider to [`packages/compiler/src/lib/lcp/api/provider-details.ts`](./packages/compiler/src/lib/lcp/api/provider-details.ts) with name, env var, config key, API docs, and signup link.

4. **API Key Handling**

   - Update [`packages/compiler/src/utils/llm-api-key.ts`](./packages/compiler/src/utils/llm-api-key.ts) to add functions for getting the API key from environment/config.

5. **CLI and Compiler Logic**

   - Update the CLI (e.g., [`packages/cli/src/cli/localizer/explicit.ts`](./packages/cli/src/cli/localizer/explicit.ts), [`packages/cli/src/cli/processor/index.ts`](./packages/cli/src/cli/processor/index.ts)) to support your provider.
   - Update the compiler's translation logic to instantiate your provider's client (see [`packages/compiler/src/lib/lcp/api/index.ts`](./packages/compiler/src/lib/lcp/api/index.ts)).

6. **Error Handling**

   - Ensure user-facing error messages are updated to mention your provider where relevant (API key checks, troubleshooting, etc).

7. **Test and Document**
   - Add or update tests to cover your provider.
   - Update documentation and this contributing guide as needed.

**Tip:**
Look at how existing providers like "groq", "google", and "mistral" are implemented for reference. Consistency helps us maintain quality and predictability!

## Issues

If you find a bug, please create an Issue and we'll triage it.

- Please search [existing Issues](https://github.com/lingodotdev/lingo.dev/issues) before creating a new one
- Please include a clear description of the problem along with steps to reproduce it. Exact steps with screenshots and urls really help here
- Before starting work on an issue, please comment on it and wait for it to be assigned to you. This prevents multiple people from working on the same issue simultaneously
- Let's discuss implementation details in the issue comments or Discord before starting work, to ensure alignment between contributors and the Lingo.dev team

## Pull Requests

We actively welcome your Pull Requests! A couple of things to keep in mind before you submit:

- If you're fixing an Issue, make sure someone else hasn't already created a PR fixing the same issue
- Make sure to link your PR to the related Issue(s)
- We will always try to accept the first viable PR that resolves the Issue
- Please discuss implementation approach beforehand to avoid having PRs rejected

## Release Process

Be sure to run `pnpm new` after you're done with the changes. This will use `changesets` library to trigger a new version after the PR is merged to the main branch. Be sure to do that after requesting a review from the maintainers: the CI build will fail if you don't run `pnpm new`.
