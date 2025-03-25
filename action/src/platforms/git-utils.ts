import { execSync } from "child_process";

export function configureGitCredentials(token: string | undefined, repoUrl: string) {
  if (!token) {
    console.warn("No token provided. Skipping Git credential configuration.");
    return false;
  }
  try {
    execSync(`git remote set-url origin ${repoUrl}`, { stdio: "inherit" });

    return true;
  } catch (error: any) {
    console.error(`Failed to configure Git credentials: ${error.message}`);
    return false;
  }
}
