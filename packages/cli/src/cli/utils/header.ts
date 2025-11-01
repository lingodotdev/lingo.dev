export function getDocsUrl(): string {
  const isCI = !!process.env.CI || process.argv.includes("ci");
  return isCI ? "https://lingo.dev/ci" : "https://lingo.dev/cli";
}