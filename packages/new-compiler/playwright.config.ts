import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Run tests sequentially with a single worker */
  workers: 1,
  /* Timeout for each test (includes beforeAll/afterAll hooks) */
  timeout: 180000, // 3 minutes - accounts for packing compiler, installing deps, starting servers
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "list" : "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    /* Action timeout (individual page actions like click, fill, etc) */
    actionTimeout: 30000, // 30 seconds for individual actions
  },

  /* Configure projects for major browsers */
  projects: [
    {
      // If we need more than one browser at some point, add them to CI browser installation step too.
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
