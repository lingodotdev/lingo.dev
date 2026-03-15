# E2E Tests

End-to-end tests for the Lingo translation system.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Install Playwright browsers:

```bash
pnpm playwright:install
```

3. **Prepare test fixtures** (one-time setup):

```bash
pnpm test:e2e:prepare
```

This will:

- Copy demo apps to `tests/fixtures/`
- Install dependencies in each fixture
- Takes 2-3 minutes but only needs to be run once

**Note:** You only need to re-run `pnpm test:e2e:prepare` if:

- Demo app dependencies change
- You want to test with updated demo apps
- Fixtures get corrupted

## Running Tests

### Run all E2E tests

```bash
pnpm test:e2e
```

### Run framework-specific tests

```bash
pnpm test:e2e
```

### Development & Debugging

```bash
# Run tests in UI mode (interactive)
pnpm test:e2e:dev

# Debug tests (with browser dev tools)
pnpm test:e2e:debug

# View last test report
pnpm test:e2e:report
```

## Test Structure

```
tests/
├── e2e/
│   ├── shared/              # Framework-agnostic tests
│   │   ├── development.test.ts
│   │   ├── build.test.ts
│   │   └── locale-switching.test.ts
│   ├── next/                # Next.js specific tests
│   └── vite/                # Vite specific tests
└── helpers/
    ├── setup-fixture.ts     # Test fixture setup
    └── locale-switcher.ts   # Locale switching utilities
```

## How Tests Work

### Test Fixtures

**Two-stage fixture approach for fast test execution:**

1. **Preparation Stage** (once):
   - Demo apps are copied to `tests/fixtures/`
   - Dependencies are installed in each fixture
   - Run with: `pnpm test:e2e:prepare`

2. **Test Execution** (fast):
   - Each test copies the prepared fixture (with node_modules) to a temp directory
   - Tests run against a clean copy with dependencies already installed
   - No need to reinstall dependencies on every test run

This ensures:

- **Fast test execution** - No dependency installation during tests
- **Isolated tests** - Each test gets a clean copy
- **Real configurations** - Tests use actual demo apps
- **Predictable behavior** - Same dependencies across all test runs

### Locale Switching

Tests use the `LocaleSwitcher` component for locale switching (not URL paths):

```typescript
import { switchLocale } from "../helpers/locale-switcher";

// Switch to German
await switchLocale(page, "de");
```

This approach is:

- Framework-agnostic
- Tests actual UI interaction

## Development Mode Tests

Development mode tests verify:

1. Translation server starts automatically
2. On-demand translation generation
3. Hot reload with text changes

## Writing New Tests

1. Use the framework-agnostic helpers when possible
2. Use `setupFixture()` to create test apps
3. Use `switchLocale()` for locale changes
4. Clean up fixtures after tests with `fixture.clean()`

Example:

```typescript
import { test, expect } from "@playwright/test";
import { setupFixture } from "../../helpers/setup-fixture";
import { switchLocale } from "../../helpers/locale-switcher";

test("my test", async ({ page }) => {
  const fixture = await setupFixture({ framework: "next" });
  const devServer = await fixture.startDev();

  try {
    await page.goto(`http://localhost:${devServer.port}`);
    await switchLocale(page, "de");

    // Your test assertions...
  } finally {
    devServer.stop();
    await fixture.clean();
  }
});
```

## Troubleshooting

### "Fixture not found" error

Run `pnpm test:e2e:prepare` to prepare the fixtures before running tests.

### Port conflicts

Tests run sequentially (workers: 1) to avoid port conflicts. If you see port errors, ensure no dev servers are running.

### Timeouts

Tests have generous timeouts (2 minutes) to account for:

- Copying fixtures (with node_modules)
- Starting dev servers
- Building applications

### Cleanup

Failed tests may leave temp directories. They're in your OS temp folder with `lingo-test-` prefix.

### Outdated fixtures

If demo apps change significantly, re-run `pnpm test:e2e:prepare` to update the fixtures.
