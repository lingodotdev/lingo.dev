import { InteractiveCommand, InteractiveOption } from "interactive-commander";
import fs from "fs";
import path from "path";
import { confirm } from "@inquirer/prompts";

// GitHub Actions workflow template
const createWorkflowTemplate = () => {
  return `name: Translation Validation

on:
  pull_request:
  push:
    branches: [main, master]

jobs:
  validate-translations:
    runs-on: ubuntu-latest
    name: Validate translations
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Validate translations with Lingo.dev
        uses: lingo-dev/action@v1
        with:
          api-key: \${{ secrets.LINGODOTDEV_API_KEY }}
`;
};

const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const printSuccessMessage = () => {
  console.log("✓ Created .github/workflows/i18n.yml");
  console.log();
  console.log("⚠️  Remember to add your LINGODOTDEV_API_KEY to your GitHub repository secrets:");
  console.log("   1. Get your API key from: https://lingo.dev");
  console.log("   2. Add it to your repo: Settings → Secrets → Actions → New repository secret");
  console.log();
};

export default new InteractiveCommand()
  .command("init-github")
  .description("Generate GitHub Actions workflow for automated translation validation")
  .helpOption("-h, --help", "Show help")
  .option(
    "-f --force",
    "Overwrite existing workflow file without confirmation"
  )
  .action(async (args: any) => {
    console.log("Setting up GitHub Actions workflow...");
    
    try {
      // Define paths
      const githubDir = ".github";
      const workflowsDir = path.join(githubDir, "workflows");
      const workflowFile = path.join(workflowsDir, "i18n.yml");
      
      // Check if workflow file already exists
      if (fs.existsSync(workflowFile) && !args.force) {
        const shouldOverwrite = await confirm({
          message: `GitHub Actions workflow file already exists at ${workflowFile}. Overwrite it?`,
          default: false,
        });
        
        if (!shouldOverwrite) {
          console.log("GitHub Actions setup cancelled.");
          return;
        }
      }
      
      // Create directories if they don't exist
      ensureDirectoryExists(githubDir);
      ensureDirectoryExists(workflowsDir);
      
      // Generate and write the workflow file
      const workflowContent = createWorkflowTemplate();
      fs.writeFileSync(workflowFile, workflowContent, "utf8");
      
      printSuccessMessage();
      
    } catch (error) {
      console.error("Failed to create GitHub Actions workflow");
      console.error(error);
      process.exit(1);
    }
  });