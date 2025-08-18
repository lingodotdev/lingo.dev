import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "build"],
    coverage: {
      reporter: ["text", "html", "lcov"],
      exclude: ["node_modules/", "build/", "**/*.d.ts", "**/*.config.*"],
    },
  },
});
