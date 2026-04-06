import { parseArgs } from "util";

export const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    prompt:    { type: "string",  short: "p" },
    out:       { type: "string",  short: "o", default: "lingo-context.md" },
    model:     { type: "string",  short: "m", default: "claude-haiku-4-5" },
    commits:   { type: "string",  short: "c" },
    "dry-run": { type: "boolean", short: "d", default: false },
    voices:    { type: "boolean", short: "V", default: false },
    debug:     { type: "boolean", short: "D", default: false },
    help:      { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
Usage: ctx [folder] [options]

Arguments:
  folder            Folder to analyse (default: current directory)

Options:
  -p, --prompt      What the agent should focus on
  -o, --out         Output file        (default: lingo-context.md)
  -m, --model       Claude model       (default: claude-haiku-4-5)
  -c, --commits <n> Use files changed in last N commits instead of uncommitted
  -d, --dry-run     Show what would run without writing anything
  -V, --voices      Generate per-locale brand voices into i18n.json (requires lingo-context.md)
  -D, --debug       Verbose logging — show all state, tool calls, and file paths
  -h, --help        Show this help

Modes:
  Fresh   lingo-context.md absent → full project scan via agent tools
  Update  lingo-context.md exists → only changed files sent to LLM (uncommitted)
  Commits --commits <n>           → only files changed in last N commits sent to LLM

Examples:
  ctx ./lingo-app -p "B2B SaaS, formal tone"
  ctx ./lingo-app -p "consumer app, friendly and casual"
  ctx ./lingo-app --out lingo-context.md
  ctx --commits 3
`);
  process.exit(0);
}

export async function selectMenu(question: string, options: string[], defaultIndex = 0): Promise<number> {
  let selected = defaultIndex;
  const render = () => {
    process.stdout.write("\x1B[?25l");
    process.stdout.write(`\n${question}\n`);
    for (let i = 0; i < options.length; i++) {
      process.stdout.write(i === selected
        ? `\x1B[36m❯ ${options[i]}\x1B[0m\n`
        : `  ${options[i]}\n`
      );
    }
  };
  const clear = () => process.stdout.write(`\x1B[${options.length + 2}A\x1B[0J`);

  render();

  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      resolve(defaultIndex);
      return;
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf-8");

    const onKey = (key: string) => {
      if (key === "\x1B[A" && selected > 0) { clear(); selected--; render(); }
      else if (key === "\x1B[B" && selected < options.length - 1) { clear(); selected++; render(); }
      else if (key === "\r" || key === "\n") {
        process.stdout.write("\x1B[?25h");
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.off("data", onKey);
        process.stdout.write("\n");
        resolve(selected);
      } else if (key === "\x03") {
        process.stdout.write("\x1B[?25h");
        process.exit(0);
      }
    };

    process.stdin.on("data", onKey);
  });
}

export async function textPrompt(question: string, placeholder = ""): Promise<string> {
  process.stdout.write(question);
  if (placeholder) process.stdout.write(` \x1B[2m(${placeholder})\x1B[0m`);
  process.stdout.write("\n\x1B[36m❯ \x1B[0m");

  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.setEncoding("utf-8");
    process.stdin.once("data", (data: string) => {
      process.stdin.pause();
      resolve(data.trim());
    });
  });
}

export function die(...lines: string[]): never {
  for (const line of lines) console.error(line);
  process.exit(1);
}
