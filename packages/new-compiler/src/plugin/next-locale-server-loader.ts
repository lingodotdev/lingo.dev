/**
 * Loader for locale/server module
 * Generates full module code - ignores source file (template is only for types)
 */

import type { LingoConfig } from "../types";
import { generateServerLocaleModule } from "../virtual/code-generator";

export default function nextLocaleServerLoader(
  this: any,
  _source: string,
): string {
  const config: LingoConfig = this.getOptions();
  return generateServerLocaleModule(config);
}
