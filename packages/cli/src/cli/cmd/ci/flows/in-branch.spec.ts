import { describe, it, expect, vi, beforeEach } from "vitest";
import { execFileSync, execSync } from "child_process";
import { InBranchFlow } from "./in-branch";

vi.mock("child_process");
vi.mock("../../i18n", () => ({
  default: {
    exitOverride: () => ({ parseAsync: vi.fn().mockResolvedValue(undefined) }),
  },
}));
vi.mock("../../run", () => ({
  default: {
    exitOverride: () => ({ parseAsync: vi.fn().mockResolvedValue(undefined) }),
  },
}));

function createOra() {
  return {
    start: vi.fn(),
    succeed: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    fail: vi.fn(),
  } as any;
}

function createPlatformKit(overrides: Record<string, any> = {}) {
  return {
    config: {
      replexicaApiKey: "test-key",
      commitMessage: `feat: "quoted" message with 'single' quotes`,
      commitAuthorName: `O'Brien "Bot"`,
      commitAuthorEmail: "bot@example.com",
      processOwnCommits: true,
      gpgSign: false,
      workingDir: ".",
      ...overrides,
    },
    platformConfig: {
      baseBranchName: "feature/some-branch",
    },
    gitConfig: vi.fn(),
  } as any;
}

describe("InBranchFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(execSync).mockReturnValue("" as any);
    vi.mocked(execFileSync).mockReturnValue("" as any);
  });

  it("passes git identity and branch name as separate arguments", async () => {
    const platformKit = createPlatformKit();
    const flow = new InBranchFlow(createOra(), platformKit);

    await flow.preRun();

    expect(execFileSync).toHaveBeenCalledWith("git", [
      "config",
      "user.name",
      `O'Brien "Bot"`,
    ]);
    expect(execFileSync).toHaveBeenCalledWith("git", [
      "config",
      "user.email",
      "bot@example.com",
    ]);
    expect(execFileSync).toHaveBeenCalledWith(
      "git",
      ["fetch", "origin", "feature/some-branch"],
      { stdio: "inherit" },
    );
    expect(execFileSync).toHaveBeenCalledWith(
      "git",
      ["checkout", "feature/some-branch", "--"],
      { stdio: "inherit" },
    );
  });

  it("commits with the message as a single argument and pushes the branch", async () => {
    vi.mocked(execSync).mockImplementation(((command: string) =>
      command.startsWith("git status --porcelain ||")
        ? "M file.json"
        : "") as any);

    const platformKit = createPlatformKit({ gpgSign: true });
    const flow = new InBranchFlow(createOra(), platformKit);

    const hasChanges = await flow.run({ force: true });

    expect(hasChanges).toBe(true);
    expect(execFileSync).toHaveBeenCalledWith(
      "git",
      [
        "commit",
        "-S",
        "-m",
        `feat: "quoted" message with 'single' quotes`,
        "--no-verify",
      ],
      { stdio: "inherit" },
    );
    expect(execFileSync).toHaveBeenCalledWith(
      "git",
      ["push", "origin", "feature/some-branch", "--force"],
      { stdio: "inherit" },
    );
  });
});
