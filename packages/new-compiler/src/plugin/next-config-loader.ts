import type { LingoConfig } from "../types";
import { generateConfigModule } from "../virtual/code-generator";

/**
 * Loader for config module
 * Generates full module code - ignores source file (template is only for types)
 */
export default function nextConfigLoader(this: any, _source: string): string {
  const config: LingoConfig = this.getOptions();
  return generateConfigModule(config);
}
