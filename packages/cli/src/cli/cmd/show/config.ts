import { Command } from "interactive-commander";
import _ from "lodash";
import fs from "fs";
import path from "path";
import { defaultConfig } from "@lingo.dev/_spec";

export default new Command()
  .command("config")
  .description("Print effective i18n.json after merging with defaults")
  .helpOption("-h, --help", "Show help")
  .action(async (options) => {
    const fileConfig = loadReplexicaFileConfig();
    const config = _.merge({}, defaultConfig, fileConfig);

    console.log(JSON.stringify(config, null, 2));
  });

function loadReplexicaFileConfig(): any {
  const replexicaConfigPath = path.resolve(process.cwd(), "i18n.json");
  const fileExists = fs.existsSync(replexicaConfigPath);
  if (!fileExists) {
    return undefined;
  }

  const fileContent = fs.readFileSync(replexicaConfigPath, "utf-8");
  const replexicaFileConfig = JSON.parse(fileContent);
  return replexicaFileConfig;
}
