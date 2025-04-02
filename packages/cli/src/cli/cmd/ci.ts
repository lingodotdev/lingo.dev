import { Command } from "interactive-commander";
import { getSettings } from "../utils/settings";
import { createAuthenticator } from "../utils/auth";
import main from "@lingo.dev/~action";

interface CIOptions {
  pullRequest?: boolean;
  commitMessage?: string;
  pullRequestTitle?: string;
  workingDirectory?: string;
  processOwnCommits?: boolean;
}

export default new Command()
  .command("ci")
  .description("Run Lingo.dev CI/CD action")
  .helpOption("-h, --help", "Show help")
  .option("--pull-request", "Create a pull request with the changes", false)
  .option("--commit-message <message>", "Commit message")
  .option("--pull-request-title <title>", "Pull request title")
  .option("--working-directory <dir>", "Working directory")
  .option("--process-own-commits", "Process commits made by this action", false)
  .action(async (options: CIOptions, program) => {
    const apiKey = program.args[0];
    const settings = getSettings(apiKey);

    if (!settings.auth.apiKey) {
      console.error("No API key provided");
      return;
    }

    const authenticator = createAuthenticator({
      apiUrl: settings.auth.apiUrl,
      apiKey: settings.auth.apiKey,
    });
    const auth = await authenticator.whoami();

    if (!auth) {
      console.error("Not authenticated");
      return;
    }

    const env = {
      LINGODOTDEV_API_KEY: settings.auth.apiKey,
      LINGODOTDEV_PULL_REQUEST: options.pullRequest?.toString() || "false",
      ...(options.commitMessage && { LINGODOTDEV_COMMIT_MESSAGE: options.commitMessage }),
      ...(options.pullRequestTitle && { LINGODOTDEV_PULL_REQUEST_TITLE: options.pullRequestTitle }),
      ...(options.workingDirectory && { LINGODOTDEV_WORKING_DIRECTORY: options.workingDirectory }),
      ...(options.processOwnCommits && { LINGODOTDEV_PROCESS_OWN_COMMITS: options.processOwnCommits.toString() }),
    };

    process.env = { ...process.env, ...env };

    main();
  });
