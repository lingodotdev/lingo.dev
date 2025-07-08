#!/usr/bin/env node

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { Command } from "commander";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

async function loadProgram(): Promise<Command> {
  const cliTsPath = path.resolve(projectRoot, "packages/cli/src/cli/index.ts");
  const { default: program } = (await import(
    pathToFileURL(cliTsPath).href
  )) as {
    default: Command;
  };
  return program;
}

function buildMarkdown(program: Command): string {
  const lines: string[] = [
    "# Lingo.dev CLI Reference",
    "",
    "<!-- This file is auto-generated. Do not edit by hand. -->",
    "",
  ];

  const helper = program.createHelp();
  const visited = new Set<Command>();

  function walk(cmd: Command, parents: string[]): void {
    if (visited.has(cmd)) return;
    visited.add(cmd);

    const commandPath = [...parents, cmd.name()].join(" ").trim();
    lines.push(`## \`${commandPath}\``);
    lines.push("");
    lines.push("```");
    lines.push(helper.formatHelp(cmd, helper).trimEnd());
    lines.push("```");
    lines.push("");

    cmd.commands
      .filter((c: any) => !(c as any)._hidden)
      .forEach((sub: Command) => walk(sub, [...parents, cmd.name()]));
  }

  walk(program, []);
  return lines.join("\n");
}

async function main(): Promise<void> {
  const program = await loadProgram();
  const markdown = buildMarkdown(program);

  const outDir = path.resolve(projectRoot, "docs/cli");
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, "reference.md");
  await writeFile(outFile, markdown, "utf8");

  console.log(
    `✅ CLI reference generated at ${path.relative(projectRoot, outFile)}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
