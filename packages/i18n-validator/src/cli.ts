#!/usr/bin/env node
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { validateI18nConfig } from "./validate.js";

function showHelp() {
  console.log(`
${chalk.bold("@lingo.dev/i18n-validator")} - Validate i18n.json configuration files

${chalk.bold("Usage:")}
  lingo-validate-i18n [file]
  lingo-validate-i18n --help

${chalk.bold("Arguments:")}
  file    Path to i18n.json file (default: ./i18n.json)

${chalk.bold("Options:")}
  --help  Show this help message

${chalk.bold("Examples:")}
  lingo-validate-i18n
  lingo-validate-i18n ./config/i18n.json
`);
}

function readConfig(filePath: string) {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  
  if (!fs.existsSync(resolvedPath)) {
    console.error(chalk.red(`❌ Config file not found: ${resolvedPath}`));
    console.error(chalk.gray(`\nTip: Make sure the file exists or specify a different path.`));
    process.exit(2);
  }
  
  let raw: string;
  try {
    raw = fs.readFileSync(resolvedPath, "utf8");
  } catch (err) {
    console.error(chalk.red(`❌ Failed to read file: ${resolvedPath}`));
    console.error(chalk.gray(`Error: ${err instanceof Error ? err.message : String(err)}`));
    process.exit(2);
  }
  
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(chalk.red(`❌ Invalid JSON in: ${resolvedPath}`));
    console.error(chalk.gray(`Error: ${err instanceof Error ? err.message : String(err)}`));
    process.exit(2);
  }
}

function main() {
  const args = process.argv.slice(2);
  
  // Handle help flag
  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    process.exit(0);
  }
  
  const filePath = args[0] || "i18n.json";
  const config = readConfig(filePath);
  const result = validateI18nConfig(config);

  if (result.ok) {
    console.log(chalk.green(`✅ ${filePath} is valid`));
    process.exit(0);
  } else {
    console.log(chalk.red(`❌ ${filePath} validation failed`));
    
    if (result.errors && result.errors.length > 0) {
      console.log(chalk.yellow("\nErrors:"));
      for (const error of result.errors) {
        console.log(chalk.red(`  • ${error}`));
      }
    }
    
    if (result.suggestions && result.suggestions.length > 0) {
      console.log(chalk.cyan("\nSuggestions:"));
      for (const suggestion of result.suggestions) {
        console.log(chalk.cyan(`  • ${suggestion}`));
      }
    }
    
    process.exit(1);
  }
}

main();
