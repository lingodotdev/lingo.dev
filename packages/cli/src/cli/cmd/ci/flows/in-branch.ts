import { execSync } from "child_process";
import path from "path";
import {
  getGitConfig,
  IntegrationFlow,
  escapeShellArg,
  IIntegrationFlowOptions,
} from "./_base";
import i18nCmd from "../../i18n";
import runCmd from "../../run";

export class InBranchFlow extends IntegrationFlow {
  async preRun() {
    this.ora.start("Configuring git");
    const canContinue = this.configureGit();
    this.ora.succeed("Git configured");

    return canContinue;
  }

  async run(options: IIntegrationFlowOptions) {
    this.ora.start("Running Lingo.dev");
    await this.runLingoDotDev(options.parallel);
    this.ora.succeed("Done running Lingo.dev");

    execSync(`rm -f i18n.cache`, { stdio: "inherit" }); // do not commit cache file if it exists

    this.ora.start("Checking for changes");
    const hasChanges = this.checkCommitableChanges();
    this.ora.succeed(hasChanges ? "Changes detected" : "No changes detected");

    if (hasChanges) {
      this.ora.start("Committing changes");
      execSync(`git add .`, { stdio: "inherit" });
      execSync(`git status --porcelain`, { stdio: "inherit" });
      const signFlag = this.platformKit.config.gpgSign ? "-S " : "";
      execSync(
        `git commit ${signFlag}-m ${escapeShellArg(
          this.platformKit.config.commitMessage,
        )} --no-verify`,
        {
          stdio: "inherit",
        },
      );
      this.ora.succeed("Changes committed");

      this.ora.start("Pushing changes to remote");
      const currentBranch =
        this.i18nBranchName ?? this.platformKit.platformConfig.baseBranchName;
      execSync(
        `git push origin ${currentBranch} ${options.force ? "--force" : ""}`,
        {
          stdio: "inherit",
        },
      );
      this.ora.succeed("Changes pushed to remote");
    }

    return hasChanges;
  }

  protected checkCommitableChanges() {
    return (
      execSync('git status --porcelain || echo "has_changes"', {
        encoding: "utf8",
      }).length > 0
    );
  }

  private async runLingoDotDev(isParallel?: boolean) {
    try {
      if (!isParallel) {
        await i18nCmd
          .exitOverride()
          .parseAsync(["--api-key", this.platformKit.config.replexicaApiKey], {
            from: "user",
          });
      } else {
        await runCmd
          .exitOverride()
          .parseAsync(["--api-key", this.platformKit.config.replexicaApiKey], {
            from: "user",
          });
      }
    } catch (err: any) {
      if (err.code === "commander.helpDisplayed") return;
      throw err;
    }
  }

  private configureGit() {
    const { processOwnCommits } = this.platformKit.config;
    const { baseBranchName } = this.platformKit.platformConfig;
    const gitConfig = getGitConfig(this.platformKit);

    this.ora.info(`Current working directory:`);
    execSync(`pwd`, { stdio: "inherit" });
    execSync(`ls -la`, { stdio: "inherit" });

    execSync(`git config --global safe.directory ${process.cwd()}`);

    execSync(`git config user.name "${gitConfig.userName}"`);
    execSync(`git config user.email "${gitConfig.userEmail}"`);

    // Configure GPG signing if enabled
    if (this.platformKit.config.gpgSign) {
      // Preflight check: verify signing key is configured
      try {
        const signingKey = execSync(`git config user.signingkey`, {
          encoding: "utf8",
        }).trim();
        if (!signingKey) {
          throw new Error("No signing key configured");
        }
      } catch {
        throw new Error(
          "GPG signing is enabled but no signing key is configured. " +
            "Import a GPG key (e.g., using crazy-max/ghaction-import-gpg) before running this action, " +
            "or set gpg-sign to false.",
        );
      }
      execSync(`git config commit.gpgsign true`);
    }

    // perform platform-specific configuration before fetching or pushing to the remote
    this.platformKit?.gitConfig();

    execSync(`git fetch origin ${baseBranchName}`, { stdio: "inherit" });
    execSync(`git checkout ${baseBranchName} --`, { stdio: "inherit" });

    if (!processOwnCommits) {
      const currentAuthor = `${gitConfig.userName} <${gitConfig.userEmail}>`;
      const authorOfLastCommit = execSync(
        `git log -1 --pretty=format:'%an <%ae>'`,
      ).toString();
      if (authorOfLastCommit === currentAuthor) {
        this.ora.warn(
          `The last commit was already made by ${currentAuthor}, so this run will be skipped, as running again would have no effect. See docs: https://lingo.dev/ci`,
        );
        return false;
      }
    }

    const workingDir = path.resolve(
      process.cwd(),
      this.platformKit.config.workingDir,
    );
    if (workingDir !== process.cwd()) {
      this.ora.info(
        `Changing to working directory: ${this.platformKit.config.workingDir}`,
      );
      process.chdir(workingDir);
    }

    return true;
  }
}
