import { Command } from "interactive-commander";
import { runBitbucketInit } from "../../utils/init-ci-cd";

export default new Command()
  .command("bitbucket")
  .description(
    "Initialize Bitbucket Pipelines workflow for automated translation validation",
  )
  .helpOption("-h, --help", "Show help")
  .action(async () => {
    await runBitbucketInit();
  });
