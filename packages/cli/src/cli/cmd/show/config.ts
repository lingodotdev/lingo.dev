import { Command } from "interactive-commander";
import _ from "lodash";
import { defaultConfig } from "@lingo.dev/_spec";
import { getConfig } from "../../utils/config";

export default new Command()
  .command("config")
  .description("Print effective i18n.json after merging with defaults")
  .helpOption("-h, --help", "Show help")
  .action(async (options) => {
    const fileConfig = getConfig(false);
    const config = _.merge({}, defaultConfig, fileConfig);

    console.log(JSON.stringify(config, null, 2));
  });
