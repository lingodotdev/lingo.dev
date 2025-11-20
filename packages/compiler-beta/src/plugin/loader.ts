import type { LoaderConfig } from "../types";
import { loadMetadata, saveMetadata, upsertEntries } from "../metadata/manager";
import { shouldTransformFile, transformComponent } from "./transform";
import { startTranslationServer } from "../server";

let globalServer: any;

/**
 * Turbopack/Webpack loader for automatic translation
 *
 * This loader transforms React components to inject translation calls automatically
 */
export default async function lingoLoader(
  this: any,
  source: string,
): Promise<void> {
  const callback = this.async();
  console.warn("Loading", this.resourcePath);

  try {
    // Get loader options
    const config: LoaderConfig = {
      sourceRoot: this.getOptions().sourceRoot || process.cwd(),
      lingoDir: this.getOptions().lingoDir || ".lingo",
      sourceLocale: this.getOptions().sourceLocale || "en",
      useDirective: this.getOptions().useDirective ?? false,
      isDev: process.env.NODE_ENV !== "production",
      skipPatterns: this.getOptions().skipPatterns || [
        /node_modules/,
        /\.spec\./,
        /\.test\./,
      ],
      translator: this.getOptions().translator,
    };

    // Check if this file should be transformed
    if (!shouldTransformFile(this.resourcePath, config)) {
      return callback(null, source);
    }

    if (!globalServer) {
      globalServer = await startTranslationServer({
        startPort: 60000,
        onError: (err) => {
          console.error("Translation server error:", err);
        },
        onReady: () => {
          console.log("Translation server started");
        },
        config,
      });
    }

    // Load current metadata
    const metadata = await loadMetadata(config);

    // Transform the component
    const result = transformComponent({
      code: source,
      filePath: this.resourcePath,
      config,
      metadata,
      serverPort: globalServer?.getPort() || null,
    });

    // If no transformation occurred, return original source
    if (!result.transformed) {
      return callback(null, source);
    }

    // Update metadata with new entries
    if (result.newEntries && result.newEntries.length > 0) {
      const updatedMetadata = upsertEntries(metadata, result.newEntries);
      await saveMetadata(config, updatedMetadata);

      // Log new translations discovered (in dev mode)
      if (config.isDev) {
        console.log(
          `✨ Lingo: Found ${result.newEntries.length} translatable text(s) in ${this.resourcePath}`,
        );
      }
    }

    // Return transformed code
    callback(null, result.code, result.map);
  } catch (error) {
    console.error(
      `⚠️  Lingo.dev compiler-beta failed for ${this.resourcePath}:`,
    );
    console.error("⚠️  Details:", error);
    callback(error as Error);
  }
}
