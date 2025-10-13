import chalk from "chalk";
import _ from "lodash";
import { createTwoFilesPatch } from "diff";
import inquirer from "inquirer";
import externalEditor from "external-editor";

export async function reviewChanges(args: {
  pathPattern: string;
  targetLocale: string;
  currentData: Record<string, any>;
  proposedData: Record<string, any>;
  sourceData: Record<string, any>;
  force: boolean;
}): Promise<Record<string, any>> {
  const currentStr = JSON.stringify(args.currentData, null, 2);
  const proposedStr = JSON.stringify(args.proposedData, null, 2);

  if (currentStr === proposedStr && !args.force) {
    console.log(
      `\n${chalk.blue(args.pathPattern)} (${chalk.yellow(
        args.targetLocale,
      )}): ${chalk.gray("No changes to review")}`,
    );
    return args.proposedData;
  }

  const patch = createTwoFilesPatch(
    `${args.pathPattern} (current)`,
    `${args.pathPattern} (proposed)`,
    currentStr,
    proposedStr,
    undefined,
    undefined,
    { context: 3 },
  );

  const coloredDiff = patch
    .split("\n")
    .map((line) => {
      if (line.startsWith("+")) return chalk.green(line);
      if (line.startsWith("-")) return chalk.red(line);
      if (line.startsWith("@")) return chalk.cyan(line);
      return line;
    })
    .join("\n");

  console.log(
    `\nReviewing changes for ${chalk.blue(args.pathPattern)} (${chalk.yellow(
      args.targetLocale,
    )}):`,
  );
  console.log(coloredDiff);

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose action:",
      choices: [
        { name: "Approve changes", value: "approve" },
        { name: "Skip changes", value: "skip" },
        { name: "Edit individually", value: "edit" },
      ],
      default: "approve",
    },
  ]);

  if (action === "approve") {
    return args.proposedData;
  }

  if (action === "skip") {
    return args.currentData;
  }

  const customData = { ...args.currentData };
  const changes = _.reduce(
    args.proposedData,
    (result: string[], value: string, key: string) => {
      if (args.currentData[key] !== value) {
        result.push(key);
      }
      return result;
    },
    [],
  );

  for (const key of changes) {
    console.log(`\nEditing value for: ${chalk.cyan(key)}`);
    console.log(chalk.gray("Source text:"), chalk.blue(args.sourceData[key]));
    console.log(
      chalk.gray("Current value:"),
      chalk.red(args.currentData[key] || "(empty)"),
    );
    console.log(
      chalk.gray("Suggested value:"),
      chalk.green(args.proposedData[key]),
    );
    console.log(
      chalk.gray(
        "\nYour editor will open. Edit the text and save to continue.",
      ),
    );
    console.log(chalk.gray("------------"));

    try {
      const editorContent = [
        "# Edit the translation below.",
        "# Lines starting with # will be ignored.",
        "# Save and exit the editor to continue.",
        "#",
        `# Source text (${chalk.blue("English")}):`,
        `# ${args.sourceData[key]}`,
        "#",
        `# Current value (${chalk.red(args.targetLocale)}):`,
        `# ${args.currentData[key] || "(empty)"}`,
        "#",
        args.proposedData[key],
      ].join("\n");

      const result = externalEditor.edit(editorContent);

      const customValue = result
        .split("\n")
        .filter((line) => !line.startsWith("#"))
        .join("\n")
        .trim();

      if (customValue) {
        customData[key] = customValue;
      } else {
        console.log(
          chalk.yellow("Empty value provided, keeping the current value."),
        );
        customData[key] = args.currentData[key] || args.proposedData[key];
      }
    } catch (_error) {
      console.log(
        chalk.red("Error while editing, keeping the suggested value."),
      );
      customData[key] = args.proposedData[key];
    }
  }

  return customData;
}
