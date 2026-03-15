import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getOrgId, clearOrgIdCache } from "./org-id";
import { execSync } from "child_process";

vi.mock("child_process");

describe("getOrgId", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
    clearOrgIdCache(); // Clear cache between tests
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("CI environment variables", () => {
    it("should detect GitHub org from GITHUB_REPOSITORY", () => {
      process.env.GITHUB_REPOSITORY = "owner/repo";
      expect(getOrgId()).toBe("github:owner");
    });

    it("should detect GitLab org from CI_PROJECT_PATH", () => {
      process.env.CI_PROJECT_PATH = "namespace/project";
      expect(getOrgId()).toBe("gitlab:namespace");
    });

    it("should detect Bitbucket org from BITBUCKET_REPO_FULL_NAME", () => {
      process.env.BITBUCKET_REPO_FULL_NAME = "workspace/repo";
      expect(getOrgId()).toBe("bitbucket:workspace");
    });

    it("should prioritize CI environment variables over git remote", () => {
      process.env.GITHUB_REPOSITORY = "owner/repo";
      vi.mocked(execSync).mockReturnValue(
        "git@gitlab.com:other/project.git" as any,
      );
      expect(getOrgId()).toBe("github:owner");
    });
  });

  describe("git remote URL parsing", () => {
    it("should parse GitHub SSH URL", () => {
      vi.mocked(execSync).mockReturnValue("git@github.com:owner/repo.git" as any);
      expect(getOrgId()).toBe("github:owner");
    });

    it("should parse GitHub HTTPS URL", () => {
      vi.mocked(execSync).mockReturnValue(
        "https://github.com/owner/repo.git" as any,
      );
      expect(getOrgId()).toBe("github:owner");
    });

    it("should parse GitLab SSH URL", () => {
      vi.mocked(execSync).mockReturnValue(
        "git@gitlab.com:namespace/project.git" as any,
      );
      expect(getOrgId()).toBe("gitlab:namespace");
    });

    it("should parse GitLab HTTPS URL", () => {
      vi.mocked(execSync).mockReturnValue(
        "https://gitlab.com/namespace/project.git" as any,
      );
      expect(getOrgId()).toBe("gitlab:namespace");
    });

    it("should parse Bitbucket SSH URL", () => {
      vi.mocked(execSync).mockReturnValue(
        "git@bitbucket.org:workspace/repo.git" as any,
      );
      expect(getOrgId()).toBe("bitbucket:workspace");
    });

    it("should parse Bitbucket HTTPS URL", () => {
      vi.mocked(execSync).mockReturnValue(
        "https://bitbucket.org/workspace/repo.git" as any,
      );
      expect(getOrgId()).toBe("bitbucket:workspace");
    });

    it("should parse self-hosted git URL with generic prefix", () => {
      vi.mocked(execSync).mockReturnValue(
        "git@custom-git.company.com:team/project.git" as any,
      );
      expect(getOrgId()).toBe("git:team");
    });

    it("should handle URLs without .git extension", () => {
      vi.mocked(execSync).mockReturnValue("git@github.com:owner/repo" as any);
      expect(getOrgId()).toBe("github:owner");
    });

    it("should return null when git command fails", () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error("not a git repository");
      });
      expect(getOrgId()).toBe(null);
    });

    it("should return null when git remote is empty", () => {
      vi.mocked(execSync).mockReturnValue("" as any);
      expect(getOrgId()).toBe(null);
    });

    it("should return null when git remote URL is invalid", () => {
      vi.mocked(execSync).mockReturnValue("invalid-url" as any);
      expect(getOrgId()).toBe(null);
    });
  });
});
