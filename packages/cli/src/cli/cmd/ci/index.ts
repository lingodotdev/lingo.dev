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
    "Execute the opinionated CI pipeline: run localization, commit changes, and optionally open a pull request",
  )
  .helpOption("-h, --help", "Show help")
  .option(
    "--parallel [boolean]",
    "Run translations in parallel mode so multiple locale files are processed at once. Leave unset to translate sequentially",
    parseBooleanArg,
  )
  .option(
    "--api-key <key>",
    "API key to authenticate the run (overrides settings and env)",
  )
  .option(
    "--pull-request [boolean]",
    "Enable pull-request mode so the action works on a temporary branch and opens/updates a PR",
    parseBooleanArg,
  )
  .option(
    "--commit-message <message>",
    "Commit message to use when the action pushes changes",
  )
  .option(
    "--pull-request-title <title>",
    "Title to use when a pull request is opened or updated",
  )
  .option(
    "--working-directory <dir>",
    "Subdirectory to `cd` into before running localization",
  )
  .option(
    "--process-own-commits [boolean]",
    "Allow the workflow to run even if the latest commit was authored by the automation user",
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
