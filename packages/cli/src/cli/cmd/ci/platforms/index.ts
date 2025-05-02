import { BitbucketPlatformKit } from "./bitbucket";
import { GitHubPlatformKit } from "./github";
import { GitlabPlatformKit } from "./gitlab";

export const getPlatformKit = () => {
  if (process.env.BITBUCKET_PIPELINE_UUID) {
    return new BitbucketPlatformKit();
  }

  if (process.env.GITHUB_ACTION) {
    return new GitHubPlatformKit();
  }

  if (process.env.GITLAB_CI) {
    return new GitlabPlatformKit();
  }

  throw new Error("This platform is not supported");
};
