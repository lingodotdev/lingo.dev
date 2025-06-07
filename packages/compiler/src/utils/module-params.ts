export function parseParametrizedModuleId(rawId: string) {
  const moduleUri = new URL(rawId, "module://");
  return {
    id: moduleUri.pathname.replace(/^\//, ""),
    params: Object.fromEntries(moduleUri.searchParams.entries()),
  };
}
