# Transform Testing Strategy

## In-Memory Mocking

All transformation tests use **in-memory mocks** - no files are created during test execution.

### Why In-Memory?

1. **Speed**: No I/O operations = faster tests
2. **Isolation**: Tests don't affect the filesystem or each other
3. **Simplicity**: No cleanup needed - everything is garbage collected
4. **Purity**: The `transformComponent` function is pure - it only transforms input and returns output

### How It Works

The `transformComponent` function is designed to be pure:

```typescript
function transformComponent(options: {
  code: string;
  filePath: string;
  config: LoaderConfig;
  metadata: MetadataSchema;
}): TransformResult {
  // Parse, transform, return new code + entries
  // NO file I/O happens here
}
```

**Input**: Code string, config, and metadata object
**Output**: Transformed code string and new translation entries
**Side Effects**: None - completely pure function

### Test Structure

Each test follows this pattern:

```typescript
it("should transform component", () => {
  // 1. Transform code (pure function)
  const result = transformComponent({
    code: `<div>Hello</div>`,
    filePath: "src/Test.tsx",
    // Mocks for these are created in the beforeEach hook
    config,
    metadata,
  });

  // 2. Assert on return values
  expect(result.newEntries).toHaveLength(1);
  expect(result.code).toMatchSnapshot();
});
```

### Mock Helpers

Two helper functions create fresh mocks for each test:

- **`createMockMetadata()`**: Returns empty in-memory metadata object
- **`createMockConfig(overrides?)`**: Returns test config with optional overrides

### Verification

After running tests, verify no files were created:

```bash
# Should return 0
find compiler/src -name ".lingo" -type d | wc -l
find compiler/src -name "metadata.json" | wc -l
```
