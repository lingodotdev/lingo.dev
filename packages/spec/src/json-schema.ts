import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { toJSONSchema } from "zod";
import { LATEST_CONFIG_DEFINITION } from "./config";

export default function buildJsonSchema() {
  const configSchema = toJSONSchema(LATEST_CONFIG_DEFINITION.schema);
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  fs.writeFileSync(
    `${currentDir}/../build/i18n.schema.json`,
    JSON.stringify(configSchema, null, 2),
  );
}
