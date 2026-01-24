import { execSync } from "child_process";

export interface ExecutionResult {
  success: boolean;
  output: string;
  command: string;
}

/**
 * Executes a help command and captures its output.
 * Tries multiple strategies:
 * 1. man <command>
 * 2. <command> --help
 * 3. <command> -h
 */
export function executeHelpCommand(args: string[]): ExecutionResult {
  const command = args[0];
  const subcommand = args.slice(1).join(" ");

  // Strategy 1: Try man page
  const manResult = tryManPage(command, subcommand);
  if (manResult.success) {
    return manResult;
  }

  // Strategy 2: Try --help flag
  const helpResult = tryHelpFlag(args, "--help");
  if (helpResult.success) {
    return helpResult;
  }

  // Strategy 3: Try -h flag
  const shortHelpResult = tryHelpFlag(args, "-h");
  if (shortHelpResult.success) {
    return shortHelpResult;
  }

  // Return the man page error as fallback
  return {
    success: false,
    output: `Could not get help for command: ${args.join(" ")}\nTried:\n  - man ${command} ${subcommand}\n  - ${args.join(" ")} --help\n  - ${args.join(" ")} -h`,
    command: args.join(" "),
  };
}

function tryManPage(command: string, subcommand: string): ExecutionResult {
  try {
    // For subcommands like "git commit", try "man git-commit" first
    const manCommand = subcommand
      ? `${command}-${subcommand.replace(/\s+/g, "-")}`
      : command;

    const output = execSync(`man ${manCommand}`, {
      encoding: "utf-8",
      env: { ...process.env, PAGER: "cat", MANPAGER: "cat" },
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large man pages
      timeout: 30000,
    });

    return {
      success: true,
      output: output.trim(),
      command: `man ${manCommand}`,
    };
  } catch {
    // If subcommand format failed, try just the main command
    if (subcommand) {
      try {
        const output = execSync(`man ${command}`, {
          encoding: "utf-8",
          env: { ...process.env, PAGER: "cat", MANPAGER: "cat" },
          maxBuffer: 10 * 1024 * 1024,
          timeout: 30000,
        });

        return {
          success: true,
          output: output.trim(),
          command: `man ${command}`,
        };
      } catch {
        return { success: false, output: "", command: `man ${command}` };
      }
    }

    return { success: false, output: "", command: `man ${command}` };
  }
}

function tryHelpFlag(args: string[], flag: string): ExecutionResult {
  const fullCommand = [...args, flag].join(" ");

  try {
    const output = execSync(fullCommand, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
      timeout: 30000,
    });

    return {
      success: true,
      output: output.trim(),
      command: fullCommand,
    };
  } catch (error: unknown) {
    // Some commands print help to stderr and exit with non-zero
    if (error && typeof error === "object" && "stdout" in error) {
      const execError = error as { stdout?: string; stderr?: string };
      const combinedOutput = (execError.stdout || "") + (execError.stderr || "");
      if (combinedOutput.trim().length > 50) {
        return {
          success: true,
          output: combinedOutput.trim(),
          command: fullCommand,
        };
      }
    }

    return { success: false, output: "", command: fullCommand };
  }
}
