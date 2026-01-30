import { showDeprecationWarning } from "./_deprecation";
import { loadDictionary, transformComponent } from "./_loader-utils";

/**
 * @deprecated This loader is part of the legacy compiler. Please migrate to @lingo.dev/compiler.
 * See migration guide at https://lingo.dev/compiler
 */
// This loader handles component transformations and dictionary generation
export default async function (this: any, source: string) {
  showDeprecationWarning();
  const callback = this.async();
  const params = this.getOptions();
  const isDev = process.env.NODE_ENV !== "production";

  try {
    // Dictionary loading
    const dictionary = await loadDictionary({
      resourcePath: this.resourcePath,
      resourceQuery: this.resourceQuery,
      params,
      sourceRoot: params.sourceRoot,
      lingoDir: params.lingoDir,
      isDev,
    });

    if (dictionary) {
      const code = `export default ${JSON.stringify(dictionary, null, 2)};`;
      return callback(null, code);
    }

    // Component transformation
    const result = transformComponent({
      code: source,
      params,
      resourcePath: this.resourcePath,
      sourceRoot: params.sourceRoot,
    });

    return callback(
      null,
      result.code,
      result.map ? JSON.stringify(result.map) : undefined,
    );
  } catch (error) {
    console.error(
      `⚠️  Lingo.dev compiler (Turbopack) failed for ${this.resourcePath}:`,
    );
    console.error("⚠️  Details:", error);
    callback(error as Error);
  }
}
