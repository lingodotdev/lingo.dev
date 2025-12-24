import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    snapshotSerializers: ["./src/react/shared/test-serializer.ts"],
    exclude: [...configDefaults.exclude, "**/tests/e2e/**"],
  },
});
