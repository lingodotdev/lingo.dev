import { checkbox, confirm } from "@inquirer/prompts";
import fs from "fs";
import { Ora } from "ora";
import path from "path";

type Platform = "github" | "bitbucket" | "gitlab";

const platforms: Platform[] = ["github", "bitbucket", "gitlab"];

export default async function initCICD(spinner: Ora) {
  const initializers = getPlatformInitializers(spinner);

  const init = await confirm({
    message: "Would you like to use Lingo.dev in your CI/CD?",
  });

  if (!init) {
    spinner.warn(
      "CI/CD not initialized. To set it up later, see docs: https://lingo.dev/ci",
    );
    return;
  }

  const selectedPlatforms: Platform[] = await checkbox({
    message: "Please select CI/CD platform(s) you want to use:",
    choices: platforms.map((platform) => ({
      name: initializers[platform].name,
      value: platform,
      checked: initializers[platform].isEnabled(),
    })),
  });

  for (const platform of selectedPlatforms) {
    await initializers[platform].init();
  }
}

function getPlatformInitializers(spinner: Ora) {
  return {
    github: makeGithubInitializer(spinner),
    bitbucket: makeBitbucketInitializer(spinner),
    gitlab: makeGitlabInitializer(spinner),
  };
}

type PlatformConfig = {
  name: string;
  checkPath: string;
  ciConfigPath: string;
  ciConfigContent: string;
};

function makePlatformInitializer(config: PlatformConfig, spinner: Ora) {
  return {
    name: config.name,
    isEnabled: () => {
      const filePath = path.join(process.cwd(), config.checkPath);
      return fs.existsSync(filePath);
    },
    init: async () => {
      const filePath = path.join(process.cwd(), config.ciConfigPath);
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      let canWrite = true;
      if (fs.existsSync(filePath)) {
        canWrite = await confirm({
          message: `File ${filePath} already exists. Do you want to overwrite it?`,
          default: false,
        });
      }
      if (canWrite) {
        fs.writeFileSync(filePath, config.ciConfigContent);
        spinner.succeed(`CI/CD initialized for ${config.name}`);
      } else {
        spinner.warn(`CI/CD not initialized for ${config.name}`);
      }
    },
  };
}

function makeGithubInitializer(spinner: Ora) {
  return makePlatformInitializer(
    {
      name: "GitHub Action",
      checkPath: ".github",
      ciConfigPath: ".github/workflows/i18n.yml",
      ciConfigContent: `name: Lingo.dev i18n

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

jobs:
  i18n:
    name: Run i18n
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: \${{ secrets.LINGODOTDEV_API_KEY }}
`,
    },
    spinner,
  );
}

function makeBitbucketInitializer(spinner: Ora) {
  return makePlatformInitializer(
    {
      name: "Bitbucket Pipeline",
      checkPath: "bitbucket-pipelines.yml",
      ciConfigPath: "bitbucket-pipelines.yml",
      ciConfigContent: `pipelines:
  branches:
    main:
      - step:
          name: Run i18n
          script:
            - pipe: lingodotdev/lingo.dev:main`,
    },
    spinner,
  );
}

function makeGitlabInitializer(spinner: Ora) {
  return makePlatformInitializer(
    {
      name: "Gitlab CI",
      checkPath: ".gitlab-ci.yml",
      ciConfigPath: ".gitlab-ci.yml",
      ciConfigContent: `lingodotdev:
  image: lingodotdev/ci-action:latest
  script:
    - echo "Done"
`,
    },
    spinner,
  );
}
