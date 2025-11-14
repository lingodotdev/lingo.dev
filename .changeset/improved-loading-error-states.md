---
"@lingo.dev/_react": minor
---

Add optional loading and error component support to LingoProviderWrapper

This enhancement adds `loadingComponent` and `errorComponent` props to the `LingoProviderWrapper` component, enabling developers to provide custom UI for loading and error states instead of the default null behavior.

**New Features:**
- `loadingComponent`: Optional prop to display custom loading UI while the dictionary loads
- `errorComponent`: Optional prop to display custom error UI when dictionary loading fails

**Benefits:**
- Better user experience with visible loading states
- Proper error handling with customizable error displays
- Backward compatible - maintains null behavior when props are not provided
- Type-safe error handling with Error object passed to error component

**Example Usage:**
```tsx
<LingoProviderWrapper
  loadDictionary={loadDictionary}
  loadingComponent={<div>Loading translations...</div>}
  errorComponent={({ error }) => <div>Error: {error.message}</div>}
>
  <App />
</LingoProviderWrapper>
```
