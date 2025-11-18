# Contributing to Lingo.dev

Thank you for contributing! We maintain high standards for code quality and design.

**IMPORTANT: Every requirement below is critical. If any requirement is not met, your issue or PR will be automatically rejected by the bots.**

## Before You Start

1. **Find or create an issue** - Search [existing issues](https://github.com/lingodotdev/lingo.dev/issues) first
2. **Wait to be assigned** - Comment on the issue and wait for assignment before starting work. Assignment priority:
   - First: Issue creator
   - Second: First volunteer commenter
   - **Submitting a PR without assignment will result in automatic rejection**
3. **Discuss approach** - Align on implementation details before coding

## Pull Request Requirements

### Must Have

- **Linked issue** - Reference the issue in your PR (e.g., "Closes #123")
- **Valid title** - Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, etc.
- **Tests** - Unit tests for main code paths
- **Changeset** - Run `pnpm new` from repo root
- **Passing checks** - All CI checks must pass

### Standards

- **Surgical PRs** - One clear objective per PR
- **Clean code** - Elegant, well-reasoned implementation
- **Meaningful changes** - No low-effort, cosmetic, or trivial edits made only to gain contributions
- **No duplicate work** - Check if someone else already opened a PR

## Local Development

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- AI API key (Groq, Google, or Mistral) - [setup guide](https://lingo.dev/en/cli/quick-start#step-2-authentication)

### Setup

```bash
git clone https://github.com/lingodotdev/lingo.dev
cd lingo.dev
pnpm install
pnpm turbo build
```

### Run Locally

```bash
# Terminal 1 - watch CLI changes
cd packages/cli
pnpm run dev

# Terminal 2 - test CLI
cd packages/cli
pnpm lingo.dev --help
```

### Run Checks

```bash
pnpm install --frozen-lockfile
pnpm turbo build --force
pnpm turbo test --force
pnpm changeset status --since origin/main
```

## Review Process

- Automated code review by AI bots provides suggestions
- Human reviewers make final decisions
- **Address maintainer comments promptly** - PRs with unaddressed comments will be closed to keep the repo clean. Feel free to recreate once issues are resolved.

Questions? Join our [Discord](https://lingo.dev/go/discord)!
