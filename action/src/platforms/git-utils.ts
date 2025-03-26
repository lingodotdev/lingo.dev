import { execSync } from "child_process";

export function configureGitCredentials(token: string, repoUrl: string): boolean {
  if (!token) {
    console.error("Missing token. Unable to configure Git credentials.");
    return false;
  }
  try {
    execSync(`git remote set-url origin ${repoUrl}`, { stdio: "inherit" });
    console.log("Git credentials configured successfully.");
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to configure git credentials: ${error.message}`);
    } else {
      console.error("An unknown error occurred while configuring Git credentials.", error);
    }
    return false;
  }
}

export function configureBitbucketProxy(origin: string, proxyUrl: string): void {
  try {
    execSync(`git config --unset http.${origin}.proxy`, { stdio: "inherit" });
    execSync(`git config http.${origin}.proxy ${proxyUrl}`, { stdio: "inherit" });
    console.log("Bitbucket proxy configured successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to configure Bitbucket proxy: ${error.message}`);
    } else {
      console.error("An unknown error occurred while configuring the Bitbucket proxy.", error);
    }
  }
}
