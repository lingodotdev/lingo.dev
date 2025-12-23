/**
 * Loader for locale/client module
 * Generates full module code - ignores source file (template is only for types)
 */

import type { LingoConfig } from "../types";
import { generateClientLocaleModule } from "../virtual/code-generator";

export default function nextLocaleClientLoader(
  this: any,
  _source: string,
): string {
  const config: LingoConfig = this.getOptions();
  return generateClientLocaleModule(config);
}
