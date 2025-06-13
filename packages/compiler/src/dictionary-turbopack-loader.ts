import { parseParametrizedModuleId } from "./utils/module-params";
import { LCP } from "./lib/lcp";
import { LCPServer } from "./lib/lcp/server";
import _ from "lodash";

export default async function (this: any, source: string) {
  const callback = this.async();
  const params = this.getOptions();

  // In Webpack, `this.resource` contains the full request path including query parameters.
  // In Turbopack, we need to combine `this.resourcePath` and `this.resourceQuery`.
  const id = `${this.resourcePath}${this.resourceQuery || ""}`;

  try {
    const moduleInfo = parseParametrizedModuleId(id);
    const locale = moduleInfo.params.locale;

    if (!locale) {
      // Not a request for a localized dictionary, return the original source.
      return callback(null, source);
    }

    const isDev = process.env.NODE_ENV !== "production";

    const lcpParams = {
      sourceRoot: params.sourceRoot,
      lingoDir: params.lingoDir,
      isDev,
    };

    await LCP.ready(lcpParams);
    const lcp = LCP.getInstance(lcpParams);

    const dictionaries = await LCPServer.loadDictionaries({
      models: params.models,
      lcp: lcp.data,
      sourceLocale: params.sourceLocale,
      targetLocales: params.targetLocales,
      sourceRoot: params.sourceRoot,
      lingoDir: params.lingoDir,
    });

    const dictionary = dictionaries[locale];
    if (!dictionary) {
      throw new Error(
        `Lingo.dev: Dictionary for locale "${locale}" could not be generated.`,
      );
    }

    const code = `export default ${JSON.stringify(dictionary, null, 2)};`;
    callback(null, code);
  } catch (e: any) {
    console.error("⚠️  Lingo.dev dictionary loader (Turbopack) failed:");
    console.error("⚠️  Details:", e);
    callback(e);
  }
}
