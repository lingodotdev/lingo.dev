import { Command } from "interactive-commander";
import createOra from "ora";
import { getSettings } from "../../utils/settings";
import { createAuthenticator } from "../../utils/auth";
import { IIntegrationFlow } from "./flows/_base";
import { PullRequestFlow } from "./flows/pull-request";
import { InBranchFlow } from "./flows/in-branch";
import { getPlatformKit } from "./platforms";

interface CIOptions {
  parallel?: boolean;
  apiKey?: string;
  debug?: boolean;
  pullRequest?: boolean;
  commitMessage?: string;
  pullRequestTitle?: string;
  workingDirectory?: string;
  processOwnCommits?: boolean;
}

export default new Command()
  .command("ci")
  .description(
    "Automate localization workflow: translate content, commit changes, and create/update pull requests",
  )
  .helpOption("-h, --help", "Show help")
  .option(
    "--parallel [boolean]",
    "Process translations concurrently for faster execution (default: false). When enabled, multiple locales are translated simultaneously",
    parseBooleanArg,
  )
  .option(
    "--api-key <key>",
    "Override the API key from settings or environment variables for this run",
  )
  .option(
    "--pull-request [boolean]",
    "Create or update translations on a dedicated branch and manage pull requests automatically (default: commit directly to current branch)",
    parseBooleanArg,
  )
  .option(
    "--commit-message <message>",
    "Commit message for localization changes (default: 'feat: update translations via @lingodotdev')",
  )
  .option(
    "--pull-request-title <title>",
    "Title for the pull request when using --pull-request mode (defaults to 'feat: update translations via @lingodotdev')",
  )
  .option(
    "--working-directory <dir>",
    "Directory to run localization from (useful for monorepos where localization files are in a subdirectory)",
  )
  .option(
    "--process-own-commits [boolean]",
    "Allow processing commits made by this CI user (bypasses infinite loop prevention)",
    parseBooleanArg,
  )
  .action(async (options: CIOptions) => {
    const settings = getSettings(options.apiKey);

    console.log(options);

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
      ...(options.commitMessage && {
        LINGODOTDEV_COMMIT_MESSAGE: options.commitMessage,
      }),
      ...(options.pullRequestTitle && {
        LINGODOTDEV_PULL_REQUEST_TITLE: options.pullRequestTitle,
      }),
      ...(options.workingDirectory && {
        LINGODOTDEV_WORKING_DIRECTORY: options.workingDirectory,
      }),
      ...(options.processOwnCommits && {
        LINGODOTDEV_PROCESS_OWN_COMMITS: options.processOwnCommits.toString(),
      }),
    };

    process.env = { ...process.env, ...env };

    const ora = createOra();
    const platformKit = getPlatformKit();
    const { isPullRequestMode } = platformKit.config;

    ora.info(`Pull request mode: ${isPullRequestMode ? "on" : "off"}`);

    const flow: IIntegrationFlow = isPullRequestMode
      ? new PullRequestFlow(ora, platformKit)
      : new InBranchFlow(ora, platformKit);

    const canRun = await flow.preRun?.();
    if (canRun === false) {
      return;
    }

    const hasChanges = await flow.run({
      parallel: options.parallel,
    });
    if (!hasChanges) {
      return;
    }

    await flow.postRun?.();
  });

function parseBooleanArg(val: string | boolean | undefined): boolean {
  if (val === true) return true;
  if (typeof val === "string") {
    return val.toLowerCase() === "true";
  }
  return false;
}
