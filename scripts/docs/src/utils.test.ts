import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import {
  getRepoRoot,
  getGitHubToken,
  getGitHubRepo,
  getGitHubOwner,
  getGitHubPRNumber,
} from "./utils";

describe("utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("getRepoRoot", () => {
    it("should find the repository root directory", () => {
      const result = getRepoRoot();
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getGitHubToken", () => {
    it("should return token when GITHUB_TOKEN is set", () => {
      vi.stubEnv("GITHUB_TOKEN", "test-token");

      const result = getGitHubToken();
      expect(result).toBe("test-token");
    });

    it("should throw error when GITHUB_TOKEN is not set", () => {
      vi.stubEnv("GITHUB_TOKEN", "");

      expect(() => getGitHubToken()).toThrow(
        "GITHUB_TOKEN environment variable is required.",
      );
    });

    it("should return token when GH_TOKEN is set as a fallback", () => {
      vi.stubEnv("GITHUB_TOKEN", "");
      vi.stubEnv("GH_TOKEN", "fallback-token");

      const result = getGitHubToken();
      expect(result).toBe("fallback-token");
    });

    it("should read token from .env file if environment variables are not set", () => {
      vi.stubEnv("GITHUB_TOKEN", "");
      vi.stubEnv("GH_TOKEN", "");
      const envPath = path.join(process.cwd(), ".env");
      fs.writeFileSync(envPath, "GITHUB_TOKEN=env-file-token");
      const result = getGitHubToken();
      expect(result).toBe("env-file-token");
      fs.unlinkSync(envPath);
    });

    it("should throw detailed error when no token found", () => {
      vi.stubEnv("GITHUB_TOKEN", "");
      vi.stubEnv("GH_TOKEN", "");
      expect(() => getGitHubToken()).toThrow(/Missing GitHub authentication token/);
    });
  });

  describe("getGitHubRepo", () => {
    it("should extract repo name from GITHUB_REPOSITORY", () => {
      vi.stubEnv("GITHUB_REPOSITORY", "owner/repo-name");

      const result = getGitHubRepo();
      expect(result).toBe("repo-name");
    });

    it("should throw error when GITHUB_REPOSITORY is not set", () => {
      vi.stubEnv("GITHUB_REPOSITORY", "");

      expect(() => getGitHubRepo()).toThrow(
        "GITHUB_REPOSITORY environment variable is missing.",
      );
    });
  });

  describe("getGitHubOwner", () => {
    it("should extract owner from GITHUB_REPOSITORY", () => {
      vi.stubEnv("GITHUB_REPOSITORY", "test-owner/repo-name");

      const result = getGitHubOwner();
      expect(result).toBe("test-owner");
    });

    it("should throw error when GITHUB_REPOSITORY is not set", () => {
      vi.stubEnv("GITHUB_REPOSITORY", "");

      expect(() => getGitHubOwner()).toThrow(
        "GITHUB_REPOSITORY environment variable is missing.",
      );
    });
  });

  describe("getGitHubPRNumber", () => {
    it("should return PR_NUMBER when set", () => {
      vi.stubEnv("PR_NUMBER", "123");

      const result = getGitHubPRNumber();
      expect(result).toBe(123);
    });

    it("should throw error when no PR number can be determined", () => {
      vi.stubEnv("PR_NUMBER", "");
      vi.stubEnv("GITHUB_EVENT_PATH", "");

      expect(() => getGitHubPRNumber()).toThrow(
        "Could not determine pull request number.",
      );
    });
  });
});
