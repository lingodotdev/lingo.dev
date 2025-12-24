# E2E Tests - Quick Start

## First Time Setup (5 minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Install Playwright browsers
pnpm playwright:install

# 3. Prepare test fixtures (takes 2-3 minutes)
pnpm test:prepare
```

## Running Tests

```bash
# Run all tests
pnpm test:e2e

# Run in interactive UI mode (recommended for development)
pnpm test:e2e:dev

# Run only shared tests
pnpm test:e2e:shared

# Debug a specific test
pnpm test:e2e:debug
```

## How It Works

### Fast Test Execution Strategy

Instead of installing dependencies on every test run, we use a two-stage approach:

```
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: Preparation (ONE TIME - run pnpm test:prepare)    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  demo/next16/  ──────┐                                     │
│                      ├──> tests/fixtures/next/             │
│  + pnpm install  ────┘     (with node_modules)             │
│                                                             │
│  demo/vite/    ──────┐                                     │
│                      ├──> tests/fixtures/vite/             │
│  + pnpm install  ────┘     (with node_modules)             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Stage 2: Test Execution (FAST - every test run)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  tests/fixtures/next/  ──> /tmp/lingo-test-next-xyz/       │
│  (copy with node_modules)  (isolated test environment)     │
│                                                             │
│  ✅ No dependency installation needed                       │
│  ✅ Each test gets clean copy                               │
│  ✅ Fast execution (~seconds per test)                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Why This Approach?

**Without preparation:**

- ❌ Install deps on every test: ~2-3 min per test
- ❌ Total test time: ~10-15 minutes for 5 tests

**With preparation:**

- ✅ Prepare once: ~2-3 minutes (one time)
- ✅ Each test: ~10-30 seconds
- ✅ Total test time: ~2-5 minutes for 5 tests

**10x faster test execution!**

## When to Re-run `pnpm test:prepare`

- When demo app `package.json` changes
- When you update demo app dependencies
- After pulling major changes to demo apps
- If fixtures get corrupted

## Directory Structure

```
tests/
├── fixtures/           # ← Prepared fixtures (gitignored)
│   ├── next/          # ← Next.js with node_modules
│   └── vite/          # ← Vite with node_modules
├── e2e/
│   └── shared/
│       └── development.test.ts
└── helpers/
    ├── prepare-fixtures.ts   # ← Prepares fixtures
    └── setup-fixture.ts      # ← Copies fixtures to temp dir
```

## Example Test Flow

```typescript
import { setupFixture } from "../../helpers/setup-fixture";

test("my test", async ({ page }) => {
  // 1. Copy prepared fixture to temp dir (fast - already has node_modules)
  const fixture = await setupFixture({ framework: "next" });

  // 2. Start dev server (dependencies already installed)
  const devServer = await fixture.startDev();

  try {
    // 3. Run your test
    await page.goto(`http://localhost:${devServer.port}`);
    // ... test assertions ...
  } finally {
    // 4. Cleanup
    devServer.stop();
    await fixture.clean();
  }
});
```

## CI/CD Integration

In CI, run both stages:

```yaml
- name: Prepare fixtures
  run: pnpm test:prepare

- name: Run E2E tests
  run: pnpm test:e2e
```

You could also cache the `tests/fixtures/` directory to speed up CI runs.
