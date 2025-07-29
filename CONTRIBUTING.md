# CONTRIBUTING.md

Thank you for contributing to Lingo.dev! We're an exciting open source project and we love having you contribute!

Here are some resources and guidance to help you get started:

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

Next, configure an AI API key. You can use either a Lingo.dev API key or one of the supported LLM model providers.

Please refer to our docs on how to set this up: https://lingo.dev/en/cli/quick-start#step-2-authentication

_Note:_ When loading LLM API keys (both Lingo.dev and other LLM model providers like Groq or Mistral), the Lingo.dev Compiler checks the following sources in order of priority:

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
pnpm lingo.dev --help # this command will use the current CLI code + demo config from ./packages/cli/i18n.json
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
- Please include a clear description of the problem along with steps to reproduce it. Exact steps with screenshots and URLs really help here
- Before starting work on an issue, please comment on it and wait for it to be assigned to you. This prevents multiple people from working on the same issue simultaneously
- Let's discuss implementation details in the issue comments or Discord before starting work, to ensure alignment between contributors and the Lingo.dev team

## Pull Requests

We love your Pull Requests! However, we maintain extremely high standards for code quality and design. We are looking for elegant, 12/10, beautiful code and deeply weighted system design decisions.

### Our Standards

- **Surgical PRs**: Pull requests must be surgical and extremely single-purposed. One clear objective per PR.
- **Elegant Code**: We expect beautifully crafted, elegant code that demonstrates mastery of the language and patterns.
- **Deep Design Thinking**: System design decisions must be deeply considered and well-reasoned.
- **Comprehensive Testing**: Must include tests that surgically test both positive and negative paths of the code.
- **Uncompromising Quality**: We prefer fewer, higher-quality contributions over numerous mediocre ones.

A couple of things to keep in mind before you submit:

### Before you open a pull request

- GitHub Issue
  - Make sure the fix or feature is sufficiently documented and discussed in advance in an existing [GitHub Issue](https://github.com/lingodotdev/lingo.dev/issues)
  - If there are no related issues, **we strongly suggest you [create a new Issue](https://github.com/lingodotdev/lingo.dev/issues/new)** and discuss your feature or proposal with the Lingo.dev team
  - If there is a Discord thread already, please summarize it in a GitHub Issue. This helps to keep everyone in the loop, including open-source contributors and Lingo.dev team members not part of the original conversation. It also serves as documentation for future decisions.
- README update
  - If applicable, please add a section with the CLI commands introduced in your PR (what their purpose is and how to use them)
  - It is not necessary to update the README file for every change, oftentimes a comprehensive description in the Issue or PR description is enough
- Tests
  - Your changes should include unit tests for the main code paths, to make sure nothing breaks
- Changeset
  - Add a [changeset](https://github.com/changesets/changesets) for your feature or fix (run `pnpm new` from the repo root)
- PR checks
  - Make sure all checks pass
  - You can run the checks locally in repo root:
    ```sh
    pnpm install --frozen-lockfile
    pnpm format:check
    pnpm turbo build --force
    pnpm turbo test --force
    pnpm changeset status --since origin/main
    ```
    ...or let GitHub run it in the PR for you.

### Opening a pull request

- GitHub Issue
  - Make sure to link your PR to the existing Issue(s)
  - We may not be able to accept new features without existing Issues
  - This does not apply to smaller fixes with sufficient description in the PR
- Existing PRs
  - Make sure someone else hasn't already created a PR fixing the same issue.
- PR title
  - The title should be [a valid Conventional Commit title](https://github.com/amannn/action-semantic-pull-request?tab=readme-ov-file#action-semantic-pull-request)
  - Should start with `feat:`, `fix:`, `chore:`, etc.
- PR description
  - Should contain sufficient description of your PR (unless the linked Issue already does)
  - _💡 Tip:_ Oftentimes less is more. Try to write in your own words; real humans are reviewing your PR.
- Demo video
  - For larger features we would really appreciate a quick screen recording showing it in action
  - It helps make the review process faster
  - You can use [open-source Cap](https://github.com/CapSoftware/Cap), [QuickTime on Mac](https://support.apple.com/guide/quicktime-player/record-your-screen-qtp97b08e666/mac), or any other software you prefer

### Review Process

- We will always try to accept the first viable PR that resolves the Issue
- Please discuss implementation approach beforehand to avoid having PRs rejected
- Please actively discuss with the Lingo.dev team in the PR and related Issue(s)

#### Automated Code Review

We use Claude Code to provide automated code reviews on all pull requests. This helps ensure:

- Code quality and maintainability
- Security best practices
- Performance considerations
- Proper test coverage
- Documentation completeness

The automated review will post comments on your PR with suggestions and feedback. While these are helpful guidelines, human reviewers will make the final decisions. If Claude Code identifies critical security issues, please address them promptly.

---

Thank you!
