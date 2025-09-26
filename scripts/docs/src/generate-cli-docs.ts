#!/usr/bin/env node

import type { Argument, Command, Option } from "commander";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import type {
  Content,
  Heading,
  List,
  ListItem,
  Paragraph,
  PhrasingContent,
  Root,
} from "mdast";
import { dirname, join, resolve } from "path";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { pathToFileURL } from "url";
import { createOrUpdateGitHubComment, getRepoRoot } from "./utils";
import { format as prettierFormat, resolveConfig } from "prettier";

type CommandWithInternals = Command & {
  _hidden?: boolean;
  _helpCommand?: Command;
};

const FRONTMATTER_DELIMITER = "---";

async function getProgram(repoRoot: string): Promise<Command> {
  const filePath = resolve(
    repoRoot,
    "packages",
    "cli",
    "src",
    "cli",
    "index.ts",
  );

  if (!existsSync(filePath)) {
    throw new Error(`CLI source file not found at ${filePath}`);
  }

  const cliModule = (await import(pathToFileURL(filePath).href)) as {
    default: Command;
  };

  return cliModule.default;
}

function slugifyCommandName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.length > 0 ? slug : "command";
}

function formatYamlValue(value: string): string {
  const escaped = value.replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function createHeading(
  depth: number,
  content: string | PhrasingContent[],
): Heading {
  const children = Array.isArray(content)
    ? content
    : [{ type: "text", value: content }];

  return {
    type: "heading",
    depth: Math.min(Math.max(depth, 1), 6),
    children,
  };
}

function createParagraph(text: string): Paragraph {
  return {
    type: "paragraph",
    children: [{ type: "text", value: text }],
  };
}

function createInlineCode(value: string): PhrasingContent {
  return { type: "inlineCode", value };
}

function createList(items: ListItem[]): List {
  return {
    type: "list",
    ordered: false,
    spread: false,
    children: items,
  };
}

function createListItem(children: PhrasingContent[]): ListItem {
  return {
    type: "listItem",
    spread: false,
    children: [
      {
        type: "paragraph",
        children,
      },
    ],
  };
}

function formatArgumentLabel(arg: Argument): string {
  const name = arg.name();
  const suffix = arg.variadic ? "..." : "";
  return arg.required ? `<${name}${suffix}>` : `[${name}${suffix}]`;
}

function formatValue(value: unknown): string {
  if (value === undefined) {
    return "";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    return value.map((item) => formatValue(item)).join(", ");
  }

  return JSON.stringify(value);
}

function getCommandPath(
  rootName: string,
  ancestors: string[],
  command: Command,
): string {
  return [rootName, ...ancestors, command.name()].filter(Boolean).join(" ");
}

function isHiddenCommand(command: Command): boolean {
  return Boolean((command as CommandWithInternals)._hidden);
}

function isHelpCommand(parent: Command, command: Command): boolean {
  const helpCmd = (parent as CommandWithInternals)._helpCommand;
  return helpCmd === command;
}

function partitionOptions(options: Option[]): {
  flags: Option[];
  valueOptions: Option[];
} {
  const flags: Option[] = [];
  const valueOptions: Option[] = [];

  options.forEach((option) => {
    if (option.hidden) {
      return;
    }

    if (option.required || option.optional) {
      valueOptions.push(option);
    } else {
      flags.push(option);
    }
  });

  return { flags, valueOptions };
}

function buildUsage(command: Command): string {
  return command.createHelp().commandUsage(command).trim();
}

function formatOptionSignature(option: Option): string {
  return option.flags.replace(/\s+/g, " ").trim();
}

function extractOptionPlaceholder(option: Option): string {
  const match = option.flags.match(/(<[^>]+>|\[[^\]]+\])/);
  return match ? match[0] : "";
}

function buildOptionUsage(commandPath: string, option: Option): string {
  const preferred = option.long || option.short || formatOptionSignature(option);
  const placeholder = extractOptionPlaceholder(option);
  const usage = [commandPath, preferred, placeholder]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return usage;
}

function buildOptionDetails(option: Option): string[] {
  const details: string[] = [];

  if (option.mandatory) {
    details.push("Required");
  }

  if (option.required && !option.mandatory) {
    details.push("Takes value");
  }

  if (option.optional) {
    details.push("Optional value");
  }

  if (option.defaultValueDescription) {
    details.push(`Default: ${option.defaultValueDescription}`);
  } else if (option.defaultValue !== undefined) {
    details.push(`Default: ${formatValue(option.defaultValue)}`);
  }

  if (option.argChoices && option.argChoices.length > 0) {
    details.push(`Choices: ${option.argChoices.join(", ")}`);
  }

  if (option.envVar) {
    details.push(`Env: ${option.envVar}`);
  }

  if (option.presetArg !== undefined) {
    details.push(`Preset: ${formatValue(option.presetArg)}`);
  }

  return details;
}

type BuildOptionEntriesArgs = {
  options: Option[];
  commandPath: string;
  depth: number;
};

function buildOptionEntries({
  options,
  commandPath,
  depth,
}: BuildOptionEntriesArgs): Content[] {
  const nodes: Content[] = [];
  const headingDepth = Math.min(depth + 1, 6);

  options.forEach((option) => {
    const signature = formatOptionSignature(option);
    nodes.push(createHeading(headingDepth, [createInlineCode(signature)]));

    nodes.push({
      type: "code",
      lang: "bash",
      value: buildOptionUsage(commandPath, option),
    });

    if (option.description) {
      nodes.push(createParagraph(option.description));
    }

    const details = buildOptionDetails(option);
    if (details.length > 0) {
      nodes.push(createParagraph(details.join(" · ")));
    }
  });

  return nodes;
}

function buildArgumentListItems(args: readonly Argument[]): ListItem[] {
  return args.map((arg) => {
    const children: PhrasingContent[] = [
      createInlineCode(formatArgumentLabel(arg)),
    ];

    if (arg.description) {
      children.push({ type: "text", value: ` — ${arg.description}` });
    }

    const details: string[] = [];

    if (arg.defaultValueDescription) {
      details.push(`default: ${arg.defaultValueDescription}`);
    } else if (arg.defaultValue !== undefined) {
      details.push(`default: ${formatValue(arg.defaultValue)}`);
    }

    if (arg.argChoices && arg.argChoices.length > 0) {
      details.push(`choices: ${arg.argChoices.join(", ")}`);
    }

    if (!arg.required) {
      details.push("optional");
    }

    if (details.length > 0) {
      children.push({
        type: "text",
        value: ` (${details.join("; ")})`,
      });
    }

    return createListItem(children);
  });
}

type BuildCommandSectionOptions = {
  command: Command;
  rootName: string;
  ancestors: string[];
  depth: number;
};

function buildCommandSection({
  command,
  rootName,
  ancestors,
  depth,
}: BuildCommandSectionOptions): Content[] {
  const nodes: Content[] = [];
  const commandPath = getCommandPath(rootName, ancestors, command);
  const isRootCommand = ancestors.length === 0;
  const headingContent = isRootCommand
    ? "Introduction"
    : [createInlineCode(commandPath)];

  nodes.push(createHeading(depth, headingContent));

  const description = command.description();
  if (description) {
    nodes.push(createParagraph(description));
  }

  const usage = buildUsage(command);
  if (usage) {
    const sectionDepth = isRootCommand ? depth : Math.min(depth + 1, 6);
    nodes.push(createHeading(sectionDepth, "Usage"));
    nodes.push({
      type: "paragraph",
      children: [createInlineCode(usage)],
    });
  }

  const aliases = command.aliases();
  if (aliases.length > 0) {
    const sectionDepth = isRootCommand ? depth : Math.min(depth + 1, 6);
    nodes.push(createHeading(sectionDepth, "Aliases"));
    nodes.push(
      createList(
        aliases.map((alias) => createListItem([createInlineCode(alias)])),
      ),
    );
  }

  const args = command.registeredArguments ?? [];
  if (args.length > 0) {
    const sectionDepth = isRootCommand ? depth : Math.min(depth + 1, 6);
    nodes.push(createHeading(sectionDepth, "Arguments"));
    nodes.push(createList(buildArgumentListItems(args)));
  }

  const visibleOptions = command.options.filter((option) => !option.hidden);
  if (visibleOptions.length > 0) {
    const { flags, valueOptions } = partitionOptions(visibleOptions);
    const sectionDepth = isRootCommand ? depth : Math.min(depth + 1, 6);

    if (valueOptions.length > 0) {
      nodes.push(createHeading(sectionDepth, "Options"));
      nodes.push(
        ...buildOptionEntries({
          options: valueOptions,
          commandPath,
          depth: sectionDepth,
        }),
      );
    }

    if (flags.length > 0) {
      nodes.push(createHeading(sectionDepth, "Flags"));
      nodes.push(
        ...buildOptionEntries({
          options: flags,
          commandPath,
          depth: sectionDepth,
        }),
      );
    }
  }

  const subcommands = command.commands.filter(
    (sub) =>
      !isHiddenCommand(sub) &&
      !isHelpCommand(command, sub) &&
      sub.parent === command,
  );

  if (subcommands.length > 0) {
    const sectionDepth = isRootCommand ? depth : Math.min(depth + 1, 6);
    nodes.push(createHeading(sectionDepth, "Subcommands"));

    subcommands.forEach((sub) => {
      nodes.push(
        ...buildCommandSection({
          command: sub,
          rootName,
          ancestors: [...ancestors, command.name()],
          depth: Math.min(sectionDepth + 1, 6),
        }),
      );
    });
  }

  return nodes;
}

function toMarkdown(root: Root): string {
  return unified().use(remarkStringify).stringify(root).trimEnd();
}

async function formatWithPrettier(
  content: string,
  filePath: string,
): Promise<string> {
  const config = await resolveConfig(filePath);
  return prettierFormat(content, {
    ...(config ?? {}),
    filepath: filePath,
  });
}

type CommandDoc = {
  fileName: string;
  markdown: string;
  mdx: string;
  commandPath: string;
};

function buildCommandDoc(
  command: Command,
  rootName: string,
): CommandDoc {
  const commandPath = getCommandPath(rootName, [], command);
  const title = commandPath;
  const subtitle = `CLI reference docs for ${command.name()} command`;
  const root: Root = {
    type: "root",
    children: buildCommandSection({
      command,
      rootName,
      ancestors: [],
      depth: 2,
    }),
  };

  const markdown = toMarkdown(root);
  const frontmatter = [
    FRONTMATTER_DELIMITER,
    `title: ${formatYamlValue(title)}`,
    `subtitle: ${formatYamlValue(subtitle)}`,
    FRONTMATTER_DELIMITER,
    "",
  ].join("\n");

  const mdx = `${frontmatter}${markdown}\n`;
  const fileName = `${slugifyCommandName(command.name())}.mdx`;

  return { fileName, markdown, mdx, commandPath };
}

async function main(): Promise<void> {
  const repoRoot = getRepoRoot();
  const cli = await getProgram(repoRoot);

  const outputArg = process.argv[2];

  if (!outputArg) {
    throw new Error(
      "Output directory is required. Usage: generate-cli-docs <output-directory>",
    );
  }

  const outputDir = resolve(process.cwd(), outputArg);
  await mkdir(outputDir, { recursive: true });

  const topLevelCommands = cli.commands.filter(
    (command) => command.parent === cli && !isHiddenCommand(command),
  );

  if (topLevelCommands.length === 0) {
    console.warn("No top-level commands found. Nothing to document.");
    return;
  }

  const docs = topLevelCommands.map((command) =>
    buildCommandDoc(command, cli.name()),
  );

  for (const doc of docs) {
    const filePath = join(outputDir, doc.fileName);
    await mkdir(dirname(filePath), { recursive: true });
    const formatted = await formatWithPrettier(doc.mdx, filePath);
    await writeFile(filePath, formatted, "utf8");
    console.log(`✅ Saved ${doc.commandPath} docs to ${filePath}`);
  }

  if (process.env.GITHUB_ACTIONS) {
    const commentMarker = "<!-- generate-cli-docs -->";
    const combinedMarkdown = docs
      .map((doc) => doc.markdown)
      .join("\n\n---\n\n");

    const commentBody = [
      commentMarker,
      "",
      "Your PR updates Lingo.dev CLI behavior. Please review the regenerated reference docs below.",
      "",
      combinedMarkdown,
    ].join("\n");

    await createOrUpdateGitHubComment({
      commentMarker,
      body: commentBody,
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
